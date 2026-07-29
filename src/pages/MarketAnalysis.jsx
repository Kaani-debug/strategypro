import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSimulation } from '../hooks/useSimulation'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GlassCard from '../components/GlassCard'

export default function MarketAnalysis() {
  const { user } = useAuth()
  const { prices, connected, getDirection, SYMBOLS } = useSimulation()

  const markets = SYMBOLS.map(sym => {
    const price = prices[sym] || 0
    const dir = getDirection(sym)
    const change = (Math.random() * 10 - 2).toFixed(2)
    const changePct = (Math.random() * 0.5 - 0.1).toFixed(2)
    return { pair: sym, price, change, changePct, dir }
  })

  if (!user) return <><Header /><main className="app-main"><div className="container" style={{textAlign:'center',paddingTop:'8rem'}}><h2>Please sign in to access market analysis</h2></div></main></>

  return (
    <>
      <Header />
      <main className="app-main">
        <div className="container">
          <div className="dash-header fade-in">
            <div>
              <h1 className="dash-header__title">Market Analysis</h1>
              <p className="dash-header__subtitle">Real-time market data and volatility indices</p>
            </div>
          </div>

          <GlassCard glow className="fade-in-up" style={{marginBottom:'2rem'}}>
            <div className="dash-panel__header"><h3>Volatility Indices</h3><span className={`vol-panel__status ${connected ? '' : 'connecting'}`}>{connected ? '● Live' : '○ Connecting'}</span></div>
            <table className="dash-table">
              <thead><tr><th>Symbol</th><th>Price</th><th>Change</th><th>Change %</th><th>Direction</th></tr></thead>
              <tbody>
                {markets.map((m, i) => (
                  <tr key={i}>
                    <td><strong>{m.pair}</strong></td>
                    <td>{m.price.toFixed(4)}</td>
                    <td className={Number(m.change) >= 0 ? 'text-green' : 'text-red'}>{Number(m.change) >= 0 ? '+' : ''}{m.change}</td>
                    <td className={Number(m.changePct) >= 0 ? 'text-green' : 'text-red'}>{Number(m.changePct) >= 0 ? '+' : ''}{m.changePct}%</td>
                    <td><span className={`badge badge--${m.dir === 'up' ? 'won' : 'lost'}`}>{m.dir === 'up' ? '▲ Rise' : '▼ Fall'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>

          <div className="features__grid fade-in-up">
            {[
              { icon: '📈', title: 'Rise/Fall Analysis', text: 'Analyze price movements to predict rise or fall patterns based on recent tick data.' },
              { icon: '🔢', title: 'Digit Analysis', text: 'Track last digit patterns including even/odd, over/under, and match/differ probabilities.' },
              { icon: '📊', title: 'OHLC Data', text: 'Access Open, High, Low, Close data for detailed technical analysis and charting.' },
              { icon: '📉', title: 'Tick History', text: 'Review historical tick data to backtest strategies and identify trading patterns.' },
            ].map((f, i) => (
              <GlassCard key={i} glow style={{cursor:'pointer',animationDelay:`${i*0.1}s`}} className="fade-in-up">
                <div className="feature-card__icon">{f.icon}</div>
                <div className="feature-card__title">{f.title}</div>
                <p className="feature-card__text">{f.text}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
