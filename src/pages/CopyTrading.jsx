import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSimulation } from '../hooks/useSimulation'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GlassCard from '../components/GlassCard'

export default function CopyTrading() {
  const { user } = useAuth()
  const { prices, connected } = useSimulation()

  const topTraders = [
    { rank: 1, name: 'AlphaTrader', profit: '+245.6%', followers: 1234, winRate: '87.2%', trades: 892, avatar: 'AT' },
    { rank: 2, name: 'CryptoKing', profit: '+198.3%', followers: 987, winRate: '82.1%', trades: 1543, avatar: 'CK' },
    { rank: 3, name: 'ForexMaster', profit: '+156.7%', followers: 756, winRate: '79.8%', trades: 2104, avatar: 'FM' },
    { rank: 4, name: 'BotBuilder', profit: '+134.2%', followers: 543, winRate: '76.5%', trades: 678, avatar: 'BB' },
    { rank: 5, name: 'ScalperPro', profit: '+112.8%', followers: 321, winRate: '74.3%', trades: 3456, avatar: 'SP' },
    { rank: 6, name: 'TrendHunter', profit: '+98.4%', followers: 287, winRate: '72.1%', trades: 1234, avatar: 'TH' },
    { rank: 7, name: 'RiskMaster', profit: '+87.2%', followers: 198, winRate: '81.5%', trades: 567, avatar: 'RM' },
    { rank: 8, name: 'ProfitPilot', profit: '+76.9%', followers: 156, winRate: '70.8%', trades: 2345, avatar: 'PP' },
  ]

  if (!user) return <><Header /><main className="app-main"><div className="container" style={{textAlign:'center',paddingTop:'8rem'}}><h2>Please sign in to access copy trading</h2></div></main></>

  return (
    <>
      <Header />
      <main className="app-main">
        <div className="container">
          <div className="dash-header fade-in">
            <div>
              <h1 className="dash-header__title">Copy Trading</h1>
              <p className="dash-header__subtitle">Follow and mirror top-performing traders automatically</p>
            </div>
          </div>

          <div className="dash-stats">
            {[
              { label: 'My Copied Traders', value: '3' },
              { label: 'Total Copied Profit', value: '+$1,247.32', up: true },
              { label: 'Active Copy Trades', value: '5' },
              { label: 'Avg. Win Rate', value: '78.4%', up: true },
            ].map((s, i) => (
              <GlassCard key={i}><div className="dash-stat-card__label">{s.label}</div>
                <div className={`dash-stat-card__value ${s.up ? 'text-green' : ''}`}>{s.value}</div></GlassCard>
            ))}
          </div>

          <GlassCard>
            <div className="dash-panel__header"><h3>Top Traders Leaderboard</h3><span className="vol-panel__status">{connected ? '● Live' : '○ Connecting'}</span></div>
            <table className="dash-table">
              <thead><tr><th>#</th><th>Trader</th><th>Total Profit</th><th>Win Rate</th><th>Trades</th><th>Followers</th><th></th></tr></thead>
              <tbody>
                {topTraders.map(t => (
                  <tr key={t.rank}>
                    <td>{t.rank}</td>
                    <td><div style={{display:'flex',alignItems:'center',gap:'0.8rem'}}>
                      <div className="testimonial-card__avatar" style={{width:'3.2rem',height:'3.2rem',fontSize:'1.1rem'}}>{t.avatar}</div>
                      <strong>{t.name}</strong>
                    </div></td>
                    <td className="text-green">{t.profit}</td>
                    <td>{t.winRate}</td>
                    <td>{t.trades.toLocaleString()}</td>
                    <td>{t.followers.toLocaleString()}</td>
                    <td><button className="btn btn--primary" style={{fontSize:'1.1rem',padding:'0.4rem 1.2rem',height:'auto'}}>Copy</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </>
  )
}
