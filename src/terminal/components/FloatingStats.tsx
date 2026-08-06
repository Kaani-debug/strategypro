import { AnimatePresence, motion } from 'framer-motion'
import { useUiStore } from '@/terminal/state/uiStore'
import { useTradeStore } from '@/terminal/state/tradeStore'
import { useMarketStore } from '@/terminal/state/marketStore'
import { formatMoney, formatPrice } from '@/terminal/lib/format'
import { ArrowDownRight, ArrowUpRight, ChevronDown, ChevronUp, CircleDollarSign, TrendingUp } from 'lucide-react'

export default function FloatingStats() {
  const open = useUiStore((s) => s.statsOpen)
  const toggle = useUiStore((s) => s.toggleStats)
  const balance = useTradeStore((s) => s.balance)
  const netProfit = useTradeStore((s) => s.netProfit)
  const wins = useTradeStore((s) => s.wins)
  const losses = useTradeStore((s) => s.losses)
  const symbol = useMarketStore((s) => s.symbol)
  const lastTick = useMarketStore((s) => s.lastTick)

  return (
    <div className="absolute bottom-12 left-1/2 z-30 -translate-x-1/2">
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="stats-open"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/90 px-5 py-2.5 shadow-2xl shadow-black/40 backdrop-blur"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
              </span>
              <div className="leading-tight">
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{symbol.symbol}</p>
                <p className="tterm-tabular text-sm font-bold text-slate-100">
                  {lastTick ? formatPrice(lastTick.price, symbol.digits) : '—'}
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-800" />

            <div className="leading-tight">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Balance</p>
              <p className="tterm-tabular text-sm font-bold text-indigo-300">{formatMoney(balance)}</p>
            </div>
            <div className="leading-tight">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Net P/L</p>
              <p className={`tterm-tabular text-sm font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {netProfit >= 0 ? '+' : ''}
                {formatMoney(netProfit)}
              </p>
            </div>
            <div className="leading-tight">
              <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                {wins}
              </p>
              <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                <ArrowDownRight className="h-3 w-3 text-rose-400" />
                {losses}
              </p>
            </div>

            <button
              type="button"
              onClick={toggle}
              aria-label="Collapse stats"
              className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="stats-collapsed"
            type="button"
            onClick={toggle}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            aria-label="Expand stats"
            className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/90 px-3 py-1.5 text-xs font-semibold text-slate-400 shadow-xl shadow-black/40 backdrop-blur transition hover:text-slate-100"
          >
            <CircleDollarSign className="h-3.5 w-3.5 text-indigo-400" />
            Stats
            <ChevronUp className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
