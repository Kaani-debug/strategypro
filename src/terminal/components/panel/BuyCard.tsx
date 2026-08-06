import { useTradeStore, validateStake, payoutFor } from '@/terminal/state/tradeStore'
import { TRADE_TYPES } from '@/terminal/data/config'
import { formatMoney } from '@/terminal/lib/format'
import type { TradeOutcome } from '@/terminal/hooks/usePlaceTrade'
import { Loader2, Sparkles, X } from 'lucide-react'
import { cn } from '@/terminal/lib/cn'

interface BuyCardProps {
  placeTrade: (outcome: TradeOutcome) => void
  pending: boolean
}

export default function BuyCard({ placeTrade, pending }: BuyCardProps) {
  const tradeType = useTradeStore((s) => s.tradeType)
  const growthRate = useTradeStore((s) => s.growthRate)
  const stakeInput = useTradeStore((s) => s.stakeInput)
  const balance = useTradeStore((s) => s.balance)
  const buyState = useTradeStore((s) => s.buyState)
  const buyMessage = useTradeStore((s) => s.buyMessage)
  const dismissBuy = useTradeStore((s) => s.dismissBuy)

  const active = TRADE_TYPES.find((t) => t.id === tradeType) ?? TRADE_TYPES[0]
  const validation = validateStake(stakeInput)
  const canBuy = validation.ok && validation.value <= balance && !pending
  const payout = payoutFor(validation.ok ? validation.value : 0, growthRate)

  if (buyState === 'confirmed' || buyState === 'error') {
    const won = buyMessage?.includes('won') ?? false
    return (
      <div
        className={cn(
          'rounded-xl border p-4',
          won
            ? 'border-emerald-500/40 bg-emerald-500/10'
            : 'border-rose-500/40 bg-rose-500/10',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <p className={cn('text-sm font-semibold', won ? 'text-emerald-500' : 'text-rose-400')}>
            {won ? 'Trade settled — win' : 'Trade settled — loss'}
          </p>
          <button
            type="button"
            onClick={dismissBuy}
            aria-label="Dismiss result"
            className="text-slate-400 transition hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-300">{buyMessage}</p>
        <button
          type="button"
          onClick={dismissBuy}
          className="mt-3 w-full rounded-lg bg-slate-200/90 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
        >
          Place another trade
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => placeTrade({ won: Math.random() < 0.5 })}
        disabled={!canBuy}
        className={cn(
          'group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition',
          'hover:shadow-indigo-500/50 hover:brightness-110 active:scale-[0.99]',
          pending && 'cursor-wait opacity-80',
          !canBuy && 'cursor-not-allowed opacity-50 hover:shadow-indigo-500/30 hover:brightness-100',
        )}
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirming purchase…
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Buy {active.label}
          </>
        )}
      </button>
      <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-slate-400 dark:text-slate-500">
        <span>
          Stake <span className="tterm-tabular font-semibold text-slate-500 dark:text-slate-400">{formatMoney(validation.ok ? validation.value : 0)}</span>
        </span>
        <span>
          Payout <span className="tterm-tabular font-semibold text-emerald-500 dark:text-emerald-400">{formatMoney(payout)}</span>
        </span>
      </div>
    </div>
  )
}
