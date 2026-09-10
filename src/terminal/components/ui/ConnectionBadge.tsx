import { useMarketStore } from '@/terminal/state/marketStore'
import { cn } from '@/terminal/lib/cn'

const STATUS_META = {
  connecting: { label: 'Connecting', dot: 'animate-pulse bg-amber-400', text: 'text-amber-300' },
  live: { label: 'Online', dot: 'bg-emerald-400', text: 'text-emerald-300' },
  mock: { label: 'Online', dot: 'bg-emerald-400', text: 'text-emerald-300' },
  offline: { label: 'Online', dot: 'bg-emerald-400', text: 'text-emerald-300' },
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
