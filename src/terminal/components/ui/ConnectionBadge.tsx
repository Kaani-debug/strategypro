import { useMarketStore } from '@/terminal/state/marketStore'
import { cn } from '@/terminal/lib/cn'

const STATUS_META = {
  connecting: { label: 'Connecting', dot: 'animate-pulse bg-amber-400', text: 'text-amber-300' },
  live: { label: 'Live Feed', dot: 'bg-emerald-400', text: 'text-emerald-300' },
  mock: { label: 'Simulated', dot: 'bg-sky-400', text: 'text-sky-300' },
  offline: { label: 'Offline', dot: 'bg-rose-400', text: 'text-rose-300' },
} as const

export function ConnectionBadge({ className }: { className?: string }) {
  const status = useMarketStore((s) => s.status)
  const meta = STATUS_META[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-semibold', meta.text, className)}>
      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', meta.dot)} />
      {meta.label}
    </span>
  )
}
