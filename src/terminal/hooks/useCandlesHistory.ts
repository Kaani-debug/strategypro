import { useQuery } from '@tanstack/react-query'
import { fetchCandlesHistory } from '@/terminal/data/derivClient'
import { generateMockCandles } from '@/terminal/data/mockFeed'
import { DEFAULT_SYMBOL, SYMBOLS, TERMINAL_GRANULARITY, TERMINAL_HISTORY_COUNT } from '@/terminal/data/config'
import type { Candle } from '@/terminal/lib/types'

export function useCandlesHistory(symbol: string, enabled = true) {
  return useQuery<Candle[]>({
    queryKey: ['terminal-candles', symbol],
    queryFn: async () => {
      try {
        return await fetchCandlesHistory(symbol, TERMINAL_HISTORY_COUNT, TERMINAL_GRANULARITY)
      } catch {
        const meta = SYMBOLS.find((s) => s.symbol === symbol) ?? DEFAULT_SYMBOL
        return generateMockCandles(meta)
      }
    },
    enabled,
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
