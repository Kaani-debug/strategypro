import { WS_APP_ID, WS_ENDPOINT, WS_LANGUAGE } from './config'
import type { Candle, ConnectionStatus, Tick } from '@/terminal/lib/types'

export interface MarketHandlers {
  onTick: (tick: Tick) => void
  onCandle: (candle: Candle) => void
  onStatus: (status: ConnectionStatus) => void
  onUnavailable?: () => void
}

interface PendingHistory {
  resolve: (candles: Candle[]) => void
  reject: (error: Error) => void
  timer: number
  socket: WebSocket
}

let ws: WebSocket | null = null
let reconnectTimer: number | null = null
let closing = false
let currentHandlers: MarketHandlers | null = null
let reconnectAttempts = 0
let subscriptionRejected = false
let liveEmitted = false

function emitStatus(status: ConnectionStatus) {
  currentHandlers?.onStatus?.(status)
}

function scheduleReconnect(symbol: string) {
  if (closing || reconnectTimer || subscriptionRejected) return
  const delay = Math.min(1000 * 2 ** reconnectAttempts, 15000)
  reconnectAttempts += 1
  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null
    openMarketStream(symbol, currentHandlers as MarketHandlers)
  }, delay)
}

export function openMarketStream(symbol: string, handlers: MarketHandlers): void {
  closeMarketStream()
  currentHandlers = handlers
  closing = false
  reconnectAttempts = 0
  subscriptionRejected = false
  liveEmitted = false
  emitStatus('connecting')

  let socket: WebSocket
  try {
    socket = new WebSocket(`${WS_ENDPOINT}?app_id=${WS_APP_ID}&l=${WS_LANGUAGE}`)
  } catch {
    emitStatus('offline')
    handlers.onUnavailable?.()
    return
  }
  ws = socket

  socket.onopen = () => {
    if (!socket || closing) return
    socket.send(JSON.stringify({ ticks: symbol, subscribe: 1 }))
  }

  socket.onmessage = (event) => {
    let message: Record<string, unknown>
    try {
      message = JSON.parse(String(event.data))
    } catch {
      return
    }
    if (message.error) {
      subscriptionRejected = true
      currentHandlers?.onUnavailable?.()
      return
    }
    const tick = message.tick as { epoch?: number; quote?: number } | undefined
    if (tick && typeof tick.epoch === 'number' && typeof tick.quote === 'number') {
      if (!liveEmitted) {
        liveEmitted = true
        emitStatus('live')
      }
      currentHandlers?.onTick({ time: tick.epoch, price: tick.quote })
    }
    const ohlc = message.ohlc as { epoch?: number; open?: number; high?: number; low?: number; close?: number } | undefined
    if (ohlc && typeof ohlc.epoch === 'number') {
      currentHandlers?.onCandle({
        time: ohlc.epoch,
        open: Number(ohlc.open),
        high: Number(ohlc.high),
        low: Number(ohlc.low),
        close: Number(ohlc.close),
      })
    }
  }

  socket.onerror = () => {
    // onclose fires right after onerror; state transitions happen there.
  }

  socket.onclose = () => {
    if (closing || !currentHandlers) return
    emitStatus('offline')
    scheduleReconnect(symbol)
  }
}

export function closeMarketStream(): void {
  closing = true
  if (reconnectTimer) {
    window.clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (ws) {
    try {
      ws.onclose = null
      ws.close()
    } catch {
      /* noop */
    }
    ws = null
  }
  currentHandlers = null
}

export function fetchCandlesHistory(
  symbol: string,
  count = 400,
  granularity = 60,
): Promise<Candle[]> {
  return new Promise<Candle[]>((resolve, reject) => {
    let socket: WebSocket
    try {
      socket = new WebSocket(`${WS_ENDPOINT}?app_id=${WS_APP_ID}&l=${WS_LANGUAGE}`)
    } catch (error) {
      reject(error instanceof Error ? error : new Error('WebSocket unavailable'))
      return
    }

    const pending: PendingHistory = {
      resolve,
      reject,
      timer: 0,
      socket,
    }

    const finish = (fn: () => void) => {
      window.clearTimeout(pending.timer)
      try {
        pending.socket.onmessage = null
        pending.socket.onerror = null
        pending.socket.close()
      } catch {
        /* noop */
      }
      fn()
    }

    pending.timer = window.setTimeout(() => {
      finish(() => reject(new Error('History request timed out')))
    }, 8000)

    socket.onopen = () => {
      socket.send(
        JSON.stringify({ ticks_history: symbol, granularity, count, style: 'candles', end: 'latest' }),
      )
    }

    socket.onmessage = (event) => {
      let message: Record<string, unknown>
      try {
        message = JSON.parse(String(event.data))
      } catch {
        return
      }
      if (message.error) {
        finish(() => reject(new Error(String((message.error as { message?: unknown })?.message ?? 'History error'))))
        return
      }
      const history = message.history as { candles?: Array<{ epoch?: number; open?: number; high?: number; low?: number; close?: number }> } | undefined
      if (history?.candles) {
        const candles: Candle[] = history.candles
          .map((c) => ({
            time: Number(c.epoch),
            open: Number(c.open),
            high: Number(c.high),
            low: Number(c.low),
            close: Number(c.close),
          }))
          .filter((c) => Number.isFinite(c.time) && Number.isFinite(c.close))
        finish(() => resolve(candles))
      }
    }

    socket.onerror = () => {
      finish(() => reject(new Error('History request failed')))
    }
  })
}
