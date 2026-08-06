import { useEffect, useRef, useState } from 'react'
import { Bot, CornerDownLeft, Send, X } from 'lucide-react'
import { DATA_READY_TICKS, marketById, modeById, strategyById, useAnalysisStore } from '../../state/analysisStore'

const QUICK_ACTIONS = [
  { id: 'signal', label: 'Explain analysis result' },
  { id: 'conditions', label: 'Market conditions' },
  { id: 'status', label: 'Engine status' },
  { id: 'run', label: 'How to run a session' },
  { id: 'navigate', label: 'Platform navigation' },
]

const GREETING = "Hi, I'm your analysis assistant. Ask me about the latest analysis result, market conditions, engine status, or how to run a trading session."

const PHASE_LABEL = {
  idle: 'idle (awaiting an analysis request)',
  collecting: 'collecting data',
  analyzing: 'analyzing',
  validating: 'validating strategy rules',
  done: 'completed',
}

function buildReply(intent, s) {
  const market = marketById(s.market)
  const mode = modeById(s.mode)
  const strategy = strategyById(s.strategy)
  const sig = s.lastSignal
  const res = s.analysis.result

  if (intent === 'signal') {
    if (res) {
      return res.qualifies
        ? `The latest analysis on ${res.market} identified a valid trading opportunity: ${res.dir} bias at ${res.confidence}% confidence, ${res.matches} of ${res.total} criteria matched (threshold ${res.threshold}). Price at evaluation was ${res.price.toFixed(2)}.`
        : `The latest analysis on ${res.market} found no qualifying opportunity right now — only ${res.matches} of ${res.total} criteria matched (threshold ${res.threshold}). You can begin another analysis cycle immediately.`
    }
    if (!sig) {
      return 'No analysis has been run yet. Launch the pipeline from the Signal Analyzer — press Analyse and watch each stage complete in the analysis window.'
    }
    return `Latest signal for ${market.id}: directional bias is ${sig.dir} with ${sig.confidence}% confidence. ${sig.matches} of ${sig.total} conditions matched under the ${strategy.label} strategy — including ${sig.conditions.slice(0, 3).map(c => c.label.toLowerCase()).join(', ')}. Current price ${s.tick.toFixed(2)}.`
  }
  if (intent === 'conditions') {
    return `On ${market.label}, the live tick is ${s.tick.toFixed(2)}. The engine is ${PHASE_LABEL[s.phase] || s.phase} (${s.ticksCollected}/${DATA_READY_TICKS} ticks buffered), mode is ${mode.label}, and the stream is ${s.connected ? 'connected' : 'reconnecting'}. ${s.matches > 0 ? `${s.matches} signal conditions currently match.` : 'No qualifying conditions yet — keep monitoring.'}`
  }
  if (intent === 'run') {
    return 'To run a session: 1) pick a market and strategy, 2) launch the analysis pipeline with Analyse and watch the ten stages stream into the analysis window, 3) once status shows "Completed", press Run. Stop or Pause anytime. Results appear in the Trade Results panel.'
  }
  if (intent === 'navigate') {
    return 'Use the top navigation to move between modules: Dashboard, Bot Builder, Free Bots, Speedbot, AI Software, Auto Trader, Analysis Tool, Manual Trader, Bulk Trader, Charts, Copy Trader, Risk Calculator, and Trade Academy. The Analysis Tool is the real-time workspace you are in now.'
  }
  if (intent === 'status') {
    return `The engine is currently ${PHASE_LABEL[s.phase] || s.phase} on ${market.id} (${s.connected ? 'stream connected' : 'reconnecting'}, ${s.paused ? 'paused' : 'active'}). ${res ? `Last recommendation: ${res.qualifies ? 'qualifying opportunity identified' : 'no qualifying opportunity'} (${res.matches}/${res.total}).` : sig ? `Last analysis: ${sig.matches}/${sig.total} conditions matched.` : 'No analysis completed yet.'}`
  }
  if (intent === 'help') {
    return 'I can explain analytical results, describe detected market conditions, report engine status, guide session execution, or help you navigate the platform. Try one of the quick actions or type a question.'
  }
  if (intent === 'risk') {
    return 'Trading involves significant financial risk. All analytical outputs are informational and do not guarantee any outcome. Never trade money you cannot afford to lose. The Risk Disclaimer is always visible at the bottom of the workspace.'
  }
  return buildReply('help', s)
}

function matchIntent(text) {
  const q = text.toLowerCase()
  if (/signal|result|match|recommend|opportunit|analys/.test(q)) return 'signal'
  if (/market|condition|price|tick/.test(q)) return 'conditions'
  if (/run|start|session|trade|execut/.test(q)) return 'run'
  if (/nav|module|tab|page|dashboard|bot/.test(q)) return 'navigate'
  if (/status|paused|phase|state|engine/.test(q)) return 'status'
  if (/risk|loss|disclaimer/.test(q)) return 'risk'
  return 'help'
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', text: GREETING, at: Date.now() }])
  const [input, setInput] = useState('')
  const bodyRef = useRef(null)

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const send = (intentOrText, isQuick) => {
    const state = useAnalysisStore.getState()
    const reply = buildReply(isQuick ? intentOrText : matchIntent(intentOrText), state)
    const now = Date.now()
    setMessages(prev => [
      ...prev,
      ...(isQuick ? [] : [{ role: 'user', text: intentOrText, at: now }]),
      { role: 'assistant', text: reply, at: now + 1 },
    ])
  }

  const submit = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    send(text, false)
  }

  return (
    <>
      {open && (
        <div className="ws-ai">
          <div className="ws-ai__head">
            <span className="ws-ai__title">
              <Bot size={15} /> AI Assistant
            </span>
            <button className="ws-ai__close" onClick={() => setOpen(false)} aria-label="Close assistant">
              <X size={15} />
            </button>
          </div>
          <div className="ws-ai__body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`ws-ai__msg ws-ai__msg--${m.role}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="ws-ai__quick">
            {QUICK_ACTIONS.map(a => (
              <button key={a.id} className="ws-ai__quick-btn" onClick={() => send(a.id, true)}>
                {a.label}
              </button>
            ))}
          </div>
          <div className="ws-ai__input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submit() }}
              placeholder="Ask about signals, conditions, execution…"
            />
            <button className="ws-ai__send" onClick={submit} aria-label="Send">
              {input ? <Send size={14} /> : <CornerDownLeft size={14} />}
            </button>
          </div>
        </div>
      )}
      <button
        className={`ws-ai-fab ${open ? 'ws-ai-fab--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle AI assistant"
      >
        <Bot size={18} />
      </button>
    </>
  )
}
