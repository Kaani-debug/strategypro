import { X } from 'lucide-react'

const STATS = [
  { label: 'Total Stake', desc: 'The cumulative amount wagered on every settled contract in the current session.' },
  { label: 'Total Payout', desc: 'The cumulative returns paid out by winning contracts, excluding returned stake.' },
  { label: 'Number of Runs', desc: 'How many times a trading session has been started within this results panel.' },
  { label: 'Contracts Won', desc: 'The number of contracts that settled in profit.' },
  { label: 'Contracts Lost', desc: 'The number of contracts that settled at a loss.' },
  { label: 'Win Percentage', desc: 'Winning contracts as a share of all settled contracts, expressed as a percentage.' },
  { label: 'Loss Percentage', desc: 'Losing contracts as a share of all settled contracts, expressed as a percentage.' },
  { label: 'Total Profit / Loss', desc: 'Net result of the session — total payout minus total stake. Positive means profit, negative means loss.' },
  { label: 'Net Return', desc: 'Total profit or loss expressed as a percentage of the starting balance.' },
  { label: 'Return on Investment (ROI)', desc: 'Total profit or loss expressed as a percentage of the total amount staked.' },
]

export default function StatsHelpModal({ onClose }) {
  return (
    <div className="tr-modal-overlay" onClick={onClose}>
      <div className="tr-modal tr-modal--sm" onClick={e => e.stopPropagation()}>
        <div className="tr-modal__header">
          <div className="tr-modal__title">Session statistics explained</div>
          <button className="tr-modal__close" onClick={onClose} aria-label="Close help">
            <X size={16} />
          </button>
        </div>
        <div className="tr-modal__body tr-scroll">
          <div className="tr-help">
            {STATS.map(s => (
              <div className="tr-help__item" key={s.label}>
                <span className="tr-help__label">{s.label}</span>
                <p className="tr-help__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="tr-modal__footer">
          <button className="tr-btn tr-btn--primary" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  )
}
