import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAnalysisStore, ACCOUNTS } from '../state/analysisStore'
import { ChevronDown, ChevronUp, LogOut, User, Settings, Bell, CandlestickChart } from 'lucide-react'

const fmtBal = n => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function DerivHeader() {
  const { logout } = useAuth()
  const [acctOpen, setAcctOpen] = useState(false)

  const account = useAnalysisStore(s => s.account)
  const setAccount = useAnalysisStore(s => s.setAccount)

  return (
    <header className="deriv-header">
      <div className="deriv-header__left">
        <span className="deriv-header__logo">
          <span className="deriv-header__logo-icon">D</span>
          <span className="deriv-header__logo-text">StrategyPro</span>
        </span>
        <div className="deriv-header__acct">
          <button
            type="button"
            className={`deriv-header__acct-toggle deriv-header__acct-toggle--${account.type}`}
            onClick={() => setAcctOpen(!acctOpen)}
            aria-haspopup="listbox"
            aria-expanded={acctOpen}
          >
            <span className="deriv-header__acct-toggle-name">{account.label}</span>
            <span className="deriv-header__acct-toggle-balance">
              {fmtBal(account.balance)} {account.currency}
            </span>
            {acctOpen ? <ChevronUp size={14} className="deriv-header__acct-toggle-chevron" /> : <ChevronDown size={14} className="deriv-header__acct-toggle-chevron" />}
          </button>
          {acctOpen && (
            <div className="deriv-header__acct-menu" role="listbox">
              {ACCOUNTS.map(a => (
                <button
                  key={a.type}
                  type="button"
                  role="option"
                  aria-selected={a.type === account.type}
                  className={`deriv-header__acct-menu-item${a.type === account.type ? ' deriv-header__acct-menu-item--active' : ''}`}
                  onClick={() => {
                    setAccount(a.type)
                    setAcctOpen(false)
                  }}
                >
                  <span className="deriv-header__acct-menu-main">
                    <span className="deriv-header__acct-menu-name">{a.label}</span>
                    <span className="deriv-header__acct-menu-id">{a.id}</span>
                  </span>
                  <span className={`deriv-header__acct-menu-balance deriv-header__acct-menu-balance--${a.type}`}>
                    {fmtBal(a.balance)} {a.currency}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="deriv-header__right">
        <Link to="/terminal" className="deriv-header__terminal-link" title="Open Terminal">
          <CandlestickChart size={18} />
          <span>Terminal</span>
        </Link>
        <button className="deriv-header__icon-btn" title="Notifications"><Bell size={18} /></button>
        <button className="deriv-header__icon-btn" title="Settings"><Settings size={18} /></button>
        <div className="deriv-header__divider" />
        <button className="deriv-header__icon-btn" title="Profile"><User size={18} /></button>
        <button className="deriv-header__icon-btn" title="Logout" onClick={logout}><LogOut size={18} /></button>
      </div>
    </header>
  )
}
