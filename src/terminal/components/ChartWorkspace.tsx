import { useMemo, type RefObject } from 'react'
import { useMarketStore } from '@/terminal/state/marketStore'
import { useTradeStore } from '@/terminal/state/tradeStore'
import { useUiStore } from '@/terminal/state/uiStore'
import { useMarketStream } from '@/terminal/hooks/useMarketStream'
import { useCandlesHistory } from '@/terminal/hooks/useCandlesHistory'
import { generateMockCandles } from '@/terminal/data/mockFeed'
import TerminalChart, { type ChartController } from '@/terminal/chart/TerminalChart'
import { cn } from '@/terminal/lib/cn'

const PACE_PRESETS: Array<{ label: string; seconds: number }> = [
  { label: '1s', seconds: 1 },
  { label: '5s', seconds: 5 },
  { label: '10s', seconds: 10 },
  { label: '30s', seconds: 30 },
  { label: '60s', seconds: 60 },
]

interface ChartWorkspaceProps {
  theme: 'light' | 'dark'
  controllerRef: RefObject<ChartController | null>
}

export default function ChartWorkspace({ theme, controllerRef }: ChartWorkspaceProps) {

  const symbol = useMarketStore((s) => s.symbol)
  const status = useMarketStore((s) => s.status)
  const ticks = useMarketStore((s) => s.ticks)
  const error = useMarketStore((s) => s.error)
  const growthRate = useTradeStore((s) => s.growthRate)
  const tradeType = useTradeStore((s) => s.tradeType)
  const tool = useUiStore((s) => s.tool)
  const timeframe = useUiStore((s) => s.timeframe)
  const setTimeframe = useUiStore((s) => s.setTimeframe)

  useMarketStream(symbol.symbol)
  const liveMode = status === 'live'
  const historyQuery = useCandlesHistory(symbol.symbol, status !== 'mock')
  const history = useMemo(() => {
    if (liveMode) return historyQuery.data ?? []
    if (status === 'mock') return generateMockCandles(symbol)
    return historyQuery.data ?? []
  }, [liveMode, status, historyQuery.data, symbol])

  return (
    <div className="relative h-full w-full min-h-0">
      <TerminalChart
        theme={theme}
        history={history}
        ticks={ticks}
        growthRate={growthRate}
        tradeType={tradeType}
        tool={tool}
        digits={symbol.digits}
        stepSeconds={timeframe}
        controllerRef={controllerRef}
      />

      {historyQuery.isLoading ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-4 text-center shadow-2xl backdrop-blur">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-indigo-400" />
            <p className="mt-3 text-sm text-slate-300">Loading {symbol.display} history…</p>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="absolute left-1/2 top-14 z-20 -translate-x-1/2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-medium text-rose-300 backdrop-blur">
          {error}
        </div>
      ) : null}

      <div className="pointer-events-none absolute left-4 top-14 z-10 select-none rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 backdrop-blur">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-slate-100">{symbol.display}</span>
          <span className="text-xs text-slate-400">{symbol.name}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400" />
          Projecting {growthRate}% target
        </div>
      </div>

      <div className="absolute right-4 top-14 z-10 flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/70 p-1 backdrop-blur">
        <span className="px-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Pace</span>
        {PACE_PRESETS.map((preset) => (
          <button
            key={preset.seconds}
            type="button"
            onClick={() => setTimeframe(preset.seconds)}
            aria-pressed={timeframe === preset.seconds}
            className={cn(
              'rounded-md px-2 py-1 text-[11px] font-medium text-slate-400 transition hover:text-slate-100',
              timeframe === preset.seconds && 'bg-indigo-500/20 text-indigo-300',
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}
