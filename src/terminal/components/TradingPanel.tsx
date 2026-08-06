import { usePlaceTrade } from '@/terminal/hooks/usePlaceTrade'
import TradeTypeCard from './panel/TradeTypeCard'
import GrowthRateCard from './panel/GrowthRateCard'
import StakeCard from './panel/StakeCard'
import TakeProfitCard from './panel/TakeProfitCard'
import StatsCard from './panel/StatsCard'
import BuyCard from './panel/BuyCard'

export default function TradingPanel() {
  const placeTrade = usePlaceTrade()
  const pending = placeTrade.isPending

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto p-3">
      <TradeTypeCard />
      <GrowthRateCard />
      <StakeCard />
      <TakeProfitCard />
      <StatsCard />
      <div className="mt-auto pt-1">
        <BuyCard placeTrade={placeTrade.mutate} pending={pending} />
      </div>
    </div>
  )
}
