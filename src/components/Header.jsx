import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import AuthModal from './AuthModal'

export default function Header() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [authOpen, setAuthOpen] = useState(false)
  const isApp = user && ['/dashboard', '/bots', '/copy-trading', '/market-analysis', '/endpoint'].includes(location.pathname)

  return (
    <>
      <header className="header glass-header">
        <div className="header__inner">
          <Link to="/" className="header__logo">Strategy<span>Pro</span></Link>
          <nav className="header__nav">
            {user ? (
              <>
                {isApp && (
                  <>
                    <Link to="/dashboard" className="header__link">Dashboard</Link>
                    <Link to="/bots" className="header__link">Bots</Link>
                    <Link to="/copy-trading" className="header__link">Copy</Link>
                    <Link to="/market-analysis" className="header__link">Markets</Link>
                    <Link to="/terminal" className="header__link">Terminal</Link>
                  </>
                )}
                {!isApp && location.pathname === '/' && (
                  <>
                    <Link to="/#features" className="header__link">Features</Link>
                    <Link to="/#testimonials" className="header__link">Testimonials</Link>
                  </>
                )}
                <ThemeToggle />
                <Link to="/dashboard" className="header__user">
                  <span className="header__avatar">{user.avatar || user.name?.[0]}</span>
                  <span className="header__user-name">{user.name}</span>
                </Link>
                <button className="btn btn--ghost" onClick={logout} style={{fontSize:'1.2rem'}}>Logout</button>
              </>
            ) : (
              <>
                {location.pathname === '/' && (
                  <><Link to="/#features" className="header__link">Features</Link><Link to="/#testimonials" className="header__link">Testimonials</Link></>
                )}
                <ThemeToggle />
                <button className="btn btn--primary" style={{fontSize:'1.2rem',padding:'0.6rem 1.6rem',height:'auto'}} onClick={() => setAuthOpen(true)}>Sign In</button>
              </>
            )}
          </nav>
        </div>
      </header>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
