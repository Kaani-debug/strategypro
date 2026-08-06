import { useTradeStore, validateStake } from '@/terminal/state/tradeStore'
import { formatMoney } from '@/terminal/lib/format'
import { Card } from '@/terminal/components/ui/Card'
import { Switch } from '@/terminal/components/ui/Switch'
import { Target } from 'lucide-react'
import { cn } from '@/terminal/lib/cn'

export default function TakeProfitCard() {
  const enabled = useTradeStore((s) => s.takeProfitEnabled)
  const setEnabled = useTradeStore((s) => s.setTakeProfitEnabled)
  const takeProfitInput = useTradeStore((s) => s.takeProfitInput)
  const setTakeProfitInput = useTradeStore((s) => s.setTakeProfitInput)
  const stakeInput = useTradeStore((s) => s.stakeInput)

  const validation = validateStake(stakeInput)
  const stake = validation.ok ? validation.value : 0
  const parsed = Number(takeProfitInput)
  const valid = enabled && Number.isFinite(parsed) && parsed > stake

  return (
    <Card title="Take Profit" icon={<Target className="h-4 w-4" />} right={<Switch id="tp-switch" checked={enabled} onChange={setEnabled} label="Toggle take profit" />}>
      <div className="flex items-stretch gap-2">
        <span className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
          $
        </span>
        <input
          type="number"
          inputMode="decimal"
          min={stake || 0.01}
          step={0.5}
          value={takeProfitInput}
          disabled={!enabled}
          onChange={(event) => setTakeProfitInput(event.target.value)}
          aria-label="Take profit amount"
          aria-invalid={enabled && !valid}
          placeholder={enabled ? `Above ${formatMoney(stake)}` : 'Enable to set'}
          className={cn(
            'tterm-tabular w-full rounded-lg border px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition',
            'border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
            'dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:focus:border-indigo-500',
            !enabled && 'cursor-not-allowed opacity-50',
            enabled && !valid && 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20 dark:border-rose-500',
          )}
        />
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
        Auto-closes the position when the exit spot reaches the target value.
      </p>
    </Card>
  )
}
