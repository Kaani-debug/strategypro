import { create } from 'zustand'
import { MARKETS } from './analysisStore'

const BASE = {
  R_10: 500,
  R_25: 600,
  R_50: 800,
  R_75: 1000,
  R_100: 1250,
  ...Object.fromEntries(MARKETS.map(m => [m.id, m.base])),
}

const DEFAULT_SYMBOL = 'R_100'
const DEFAULT_STAKE = 10
const DEFAULT_BALANCE = 10000

const rnd = (min, max) => min + Math.random() * (max - min)
const round = (n, d = 2) => {
  const p = 10 ** d
  return Math.round(n * p) / p
}

const makeId = prefix => `${prefix}${Date.now().toString(36).toUpperCase().slice(-4)}${Math.floor(Math.random() * 1000)}`

let engineTimer = null
let clockTimer = null
let reconnectTimer = null
let pendingResolves = []

const clearEngine = () => {
  if (engineTimer) { clearInterval(engineTimer); engineTimer = null }
  if (clockTimer) { clearInterval(clockTimer); clockTimer = null }
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null }
  pendingResolves.forEach(clearTimeout)
  pendingResolves = []
}

const idleSession = () => ({
  id: makeId('S-'),
  botName: 'Volatility 100 Bot',
  strategy: 'Rise / Fall',
  symbol: DEFAULT_SYMBOL,
  stake: DEFAULT_STAKE,
  status: 'idle',
  connected: true,
  startTime: null,
  endTime: null,
  elapsedMs: 0,
  startBalance: DEFAULT_BALANCE,
})

const zeroStats = () => ({
  totalStake: 0,
  totalPayout: 0,
  won: 0,
  lost: 0,
  open: 0,
  errored: 0,
  netProfit: 0,
  netReturn: 0,
  roi: 0,
  winRate: 0,
  lossRate: 0,
  avgStake: 0,
  avgPayout: 0,
  avgProfit: 0,
  maxWin: 0,
  maxLoss: 0,
})

const computeStats = (trades, base = 0) => {
  const s = zeroStats()
  let settled = 0
  for (const t of trades) {
    if (t.status === 'open') { s.open += 1; continue }
    if (t.status === 'error') { s.errored += 1; continue }
    s.totalStake += t.stake
    s.totalPayout += t.payout
    s.netProfit += t.profit
    settled += 1
    if (t.status === 'won') { s.won += 1 } else { s.lost += 1 }
    s.maxWin = Math.max(s.maxWin, t.profit)
    s.maxLoss = Math.min(s.maxLoss, t.profit)
  }
  s.avgStake = trades.length ? s.totalStake / trades.length : 0
  s.avgPayout = s.won ? s.totalPayout / s.won : 0
  s.avgProfit = settled ? s.netProfit / settled : 0
  s.winRate = s.won + s.lost ? (s.won / (s.won + s.lost)) * 100 : 0
  s.lossRate = s.won + s.lost ? (s.lost / (s.won + s.lost)) * 100 : 0
  s.roi = s.totalStake ? (s.netProfit / s.totalStake) * 100 : 0
  s.netReturn = base ? (s.netProfit / base) * 100 : 0
  return s
}

const makeSignal = () => {
  const direction = Math.random() < 0.5 ? 'Rise' : 'Fall'
  const rsi = round(rnd(26, 78))
  const macd = round(rnd(-8, 8), 3)
  const ma20 = round(rnd(-0.8, 0.8), 3)
  const bbWidth = round(rnd(8, 30), 1)
  const momentum = round(rnd(-2.4, 2.4), 2)
  const strength = Math.floor(rnd(55, 96))
  const riskLevel = strength > 85 ? 'low' : strength > 70 ? 'medium' : 'high'
  const trend = direction === 'Rise' ? 'uptrend' : 'downtrend'
  const rationale =
    direction === 'Rise'
      ? `Momentum and RSI divergence favour upward continuation. Price holding above the ${ma20 >= 0 ? 'rising' : 'stable'} MA(20) with tightening Bollinger bands.`
      : `Break of recent swing support with expanding volatility. Lower RSI confirms bearish pressure and favours downward continuation.`
  const marketConditions = `${trend} with ${bbWidth > 18 ? 'high' : 'moderate'} volatility`
  return {
    direction,
    rsi,
    macd,
    ma20,
    bbWidth,
    momentum,
    strength,
    riskLevel,
    indicators: ['RSI', 'MACD', 'Bollinger Bands', 'MA(20)', 'Momentum'],
    marketConditions,
    rationale,
  }
}

const AI_NOTES = {
  won: 'Signal alignment held: momentum, trend and volatility all agreed on direction. Exit executed within the projected band.',
  lost: 'Price retraced against the signal shortly after entry. Volatility expanded beyond the modelled band and the barrier was not protected.',
  error: 'Contract was rejected before settlement. Execution latency and spot re-pricing caused the order to fail; stake was returned.',
}

const makeTrade = session => {
  const base = BASE[session.symbol] ?? 1250
  const signal = makeSignal()
  const entrySpot = round(base + rnd(-4, 4))
  const duration = 60 + Math.floor(rnd(0, 240))
  const openLatencyMs = Math.round(rnd(250, 700))
  const settleLatencyMs = Math.round(rnd(400, 900))
  const isEvenOdd = session.strategy === 'Even / Odd'
  const rate = isEvenOdd ? 0.88 : round(rnd(0.6, 1.0), 2)
  const payout = round(session.stake * (1 + rate), 2)
  const won = Math.random() < 0.85
  const drift = entrySpot * rnd(0.001, 0.004)
  const exitSpot = round(signal.direction === 'Rise' ? entrySpot + drift : entrySpot - drift)
  const now = Date.now()
  const digitPool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  for (let i = digitPool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[digitPool[i], digitPool[j]] = [digitPool[j], digitPool[i]]
  }
  const entryPoints = digitPool.slice(0, 3)

  return {
    id: makeId('T-'),
    sessionId: session.id,
    symbol: session.symbol,
    contractType: signal.direction,
    stake: session.stake,
    payout,
    profit: won ? round(payout - session.stake, 2) : -session.stake,
    status: 'open',
    won,
    entrySpot,
    exitSpot,
    buyPrice: entrySpot,
    sellPrice: exitSpot,
    entryTime: now,
    exitTime: null,
    duration,
    latencyMs: openLatencyMs + settleLatencyMs,
    signal,
    entryPoints,
    execution: {
      signalAt: now,
      openedAt: null,
      resolvedAt: null,
      openLatencyMs,
      settleLatencyMs,
      logs: [
        `Signal detected at ${entrySpot.toFixed(2)}`,
        `Contract "${signal.direction}" opened with stake $${session.stake}`,
        'Monitoring price action for settlement',
        'Contract settled',
      ],
    },
  }
}

const journalEntry = sessionId => ({ id: makeId('J-'), timestamp: Date.now(), sessionId, type: 'system', category: 'system', title: '', details: '' })

const JOURNAL_CATEGORY = {
  info: 'info',
  ai: 'info',
  warning: 'warning',
  error: 'error',
  trade: 'trade',
  system: 'system',
  account: 'account',
  market: 'system',
}

const runEngine = () => {
  const { session, boosted } = useSessionStore.getState()
  if (session.status !== 'running') return
  const store = useSessionStore.getState()

  const roll = Math.random()

  if (roll < 0.03) {
    store._setDisconnected(false)
    store._addJournal({
      type: 'warning',
      title: 'Connection lost',
      details: 'Market stream disconnected. Trade generation paused while the bot reconnects.',
    })
    reconnectTimer = setTimeout(() => {
      const cur = useSessionStore.getState()
      cur._setDisconnected(true)
      cur._addJournal({
        type: 'system',
        title: 'Connection restored',
        details: 'Market stream reconnected. Bot resumed trading.',
      })
    }, 2000 + Math.random() * 1200)
    return
  }

  if (roll > 0.972) {
    const trade = makeTrade(session)
    trade.status = 'error'
    trade.profit = 0
    trade.won = null
    trade.execution.logs[1] = 'Contract rejected — spot re-priced before execution'
    trade.execution.logs[3] = 'Stake returned to balance'
    store._addErrorTrade(trade)
    store._addJournal({
      type: 'warning',
      tradeId: trade.id,
      title: 'Contract error — stake returned',
      details: `Order for ${trade.contractType} on ${trade.symbol} failed to execute within acceptable latency. No loss incurred.`,
    })
    return
  }

  const trade = makeTrade(session)
  store._addTrade(trade)
  store._addJournal({
    type: 'trade',
    tradeId: trade.id,
    title: `Signal detected — ${trade.contractType} ${trade.symbol}`,
    details: trade.signal.rationale,
    direction: trade.signal.direction,
    strength: trade.signal.strength,
    riskLevel: trade.signal.riskLevel,
    indicators: trade.signal.indicators,
    marketConditions: trade.signal.marketConditions,
  })

  const resolveTimer = setTimeout(() => {
    const cur = useSessionStore.getState()
    const now = Date.now()
    const resolved = {
      ...trade,
      status: trade.won ? 'won' : 'lost',
      exitTime: now,
      execution: {
        ...trade.execution,
        openedAt: trade.entryTime + trade.execution.openLatencyMs,
        resolvedAt: now,
      },
    }
    cur._resolveTrade(resolved)
    cur._addJournal({
      type: trade.won ? 'system' : 'warning',
      tradeId: trade.id,
      title: trade.won ? `Trade won — +$${resolved.profit.toFixed(2)}` : `Trade lost — -$${Math.abs(resolved.profit).toFixed(2)}`,
      details: `${resolved.contractType} on ${resolved.symbol} settled at ${resolved.sellPrice.toFixed(2)} in ${resolved.duration}s.`,
    })
    cur._addJournal({
      type: 'ai',
      tradeId: trade.id,
      title: 'AI explanation',
      details: AI_NOTES[trade.won ? 'won' : 'lost'],
    })
  }, trade.latencyMs)
  pendingResolves.push(resolveTimer)

  if (boosted) {
    clearInterval(engineTimer)
    engineTimer = setInterval(runEngine, 1300)
  }
}

export const useSessionStore = create((set, get) => ({
  panelOpen: false,
  activeTab: 'summary',
  session: idleSession(),
  trades: [],
  journal: [],
  stats: zeroStats(),
  runs: 0,
  balance: DEFAULT_BALANCE,
  boosted: false,
  detailId: null,
  exportOpen: false,

  openPanel: () => set({ panelOpen: true }),
  closePanel: () => set({ panelOpen: false }),
  setActiveTab: tab => set({ activeTab: tab }),
  setBoosted: boosted => set({ boosted }),
  setDetail: id => set({ detailId: id }),
  setExportOpen: v => set({ exportOpen: v }),

  startSession: (opts = {}) => {
    clearEngine()
    const prev = get()
    const session = idleSession()
    Object.assign(session, {
      id: makeId('S-'),
      botName: opts.botName || 'Volatility 100 Bot',
      strategy: opts.strategy || 'Rise / Fall',
      symbol: opts.symbol || DEFAULT_SYMBOL,
      stake: opts.stake || DEFAULT_STAKE,
      status: 'running',
      connected: true,
      startTime: Date.now(),
      endTime: null,
      elapsedMs: 0,
      startBalance: opts.startBalance || prev.balance,
    })
    const initial = journalEntry(session.id)
    initial.title = `Bot started — ${session.botName}`
    initial.details = `Strategy ${session.strategy} on ${session.symbol} with stake $${session.stake.toFixed(2)}. Starting balance $${session.startBalance.toFixed(2)}.`
    set({
      session,
      balance: session.startBalance,
      trades: [],
      journal: [initial],
      stats: zeroStats(),
      runs: prev.runs + 1,
      detailId: null,
      exportOpen: false,
      panelOpen: true,
    })
    engineTimer = setInterval(runEngine, get().boosted ? 1300 : 2800)
    clockTimer = setInterval(() => {
      const s = useSessionStore.getState().session
      if (s.status === 'running') {
        set({ session: { ...s, elapsedMs: Date.now() - s.startTime } })
      }
    }, 1000)
  },

  stopSession: () => {
    clearEngine()
    const s = get().session
    if (s.status !== 'running') return
    const st = get().stats
    set({ session: { ...s, status: 'stopped', endTime: Date.now() } })
    get()._addJournal({
      type: 'system',
      title: 'Bot stopped',
      details: `Session ended after ${st.won + st.lost} settled contracts. Net P/L $${st.netProfit >= 0 ? '+' : ''}${st.netProfit.toFixed(2)}.`,
    })
  },

  resetSession: () => {
    clearEngine()
    const base = idleSession()
    set({
      session: base,
      trades: [],
      journal: [],
      stats: zeroStats(),
      runs: 0,
      balance: base.startBalance,
      detailId: null,
      exportOpen: false,
      activeTab: 'summary',
    })
  },

  dispose: clearEngine,

  _setDisconnected: connected =>
    set(s => ({ session: { ...s.session, connected, status: connected ? 'running' : 'disconnected' } })),

  _addTrade: trade =>
    set(s => {
      const trades = [...s.trades, trade]
      return { trades, balance: s.balance - trade.stake, stats: computeStats(trades, s.session.startBalance) }
    }),

  _resolveTrade: updated =>
    set(s => {
      const trades = s.trades.map(t => (t.id === updated.id ? updated : t))
      const balance = s.balance + (updated.status === 'won' ? updated.payout : 0)
      return { trades, balance, stats: computeStats(trades, s.session.startBalance) }
    }),

  _addErrorTrade: trade =>
    set(s => {
      const trades = [...s.trades, trade]
      return { trades, stats: computeStats(trades, s.session.startBalance) }
    }),

  _addJournal: entry =>
    set(s => {
      const type = entry.type || 'system'
      const item = {
        id: makeId('J-'),
        timestamp: Date.now(),
        sessionId: s.session.id,
        type,
        category: JOURNAL_CATEGORY[type] || 'system',
        title: '',
        details: '',
        ...entry,
      }
      return { journal: [item, ...s.journal] }
    }),
}))
