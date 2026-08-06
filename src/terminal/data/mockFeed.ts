import { MOCK_HISTORY_POINTS, MOCK_TICK_INTERVAL_MS, type MarketSymbol } from './config'
import type { Candle, Tick } from '@/terminal/lib/types'

function gaussian(): number {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function volatilityOf(symbol: MarketSymbol): number {
  const value = parseInt(symbol.symbol.replace(/\D/g, ''), 10)
  const index = Number.isFinite(value) && value > 0 ? value : 10
  return index * 0.000055
}

function nextPrice(price: number, base: number, volatility: number): number {
  const drift = (base - price) * 0.0015
  const noise = gaussian() * volatility * price
  return Math.max(price * 0.5, price + drift + noise)
}

export function generateMockCandles(
  symbol: MarketSymbol,
  points: number = MOCK_HISTORY_POINTS,
  nowEpoch: number = Math.floor(Date.now() / 1000),
): Candle[] {
  const volatility = volatilityOf(symbol)
  let price = symbol.base
  const candles: Candle[] = []
  for (let i = 0; i < points; i += 1) {
    price = nextPrice(price, symbol.base, volatility)
    const open = price
    const high = open * (1 + Math.abs(gaussian()) * 0.0004)
    const low = open * (1 - Math.abs(gaussian()) * 0.0004)
    const close = nextPrice(price, symbol.base, volatility)
    price = close
    candles.push({
      time: nowEpoch - (points - i - 1),
      open,
      high,
      low,
      close,
    })
  }
  return candles
}

export class MockFeed {
  private timer: number | null = null
  private price: number
  private readonly base: number
  private readonly volatility: number

  constructor(private readonly symbol: MarketSymbol) {
    this.base = symbol.base
    this.price = symbol.base
    this.volatility = volatilityOf(symbol)
  }

  start(onTick: (tick: Tick) => void): void {
    this.stop()
    const emit = () => {
      this.price = nextPrice(this.price, this.base, this.volatility)
      onTick({ time: Math.floor(Date.now() / 1000), price: this.price })
    }
    emit()
    this.timer = window.setInterval(emit, MOCK_TICK_INTERVAL_MS)
  }

  stop(): void {
    if (this.timer !== null) {
      window.clearInterval(this.timer)
      this.timer = null
    }
  }
}
