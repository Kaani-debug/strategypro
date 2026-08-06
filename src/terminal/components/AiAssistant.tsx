import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUiStore } from '@/terminal/state/uiStore'
import { useMarketStore } from '@/terminal/state/marketStore'
import { useTradeStore } from '@/terminal/state/tradeStore'
import { formatPrice, formatMoney } from '@/terminal/lib/format'
import { Bot, Send, Sparkles, X } from 'lucide-react'
import { cn } from '@/terminal/lib/cn'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
}

const QUICK_REPLIES = [
  'How does this work?',
  'Explain my stats',
  'Risk warning',
]

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export default function AiAssistant() {
  const open = useUiStore((s) => s.assistantOpen)
  const setOpen = useUiStore((s) => s.setAssistantOpen)
  const symbol = useMarketStore((s) => s.symbol)
  const lastTick = useMarketStore((s) => s.lastTick)
  const balance = useTradeStore((s) => s.balance)
  const wins = useTradeStore((s) => s.wins)
  const losses = useTradeStore((s) => s.losses)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hi, I’m your trade copilot. Ask me about the market, trade types, or your session stats.',
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, typing, open])

  const answer = (question: string): string => {
    const q = question.toLowerCase()
    if (q.includes('work') || q.includes('how')) {
      return 'Select a trade type and target return, set a stake, then hit Buy. The dashed line on the chart projects a possible move based on your target. Results settle instantly in this simulation.'
    }
    if (q.includes('stat') || q.includes('win')) {
      const total = wins + losses
      const rate = total > 0 ? Math.round((wins / total) * 100) : 0
      return `You have ${wins} wins and ${losses} losses (${rate}% win rate). Current balance is ${formatMoney(balance)}.`
    }
    if (q.includes('risk')) {
      return 'This is a simulated environment. Deriv contracts can lose the full stake — never risk more than you can afford. Trade types like Rise/Fall settle on the exit spot after the barrier is placed.'
    }
      return `On ${symbol.symbol} the last tick was ${lastTick ? formatPrice(lastTick.price, symbol.digits) : '—'}. I can explain trade types, your stats, or the risk warning.`
  }

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || typing) return
    setMessages((m) => [...m, { id: makeId(), role: 'user', text: trimmed }])
    setInput('')
    setTyping(true)
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: makeId(), role: 'assistant', text: answer(trimmed) }])
      setTyping(false)
    }, 700)
  }

  return (
    <div className="absolute bottom-12 right-4 z-30 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex h-[26rem] w-[20rem] flex-col overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/95 shadow-2xl shadow-black/50 backdrop-blur"
          >
            <header className="flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-indigo-500/15 to-violet-500/15 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
                  <Bot className="h-4 w-4 text-white" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-slate-100">Copilot AI</p>
                  <p className="text-[10px] text-emerald-400">● Online</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed',
                    message.role === 'user'
                      ? 'ml-auto rounded-br-sm bg-indigo-600 text-white'
                      : 'rounded-bl-sm bg-slate-800 text-slate-200',
                  )}
                >
                  {message.text}
                </div>
              ))}
              {typing ? (
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-slate-800 px-3.5 py-3" style={{ width: 'fit-content' }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${i * 120}ms` }} />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => send(reply)}
                  className="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] text-slate-400 transition hover:border-indigo-500 hover:text-indigo-300"
                >
                  {reply}
                </button>
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                send(input)
              }}
              className="flex items-center gap-2 border-t border-slate-800 px-3 py-3"
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about the market…"
                aria-label="Message the assistant"
                className="flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-[13px] text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!input.trim() || typing}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Open AI assistant"
        aria-expanded={open}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className={cn(
          'relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-2xl shadow-indigo-500/40',
        )}
      >
        {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
        {!open ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-400" />
          </span>
        ) : null}
      </motion.button>
    </div>
  )
}
