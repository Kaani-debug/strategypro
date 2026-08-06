import { useTradeStore } from '@/terminal/state/tradeStore'
import { TRADE_TYPES } from '@/terminal/data/config'
import { Card } from '@/terminal/components/ui/Card'
import { Layers, ChevronDown } from 'lucide-react'
import { cn } from '@/terminal/lib/cn'
import { useRef, useState } from 'react'

export default function TradeTypeCard() {
  const tradeType = useTradeStore((s) => s.tradeType)
  const setTradeType = useTradeStore((s) => s.setTradeType)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const [open, setOpen] = useState(false)
  const active = TRADE_TYPES.find((t) => t.id === tradeType) ?? TRADE_TYPES[0]

  return (
    <Card
      title="Trade Type"
      icon={<Layers className="h-4 w-4" />}
      right={
        <span className="text-[11px] font-semibold text-indigo-400">{active.label}</span>
      }
    >
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Trade type">
        {TRADE_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            role="radio"
            aria-checked={tradeType === type.id}
            onClick={() => setTradeType(type.id)}
            className={cn(
              'rounded-lg border px-2 py-2 text-xs font-medium transition',
              'border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600',
              'dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:text-indigo-300',
              tradeType === type.id &&
                'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-500/15 dark:text-indigo-300',
            )}
          >
            {type.label}
          </button>
        ))}
      </div>

      <details ref={detailsRef} className="mt-3" onToggle={() => setOpen(detailsRef.current?.open ?? false)}>
        <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium text-slate-500 transition hover:text-indigo-500 dark:text-slate-400">
          <span>About this type</span>
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
        </summary>
        <p className="mt-2 rounded-lg bg-slate-50 p-2.5 text-[11px] leading-relaxed text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          {active.description}
        </p>
      </details>
    </Card>
  )
}
