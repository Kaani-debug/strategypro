import type { ReactNode } from 'react'
import { cn } from '@/terminal/lib/cn'

export type StatTone = 'default' | 'up' | 'down' | 'accent'

interface StatProps {
  label: string
  value: ReactNode
  sub?: ReactNode
  tone?: StatTone
  icon?: ReactNode
  className?: string
}

const TONES: Record<StatTone, string> = {
  default: 'text-slate-800 dark:text-slate-100',
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-rose-600 dark:text-rose-400',
  accent: 'text-indigo-600 dark:text-indigo-400',
}

export function Stat({ label, value, sub, tone = 'default', icon, className }: StatProps) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {icon}
        {label}
      </span>
      <span className={cn('tterm-tabular text-lg font-bold leading-tight', TONES[tone])}>{value}</span>
      {sub ? <span className="tterm-tabular text-[11px] text-slate-400 dark:text-slate-500">{sub}</span> : null}
    </div>
  )
}
