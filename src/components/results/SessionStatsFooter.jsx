import { useSessionStore } from '../../state/sessionStore'
import { fmtSignedMoney, pnlClass } from './utils'

function FooterStat({ label, value }) {
  return (
    <div className="tr-footer__stat">
      <span className="tr-footer__label">{label}</span>
      <span className="tr-footer__value">{value}</span>
    </div>
  )
}

export default function SessionStatsFooter() {
  const stats = useSessionStore(s => s.stats)
  const trades = useSessionStore(s => s.trades)
  const totalRuns = stats.won + stats.lost + stats.open

  return (
    <div className="tr-footer">
      <div className="tr-footer__grid">
        <FooterStat label="Total Runs" value={totalRuns} />
        <FooterStat
          label="Won / Lost"
          value={
            <span className="tr-footer__wl">
              <span className="text-green">{stats.won}</span>
              <span className="tr-footer__sep">/</span>
              <span className="text-red">{stats.lost}</span>
            </span>
          }
        />
        <FooterStat label="Total P/L" value={<span className={pnlClass(stats.netProfit)}>{fmtSignedMoney(stats.netProfit)}</span>} />
      </div>
      {trades.some(t => t.status === 'open') ? <div className="tr-footer__live">● {trades.filter(t => t.status === 'open').length} open contract(s)</div> : null}
    </div>
  )
}
