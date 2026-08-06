import { useMutation } from '@tanstack/react-query'
import { useMarketStore } from '@/terminal/state/marketStore'
import { useTradeStore } from '@/terminal/state/tradeStore'

export interface TradeOutcome {
  won: boolean
}

function simulateLatency(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, 950))
}

export function usePlaceTrade() {
  const symbol = useMarketStore((s) => s.symbol.symbol)
  const openTrade = useTradeStore((s) => s.openTrade)
  const resolveTrade = useTradeStore((s) => s.resolveTrade)
  const dismissBuy = useTradeStore((s) => s.dismissBuy)

  return useMutation<TradeOutcome, Error, TradeOutcome>({
    mutationFn: async (outcome) => {
      await simulateLatency()
      return outcome
    },
    onMutate: () => {
      openTrade(symbol)
    },
    onSuccess: (outcome) => {
      resolveTrade(outcome.won)
    },
    onError: () => {
      dismissBuy()
    },
  })
}
