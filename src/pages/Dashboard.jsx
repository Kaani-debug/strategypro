import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GlassCard from '../components/GlassCard'

export default function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label: 'Total Balance', value: `$${(user?.balance || 15247.32).toLocaleString()}`, change: '+12.4%', up: true },
    { label: "Today's P&L", value: '+$847.21', change: '+$847.21', up: true },
    { label: 'Active Bots', value: '3', change: 'Running', up: true },
    { label: 'Win Rate', value: '72.4%', change: '+3.2%', up: true },
  ]

  const trades = [
    { pair: 'Vol 10', type: 'Rise', stake: '$10.00', profit: '+$8.50', time: '2m ago', status: 'won' },
    { pair: 'Vol 25', type: 'Fall', stake: '$15.00', profit: '+$12.75', time: '5m ago', status: 'won' },
    { pair: 'Vol 50', type: 'Rise', stake: '$20.00', profit: '-$20.00', time: '12m ago', status: 'lost' },
    { pair: 'Vol 75', type: 'Match', stake: '$5.00', profit: '+$4.25', time: '18m ago', status: 'won' },
    { pair: 'Vol 100', type: 'Rise', stake: '$25.00', profit: '+$21.25', time: '25m ago', status: 'won' },
  ]

  const bots = [
    { name: 'Martingale', asset: 'Vol 10', status: 'active', profit: '+$124.50' },
    { name: "D'Alembert", asset: 'Vol 25', status: 'active', profit: '+$87.30' },
    { name: 'Reverse Martingale', asset: 'Vol 50', status: 'paused', profit: '+$45.20' },
  ]

  const recentSignals = [
    { signal: 'Rise', asset: 'Vol 10', confidence: '87%', time: 'Just now' },
    { signal: 'Fall', asset: 'Vol 25', confidence: '76%', time: '2m ago' },
    { signal: 'Match 5', asset: 'Vol 50', confidence: '82%', time: '5m ago' },
    { signal: 'Over 5', asset: 'Vol 75', confidence: '71%', time: '8m ago' },
  ]

  if (!user) return <><Header /><main className="app-main"><div className="container" style={{textAlign:'center',paddingTop:'8rem'}}><h2>Please sign in to view your dashboard</h2><Link to="/login" className="btn btn--primary" style={{marginTop:'2rem'}}>Sign In</Link></div></main></>

  return (
    <>
      <Header />
      <main className="app-main">
        <div className="container">
          <div className="dash-header fade-in">
            <div>
              <h1 className="dash-header__title">Dashboard</h1>
              <p className="dash-header__subtitle">Welcome back, {user.name}</p>
            </div>
            <div className="dash-header__actions">
              <div className="dash-tabs">
                {['overview', 'trades', 'signals'].map(t => (
                  <button key={t} className={`dash-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <Link to="/bots" className="btn btn--primary">Create Bot</Link>
            </div>
          </div>

          <div className="dash-stats">
            {stats.map((s, i) => (
              <GlassCard key={i}>
                <div className="dash-stat-card__label">{s.label}</div>
                <div className="dash-stat-card__value">{s.value}</div>
                <div className={`dash-stat-card__change ${s.up ? 'up' : 'down'}`}>{s.change}</div>
              </GlassCard>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="dash-grid">
              <GlassCard>
                <div className="dash-panel__header"><h3>Active Bots</h3><Link to="/bots" className="header__link">Manage</Link></div>
                <div className="bot-list">
                  {bots.map((b, i) => (
                    <div className="bot-item" key={i}>
                      <div className="bot-item__left">
                        <div className={`bot-status-dot ${b.status}`} />
                        <div>
                          <div className="bot-item__name">{b.name}</div>
                          <div className="bot-item__status">{b.asset} · {b.status}</div>
                        </div>
                      </div>
                      <span className="text-green">{b.profit}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
              <GlassCard>
                <div className="dash-panel__header"><h3>Recent Trades</h3><span className="header__link">View All</span></div>
                <table className="dash-table">
                  <thead><tr><th>Pair</th><th>Type</th><th>Profit</th><th>Status</th></tr></thead>
                  <tbody>
                    {trades.slice(0, 4).map((t, i) => (
                      <tr key={i}>
                        <td>{t.pair}</td><td>{t.type}</td>
                        <td className={t.status === 'won' ? 'text-green' : 'text-red'}>{t.profit}</td>
                        <td><span className={`badge badge--${t.status}`}>{t.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
            </div>
          )}

          {activeTab === 'trades' && (
            <GlassCard>
              <div className="dash-panel__header"><h3>Trade History</h3></div>
              <table className="dash-table">
                <thead><tr><th>Pair</th><th>Type</th><th>Stake</th><th>Profit</th><th>Time</th><th>Status</th></tr></thead>
                <tbody>
                  {trades.map((t, i) => (
                    <tr key={i}>
                      <td>{t.pair}</td><td>{t.type}</td><td>{t.stake}</td>
                      <td className={t.status === 'won' ? 'text-green' : 'text-red'}>{t.profit}</td>
                      <td>{t.time}</td>
                      <td><span className={`badge badge--${t.status}`}>{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          )}

          {activeTab === 'signals' && (
            <GlassCard>
              <div className="dash-panel__header"><h3>Live Signals</h3><span className="vol-panel__status">● Live</span></div>
              <table className="dash-table">
                <thead><tr><th>Signal</th><th>Asset</th><th>Confidence</th><th>Time</th></tr></thead>
                <tbody>
                  {recentSignals.map((s, i) => (
                    <tr key={i}>
                      <td><strong>{s.signal}</strong></td><td>{s.asset}</td>
                      <td className="text-green">{s.confidence}</td><td>{s.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
