import { useMemo } from 'react'
import { ArrowLeft, TrendingUp, TrendingDown, Timer, Layers } from 'lucide-react'
import { useSessionStore } from '../../state/sessionStore'
import { fmtMoney, fmtSignedMoney, fmtTime, fmtDuration, pnlClass, tradeStatusBadge, tradeStatusLabel } from './utils'

function PriceSnapshot({ trade }) {
  const points = useMemo(() => {
    const steps = 24
    const out = []
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps
      out.push(trade.entrySpot + (trade.exitSpot - trade.entrySpot) * t)
    }
    return out
  }, [trade])

  const W = 100
  const H = 36
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const coords = points.map((v, i) => [((i / (points.length - 1)) * W).toFixed(2), (H - ((v - min) / range) * (H - 6) - 3).toFixed(2)])
  const line = coords.map((c, i) => `${i ? 'L' : 'M'}${c[0]},${c[1]}`).join(' ')
  const area = `${line} L${W},${H} L0,${H} Z`
  const rise = trade.exitSpot >= trade.entrySpot

  return (
    <div className={`tr-detail__chart ${rise ? '' : 'tr-detail__chart--down'}`}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: 110 }} aria-label="Price path snapshot">
        <defs>
          <linearGradient id="trDetailFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#trDetailFill)" />
        <path d={line} fill="none" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        <circle cx={coords[0][0]} cy={coords[0][1]} r="2" />
        <circle cx={coords[coords.length - 1][0]} cy={coords[coords.length - 1][1]} r="2.4" />
      </svg>
      <div className="tr-detail__chartlabels">
        <span>Entry {trade.entrySpot.toFixed(2)}</span>
        <span>Exit {trade.exitSpot.toFixed(2)}</span>
      </div>
    </div>
  )
}

function TimelineStep({ label, time, latency }) {
  return (
    <div className="tr-detail__step">
      <span className="tr-detail__step-dot" />
      <div className="tr-detail__step-body">
        <span className="tr-detail__step-label">{label}</span>
        <span className="tr-detail__step-time">{time ? fmtTime(time) : '—'}{latency ? ` · ${latency}ms` : ''}</span>
      </div>
    </div>
  )
}

export default function TradeDetailView({ trade, onClose }) {
  const journal = useSessionStore(s => s.journal)
  const aiNote = useMemo(() => journal.find(j => j.tradeId === trade.id && j.type === 'ai'), [journal, trade.id])

  if (!trade) return null

  const { signal, execution } = trade
  const riskReward = trade.stake ? (trade.payout - trade.stake) / trade.stake : 0

  return (
    <div className="tr-detail tr-detail--inline">
      <div className="tr-detail__topbar">
        <button className="tr-btn" onClick={onClose} aria-label="Back to transactions">
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>
        <span className="tr-detail__sub">
          {trade.id} · {trade.symbol} <span className={tradeStatusBadge(trade.status)}>{tradeStatusLabel(trade.status)}</span>
        </span>
      </div>

      <div className="tr-scroll">
        <div className="tr-detail__body">
          <div className="tr-detail__head">
            <div className={`tr-detail__direction ${trade.contractType === 'Rise' ? 'tr-detail__direction--rise' : 'tr-detail__direction--fall'}`}>
              {trade.contractType === 'Rise' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              {trade.contractType}
            </div>
            <div className={`tr-detail__pnl ${pnlClass(trade.profit)}`}>
              {trade.status === 'open' ? 'Settling…' : fmtSignedMoney(trade.profit)}
            </div>
          </div>

          <div className="tr-detail__section">
            <div className="tr-detail__section-title">Execution Timeline</div>
            <div className="tr-detail__timeline">
              <TimelineStep label="Signal generated" time={execution.signalAt} />
              <TimelineStep label="Contract opened" time={execution.openedAt} latency={execution.openLatencyMs} />
              <TimelineStep label="Contract settled" time={execution.resolvedAt} latency={execution.settleLatencyMs} />
            </div>
          </div>

          <div className="tr-detail__section">
            <div className="tr-detail__section-title">Chart Snapshot</div>
            <PriceSnapshot trade={trade} />
          </div>

          <div className="tr-detail__section">
            <div className="tr-detail__section-title">Indicator Values</div>
            <div className="tr-detail__grid">
              <span className="tr-detail__kv"><b>RSI</b>{signal.rsi.toFixed(2)}</span>
              <span className="tr-detail__kv"><b>MACD</b>{signal.macd.toFixed(3)}</span>
              <span className="tr-detail__kv"><b>MA (20)</b>{signal.ma20 >= 0 ? '+' : ''}{signal.ma20.toFixed(2)}</span>
              <span className="tr-detail__kv"><b>BB Width</b>{signal.bbWidth.toFixed(1)}</span>
              <span className="tr-detail__kv"><b>Momentum</b>{signal.momentum.toFixed(2)}</span>
              <span className="tr-detail__kv"><b>Conditions</b>{signal.marketConditions}</span>
            </div>
          </div>

          <div className="tr-detail__section">
            <div className="tr-detail__section-title">Trade Reasoning</div>
            <p className="tr-detail__text">{signal.rationale}</p>
            {aiNote ? (
              <div className="tr-detail__ai">
                <div className="tr-detail__ai-label">AI explanation</div>
                <p className="tr-detail__text">{aiNote.details}</p>
              </div>
            ) : null}
          </div>

          <div className="tr-detail__section">
            <div className="tr-detail__section-title">Contract Parameters</div>
            <div className="tr-detail__grid">
              <span className="tr-detail__kv"><b>Stake</b>{fmtMoney(trade.stake)}</span>
              <span className="tr-detail__kv"><b>Payout</b>{fmtMoney(trade.payout)}</span>
              <span className="tr-detail__kv"><b>Entry Price</b>{trade.entrySpot.toFixed(2)}</span>
              <span className="tr-detail__kv"><b>Exit Price</b>{trade.exitSpot.toFixed(2)}</span>
              <span className="tr-detail__kv"><b>Risk / Reward</b>1:{riskReward.toFixed(2)}</span>
              <span className="tr-detail__kv"><b>Duration</b>{fmtDuration(trade.duration)}</span>
            </div>
            {trade.entryPoints && trade.entryPoints.length > 0 && (
              <div className="tr-detail__entrypoints">
                <span className="tr-detail__entrypoints-label">Suggested Entry Points</span>
                <span className="tr-detail__entrypoints-chips">
                  {trade.entryPoints.map(d => (
                    <span key={d} className="tr-detail__entrypoint-chip">{d}</span>
                  ))}
                </span>
              </div>
            )}
          </div>

          <div className="tr-detail__section">
            <div className="tr-detail__section-title">
              <Timer size={13} /> Latency
            </div>
            <div className="tr-detail__grid">
              <span className="tr-detail__kv"><b>Open</b>{execution.openLatencyMs}ms</span>
              <span className="tr-detail__kv"><b>Settle</b>{execution.settleLatencyMs}ms</span>
              <span className="tr-detail__kv"><b>Total</b>{trade.latencyMs}ms</span>
            </div>
          </div>

          <div className="tr-detail__section">
            <div className="tr-detail__section-title">
              <Layers size={13} /> Execution Logs
            </div>
            <div className="tr-detail__logs">
              {execution.logs.map((log, i) => (
                <div key={`${log}-${i}`} className="tr-detail__log">{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
