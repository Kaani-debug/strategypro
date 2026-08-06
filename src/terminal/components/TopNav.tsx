import { useMarketStore } from '@/terminal/state/marketStore'
import { SYMBOLS } from '@/terminal/data/config'
import { ConnectionBadge } from '@/terminal/components/ui/ConnectionBadge'
import { Activity, Menu, SquareTerminal } from 'lucide-react'

interface TopNavProps {
  onOpenPanel: () => void
}

export default function TopNav({ onOpenPanel }: TopNavProps) {
  const symbol = useMarketStore((s) => s.symbol)
  const setSymbol = useMarketStore((s) => s.setSymbol)

  return (
    <header className="z-40 flex h-14 shrink-0 items-center gap-3 border-b border-slate-800 bg-slate-950 px-4 text-slate-100">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
          <Activity className="h-5 w-5 text-white" strokeWidth={2.4} />
        </span>
        <div className="hidden leading-tight sm:block">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold tracking-tight">
              Strategy<span className="text-indigo-400">Pro</span>
            </span>
            <span className="flex items-center gap-1 rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
              <SquareTerminal className="h-3 w-3" />
              Terminal
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Professional trading workspace</span>
        </div>
      </div>

      <div className="mx-2 hidden h-6 w-px bg-slate-800 md:block" />

      <label className="flex min-w-0 items-center gap-2">
        <span className="hidden text-[11px] font-medium uppercase tracking-wider text-slate-500 lg:block">Market</span>
        <select
          aria-label="Select market"
          value={symbol.symbol}
          onChange={(event) => {
            const next = SYMBOLS.find((s) => s.symbol === event.target.value)
            if (next) setSymbol(next)
          }}
          className="max-w-[220px] truncate rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[13px] font-medium text-slate-100 outline-none transition hover:border-slate-600 focus-visible:border-indigo-500"
        >
          {SYMBOLS.map((s) => (
            <option key={s.symbol} value={s.symbol}>
              {s.display} — {s.name}
            </option>
          ))}
        </select>
      </label>

      <div className="ml-auto flex items-center gap-3">
        <ConnectionBadge />
        <button
          type="button"
          onClick={onOpenPanel}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 lg:hidden"
        >
          <Menu className="h-4 w-4" />
          Trade
        </button>
      </div>
    </header>
  )
}
