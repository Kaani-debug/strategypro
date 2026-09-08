import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAnalysisStore, ACCOUNTS } from '../state/analysisStore'
import { CircleDollarSign, LogOut, User, Settings, Bell, CandlestickChart } from 'lucide-react'
import FundAccountModal from './FundAccountModal'

const fmtBal = n => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function DerivHeader() {
  const { user, logout } = useAuth()
  const [fundOpen, setFundOpen] = useState(false)

  const account = useAnalysisStore(s => s.account)
  const setAccountBalance = useAnalysisStore(s => s.setAccountBalance)

  const userBalance = Number(user?.balance)

  useEffect(() => {
    if (user) setAccountBalance(userBalance)
  }, [userBalance, setAccountBalance, user])

  const displayBalance = user ? userBalance : Number(account.balance)

  return (
    <header className="deriv-header">
      <div className="deriv-header__left">
        <span className="deriv-header__logo">
          <span className="deriv-header__logo-icon">D</span>
          <span className="deriv-header__logo-text">StrategyPro</span>
        </span>
        <div className="deriv-header__acct">
          <div className="deriv-header__acct-toggle deriv-header__acct-toggle--real" title={`${ACCOUNTS[0].label} · ${ACCOUNTS[0].id}`}>
            <span className="deriv-header__acct-toggle-name">{ACCOUNTS[0].label}</span>
            <span className="deriv-header__acct-toggle-balance">
              {fmtBal(displayBalance)} {account.currency}
            </span>
          </div>
          <button type="button" className="deriv-header__fund-btn" onClick={() => setFundOpen(true)}>
            <CircleDollarSign size={14} />
            <span>Fund Account</span>
          </button>
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

      <FundAccountModal open={fundOpen} onClose={() => setFundOpen(false)} />
    </header>
  )
}