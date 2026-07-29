import { useState, useEffect, useCallback, useRef } from 'react'

const SYMBOLS = ['Vol 10', 'Vol 25', 'Vol 50', 'Vol 75', 'Vol 100', 'Vol 10 (1s)', 'Vol 100 (1s)', 'Bull Market', 'Bear Market']

function randomTick(base) { return base + (Math.random() - 0.5) * base * 0.02 }

const INITIAL = {
  'Vol 10': 4824.349, 'Vol 25': 2599.941, 'Vol 50': 97.7379, 'Vol 75': 56084.1056,
  'Vol 100': 551.63, 'Vol 10 (1s)': 9510.270, 'Vol 100 (1s)': 793.58,
  'Bull Market': 925.1682, 'Bear Market': 981.6592,
}

export function useSimulation() {
  const [prices, setPrices] = useState(INITIAL)
  const [ticks, setTicks] = useState({})
  const [connected, setConnected] = useState(false)
  const [botRunning, setBotRunning] = useState(false)
  const [botLog, setBotLog] = useState([])
  const intervalRef = useRef(null)
  const botIntervalRef = useRef(null)

  useEffect(() => {
    const timeout = setTimeout(() => setConnected(true), 1500)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!connected) return
    intervalRef.current = setInterval(() => {
      setPrices(prev => {
        const next = {}
        for (const sym of SYMBOLS) {
          const val = randomTick(prev[sym])
          next[sym] = Math.round(val * 10000) / 10000
        }
        return next
      })
      setTicks(prev => {
        const next = { ...prev }
        const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        if (!next[sym]) next[sym] = []
        next[sym] = [...next[sym].slice(-49), { time: Date.now(), price: prices[sym] || INITIAL[sym] }]
        return next
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [connected])

  const getPrice = useCallback((sym) => prices[sym] || 0, [prices])
  const getDirection = useCallback((sym) => {
    const t = ticks[sym]
    if (!t || t.length < 2) return 'up'
    return t[t.length - 1].price >= t[t.length - 2].price ? 'up' : 'down'
  }, [ticks])

  const startBot = useCallback((strategy, config) => {
    setBotRunning(true)
    setBotLog([])
    const symbols = Object.keys(config?.symbols || { Vol10: 'Vol 10' })
    let tradeCount = 0
    const maxTrades = config?.maxTrades || 10

    const addLog = (msg) => setBotLog(p => [...p, `[${new Date().toLocaleTimeString()}] ${msg}`])

    addLog(`Bot started: ${strategy}`)
    addLog(`Connected to ${symbols.join(', ')}`)
    addLog('Watching market...')

    botIntervalRef.current = setInterval(() => {
      if (tradeCount >= maxTrades) {
        clearInterval(botIntervalRef.current)
        botIntervalRef.current = null
        setBotRunning(false)
        addLog('Session complete. Max trades reached.')
        return
      }
      tradeCount++
      const sym = symbols[Math.floor(Math.random() * symbols.length)]
      const dir = Math.random() > 0.35 ? 'Rise' : 'Fall'
      const won = Math.random() > 0.3
      const stake = config?.stake || 10
      const profit = won ? (stake * (0.75 + Math.random() * 0.15)).toFixed(2) : (-stake).toFixed(2)
      const outcome = won ? '✅ Won' : '❌ Lost'
      addLog(`${sym} ${dir} | Stake: $${stake} | ${outcome} $${profit}`)
    }, 2500 + Math.random() * 1500)
  }, [])

  const stopBot = useCallback(() => {
    if (botIntervalRef.current) clearInterval(botIntervalRef.current)
    botIntervalRef.current = null
    setBotRunning(false)
    setBotLog(p => [...p, `[${new Date().toLocaleTimeString()}] Bot stopped by user.`])
  }, [])

  useEffect(() => {
    return () => { if (botIntervalRef.current) clearInterval(botIntervalRef.current) }
  }, [])

  return { prices, ticks, connected, botRunning, botLog, getPrice, getDirection, startBot, stopBot, SYMBOLS }
}
