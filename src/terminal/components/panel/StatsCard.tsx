import { useTradeStore } from '@/terminal/state/tradeStore'
import { formatMoney, formatSignedMoney } from '@/terminal/lib/format'
import { Card } from '@/terminal/components/ui/Card'
import { Stat } from '@/terminal/components/ui/Stat'
import { ArrowDownRight, ArrowUpRight, CircleDollarSign, Wallet } from 'lucide-react'

export default function StatsCard() {
  const balance = useTradeStore((s) => s.balance)
  const totalTrades = useTradeStore((s) => s.totalTrades)
  const wins = useTradeStore((s) => s.wins)
  const losses = useTradeStore((s) => s.losses)
  const netProfit = useTradeStore((s) => s.netProfit)

  const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0

  return (
    <Card title="Session Stats" icon={<Wallet className="h-4 w-4" />}>
      <div className="grid grid-cols-2 gap-4">
        <Stat
          label="Balance"
          value={formatMoney(balance)}
          icon={<CircleDollarSign className="h-3.5 w-3.5" />}
          tone="accent"
        />
        <Stat
          label="Net Profit"
          value={formatSignedMoney(netProfit)}
          tone={netProfit >= 0 ? 'up' : 'down'}
        />
        <Stat label="Wins" value={wins} icon={<ArrowUpRight className="h-3.5 w-3.5" />} tone="up" />
        <Stat label="Losses" value={losses} icon={<ArrowDownRight className="h-3.5 w-3.5" />} tone="down" />
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span>Win rate</span>
          <span className="tterm-tabular font-semibold text-slate-600 dark:text-slate-300">{winRate}%</span>
        </div>
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${winRate}%` }} />
        </div>
      </div>
    </Card>
  )
}
