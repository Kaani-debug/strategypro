import { useEffect } from 'react'
import { closeMarketStream, openMarketStream } from '@/terminal/data/derivClient'
import { MockFeed } from '@/terminal/data/mockFeed'
import { DEFAULT_SYMBOL, MOCK_CONNECT_TIMEOUT_MS, SYMBOLS } from '@/terminal/data/config'
import { useMarketStore } from '@/terminal/state/marketStore'

export function useMarketStream(symbol: string): void {
  const setStatus = useMarketStore((s) => s.setStatus)
  const setError = useMarketStore((s) => s.setError)
  const appendTick = useMarketStore((s) => s.appendTick)

  useEffect(() => {
    const symbolMeta = SYMBOLS.find((s) => s.symbol === symbol) ?? DEFAULT_SYMBOL
    let mock: MockFeed | null = null
    let liveActive = false

    setStatus('connecting')
    setError(null)

    const startMock = () => {
      if (mock || liveActive) return
      mock = new MockFeed(symbolMeta)
      mock.start((tick) => appendTick(tick))
      setStatus('mock')
    }

    openMarketStream(symbol, {
      onTick: (tick) => {
        if (liveActive) appendTick(tick)
      },
      onCandle: () => {
        // Live candles are not used for the area chart — ticks drive the series.
      },
      onStatus: (next) => {
        if (next === 'live') {
          liveActive = true
          mock?.stop()
          mock = null
          setError(null)
        }
        setStatus(next)
      },
      onUnavailable: () => startMock(),
    })

    const initialFallback = window.setTimeout(() => {
      if (!liveActive) startMock()
    }, MOCK_CONNECT_TIMEOUT_MS)

    return () => {
      window.clearTimeout(initialFallback)
      liveActive = false
      mock?.stop()
      closeMarketStream()
    }
  }, [symbol, setStatus, setError, appendTick])
}
