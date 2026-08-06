import { useMarketStore } from '@/terminal/state/marketStore'
import { useUiStore } from '@/terminal/state/uiStore'
import { useClock } from '@/terminal/hooks/useClock'
import { LANGUAGES } from '@/terminal/data/config'
import { formatPrice } from '@/terminal/lib/format'
import { ConnectionBadge } from '@/terminal/components/ui/ConnectionBadge'
import { Globe, Moon, Sun } from 'lucide-react'

interface StatusBarProps {
  isDark: boolean
  onToggleTheme: () => void
}

export default function StatusBar({ isDark, onToggleTheme }: StatusBarProps) {
  const now = useClock(1000)
  const symbol = useMarketStore((s) => s.symbol)
  const lastTick = useMarketStore((s) => s.lastTick)
  const language = useUiStore((s) => s.language)
  const setLanguage = useUiStore((s) => s.setLanguage)

  const utc = now.toUTCString().slice(17, 25)

  return (
    <footer className="z-40 flex h-9 shrink-0 items-center gap-4 border-t border-slate-800 bg-slate-950/95 px-4 text-slate-400 backdrop-blur">
      <ConnectionBadge className="shrink-0" />

      <span className="hidden items-center gap-2 sm:flex">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{symbol.symbol}</span>
        <span className="tterm-tabular text-[13px] font-semibold text-slate-200">
          {lastTick ? formatPrice(lastTick.price, symbol.digits) : '—'}
        </span>
      </span>

      <div className="ml-auto flex items-center gap-3">
        <label className="hidden items-center gap-1.5 md:flex">
          <Globe className="h-3.5 w-3.5" />
          <select
            aria-label="Language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="rounded-md border border-slate-800 bg-slate-900 px-1.5 py-1 text-xs text-slate-300 outline-none focus-visible:border-indigo-500"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Light theme' : 'Dark theme'}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <span className="tterm-tabular flex items-center gap-1.5 text-xs text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
          {utc} UTC
        </span>
      </div>
    </footer>
  )
}
