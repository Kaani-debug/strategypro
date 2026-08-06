import { useEffect, useState } from 'react'
import { Hash } from 'lucide-react'
import { useAnalysisStore } from '../../state/analysisStore'

function buildDigitAnalysis(history) {
  const counts = Array(10).fill(0)
  history.forEach(d => { counts[d] += 1 })
  const total = history.length || 1
  const pcts = counts.map(c => +((c / total) * 100).toFixed(1))

  const sorted = [...pcts].map((p, i) => ({ digit: i, pct: p })).sort((a, b) => b.pct - a.pct)
  return { pcts, highest: sorted[0], secondHighest: sorted[1], lowest: sorted[sorted.length - 1], secondLowest: sorted[sorted.length - 2] }
}

function getCircleClass(digit, { highest, secondHighest, lowest, secondLowest }) {
  if (digit === highest.digit) return 'at-circle--highest'
  if (digit === secondHighest.digit) return 'at-circle--second-highest'
  if (digit === lowest.digit) return 'at-circle--lowest'
  if (digit === secondLowest.digit) return 'at-circle--second-lowest'
  return ''
}

function getDigitColor(d, pct) {
  if (pct > 12) return '#4bb4b3'
  if (pct > 9) return '#85acb0'
  if (pct > 7) return '#ffad3a'
  return '#6e6e6e'
}

export default function DigitCirclesView() {
  const market = useAnalysisStore(s => s.market)
  const tick = useAnalysisStore(s => s.tick)
  const [ticks, setTicks] = useState(1000)
  const [history, setHistory] = useState(() => Array.from({ length: 1000 }, () => Math.floor(Math.random() * 10)))
  const [lastDigit, setLastDigit] = useState('5')

  useEffect(() => {
    const digit = Math.floor(Math.abs(tick)) % 10
    setLastDigit(String(digit))
    setHistory(prev => [digit, ...prev].slice(0, ticks))
  }, [tick, ticks])

  const analysis = buildDigitAnalysis(history)
  const { pcts, highest, secondHighest, lowest, secondLowest } = analysis
  const cards = buildCards(history)

  return (
    <div className="at-circles-view">
      <div className="at-circles-toolbar">
        <span className="at-circles-toolbar__title">
          <Hash size={14} /> Digit distribution — {market}
        </span>
        <div className="at-ticks-wrap">
          <label>Ticks</label>
          <input type="number" value={ticks} onChange={e => setTicks(Math.max(100, +e.target.value || 1000))} />
        </div>
        <span className="at-circles-toolbar__digit">Last digit: <b>{lastDigit}</b></span>
      </div>

      <div className="at-circles">
        {pcts.map((pct, i) => (
          <div
            key={i}
            className={`at-circle ${getCircleClass(i, { highest, secondHighest, lowest, secondLowest })} ${String(i) === lastDigit ? 'at-circle--active' : ''}`}
          >
            <span className="at-circle__dot" style={{ backgroundColor: getDigitColor(i, pct) }} />
            <span className="at-circle__digit">{i}</span>
            <span className="at-circle__pct">{pct}%</span>
          </div>
        ))}
      </div>

      <div className="at-cards">
        {cards.map(card => (
          <Card key={card.title} card={card} lastDigit={lastDigit} />
        ))}
      </div>
    </div>
  )
}

const INITIAL_VISIBLE = 24

function Card({ card, lastDigit }) {
  const { title, streak, bars, predictions, sequence } = card
  const [prediction, setPrediction] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const showPredButtons = !!predictions
  const [seqHistory, setSeqHistory] = useState(sequence)

  useEffect(() => {
    const interval = setInterval(() => {
      const roll = Math.random()
      let newSeq
      if (title === 'Over / Under') newSeq = roll > 0.5 ? 'U' : 'O'
      else if (title === 'Match / Differ') newSeq = roll > 0.5 ? 'D' : 'M'
      else if (title === 'Even / Odd') newSeq = +lastDigit % 2 === 0 ? 'E' : 'O'
      else newSeq = roll > 0.5 ? 'F' : 'R'
      setSeqHistory(prev => [newSeq, ...prev].slice(0, 42))
    }, 3000)
    return () => clearInterval(interval)
  }, [title, lastDigit])

  const visible = expanded ? seqHistory : seqHistory.slice(0, INITIAL_VISIBLE)

  return (
    <div className="at-card">
      <div className="at-card__header">
        <span className="at-card__title">{title}</span>
        <span className="at-card__streak">{streak}</span>
      </div>
      <div className="at-card__body">
        {showPredButtons && (
          <div className="at-prediction">
            {predictions.map(d => (
              <button
                key={d}
                className={`at-pred-btn ${prediction === d ? 'active' : ''}`}
                onClick={() => setPrediction(d)}
              >{d}</button>
            ))}
          </div>
        )}
        <div className="at-bars">
          {bars.map((bar, i) => (
            <div key={i} className={`at-bar-row at-bar--${bar.label.toLowerCase()}`}>
              <span>{bar.label}</span>
              <div className="at-bar-track">
                <div className="at-bar-fill" style={{ width: bar.pct + '%' }} />
              </div>
              <span>{bar.pct}%</span>
            </div>
          ))}
        </div>
        <div className="at-sequence">
          {visible.map((s, i) => (
            <div key={i} className={`at-seq-box at-seq-box--${s.toLowerCase()}`}>{s}</div>
          ))}
        </div>
        <div className="at-sequence-toggle">
          <button className="at-seq-more" onClick={() => setExpanded(!expanded)}>
            {expanded ? '- Less' : '+ More'}
          </button>
        </div>
      </div>
    </div>
  )
}

function pctOf(history, pred) {
  if (!history.length) return 0
  const n = history.filter(pred).length
  return +((n / history.length) * 100).toFixed(1)
}

function streakOf(history, pred) {
  let n = 0
  for (const d of history) {
    if (pred(d)) n += 1
    else break
  }
  return n
}

function buildCards(history) {
  const recent = history.slice(0, 20)
  const last = recent[0]
  const overPct = pctOf(recent, d => d >= 5)
  const underPct = +(100 - overPct).toFixed(1)
  const matchPct = pctOf(recent, d => d === last)
  const differPct = +(100 - matchPct).toFixed(1)
  const evenPct = pctOf(recent, d => d % 2 === 0)
  const oddPct = +(100 - evenPct).toFixed(1)
  const risePct = pctOf(recent, d => d > (last ?? 5))
  const fallPct = +(100 - risePct).toFixed(1)

  const streakOver = streakOf(recent, d => d >= 5)
  const streakMatch = streakOf(recent, d => d === last)
  const streakEven = streakOf(recent, d => d % 2 === 0)
  const streakRise = streakOf(recent, d => d > (last ?? 5))

  return [
    {
      title: 'Over / Under', streak: `${streakOver}x Over`,
      bars: [{ label: 'Over', pct: overPct }, { label: 'Under', pct: underPct }],
      predictions: Array.from({ length: 10 }, (_, i) => i),
      sequence: recent.map(d => d >= 5 ? 'O' : 'U'),
    },
    {
      title: 'Match / Differ', streak: `${streakMatch}x Match`,
      bars: [{ label: 'Match', pct: matchPct }, { label: 'Differ', pct: differPct }],
      predictions: Array.from({ length: 10 }, (_, i) => i),
      sequence: recent.map(d => d === last ? 'M' : 'D'),
    },
    {
      title: 'Even / Odd', streak: `${streakEven}x Even`,
      bars: [{ label: 'Even', pct: evenPct }, { label: 'Odd', pct: oddPct }],
      predictions: null,
      sequence: recent.map(d => d % 2 === 0 ? 'E' : 'O'),
    },
    {
      title: 'Rise / Fall', streak: `${streakRise}x Rise`,
      bars: [{ label: 'Rise', pct: risePct }, { label: 'Fall', pct: fallPct }],
      predictions: Array.from({ length: 10 }, (_, i) => i),
      sequence: recent.map(d => d > (last ?? 5) ? 'R' : 'F'),
    },
  ]
}
