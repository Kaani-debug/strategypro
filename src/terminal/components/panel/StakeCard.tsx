import { useTradeStore, validateStake } from '@/terminal/state/tradeStore'
import { payoutFor } from '@/terminal/state/tradeStore'
import { TERMINAL_STAKE_MIN, TERMINAL_STAKE_MAX } from '@/terminal/data/config'
import { formatMoney } from '@/terminal/lib/format'
import { Card } from '@/terminal/components/ui/Card'
import { CircleDollarSign, Minus, Plus } from 'lucide-react'
import { cn } from '@/terminal/lib/cn'

export default function StakeCard() {
  const stakeInput = useTradeStore((s) => s.stakeInput)
  const setStakeInput = useTradeStore((s) => s.setStakeInput)
  const balance = useTradeStore((s) => s.balance)
  const growthRate = useTradeStore((s) => s.growthRate)

  const validation = validateStake(stakeInput)
  const payout = payoutFor(validation.value, growthRate)
  const insufficient = validation.ok && validation.value > balance

  const adjust = (delta: number) => {
    const current = validation.ok ? validation.value : 0
    const next = Math.round((current + delta) * 100) / 100
    const clamped = Math.min(Math.max(next, TERMINAL_STAKE_MIN), TERMINAL_STAKE_MAX)
    setStakeInput(String(clamped))
  }

  return (
    <Card
      title="Stake"
      icon={<CircleDollarSign className="h-4 w-4" />}
      right={
        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          Balance <span className="tterm-tabular font-semibold text-slate-600 dark:text-slate-300">{formatMoney(balance)}</span>
        </span>
      }
    >
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={() => adjust(-1)}
          aria-label="Decrease stake by 1"
          className="flex w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-indigo-500/50 dark:hover:text-indigo-300"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
          <input
            type="number"
            inputMode="decimal"
            value={stakeInput}
            min={TERMINAL_STAKE_MIN}
            max={TERMINAL_STAKE_MAX}
            step={0.5}
            onChange={(event) => setStakeInput(event.target.value)}
            aria-label="Stake amount"
            aria-invalid={!validation.ok || insufficient}
            className={cn(
              'tterm-tabular w-full rounded-lg border py-2.5 pl-7 pr-3 text-sm font-semibold text-slate-800 outline-none transition',
              'border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
              'dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:focus:border-indigo-500',
              (!validation.ok || insufficient) && 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20 dark:border-rose-500',
            )}
          />
        </div>
        <button
          type="button"
          onClick={() => adjust(1)}
          aria-label="Increase stake by 1"
          className="flex w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-indigo-500/50 dark:hover:text-indigo-300"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {validation.error && validation.value === 0 ? null : (
        <p className={cn('mt-2 text-[11px]', !validation.ok || insufficient ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500')}>
          {!validation.ok && validation.value > 0
            ? validation.error
            : insufficient
              ? 'Insufficient balance for this stake.'
              : `Min ${TERMINAL_STAKE_MIN.toFixed(2)} · Max ${TERMINAL_STAKE_MAX.toFixed(2)}`}
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Stake</p>
          <p className="tterm-tabular text-sm font-bold text-slate-700 dark:text-slate-200">{formatMoney(validation.value)}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-500/10">
          <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500">Potential payout</p>
          <p className="tterm-tabular text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(payout)}</p>
        </div>
      </div>
    </Card>
  )
}
