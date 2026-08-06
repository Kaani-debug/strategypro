import { useMemo, useState } from 'react'
import { CircleHelp, TrendingDown, TrendingUp } from 'lucide-react'
import { useSessionStore } from '../../state/sessionStore'
import PerformanceChart from './PerformanceChart'
import StatsHelpModal from './StatsHelpModal'
import { fmtElapsed, fmtMoney, fmtPct, fmtSignedMoney, fmtTime, pnlClass, statusBadge, statusLabel } from './utils'

function StatTile({ label, value, tone, sub }) {
  return (
    <div className="tr-stat">
      <span className="tr-stat__label">{label}</span>
      <span className={`tr-stat__value ${tone || ''}`}>{value}</span>
      {sub ? <span className="tr-stat__sub">{sub}</span> : null}
    </div>
  )
}

function ResultCard({ trade }) {
  if (!trade) {
    return (
      <div className="tr-result tr-result--idle">
        <div className="tr-result__icon"><TrendingUp size={22} /></div>
        <div className="tr-result__main">
          <div className="tr-result__status">Awaiting first contract</div>
          <div className="tr-result__detail">Results will appear here the moment a contract settles.</div>
        </div>
      </div>
    )
  }

  const won = trade.status === 'won'
  const pnl = trade.profit

  return (
    <div key={trade.id} className={`tr-result ${won ? 'tr-result--win' : 'tr-result--loss'}`}>
      <div className="tr-result__icon">
        {won ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
      </div>
      <div className="tr-result__main">
        <div className="tr-result__status">{won ? 'Contract Won' : 'Contract Lost'}</div>
        <div className="tr-result__detail">
          {trade.contractType} · {trade.symbol} · {fmtTime(trade.exitTime || trade.entryTime)}
        </div>
      </div>
      <div className="tr-result__pnl">{won ? '+' : ''}{fmtMoney(pnl)}</div>
    </div>
  )
}

export default function SummaryTab() {
  const session = useSessionStore(s => s.session)
  const trades = useSessionStore(s => s.trades)
  const stats = useSessionStore(s => s.stats)
  const balance = useSessionStore(s => s.balance)
  const runs = useSessionStore(s => s.runs)
  const [helpOpen, setHelpOpen] = useState(false)

  const settled = useMemo(() => trades.filter(t => t.status === 'won' || t.status === 'lost'), [trades])
  const latest = settled.length ? settled[settled.length - 1] : null
  const avgDuration = settled.length
    ? settled.reduce((a, t) => a + t.duration, 0) / settled.length
    : 0

  return (
    <div className="tr-scroll">
      <div className="tr-summary">
        <ResultCard trade={latest} />

        <div className="tr-stats-head">
          <span className="tr-stats-head__title">Session Statistics</span>
          <button className="tr-stats-head__help" onClick={() => setHelpOpen(true)} aria-label="Explain session statistics">
            <CircleHelp size={15} />
            <span>Help</span>
          </button>
        </div>

        <div className="tr-stats">
          <StatTile label="Total Stake" value={fmtMoney(stats.totalStake)} />
          <StatTile label="Total Payout" value={fmtMoney(stats.totalPayout)} tone={stats.totalPayout ? 'text-green' : ''} />
          <StatTile label="Number of Runs" value={runs} />
          <StatTile label="Contracts Won" value={stats.won} tone={stats.won ? 'text-green' : ''} />
          <StatTile label="Contracts Lost" value={stats.lost} tone={stats.lost ? 'text-red' : ''} />
          <StatTile label="Win Percentage" value={fmtPct(stats.winRate)} tone={stats.winRate >= 50 ? 'text-green' : ''} />
          <StatTile label="Loss Percentage" value={fmtPct(stats.lossRate)} tone={stats.lossRate > 50 ? 'text-red' : ''} />
          <StatTile label="Total Profit / Loss" value={fmtSignedMoney(stats.netProfit)} tone={pnlClass(stats.netProfit)} />
          <StatTile label="Net Return" value={fmtPct(stats.netReturn)} tone={pnlClass(stats.netReturn)} />
          <StatTile label="Return on Investment" value={fmtPct(stats.roi)} tone={pnlClass(stats.roi)} />
        </div>

        <div className="tr-session">
          <div className="tr-session__main">
            <div className="tr-session__name">{session.botName}</div>
            <div className="tr-session__meta">
              <span className="tr-session__id">{session.id}</span>
              <span>{session.strategy}</span>
              <span>{session.symbol}</span>
            </div>
          </div>
          <div className="tr-session__side">
            <span className={statusBadge(session.status)}>{statusLabel(session.status)}</span>
            <span className="tr-session__elapsed">{fmtElapsed(session.elapsedMs)}</span>
          </div>
        </div>

        <div className="tr-session__times">
          <span>Started {session.startTime ? fmtTime(session.startTime) : '—'}</span>
          <span>Balance {fmtMoney(balance)} / Start {fmtMoney(session.startBalance)}</span>
          <span>{session.endTime ? `Ended ${fmtTime(session.endTime)}` : 'Live'}</span>
        </div>

        <div className="tr-card">
          <div className="tr-card__header">
            <span className="tr-card__title">Cumulative Performance</span>
            <span className="tr-card__badge">{settled.length} settled</span>
          </div>
          <PerformanceChart trades={trades} />
        </div>

        <div className="tr-card">
          <div className="tr-card__header">
            <span className="tr-card__title">Trade Efficiency</span>
          </div>
          <div className="tr-winrate">
            <div className="tr-winrate__bar">
              <div className="tr-winrate__fill" style={{ width: `${Math.min(100, stats.winRate)}%` }} />
            </div>
            <div className="tr-winrate__labels">
              <span className="text-green">{stats.won} wins</span>
              <span className="text-red">{stats.lost} losses</span>
            </div>
          </div>
          <div className="tr-summary__runinfo">
            Avg duration {settled.length ? `${Math.round(avgDuration)}s` : '—'} · Max win {fmtMoney(stats.maxWin)} · Max loss {fmtMoney(stats.maxLoss)}
          </div>
        </div>
      </div>

      {helpOpen ? <StatsHelpModal onClose={() => setHelpOpen(false)} /> : null}
    </div>
  )
}
