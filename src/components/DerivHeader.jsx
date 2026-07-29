import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { ChevronDown, ChevronUp, Copy, Plus, LogOut, User, Settings, Bell } from 'lucide-react'

export default function DerivHeader() {
  const { user, logout } = useAuth()
  const [acctOpen, setAcctOpen] = useState(false)

  const balance = user?.balance ?? 15247.32
  const acctId = user?.acctId || `ROT${String(user?.id || '').replace('U', '').padStart(5, '0') || '91857'}`
  const demoBalance = 10000

  return (
    <header className="deriv-header">
      <div className="deriv-header__left">
        <span className="deriv-header__logo">
          <span className="deriv-header__logo-icon">D</span>
          <span className="deriv-header__logo-text">StrategyPro</span>
        </span>
        <div className="deriv-header__divider" />
        <div className="deriv-header__acct-switcher" onClick={() => setAcctOpen(!acctOpen)}>
          <div className="deriv-header__acct-info">
            <span className="deriv-header__acct-type">Deriv Demo</span>
            <span className="deriv-header__acct-id">{acctId}</span>
          </div>
          <div className="deriv-header__balance">
            <span className="deriv-header__balance-amount">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="deriv-header__balance-currency">USD</span>
          </div>
          {acctOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        {acctOpen && (
          <div className="deriv-header__acct-dropdown">
            <div className="deriv-header__acct-dropdown-item deriv-header__acct-dropdown-item--active">
              <div>
                <div className="deriv-header__acct-dropdown-type">Deriv Demo</div>
                <div className="deriv-header__acct-dropdown-id">{acctId}</div>
              </div>
              <div className="deriv-header__balance">
                <span className="deriv-header__balance-amount">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="deriv-header__balance-currency">USD</span>
              </div>
            </div>
            <div className="deriv-header__acct-dropdown-item">
              <div>
                <div className="deriv-header__acct-dropdown-type">Deriv Demo</div>
                <div className="deriv-header__acct-dropdown-id">VRTC123456</div>
              </div>
              <div className="deriv-header__balance">
                <span className="deriv-header__balance-amount">${demoBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="deriv-header__balance-currency">USD</span>
              </div>
            </div>
            <div className="deriv-header__acct-dropdown-footer">
              <button className="deriv-header__acct-btn"><Plus size={14} /> Add account</button>
              <button className="deriv-header__acct-btn"><Copy size={14} /> Transfer</button>
            </div>
          </div>
        )}
      </div>
      <div className="deriv-header__right">
        <button className="deriv-header__icon-btn" title="Notifications"><Bell size={18} /></button>
        <button className="deriv-header__icon-btn" title="Settings"><Settings size={18} /></button>
        <div className="deriv-header__divider" />
        <button className="deriv-header__icon-btn" title="Profile"><User size={18} /></button>
        <button className="deriv-header__icon-btn" title="Logout" onClick={logout}><LogOut size={18} /></button>
      </div>
    </header>
  )
}
