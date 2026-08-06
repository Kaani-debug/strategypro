import type { ReactNode } from 'react'
import { cn } from '@/terminal/lib/cn'

interface CardProps {
  title?: ReactNode
  icon?: ReactNode
  right?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}

export function Card({ title, icon, right, children, className, bodyClassName }: CardProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-slate-200 bg-white/90 shadow-sm',
        'dark:border-slate-800 dark:bg-slate-900/60',
        className,
      )}
    >
      {title ? (
        <header className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <h3 className="flex items-center gap-2 text-[13px] font-semibold text-slate-700 dark:text-slate-200">
            {icon && <span className="text-slate-400 dark:text-slate-500">{icon}</span>}
            {title}
          </h3>
          {right}
        </header>
      ) : null}
      <div className={cn('p-4', bodyClassName)}>{children}</div>
    </section>
  )
}
