import { useMemo } from 'react'

export default function PerformanceChart({ trades, height = 140 }) {
  const points = useMemo(() => {
    let cum = 0
    const out = []
    for (const t of trades) {
      if (t.status === 'won' || t.status === 'lost') {
        cum += t.profit
        out.push(cum)
      }
    }
    return out
  }, [trades])

  if (!points.length) {
    return (
      <div className="tr-perf tr-perf--empty">
        <span>No completed trades yet</span>
        <span className="tr-perf__hint">The performance curve will appear as trades settle.</span>
      </div>
    )
  }

  const W = 100
  const H = 40
  const min = Math.min(0, ...points)
  const max = Math.max(0, ...points)
  const range = max - min || 1
  const coords = points.map((v, i) => [
    points.length === 1 ? 0 : (i / (points.length - 1)) * W,
    H - ((v - min) / range) * (H - 6) - 3,
  ])
  const line = coords.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
  const area = `${line} L${W},${H} L0,${H} Z`
  const last = coords[coords.length - 1]
  const rising = points[points.length - 1] >= (points.length > 1 ? points[points.length - 2] : 0)

  return (
    <div className={`tr-perf ${rising ? '' : 'tr-perf--down'}`}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height, width: '100%' }} role="img" aria-label="Cumulative profit and loss">
        <defs>
          <linearGradient id="trPerfFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#trPerfFill)" className="tr-perf__area" />
        <path d={line} fill="none" className="tr-perf__stroke" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1={H - ((0 - min) / range) * (H - 6) - 3} x2={W} y2={H - ((0 - min) / range) * (H - 6) - 3} className="tr-perf__zero" strokeWidth="0.4" strokeDasharray="2 1.5" />
        <circle cx={last[0]} cy={last[1]} r="2.4" className="tr-perf__dot" />
      </svg>
    </div>
  )
}
