import { useTradeStore } from '@/terminal/state/tradeStore'
import { GROWTH_RATES } from '@/terminal/data/config'
import { Card } from '@/terminal/components/ui/Card'
import { TrendingUp } from 'lucide-react'
import { cn } from '@/terminal/lib/cn'

export default function GrowthRateCard() {
  const growthRate = useTradeStore((s) => s.growthRate)
  const setGrowthRate = useTradeStore((s) => s.setGrowthRate)

  return (
    <Card
      title="Target Return"
      icon={<TrendingUp className="h-4 w-4" />}
      right={
        <span className="tterm-tabular rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-500 dark:text-indigo-400">
          +{growthRate}%
        </span>
      }
    >
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Target return percentage">
        {GROWTH_RATES.map((rate) => (
          <button
            key={rate}
            type="button"
            role="radio"
            aria-checked={growthRate === rate}
            onClick={() => setGrowthRate(rate)}
            className={cn(
              'tterm-tabular rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition',
              'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600',
              'dark:border-slate-700 dark:text-slate-400 dark:hover:border-indigo-500/50 dark:hover:text-indigo-300',
              growthRate === rate &&
                'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-500/15 dark:text-indigo-300',
            )}
          >
            {rate}%
          </button>
        ))}
      </div>
      <p className="mt-2.5 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
        Return multiples payout on a win: stake × (1 + target).
      </p>
    </Card>
  )
}
