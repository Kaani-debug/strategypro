import { useMemo } from 'react'
import { Flame, Info, Sparkles, TrendingDown, TrendingUp } from 'lucide-react'
import { marketById, modeById, strategyById, useAnalysisStore } from '../../state/analysisStore'

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

export default function LiveMarketPanel() {
  const market = useAnalysisStore(s => s.market)
  const mode = useAnalysisStore(s => s.mode)
  const strategy = useAnalysisStore(s => s.strategy)
  const tick = useAnalysisStore(s => s.tick)
  const tickDir = useAnalysisStore(s => s.tickDir)
  const history = useAnalysisStore(s => s.history)
  const phase = useAnalysisStore(s => s.phase)
  const signalHistory = useAnalysisStore(s => s.signalHistory)
  const lastSignal = useAnalysisStore(s => s.lastSignal)

  const marketMeta = marketById(market)
  const modeMeta = modeById(mode)

  const stats = useMemo(() => {
    const h = history
    const first = h[0] ?? marketMeta.base
    const last = h[h.length - 1] ?? marketMeta.base
    const high = Math.max(...h, marketMeta.base)
    const low = Math.min(...h, marketMeta.base)
    const change = ((last - first) / first) * 100
    const digits = h.map(p => Math.floor(Math.abs(p)) % 10).slice(-20)
    return { first, high, low, change, digits }
  }, [history, marketMeta])

  const dirTone = tickDir === 'up' ? 'rise' : tickDir === 'down' ? 'fall' : 'flat'
  const w = 300
  const h = 64
  const points = sparklinePoints(history, w, h)

  return (
    <aside className="ws-side">
      <div className="ws-panel">
        <div className="ws-panel__head">
          <span className="ws-panel__title">Live Market</span>
          <span className={`ws-live-dot ${tickDir}`} />
        </div>
        <div className="ws-panel__market">
          <span className="ws-panel__sym">{marketMeta.id}</span>
          <span className="ws-panel__label">{marketMeta.label}</span>
        </div>
        <div className="ws-panel__price">
          <span className={`ws-panel__value ws-tone--${dirTone}`}>{tick.toFixed(2)}</span>
          <span className={`ws-panel__change ws-tone--${dirTone}`}>
            {tickDir === 'up' ? <TrendingUp size={12} /> : tickDir === 'down' ? <TrendingDown size={12} /> : null}
            {stats.change >= 0 ? '+' : ''}{stats.change.toFixed(2)}%
          </span>
        </div>
        <svg className="ws-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke={tickDir === 'up' ? '#4bb4b3' : tickDir === 'down' ? '#ec3f3f' : '#ffad3a'}
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        <div className="ws-panel__stats">
          <div className="ws-panel__stat">
            <span>High</span><b>{stats.high.toFixed(2)}</b>
          </div>
          <div className="ws-panel__stat">
            <span>Low</span><b>{stats.low.toFixed(2)}</b>
          </div>
          <div className="ws-panel__stat">
            <span>Open</span><b>{stats.first.toFixed(2)}</b>
          </div>
        </div>
        <div className="ws-panel__digits">
          <span className="ws-panel__digits-label">Last digits</span>
          <div className="ws-panel__digits-row">
            {stats.digits.map((d, i) => (
              <span key={`${d}-${i}`} className={`ws-digit ${d % 2 === 0 ? 'ws-digit--even' : 'ws-digit--odd'}`}>{d}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="ws-panel ws-panel--mode">
        <div className="ws-panel__head">
          <span className="ws-panel__title"><Sparkles size={12} /> Active mode</span>
        </div>
        <p className="ws-panel__desc">{modeMeta.desc}</p>
        <div className="ws-panel__meta">
          <span>Strategy: {strategyById(strategy).label}</span>
          <span>Phase: {phase}</span>
        </div>
      </div>

      <div className="ws-panel ws-panel--signals">
        <div className="ws-panel__head">
          <span className="ws-panel__title"><Flame size={12} /> Recent signals</span>
        </div>
        {signalHistory.length === 0 && (
          <p className="ws-panel__empty">Run an analysis to generate signals.</p>
        )}
        {signalHistory.slice(0, 4).map((s, i) => (
          <div key={`${s.at}-${i}`} className="ws-signal">
            <span className={`ws-signal__dir ws-signal__dir--${s.dir.toLowerCase()}`}>{s.dir}</span>
            <span className="ws-signal__conf">{s.confidence}%</span>
            <span className="ws-signal__match">{s.matches}/{s.total}</span>
            <span className="ws-signal__time">{new Date(s.at).toLocaleTimeString()}</span>
          </div>
        ))}
        {lastSignal && (
          <p className="ws-panel__note">
            <Info size={11} /> Latest: {lastSignal.matches}/{lastSignal.total} conditions matched.
          </p>
        )}
      </div>
    </aside>
  )
}
