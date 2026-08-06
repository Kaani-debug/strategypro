import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw,
  Activity,
  Eye,
  Star,
  X,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Play,
  Square,
  Zap,
  Gauge,
  Flame,
  Waves,
} from 'lucide-react'
import { SYMBOLS, DEFAULT_SYMBOL } from '../../terminal/data/config'
import { useMarketStore } from '../../terminal/state/marketStore'

const SCANNER_MARKETS = [
  { id: '1HZ100V', label: 'Volatility 100 (1s) Index', base: 1250 },
  { id: '1HZ75V', label: 'Volatility 75 (1s) Index', base: 1000 },
  { id: '1HZ50V', label: 'Volatility 50 (1s) Index', base: 800 },
  { id: '1HZ25V', label: 'Volatility 25 (1s) Index', base: 600 },
  { id: 'BOOM1000', label: 'Boom 1000 Index', base: 15000 },
  { id: 'CRASH1000', label: 'Crash 1000 Index', base: 5000 },
  { id: 'JUMP100', label: 'Jump 100 Index', base: 350 },
  { id: 'STEP100', label: 'Step 100 Index', base: 250 },
]

const PATTERN_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'streak', label: 'Streaks' },
  { id: 'momentum', label: 'Momentum' },
  { id: 'volatility', label: 'Volatility' },
  { id: 'rsi', label: 'RSI' },
]

const SIGNAL_TONES = {
  'Strong Buy': '#0e6f6e',
  Buy: '#4bb4b3',
  Neutral: '#ffad3a',
  Sell: '#ec3f3f',
  'Strong Sell': '#b02626',
}

const HISTORY_POINTS = 50
const TICK_MS = 1400

function seedHistory(base) {
  let price = base * (0.92 + Math.random() * 0.16)
  const out = []
  for (let i = 0; i < HISTORY_POINTS; i += 1) {
    price = price * (1 + (Math.random() - 0.5) * 0.004)
    out.push(price)
  }
  return out
}

function nextTick(market, price) {
  const jumpy = market.id === 'JUMP100' || market.id === 'BOOM1000' || market.id === 'CRASH1000'
  const jump = jumpy && Math.random() < 0.025
  const step =
    jump
      ? price * (Math.random() - 0.38) * (market.id === 'JUMP100' ? 0.03 : 0.012)
      : price * (Math.random() - 0.5) * (market.id === '1HZ100V' ? 0.005 : 0.003)
  const next = Math.max(market.base * 0.85, price + step)
  return +(next.toFixed(2))
}

function analyze(market) {
  const h = market.history
  const first = h[0]
  const last = h[h.length - 1]
  const changePct = +(((last - first) / first) * 100).toFixed(2)
  const dir = last > first ? 'rise' : last < first ? 'fall' : 'flat'

  const changes = []
  for (let i = 1; i < h.length; i += 1) changes.push(h[i] - h[i - 1])

  const momWindow = changes.slice(-5)
  const momentum = momWindow.reduce((a, b) => a + b, 0) / (momWindow.length || 1)
  const momentumPct = +((Math.abs(momentum) / first) * 100).toFixed(2)

  const volWindow = changes.slice(-12)
  const mean = volWindow.reduce((a, b) => a + b, 0) / (volWindow.length || 1)
  const variance = volWindow.reduce((a, b) => a + (b - mean) ** 2, 0) / (volWindow.length || 1)
  const volPct = +((Math.sqrt(variance) / first) * 100).toFixed(2)

  let gains = 0
  let losses = 0
  for (const c of changes) {
    if (c > 0) gains += c
    else if (c < 0) losses += Math.abs(c)
  }
  const rsi = gains + losses === 0 ? 50 : Math.round(100 - 100 / (1 + gains / losses))

  let streak = 0
  if (changes.length) {
    const lastSign = Math.sign(changes[changes.length - 1])
    for (let i = changes.length - 1; i >= 0; i -= 1) {
      if (Math.sign(changes[i]) === lastSign && lastSign !== 0) streak += 1
      else break
    }
  }
  const streakDir = streak >= 3 ? (dir === 'rise' ? 'Rise' : 'Fall') : null

  const lastDigit = Math.floor(Math.abs(last)) % 10
  const parity = lastDigit % 2 === 0 ? 'Even' : 'Odd'
  const distPct = +((Math.abs(last - market.base) / market.base) * 100).toFixed(2)

  const patterns = []
  const categories = []
  if (streak >= 3) {
    patterns.push(`${streak}-Streak ${streakDir}`)
    categories.push('streak')
  }
  if (momentumPct > 0.15) {
    patterns.push(momentum > 0 ? 'Bullish Momentum' : 'Bearish Momentum')
    categories.push('momentum')
  }
  if (volPct > 0.9) {
    patterns.push('High Volatility')
    categories.push('volatility')
  }
  if (volPct < 0.28) {
    patterns.push('Low Volatility')
    categories.push('volatility')
  }
  if (distPct < 0.05) {
    patterns.push('Boundary Zone')
  }
  if (rsi > 70) {
    patterns.push('Overbought')
    categories.push('rsi')
  }
  if (rsi < 30) {
    patterns.push('Oversold')
    categories.push('rsi')
  }

  let score = 50
  score += Math.max(-20, Math.min(20, momentum * 150))
  score += Math.max(-15, Math.min(15, (rsi - 50) * 0.55))
  score += Math.max(-10, Math.min(10, streak * 3))
  score -= Math.max(0, (volPct - 0.6) * 5)
  score = Math.max(2, Math.min(98, Math.round(score)))

  const signal = score >= 78 ? 'Strong Buy' : score >= 60 ? 'Buy' : score > 40 ? 'Neutral' : score > 22 ? 'Sell' : 'Strong Sell'

  let reasoning
  const body = []
  if (streak >= 3) body.push(`${streak} consecutive ${streakDir.toLowerCase()} prints form a ${streakDir} streak pattern.`)
  if (momentumPct > 0.15) body.push(`${momentum > 0 ? 'Upward' : 'Downward'} momentum is building at ${momentumPct.toFixed(2)}% per tick.`)
  if (rsi > 70) body.push(`RSI at ${rsi} reads overbought; pullback risk is elevated.`)
  if (rsi < 30) body.push(`RSI at ${rsi} reads oversold; bounce potential is elevated.`)
  if (volPct > 0.9) body.push(`Volatility is high (${volPct.toFixed(2)}%); wider swings than usual.`)
  if (volPct < 0.28) body.push(`Volatility is low (${volPct.toFixed(2)}%); price is coiling.`)
  if (distPct < 0.05) body.push(`Price is sitting ${distPct.toFixed(2)}% from the ${market.id} baseline boundary.`)
  if (!body.length) body.push(`Price is drifting ${dir === 'rise' ? 'higher' : dir === 'fall' ? 'lower' : 'sideways'} with no dominant pattern detected.`)
  if (score >= 60) body.push('Scan favours an entry on the prevailing direction.')
  else if (score <= 40) body.push('Scan favours avoiding or fading the prevailing direction.')
  else body.push('Scan conditions are neutral; wait for clearer alignment.')
  reasoning = body.join(' ')

  return {
    changePct,
    dir,
    momentum,
    momentumPct,
    volPct,
    rsi,
    streak,
    streakDir,
    lastDigit,
    parity,
    distPct,
    patterns,
    categories,
    score,
    signal,
    reasoning,
  }
}

function Sparkline({ history, dir }) {
  const width = 220
  const height = 56
  if (!history.length) return null
  const min = Math.min(...history)
  const max = Math.max(...history)
  const span = max - min || 1
  const pts = history
    .map((p, i) => {
      const x = (i / (history.length - 1)) * width
      const y = height - ((p - min) / span) * (height - 6) - 3
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const color = dir === 'rise' ? '#4bb4b3' : dir === 'fall' ? '#ec3f3f' : '#ffad3a'
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="at-scan-spark" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export default function AnalysisToolScanner() {
  const [markets, setMarkets] = useState(() =>
    SCANNER_MARKETS.map(m => ({ ...m, price: m.base, history: seedHistory(m.base) }))
  )
  const [auto, setAuto] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [lastScan, setLastScan] = useState(null)
  const [filter, setFilter] = useState('all')
  const [watch, setWatch] = useState(() => new Set(['1HZ100V']))
  const [selected, setSelected] = useState(null)
  const tickRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setMarkets(prev =>
        prev.map(m => {
          const price = nextTick(m, m.price)
          return { ...m, price, history: [...m.history, price].slice(-HISTORY_POINTS) }
        })
      )
    }, TICK_MS)
    return () => clearInterval(tickRef.current)
  }, [])

  const runScan = useCallback(() => {
    if (scanning) return
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      setLastScan(new Date())
    }, 900)
  }, [scanning])

  useEffect(() => {
    if (!auto || scanning) return undefined
    const t = setInterval(runScan, 6000)
    return () => clearInterval(t)
  }, [auto, scanning, runScan])

  const results = useMemo(
    () => markets.map(m => ({ market: m, ...analyze(m) })),
    [markets]
  )

  const toggleWatch = id => {
    setWatch(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const tradeMarket = id => {
    const sym = SYMBOLS.find(s => s.symbol === id) || DEFAULT_SYMBOL
    useMarketStore.getState().setSymbol(sym)
    navigate('/terminal')
  }

  const strongCount = results.filter(r => r.score >= 78).length
  const buyCount = results.filter(r => r.score >= 60).length
  const sellCount = results.filter(r => r.score <= 40).length
  const watchCount = results.filter(r => watch.has(r.market.id)).length

  const visible = filter === 'all' ? results : results.filter(r => r.categories.includes(filter))

  return (
    <div className="at-scanner">
      <div className="at-scan-topbar">
        <div className="at-scan-controls">
          <button className={`at-scan-btn at-scan-btn--primary ${scanning ? 'is-scanning' : ''}`} onClick={runScan}>
            <RefreshCw size={14} className={scanning ? 'spin' : ''} />
            {scanning ? 'Scanning…' : 'Scan Now'}
          </button>
          <button className={`at-scan-toggle ${auto ? 'active' : ''}`} onClick={() => setAuto(a => !a)}>
            {auto ? <Square size={12} /> : <Play size={12} />}
            {auto ? 'Auto' : 'Manual'}
          </button>
          <span className="at-scan-hint">
            {lastScan ? `Last scan ${lastScan.toLocaleTimeString()}` : 'Live scan ready'}
          </span>
        </div>
        <div className="at-scan-filters">
          <span className="at-scan-filter-label">Patterns</span>
          {PATTERN_FILTERS.map(f => (
            <button
              key={f.id}
              className={`at-scan-chip ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="at-scan-summary">
        <div className="at-scan-stat">
          <Activity size={13} />
          <b>{results.length}</b> markets
        </div>
        <div className="at-scan-stat">
          <TrendingUp size={13} />
          <b>{buyCount}</b> buy signals
        </div>
        <div className="at-scan-stat">
          <Flame size={13} />
          <b>{strongCount}</b> strong
        </div>
        <div className="at-scan-stat">
          <TrendingDown size={13} />
          <b>{sellCount}</b> sell signals
        </div>
        <div className="at-scan-stat">
          <Star size={13} />
          <b>{watchCount}</b> watched
        </div>
      </div>

      <div className="at-scan-grid">
        {visible.map(({ market, ...r }) => (
          <MarketCard
            key={market.id}
            market={market}
            analysis={r}
            watched={watch.has(market.id)}
            onToggleWatch={() => toggleWatch(market.id)}
            onAnalyze={() => setSelected(market.id)}
            onTrade={() => tradeMarket(market.id)}
          />
        ))}
      </div>

      {selected && (
        <ScannerModal
          marketId={selected}
          results={results}
          watched={watch.has(selected)}
          onToggleWatch={toggleWatch}
          onTrade={tradeMarket}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

function MarketCard({ market, analysis, watched, onToggleWatch, onAnalyze, onTrade }) {
  const { changePct, dir, score, signal, patterns, rsi, streak, lastDigit, volPct, momentumPct, categories } = analysis
  const icon = categories.includes('volatility') ? <Waves size={14} /> : categories.includes('momentum') ? <Zap size={14} /> : <Gauge size={14} />

  return (
    <div className="at-scan-card">
      <div className="at-scan-card__head">
        <div className="at-scan-card__id">
          <span className="at-scan-card__sym">{market.id}</span>
          <span className="at-scan-card__name">{market.label}</span>
        </div>
        <button
          className={`at-scan-watch ${watched ? 'active' : ''}`}
          onClick={onToggleWatch}
          title={watched ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Star size={15} fill={watched ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="at-scan-card__price">
        <span className={`at-scan-card__value at-scan--${dir}`}>{market.price.toFixed(2)}</span>
        <span className={`at-scan-card__change at-scan--${dir}`}>
          {dir === 'rise' ? <TrendingUp size={13} /> : dir === 'fall' ? <TrendingDown size={13} /> : null}
          {changePct >= 0 ? '+' : ''}{changePct}%
        </span>
        <span className="at-scan-signal" style={{ background: SIGNAL_TONES[signal] }}>
          {signal}
        </span>
      </div>

      <div className="at-scan-score">
        <div className="at-scan-score__row">
          <span className="at-scan-score__label">
            {icon} Scan score
          </span>
          <span className="at-scan-score__val">{score}/100</span>
        </div>
        <div className="at-scan-score__track">
          <div
            className={`at-scan-score__fill at-scan--${dir}`}
            style={{ width: `${score}%`, background: SIGNAL_TONES[signal] }}
          />
        </div>
      </div>

      <div className="at-scan-stats">
        <div className="at-scan-stat-cell">
          <span className="at-scan-stat-cell__k">RSI</span>
          <span className="at-scan-stat-cell__v">{rsi}</span>
        </div>
        <div className="at-scan-stat-cell">
          <span className="at-scan-stat-cell__k">Streak</span>
          <span className="at-scan-stat-cell__v">{streak}</span>
        </div>
        <div className="at-scan-stat-cell">
          <span className="at-scan-stat-cell__k">Last digit</span>
          <span className="at-scan-stat-cell__v">{lastDigit}</span>
        </div>
        <div className="at-scan-stat-cell">
          <span className="at-scan-stat-cell__k">Vol</span>
          <span className="at-scan-stat-cell__v">{volPct.toFixed(2)}%</span>
        </div>
        <div className="at-scan-stat-cell">
          <span className="at-scan-stat-cell__k">Mom</span>
          <span className="at-scan-stat-cell__v">{momentumPct.toFixed(2)}%</span>
        </div>
      </div>

      <div className="at-scan-card__patterns">
        {patterns.slice(0, 3).map(p => (
          <span key={p} className="at-scan-chip at-scan-chip--soft">{p}</span>
        ))}
        {!patterns.length && <span className="at-scan-chip at-scan-chip--soft">No pattern</span>}
      </div>

      <div className="at-scan-card__actions">
        <button className="at-scan-btn" onClick={onAnalyze}>
          <Eye size={13} /> Analyze
        </button>
        <button className="at-scan-btn at-scan-btn--primary" onClick={onTrade}>
          <ArrowUpRight size={13} /> Trade
        </button>
      </div>
    </div>
  )
}

function ScannerModal({ marketId, results, watched, onToggleWatch, onTrade, onClose }) {
  const result = results.find(r => r.market.id === marketId)
  if (!result) return null
  const { market, ...a } = result
  const { changePct, dir, signal, patterns, rsi, streak, streakDir, lastDigit, parity, volPct, momentumPct, distPct, reasoning } = a

  return (
    <div className="at-modal-overlay" onClick={onClose}>
      <div className="at-modal at-modal--scanner" onClick={e => e.stopPropagation()}>
        <div className="at-modal__head">
          <div>
            <h3 className="at-modal__title">{market.id}</h3>
            <span className="at-modal__subtitle">{market.label}</span>
          </div>
          <button className="at-modal__close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="at-scan-detail">
          <div className="at-scan-detail__price">
            <span className={`at-scan-card__value at-scan--${dir}`}>{market.price.toFixed(2)}</span>
            <span className={`at-scan-card__change at-scan--${dir}`}>
              {dir === 'rise' ? <TrendingUp size={13} /> : dir === 'fall' ? <TrendingDown size={13} /> : null}
              {changePct >= 0 ? '+' : ''}{changePct}%
            </span>
            <span className="at-scan-signal" style={{ background: SIGNAL_TONES[signal] }}>{signal}</span>
          </div>

          <Sparkline history={market.history} dir={dir} />

          <div className="at-scan-detail__indicators">
            <div className="at-scan-detail__cell">
              <span>RSI</span><b>{rsi}</b>
            </div>
            <div className="at-scan-detail__cell">
              <span>Momentum</span><b>{momentumPct.toFixed(2)}%</b>
            </div>
            <div className="at-scan-detail__cell">
              <span>Volatility</span><b>{volPct.toFixed(2)}%</b>
            </div>
            <div className="at-scan-detail__cell">
              <span>Streak</span><b>{streak} {streakDir || ''}</b>
            </div>
            <div className="at-scan-detail__cell">
              <span>Last digit</span><b>{lastDigit} · {parity}</b>
            </div>
            <div className="at-scan-detail__cell">
              <span>Boundary</span><b>{distPct.toFixed(2)}%</b>
            </div>
          </div>

          <div className="at-scan-card__patterns">
            {patterns.map(p => (
              <span key={p} className="at-scan-chip at-scan-chip--soft">{p}</span>
            ))}
            {!patterns.length && <span className="at-scan-chip at-scan-chip--soft">No pattern</span>}
          </div>

          <div className="at-scan-detail__reason">
            {reasoning}
          </div>
        </div>

        <div className="at-modal__foot">
          <button className="at-scan-btn" onClick={() => onToggleWatch(marketId)}>
            <Star size={13} fill={watched ? 'currentColor' : 'none'} />
            {watched ? 'Watched' : 'Watch'}
          </button>
          <button className="at-scan-btn at-scan-btn--primary" onClick={() => onTrade(marketId)}>
            <ArrowUpRight size={13} /> Trade this market
          </button>
        </div>
      </div>
    </div>
  )
}
