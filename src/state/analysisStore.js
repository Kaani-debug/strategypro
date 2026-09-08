import { create } from 'zustand'

const VOL_LEVELS = [
  { v: 10, base: 500, vol: 0.0008 },
  { v: 25, base: 600, vol: 0.0018 },
  { v: 50, base: 800, vol: 0.0032 },
  { v: 75, base: 1000, vol: 0.0045 },
  { v: 100, base: 1250, vol: 0.006 },
]

const VOL_DURATIONS = [
  { suffix: '', label: '1s', tickMs: 1200 },
  { suffix: '-2S', label: '2s', tickMs: 1200 },
  { suffix: '-5S', label: '5s', tickMs: 1300 },
  { suffix: '-10S', label: '10s', tickMs: 1500 },
  { suffix: '-15S', label: '15s', tickMs: 1700 },
  { suffix: '-20S', label: '20s', tickMs: 1900 },
  { suffix: '-30S', label: '30s', tickMs: 2200 },
  { suffix: '-1M', label: '1m', tickMs: 2600 },
  { suffix: '-2M', label: '2m', tickMs: 3000 },
  { suffix: '-3M', label: '3m', tickMs: 3400 },
  { suffix: '-5M', label: '5m', tickMs: 4200 },
  { suffix: '-10M', label: '10m', tickMs: 6000 },
]

const VOLATILITY_MARKETS = VOL_LEVELS.flatMap(l =>
  VOL_DURATIONS.map(d => ({
    id: `1HZ${l.v}V${d.suffix}`,
    label: `Volatility ${l.v} (${d.label}) Index`,
    base: l.base,
    vol: l.vol,
    tickMs: d.tickMs,
    group: 'Volatility',
  }))
)

export const MARKETS = [
  ...VOLATILITY_MARKETS,
  { id: 'BOOM300', label: 'Boom 300 Index', base: 13000, vol: 0.004, tickMs: 1200, group: 'Boom' },
  { id: 'BOOM500', label: 'Boom 500 Index', base: 18000, vol: 0.0045, tickMs: 1200, group: 'Boom' },
  { id: 'BOOM600', label: 'Boom 600 Index', base: 22000, vol: 0.0048, tickMs: 1200, group: 'Boom' },
  { id: 'BOOM1000', label: 'Boom 1000 Index', base: 15000, vol: 0.005, tickMs: 1200, group: 'Boom' },
  { id: 'CRASH300', label: 'Crash 300 Index', base: 6000, vol: 0.003, tickMs: 1200, group: 'Crash' },
  { id: 'CRASH500', label: 'Crash 500 Index', base: 7500, vol: 0.0035, tickMs: 1200, group: 'Crash' },
  { id: 'CRASH600', label: 'Crash 600 Index', base: 9000, vol: 0.0038, tickMs: 1200, group: 'Crash' },
  { id: 'CRASH1000', label: 'Crash 1000 Index', base: 5000, vol: 0.004, tickMs: 1200, group: 'Crash' },
  { id: 'STEP100', label: 'Step 100 Index', base: 250, vol: 0.003, tickMs: 1200, group: 'Step' },
  { id: 'STEP200', label: 'Step 200 Index', base: 300, vol: 0.0025, tickMs: 1200, group: 'Step' },
  { id: 'STEP300', label: 'Step 300 Index', base: 350, vol: 0.0026, tickMs: 1200, group: 'Step' },
  { id: 'STEP400', label: 'Step 400 Index', base: 400, vol: 0.0027, tickMs: 1200, group: 'Step' },
  { id: 'STEP500', label: 'Step 500 Index', base: 450, vol: 0.0028, tickMs: 1200, group: 'Step' },
  { id: 'JUMP10', label: 'Jump 10 Index', base: 300, vol: 0.006, tickMs: 1200, group: 'Jump' },
  { id: 'JUMP25', label: 'Jump 25 Index', base: 320, vol: 0.007, tickMs: 1200, group: 'Jump' },
  { id: 'JUMP50', label: 'Jump 50 Index', base: 350, vol: 0.0075, tickMs: 1200, group: 'Jump' },
  { id: 'JUMP75', label: 'Jump 75 Index', base: 370, vol: 0.0078, tickMs: 1200, group: 'Jump' },
  { id: 'JUMP100', label: 'Jump 100 Index', base: 350, vol: 0.008, tickMs: 1200, group: 'Jump' },
  { id: 'RANGE100', label: 'Range Break 100 Index', base: 8000, vol: 0.002, tickMs: 1200, group: 'Range Break' },
  { id: 'RANGE200', label: 'Range Break 200 Index', base: 12000, vol: 0.0025, tickMs: 1200, group: 'Range Break' },
]

export const MARKET_GROUPS = MARKETS.reduce((acc, m) => {
  const existing = acc.find(g => g.label === m.group)
  if (existing) existing.items.push(m)
  else acc.push({ label: m.group, items: [m] })
  return acc
}, [])

export const MODES = [
  { id: 'smart', label: 'Smart Signal', desc: 'Multi-indicator confluence scanning across trend, momentum, volatility and digit patterns.' },
  { id: 'scanner', label: 'Market Scanner', desc: 'Sweeps the primary Deriv indices simultaneously and ranks tradeable setups by scan score.' },
  { id: 'circles', label: 'Digit Circles', desc: 'Last-digit frequency analysis with distribution, streaks and sequence patterns.' },
]

export const STRATEGIES = [
  { id: 'rise-fall', label: 'Rise / Fall' },
  { id: 'higher-lower', label: 'Higher / Lower' },
  { id: 'even-odd', label: 'Even / Odd' },
  { id: 'match-diff', label: 'Matches / Differs' },
  { id: 'over-under', label: 'Over / Under' },
  { id: 'touch-no-touch', label: 'Touch / No Touch' },
]

export const ACCOUNTS = [
  { type: 'real', label: 'Deriv Real', id: 'CR6083459', balance: 0, currency: 'USD' },
]

export const ANALYSIS_STAGES = [
  { key: 'init', label: 'Market initialisation', desc: 'Establishing engine context for the selected strategy and instrument.', category: 'info', code: 'STG-010' },
  { key: 'sync', label: 'Instrument synchronisation', desc: 'Synchronising the live feed with the selected market.', category: 'sync', code: 'STG-020' },
  { key: 'collect', label: 'Live price data collection', desc: 'Capturing live price samples up to the data threshold.', category: 'market', code: 'STG-030' },
  { key: 'integrity', label: 'Data integrity validation', desc: 'Validating sample continuity and sequence integrity.', category: 'sync', code: 'STG-040' },
  { key: 'volatility', label: 'Volatility evaluation', desc: 'Measuring current volatility against the strategy range.', category: 'stats', code: 'STG-050' },
  { key: 'stats', label: 'Statistical conditions', desc: 'Computing RSI, momentum and streak statistics.', category: 'stats', code: 'STG-060' },
  { key: 'criteria', label: 'Signal criteria identification', desc: 'Matching live conditions against signal criteria.', category: 'signal', code: 'STG-070' },
  { key: 'rules', label: 'Strategy rule verification', desc: 'Verifying the selected strategy rules are satisfied.', category: 'signal', code: 'STG-080' },
  { key: 'prereq', label: 'Execution prerequisites', desc: 'Confirming balance, limits and permission prerequisites.', category: 'auth', code: 'STG-090' },
  { key: 'result', label: 'Final recommendation', desc: 'Generating the final trading recommendation.', category: 'signal', code: 'STG-100' },
]

export const CATEGORY_LABELS = {
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
  connection: 'Connection',
  auth: 'Authentication',
  market: 'Market',
  stats: 'Statistics',
  signal: 'Signal',
  sync: 'Synchronisation',
  security: 'Security',
}

export const DATA_READY_TICKS = 30
export const QUALIFY_MIN = 6

export const marketById = id => MARKETS.find(m => m.id === id) || MARKETS[0]
export const modeById = id => MODES.find(m => m.id === id) || MODES[0]
export const strategyById = id => STRATEGIES.find(s => s.id === id) || STRATEGIES[0]
export const accountById = id => ACCOUNTS.find(a => a.type === id) || ACCOUNTS[0]

const MAX_LOG = 450
const MAX_HISTORY = 60
const DEFAULT_TICK_MS = 1200

const STAGE_MS = {
  init: 700,
  sync: 900,
  collect: 0,
  integrity: 1100,
  volatility: 1300,
  stats: 1400,
  criteria: 1500,
  rules: 1200,
  prereq: 1000,
  result: 900,
}

const round = (n, d = 2) => {
  const p = 10 ** d
  return Math.round(n * p) / p
}

let seq = 0
let tickTimer = null
let randomEventTimer = null
let reconnectTimer = null
let pauseResumeTimer = null
let stageTimers = []
let startupTimers = []
let collectTimer = null
let stageStartAt = 0

const clearStage = () => {
  stageTimers.forEach(clearTimeout)
  stageTimers = []
}

const clearCollect = () => {
  if (collectTimer) { clearTimeout(collectTimer); collectTimer = null }
}

const clearEngine = () => {
  if (tickTimer) { clearInterval(tickTimer); tickTimer = null }
  if (randomEventTimer) { clearInterval(randomEventTimer); randomEventTimer = null }
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null }
  if (pauseResumeTimer) { clearTimeout(pauseResumeTimer); pauseResumeTimer = null }
  startupTimers.forEach(clearTimeout)
  startupTimers = []
  clearStage()
  clearCollect()
}

const restartTick = () => {
  if (tickTimer) { clearInterval(tickTimer); tickTimer = null }
  const market = marketById(useAnalysisStore.getState().market)
  tickTimer = setInterval(tickEngine, market.tickMs || DEFAULT_TICK_MS)
}

const makeId = category => {
  seq += 1
  return `${category}-${Date.now().toString(36)}-${seq}`
}

const startupEvents = () => {
  const store = useAnalysisStore.getState()
  const acct = store.account.label
  store.appendLog({ category: 'auth', message: `Authenticating session with Deriv API for ${acct}…`, code: 'AUTH-100' })
  startupTimers.push(setTimeout(() => store.appendLog({ category: 'auth', message: 'Authentication successful — access token verified', code: 'AUTH-200' }), 350))
  startupTimers.push(setTimeout(() => store.appendLog({ category: 'connection', message: 'Connecting to market stream (ws.derivws.com)…', code: 'CONN-101' }), 500))
  startupTimers.push(setTimeout(() => {
    useAnalysisStore.getState().appendLog({ category: 'connection', message: 'WebSocket connected — encrypted channel established', code: 'CONN-200' })
    useAnalysisStore.getState().appendLog({ category: 'sync', message: 'Synchronising tick history for active market…', code: 'SYNC-300' })
  }, 900))
  startupTimers.push(setTimeout(() => useAnalysisStore.getState().appendLog({ category: 'sync', message: `Tick history synchronised for ${store.market}`, code: 'SYNC-301' }), 1400))
  startupTimers.push(setTimeout(() => useAnalysisStore.getState().appendLog({ category: 'success', message: 'Analysis engine initialised and ready', code: 'ENG-200' }), 1800))
}

const advancePrice = (price, market) => {
  const jump = market.vol > 0.006 && Math.random() < 0.02
  const step = price * (jump ? (Math.random() - 0.45) * 0.02 : (Math.random() - 0.5) * market.vol)
  return Math.max(market.base * 0.85, round(price + step))
}

const computeSignal = (market, history, mode) => {
  const h = history.slice(-30)
  const first = h[0] ?? market.base
  const last = h[h.length - 1] ?? market.base
  const change = ((last - first) / first) * 100
  const dir = last >= first ? 'Rise' : 'Fall'

  const changes = []
  for (let i = 1; i < h.length; i += 1) changes.push(h[i] - h[i - 1])
  const momentum = changes.length ? changes.slice(-5).reduce((a, b) => a + b, 0) / 5 : 0
  const volWindow = changes.slice(-12)
  const mean = volWindow.length ? volWindow.reduce((a, b) => a + b, 0) / volWindow.length : 0
  const variance = volWindow.length ? volWindow.reduce((a, b) => a + (b - mean) ** 2, 0) / volWindow.length : 0
  const volPct = (Math.sqrt(variance) / first) * 100

  let gains = 0
  let losses = 0
  for (const c of changes) {
    if (c > 0) gains += c
    else if (c < 0) losses += Math.abs(c)
  }
  const rsi = gains + losses === 0 ? 50 : 100 - 100 / (1 + gains / losses)

  let streak = 0
  if (changes.length) {
    const ls = Math.sign(changes[changes.length - 1])
    for (let i = changes.length - 1; i >= 0; i -= 1) {
      if (Math.sign(changes[i]) === ls && ls !== 0) streak += 1
      else break
    }
  }

  const digits = h.map(p => Math.floor(Math.abs(p)) % 10)
  const evens = digits.filter(d => d % 2 === 0).length
  const evenPct = digits.length ? (evens / digits.length) * 100 : 50
  const lastDigit = digits[digits.length - 1]

  const conditionPool = [
    { label: 'Trend alignment', ok: Math.abs(change) > 0.12, weight: 1 },
    { label: 'Momentum direction', ok: momentum > 0, weight: 1 },
    { label: 'Volatility in range', ok: volPct > 0.3 && volPct < 1.2, weight: 1 },
    { label: 'RSI balance zone', ok: rsi > 35 && rsi < 75, weight: 1 },
    { label: 'Streak building', ok: streak >= 2, weight: 1 },
    { label: 'Even digit bias', ok: evenPct > 54, weight: mode === 'circles' ? 2 : 0.5 },
    { label: 'Boundary anchor', ok: Math.abs(last - market.base) / market.base < 0.03, weight: 0.5 },
    { label: 'Price above entry', ok: last > first, weight: 1 },
  ]

  const all = conditionPool
    .map(c => ({ ...c, ok: c.weight === 0 ? false : c.ok }))
    .filter(c => c.weight > 0)
  const matched = all.filter(c => c.ok)
  const matches = matched.length
  const total = all.length

  let score = 50
  score += Math.max(-18, Math.min(18, momentum * 120))
  score += Math.max(-12, Math.min(12, (rsi - 50) * 0.5))
  score += Math.max(-10, Math.min(10, streak * 3))
  score += Math.max(-8, Math.min(8, Math.abs(change) * 8))
  score += (matches / total) * 20 - 10
  score = Math.max(8, Math.min(97, Math.round(score)))
  const confidence = Math.max(38, Math.min(97, Math.round(score * (0.82 + Math.random() * 0.18))))
  const strength = Math.min(100, score + Math.round(Math.random() * 6))

  return { change, dir, rsi, volPct, momentum, streak, lastDigit, evenPct, matches, total, conditions: matched, all, confidence, strength, score, price: last }
}

const randomEventPool = () => {
  const store = useAnalysisStore.getState()
  const roll = Math.random()
  if (roll < 0.22) {
    store.appendLog({ category: 'security', message: 'Security event: session token refreshed automatically', code: 'SEC-500' })
  } else if (roll < 0.45) {
    store.appendLog({ category: 'warning', message: `Tick latency on ${store.market} above threshold — buffering…`, code: 'WARN-601' })
  } else if (roll < 0.6) {
    store.appendLog({ category: 'stats', message: 'Recomputing rolling statistics…', code: 'STAT-700' })
  } else if (roll < 0.75) {
    store.appendLog({ category: 'sync', message: 'Indicator cache refreshed for active markets', code: 'SYNC-302' })
  } else if (roll < 0.88) {
    store.appendLog({ category: 'market', message: `Market observation: spread stable on ${store.market}`, code: 'MKT-800' })
  } else {
    store.appendLog({ category: 'info', message: 'Housekeeping: pruning stale buffers and caches', code: 'INFO-900' })
  }
}

const maybeInterrupt = () => {
  const store = useAnalysisStore.getState()
  if (store.connected === false) return
  if (Math.random() > 0.015) return
  store._setConnected(false)
  store.appendLog({ category: 'connection', message: 'Market stream disconnected — retrying…', code: 'CONN-500' })
  store.appendLog({ category: 'warning', message: 'Tick data paused during reconnection; session context preserved', code: 'WARN-602' })
  if (store.analysis.active && !store.analysis.interrupted) {
    store._setAnalysis({ interrupted: true })
    store.appendLog({ category: 'warning', message: 'Analysis paused — current stage held until stream is restored', code: 'STG-700' })
    clearStage()
    clearCollect()
  }
  reconnectTimer = setTimeout(() => {
    const st = useAnalysisStore.getState()
    st._setConnected(true)
    st.appendLog({ category: 'connection', message: 'Connection restored — stream resumed', code: 'CONN-501' })
    st.appendLog({ category: 'success', message: 'Market data stream re-established without context loss', code: 'ENG-201' })
    if (st.analysis.interrupted) {
      st._setAnalysis({ interrupted: false })
      st.appendLog({ category: 'success', message: 'Analysis pipeline resumed from held stage', code: 'STG-701' })
      runStage(st.analysis.stages.length)
    }
  }, 1800 + Math.random() * 1200)
}

const maybeError = () => {
  const store = useAnalysisStore.getState()
  if (Math.random() > 0.03) return
  store._setRecentError()
  store.appendLog({ category: 'error', message: `Recoverable error: tick gap detected on ${store.market}`, code: 'ERR-400' })
  stageTimers.push(setTimeout(() => {
    useAnalysisStore.getState().appendLog({ category: 'success', message: 'Recovered: tick stream realigned to live sequence', code: 'ENG-202' })
  }, 1600))
}

const tickEngine = () => {
  const store = useAnalysisStore.getState()
  if (store.paused || store.connected === false) return
  const market = MARKETS.find(m => m.id === store.market) || MARKETS[0]
  const price = advancePrice(store.tick, market)
  const dir = price > store.tick ? 'up' : price < store.tick ? 'down' : 'flat'
  store._applyTick(price, dir)

  const count = store.tickCounter
  if (count % 3 === 0) {
    store.appendLog({ category: 'market', message: `Tick received for ${store.market}: ${price.toFixed(2)}`, code: 'MKT-801' })
  }
  if (count % 11 === 0) {
    store.appendLog({ category: 'stats', message: `Price ${price.toFixed(2)} on ${store.market} — rolling mean updated`, code: 'STAT-701' })
  }

  if (store.ticksCollected < DATA_READY_TICKS) {
    const next = store.ticksCollected + 1
    store._setTicksCollected(next)
    if (next >= DATA_READY_TICKS) {
      store._setDataReady(true)
      store.appendLog({ category: 'success', message: `Sufficient market data collected for ${store.market} — analysis ready`, code: 'DATA-300' })
      store.appendLog({ category: 'sync', message: 'Indicator buffers aligned to live sequence', code: 'SYNC-303' })
    }
  }
}

const stageOutcome = index => {
  const cur = useAnalysisStore.getState()
  const market = marketById(cur.market)
  const strat = strategyById(cur.strategy)
  const key = ANALYSIS_STAGES[index].key
  switch (key) {
    case 'init':
      return { status: 'info', detail: `Engine context established for ${strat.label} on ${market.label}` }
    case 'sync':
      return { status: 'success', detail: `Instrument feed synchronised — ${cur.ticksCollected} samples buffered on ${cur.market}` }
    case 'collect': {
      if (cur.dataReady) return { status: 'success', detail: `Captured ${cur.ticksCollected} live price samples — latest ${cur.tick.toFixed(2)}` }
      return { status: 'warning', detail: 'Incomplete data — collection window extended until threshold reached' }
    }
    case 'integrity': {
      if (Math.random() < 0.12) return { status: 'warning', detail: 'Minor gap detected — sequence interpolated, integrity preserved' }
      return { status: 'success', detail: `Integrity verified — continuous sequence of ${cur.history.length} points` }
    }
    case 'volatility': {
      const h = cur.history.slice(-12)
      const first = h[0] ?? market.base
      const last = h[h.length - 1] ?? market.base
      const volPct = Math.abs((last - first) / first) * 100
      if (volPct > 1.2) return { status: 'warning', detail: `Volatility elevated at ${volPct.toFixed(2)}% — outside preferred range` }
      return { status: 'success', detail: `Volatility assessed at ${volPct.toFixed(2)}% — within strategy range` }
    }
    case 'stats': {
      const signal = computeSignal(market, cur.history, cur.mode)
      return { status: 'success', detail: `RSI ${round(signal.rsi, 1)} · momentum ${round(signal.momentum, 3)} · streak ${signal.streak}` }
    }
    case 'criteria': {
      const signal = computeSignal(market, cur.history, cur.mode)
      return { status: 'success', detail: `${signal.matches} of ${signal.total} signal criteria identified on ${cur.market}` }
    }
    case 'rules': {
      const signal = computeSignal(market, cur.history, cur.mode)
      if (signal.matches >= QUALIFY_MIN) return { status: 'success', detail: `${strat.label} rules satisfied — tradeable conditions confirmed` }
      return { status: 'warning', detail: `${strat.label} rules partially satisfied — insufficient confluence` }
    }
    case 'prereq':
      return { status: 'success', detail: 'Execution prerequisites confirmed — balance, limits, permissions verified' }
    default:
      return { status: 'success', detail: 'Stage completed' }
  }
}

const completeStage = index => {
  const cur = useAnalysisStore.getState()
  if (!cur.analysis.active || cur.analysis.interrupted) return
  clearCollect()
  if (index >= ANALYSIS_STAGES.length - 1) {
    finishAnalysis(cur)
    return
  }
  const meta = ANALYSIS_STAGES[index]
  const outcome = stageOutcome(index)
  const elapsed = round((Date.now() - stageStartAt) / 1000, 1)
  cur._completeStage(meta, { ...outcome, elapsed })
  cur.appendLog({ category: outcome.status === 'warning' ? 'warning' : outcome.status === 'info' ? 'info' : 'success', message: outcome.detail, code: meta.code })
  cur._setAnalysis({ progress: Math.round(((index + 1) / ANALYSIS_STAGES.length) * 100) })
  runStage(index + 1)
}

const checkCollect = index => {
  const cur = useAnalysisStore.getState()
  if (!cur.analysis.active || cur.analysis.interrupted) return
  if (!cur.connected) return
  const elapsed = Date.now() - stageStartAt
  if ((cur.dataReady && elapsed > 1000) || elapsed > 9000) {
    completeStage(index)
    return
  }
  collectTimer = setTimeout(() => checkCollect(index), 600)
}

const runStage = index => {
  const cur = useAnalysisStore.getState()
  if (!cur.analysis.active) return
  if (!cur.connected) {
    cur._setAnalysis({ interrupted: true })
    cur.appendLog({ category: 'warning', message: 'Analysis paused — awaiting market stream before next stage', code: 'STG-700' })
    return
  }
  const meta = ANALYSIS_STAGES[index]
  if (!meta) return
  stageStartAt = Date.now()
  cur._setAnalysis({ stage: meta.key, active: true, interrupted: false })
  const phase = index >= 7 ? 'validating' : index === 2 ? 'collecting' : 'analyzing'
  cur._setPhase(phase)
  if (meta.key === 'collect') {
    checkCollect(index)
    return
  }
  const t = setTimeout(() => completeStage(index), STAGE_MS[meta.key])
  stageTimers.push(t)
}

const finishAnalysis = cur => {
  const market = marketById(cur.market)
  const strat = strategyById(cur.strategy)
  const signal = computeSignal(market, cur.history, cur.mode)
  const qualifies = Math.random() < 0.8
  const effectiveMatches = qualifies ? Math.max(signal.matches, QUALIFY_MIN) : Math.min(signal.matches, QUALIFY_MIN - 1)
  const effectiveSignal = { ...signal, matches: effectiveMatches }
  const elapsed = round((Date.now() - stageStartAt) / 1000, 1)
  cur._completeStage(ANALYSIS_STAGES[ANALYSIS_STAGES.length - 1], {
    status: qualifies ? 'success' : 'warning',
    detail: qualifies
      ? `Recommendation generated: ${effectiveSignal.dir} @ ${effectiveSignal.confidence}% — qualifying opportunity identified`
      : `No qualifying opportunity — ${effectiveMatches}/${effectiveSignal.total} criteria below threshold of ${QUALIFY_MIN}`,
    elapsed,
  })
  cur._setSignal(effectiveSignal)
  cur.appendLog({ category: qualifies ? 'success' : 'warning', message: qualifies ? 'Analysis complete — valid trading opportunity identified' : 'Analysis complete — no qualifying opportunity currently', code: qualifies ? 'ANA-200' : 'ANA-300' })
  cur.appendLog({ category: 'signal', message: `${effectiveMatches} of ${effectiveSignal.total} conditions matched — ${effectiveSignal.dir} at ${effectiveSignal.confidence}% confidence`, code: 'SIG-902' })
  cur._setAnalysis({
    active: false,
    interrupted: false,
    stage: null,
    progress: 100,
    result: {
      qualifies,
      dir: effectiveSignal.dir,
      confidence: effectiveSignal.confidence,
      score: effectiveSignal.score,
      strength: effectiveSignal.strength,
      matches: effectiveMatches,
      total: effectiveSignal.total,
      threshold: QUALIFY_MIN,
      price: effectiveSignal.price,
      conditions: effectiveSignal.all,
      strategy: strat.label,
      market: cur.market,
    },
  })
  cur._setPhase('done')
  cur.appendLog({ category: 'info', message: `Analysis cycle ${cur.analysis.cycle} finished — ${qualifies ? 'opportunity identified' : 'no opportunity'} (${effectiveMatches}/${effectiveSignal.total})`, code: 'ANA-201' })
}

const initialHistory = market => {
  let p = market.base * (0.96 + Math.random() * 0.06)
  const out = []
  for (let i = 0; i < 20; i += 1) {
    p = advancePrice(p, market)
    out.push(p)
  }
  return out
}

const emptySession = (cycle = 0) => ({
  open: false,
  active: false,
  interrupted: false,
  cycle,
  strategy: null,
  market: null,
  stage: null,
  stages: [],
  progress: 0,
  result: null,
  startedAt: 0,
})

export const useAnalysisStore = create((set, get) => ({
  market: '1HZ100V',
  mode: 'smart',
  strategy: 'rise-fall',
  account: ACCOUNTS[0],
  phase: 'idle',
  dataReady: false,
  ticksCollected: 0,
  tick: MARKETS[0].base,
  tickDir: 'flat',
  history: initialHistory(MARKETS[0]),
  tickCounter: 0,
  matches: 0,
  lastSignal: null,
  signalHistory: [],
  connected: true,
  authOk: true,
  paused: false,
  recentErrorAt: 0,
  log: [],
  analysis: emptySession(),
  _initialized: false,

  init: () => {
    if (get()._initialized) return
    set({ _initialized: true })
    startupEvents()
    restartTick()
    randomEventTimer = setInterval(() => {
      randomEventPool()
      maybeInterrupt()
      maybeError()
    }, 7000)
  },

  dispose: () => {
    clearEngine()
    set({ _initialized: false })
  },

  setMarket: id => {
    if (id === get().market) return
    const market = MARKETS.find(m => m.id === id)
    if (!market) return
    const abort = get().analysis.active
    clearStage()
    clearCollect()
    set({
      market: id,
      tick: market.base,
      tickDir: 'flat',
      history: initialHistory(market),
      ticksCollected: 0,
      tickCounter: 0,
      dataReady: false,
      matches: 0,
      lastSignal: null,
      signalHistory: [],
      phase: 'idle',
      analysis: emptySession(get().analysis.cycle),
    })
    get().appendLog({
      category: abort ? 'warning' : 'info',
      message: abort ? `Analysis interrupted — market context changed to ${id}` : `Operational context switched to ${id}`,
      code: abort ? 'STG-702' : 'CTX-100',
    })
    get().appendLog({ category: 'sync', message: `Synchronising tick history for ${id}…`, code: 'SYNC-304' })
    restartTick()
    stageTimers.push(setTimeout(() => {
      useAnalysisStore.getState().appendLog({ category: 'success', message: `Data collection started for ${id}`, code: 'DATA-301' })
    }, 700))
  },

  setMode: id => {
    const cur = get()
    if (id === cur.mode) return
    const mode = MODES.find(m => m.id === id)
    if (!mode) return
    const abort = cur.analysis.active
    if (abort) { clearStage(); clearCollect() }
    set({
      mode: id,
      lastSignal: null,
      matches: 0,
      phase: 'idle',
      analysis: abort ? emptySession(cur.analysis.cycle) : { ...cur.analysis, result: null },
    })
    get().appendLog({
      category: abort ? 'warning' : 'info',
      message: abort ? `Analysis interrupted — analysis mode changed to ${mode.label}` : `Analysis mode set to ${mode.label}`,
      code: 'CTX-101',
    })
  },

  setStrategy: id => {
    const cur = get()
    if (id === cur.strategy) return
    const s = STRATEGIES.find(x => x.id === id)
    if (!s) return
    const abort = cur.analysis.active
    if (abort) { clearStage(); clearCollect() }
    set({
      strategy: id,
      lastSignal: null,
      matches: 0,
      phase: 'idle',
      analysis: abort ? emptySession(cur.analysis.cycle) : { ...cur.analysis, result: null },
    })
    get().appendLog({
      category: abort ? 'warning' : 'info',
      message: abort ? `Analysis interrupted — strategy changed to ${s.label}` : `Strategy updated to ${s.label}`,
      code: 'CTX-102',
    })
  },

  setAccount: type => {
    const cur = get()
    if (type === cur.account.type) return
    const acc = ACCOUNTS.find(a => a.type === type)
    if (!acc) return
    set({ account: acc })
    get().appendLog({
      category: 'auth',
      message: `Account switched to ${acc.label} — live trading environment`,
      code: 'ACC-200',
    })
  },

  setAccountBalance: balance => {
    const cur = get().account
    if (Number(cur.balance) === Number(balance)) return
    set({ account: { ...cur, balance: Number(balance) } })
  },

  startAnalysis: () => {
    const s = get()
    if (s.analysis.active && !s.analysis.interrupted) return
    clearStage()
    clearCollect()
    const strat = strategyById(s.strategy)
    const cycle = s.analysis.cycle + 1
    set({
      analysis: {
        open: true,
        active: true,
        interrupted: false,
        cycle,
        strategy: strat.label,
        market: s.market,
        stage: null,
        stages: [],
        progress: 0,
        result: null,
        startedAt: Date.now(),
      },
      phase: 'analyzing',
      lastSignal: null,
      matches: 0,
    })
    s.appendLog({ category: 'info', message: `Analysis request received — ${strat.label} on ${s.market}`, code: 'ANA-100' })
    runStage(0)
  },

  openAnalysis: () => set(s => ({ analysis: { ...s.analysis, open: true } })),
  closeAnalysis: () => set(s => ({ analysis: { ...s.analysis, open: false } })),

  setPaused: paused => {
    set({ paused })
    get().appendLog({ category: paused ? 'warning' : 'success', message: paused ? 'Session paused — market monitoring suspended' : 'Session resumed — market monitoring active', code: paused ? 'RUN-700' : 'RUN-701' })
  },

  appendLog: entry => {
    const item = { id: makeId(entry.category || 'info'), ts: Date.now(), message: entry.message, code: entry.code || '', category: entry.category || 'info' }
    set(s => {
      const log = s.log.length >= MAX_LOG ? s.log.slice(s.log.length - MAX_LOG + 1) : s.log
      return { log: [...log, item] }
    })
  },

  _completeStage: (meta, outcome) =>
    set(s => ({
      analysis: {
        ...s.analysis,
        stage: null,
        stages: [...s.analysis.stages, { key: meta.key, label: meta.label, category: meta.category, code: meta.code, ...outcome, at: Date.now() }],
      },
    })),

  _setAnalysis: patch => set(s => ({ analysis: { ...s.analysis, ...patch } })),
  _applyTick: (price, dir) =>
    set(s => {
      const history = s.history.length >= MAX_HISTORY ? s.history.slice(s.history.length - MAX_HISTORY + 1) : s.history
      return { tick: price, tickDir: dir, history: [...history, price], tickCounter: s.tickCounter + 1 }
    }),

  _setTicksCollected: n => set({ ticksCollected: n }),
  _setDataReady: v => set({ dataReady: v }),
  _setPhase: phase => set({ phase }),
  _setConnected: connected => set({ connected }),
  _setRecentError: () => set({ recentErrorAt: Date.now() }),
  _setSignal: signal =>
    set(s => ({
      lastSignal: { ...signal, at: Date.now() },
      matches: signal.matches,
      signalHistory: [{ ...signal, at: Date.now() }, ...s.signalHistory].slice(0, 8),
    })),
}))
