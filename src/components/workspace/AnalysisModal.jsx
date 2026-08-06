import { useEffect, useRef } from 'react'
import {
  Activity,
  CheckCircle2,
  Circle,
  CircleX,
  Info,
  Loader2,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react'
import { ANALYSIS_STAGES, DATA_READY_TICKS, MARKET_GROUPS, STRATEGIES, marketById, strategyById, useAnalysisStore } from '../../state/analysisStore'

const PHASE_LABEL = {
  idle: 'Idle',
  collecting: 'Collecting data',
  analyzing: 'Analyzing',
  validating: 'Validating',
  done: 'Completed',
}

function sparklinePoints(history, w, h) {
  if (history.length < 2) return ''
  const min = Math.min(...history)
  const max = Math.max(...history)
  const span = max - min || 1
  return history
    .map((p, i) => {
      const x = (i / (history.length - 1)) * w
      const y = h - ((p - min) / span) * (h - 6) - 3
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

function StageStatusIcon({ status }) {
  if (status === 'success') return <CheckCircle2 size={15} />
  if (status === 'warning') return <TriangleAlert size={15} />
  if (status === 'error') return <CircleX size={15} />
  return <Info size={15} />
}

export default function AnalysisModal() {
  const analysis = useAnalysisStore(s => s.analysis)
  const tick = useAnalysisStore(s => s.tick)
  const tickDir = useAnalysisStore(s => s.tickDir)
  const history = useAnalysisStore(s => s.history)
  const connected = useAnalysisStore(s => s.connected)
  const phase = useAnalysisStore(s => s.phase)
  const ticksCollected = useAnalysisStore(s => s.ticksCollected)
  const dataReady = useAnalysisStore(s => s.dataReady)
  const strategy = useAnalysisStore(s => s.strategy)
  const market = useAnalysisStore(s => s.market)
  const account = useAnalysisStore(s => s.account)
  const setStrategy = useAnalysisStore(s => s.setStrategy)
  const setMarket = useAnalysisStore(s => s.setMarket)
  const startAnalysis = useAnalysisStore(s => s.startAnalysis)
  const closeAnalysis = useAnalysisStore(s => s.closeAnalysis)

  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [analysis.stages.length, analysis.stage, analysis.interrupted])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') closeAnalysis()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeAnalysis])

  if (!analysis.open) return null

  const marketMeta = marketById(analysis.market || useAnalysisStore.getState().market)
  const stratLabel = analysis.strategy || strategyById(strategy).label
  const currentIdx = analysis.stages.length
  const current = analysis.stage ? ANALYSIS_STAGES.find(s => s.key === analysis.stage) : null
  const runningDesc = current?.key === 'collect'
    ? dataReady
      ? `Buffering final samples… ${ticksCollected}/${DATA_READY_TICKS}`
      : `Capturing live price samples… ${ticksCollected}/${DATA_READY_TICKS}`
    : (current?.desc || 'Preparing analysis pipeline…')

  const doneByKey = {}
  analysis.stages.forEach(st => { doneByKey[st.key] = st })

  const dirTone = tickDir === 'up' ? 'rise' : tickDir === 'down' ? 'fall' : 'flat'
  const w = 280
  const h = 56
  const points = sparklinePoints(history, w, h)

  const busy = analysis.active || phase === 'analyzing' || phase === 'collecting' || phase === 'validating'
  const selectable = !analysis.active

  return (
    <div className="ws-modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) closeAnalysis() }}>
      <div className="ws-modal" role="dialog" aria-modal="true" aria-label="Signal analysis">
        <div className="ws-modal__head">
          <div className="ws-modal__title">
            <ScanSearch size={18} />
            <span>Signal Analysis Engine</span>
          </div>
          <div className="ws-modal__chips">
            <span className="ws-modal__chip">{stratLabel}</span>
            <span className="ws-modal__chip ws-modal__chip--accent">{marketMeta.id}</span>
            <span className={`ws-modal__chip ${account.type === 'real' ? 'ws-modal__chip--live' : 'ws-modal__chip--ok'}`}>{account.label}</span>
            <span className="ws-modal__chip">Cycle {analysis.cycle}</span>
            <span className={`ws-modal__chip ${analysis.interrupted ? 'ws-modal__chip--warn' : busy ? 'ws-modal__chip--live' : 'ws-modal__chip--ok'}`}>
              {analysis.interrupted ? <TriangleAlert size={12} /> : busy ? <Loader2 size={12} className="spin" /> : <CheckCircle2 size={12} />}
              {analysis.interrupted ? 'Recovering' : busy ? PHASE_LABEL[phase] || phase : PHASE_LABEL[phase] || 'Ready'}
            </span>
          </div>
          <button className="ws-modal__close" onClick={closeAnalysis} aria-label="Close analysis window">
            <X size={18} />
          </button>
        </div>

        <div className="ws-modal__body">
          <div className="ws-modal__side">
            <div className="ws-modal__select">
              <label className="ws-modal__side-label" htmlFor="ws-modal-strategy">Type of trade</label>
              <select
                id="ws-modal-strategy"
                className="ws-select ws-select--modal"
                value={strategy}
                onChange={e => setStrategy(e.target.value)}
                disabled={!selectable}
              >
                {STRATEGIES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>

              <label className="ws-modal__side-label" htmlFor="ws-modal-market">Trading instrument</label>
              <select
                id="ws-modal-market"
                className="ws-select ws-select--modal"
                value={market}
                onChange={e => setMarket(e.target.value)}
                disabled={!selectable}
              >
                {MARKET_GROUPS.map(g => (
                  <optgroup key={g.label} label={`${g.label} (${g.items.length})`}>
                    {g.items.map(m => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {!selectable && (
                <span className="ws-modal__select-note">Locked while an analysis is running</span>
              )}
            </div>

            <div className="ws-modal__session">
              <span className="ws-modal__side-label">Active session</span>
              <span className="ws-modal__strategy">{analysis.strategy || stratLabel}</span>
              <span className="ws-modal__market">{marketMeta.label}</span>
            </div>

            <div className="ws-modal__tick">
              <span className="ws-modal__side-label">Live market tick</span>
              <span className={`ws-tick ws-tick--${dirTone}`}>
                {tickDir === 'up' ? <TrendingUp size={16} /> : tickDir === 'down' ? <TrendingDown size={16} /> : null}
                {tick.toFixed(2)}
              </span>
              <svg className="ws-spark ws-spark--modal" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                <polyline
                  points={points}
                  fill="none"
                  stroke={tickDir === 'up' ? '#4bb4b3' : tickDir === 'down' ? '#ec3f3f' : '#ffad3a'}
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
              <span className={`ws-modal__conn ${connected ? 'ws-modal__conn--ok' : 'ws-modal__conn--warn'}`}>
                {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
                {connected ? 'Stream connected' : 'Reconnecting…'}
              </span>
            </div>

            <div className="ws-modal__progress">
              <div className="ws-modal__progress-row">
                <span className="ws-modal__side-label">Data readiness</span>
                <span className="ws-modal__pct">{dataReady ? '100%' : `${Math.round((ticksCollected / DATA_READY_TICKS) * 100)}%`}</span>
              </div>
              <div className="ws-progress">
                <div className="ws-progress__fill" style={{ width: `${dataReady ? 100 : (ticksCollected / DATA_READY_TICKS) * 100}%` }} />
              </div>
              <span className="ws-modal__side-sub">{ticksCollected}/{DATA_READY_TICKS} live samples buffered</span>
            </div>

            <div className="ws-modal__progress">
              <div className="ws-modal__progress-row">
                <span className="ws-modal__side-label">Pipeline progress</span>
                <span className="ws-modal__pct">{analysis.progress}%</span>
              </div>
              <div className="ws-progress">
                <div className="ws-progress__fill ws-progress__fill--pipe" style={{ width: `${analysis.progress}%` }} />
              </div>
              <span className="ws-modal__side-sub">{analysis.stages.length} of {ANALYSIS_STAGES.length} stages completed</span>
            </div>

            {analysis.result && (
              <div className="ws-modal__criteria">
                <span className="ws-modal__side-label">
                  <ShieldCheck size={11} /> Strategy criteria ({analysis.result.matches}/{analysis.result.total} matched)
                </span>
                <div className="ws-modal__criteria-list">
                  {analysis.result.conditions.map(c => (
                    <span key={c.label} className={`ws-cond ${c.ok ? 'ws-cond--ok' : ''}`}>{c.label}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="ws-modal__console">
            <div className="ws-modal__console-head">
              <span className="ws-modal__console-title"><Activity size={13} /> Analysis console</span>
              <span className="ws-modal__console-live">live terminal</span>
            </div>
            <div className="ws-modal__stages">
              {ANALYSIS_STAGES.map((s, i) => {
                const done = doneByKey[s.key]
                const isCurrent = !done && analysis.active && i === currentIdx
                return (
                  <div
                    key={s.key}
                    className={`ws-stage ${done ? `ws-stage--${done.status}` : isCurrent ? 'ws-stage--current' : 'ws-stage--pending'}`}
                  >
                    <span className="ws-stage__icon">
                      {done ? <StageStatusIcon status={done.status} /> : isCurrent ? <Loader2 size={15} className="spin" /> : <Circle size={15} />}
                    </span>
                    <div className="ws-stage__text">
                      <span className="ws-stage__label">
                        {s.label}
                        {isCurrent && <em className="ws-stage__live">running</em>}
                      </span>
                      <span className="ws-stage__detail">
                        {done ? done.detail : isCurrent ? runningDesc : s.desc}
                      </span>
                    </div>
                    {done && <span className="ws-stage__elapsed">{done.elapsed}s</span>}
                  </div>
                )
              })}

              {analysis.interrupted && (
                <div className="ws-stage ws-stage--hold">
                  <span className="ws-stage__icon"><TriangleAlert size={15} /></span>
                  <div className="ws-stage__text">
                    <span className="ws-stage__label">Stream interrupted</span>
                    <span className="ws-stage__detail">Connection lost — stage held, resuming automatically on reconnect</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>
        </div>

        {analysis.result && (
          <div className={`ws-modal__result ${analysis.result.qualifies ? 'ws-result--ok' : 'ws-result--warn'}`}>
            <div className="ws-modal__verdict">
              {analysis.result.qualifies ? <Sparkles size={20} /> : <TriangleAlert size={20} />}
              <div className="ws-modal__verdict-text">
                <b>{analysis.result.qualifies ? 'Valid trading opportunity identified' : 'No qualifying opportunity currently'}</b>
                <span>
                  {analysis.result.dir} bias · {analysis.result.confidence}% confidence · {analysis.result.matches}/{analysis.result.total} criteria matched
                </span>
              </div>
            </div>
            <button className="ws-analyse" onClick={startAnalysis}>
              <RefreshCw size={15} />
              New Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
