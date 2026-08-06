import { create } from 'zustand'
import type { Candle, ConnectionStatus, Tick } from '@/terminal/lib/types'
import { DEFAULT_SYMBOL, type MarketSymbol } from '@/terminal/data/config'

const MAX_TICKS = 6000

interface MarketState {
  symbol: MarketSymbol
  status: ConnectionStatus
  lastTick: Tick | null
  ticks: Tick[]
  candles: Candle[]
  hasHistory: boolean
  error: string | null
  setSymbol: (symbol: MarketSymbol) => void
  setStatus: (status: ConnectionStatus) => void
  setError: (error: string | null) => void
  setCandles: (candles: Candle[]) => void
  resetSeries: () => void
  appendTick: (tick: Tick) => void
}

export const useMarketStore = create<MarketState>((set, get) => ({
  symbol: DEFAULT_SYMBOL,
  status: 'connecting',
  lastTick: null,
  ticks: [],
  candles: [],
  hasHistory: false,
  error: null,

  setSymbol: (symbol) =>
    set({ symbol, ticks: [], candles: [], hasHistory: false, lastTick: null, error: null }),

  setStatus: (status) => set({ status }),

  setError: (error) => set({ error }),

  setCandles: (candles) => set({ candles, hasHistory: true }),

  resetSeries: () => set({ ticks: [], candles: [], hasHistory: false, lastTick: null }),

  appendTick: (tick) => {
    const { ticks } = get()
    const next = ticks.length >= MAX_TICKS ? ticks.slice(ticks.length - MAX_TICKS + 1) : ticks
    set({ ticks: [...next, tick], lastTick: tick })
  },
}))
