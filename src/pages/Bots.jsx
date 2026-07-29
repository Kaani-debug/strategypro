import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSimulation } from '../hooks/useSimulation'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GlassCard from '../components/GlassCard'
import BotBlockly from '../components/BotBlockly'

const STRATEGIES = [
  { id: 'visual', name: 'Visual Builder', desc: 'Drag-and-drop block-based strategy builder', icon: '🧩' },
  { id: 'martingale', name: 'Martingale', desc: 'Double stake after each loss to recover losses and profit on the first win.', icon: '📈' },
  { id: 'dalembert', name: "D'Alembert", desc: 'Increase stake by 1 unit after a loss, decrease by 1 unit after a win.', icon: '⚖️' },
  { id: 'reverse-martingale', name: 'Reverse Martingale', desc: 'Double stake after each win, reset after a loss.', icon: '🔄' },
  { id: 'reverse-dalembert', name: "Reverse D'Alembert", desc: 'Increase stake by 1 unit after a win, decrease by 1 unit after a loss.', icon: '↩️' },
  { id: 'oscars-grind', name: "Oscar's Grind", desc: 'After a win, increase stake by 1 unit; after a loss, keep stake the same.', icon: '⏳' },
  { id: '1-3-2-6', name: '1-3-2-6 Strategy', desc: 'A positive progression system using the 1-3-2-6 unit betting pattern.', icon: '🔢' },
]

export default function Bots() {
  const { user } = useAuth()
  const { botRunning, botLog, startBot, stopBot } = useSimulation()
  const [selected, setSelected] = useState('visual')
  const [config, setConfig] = useState({ stake: 10, asset: 'Vol 10', contractType: 'Rise/Fall', duration: 5, profitThreshold: 50, lossThreshold: 30, maxTrades: 10 })
  const [blockCode, setBlockCode] = useState('')

  const current = STRATEGIES.find(s => s.id === selected)

  const handleStart = () => {
    if (selected === 'visual') {
      startBot('Visual Block Strategy', { ...config, strategyCode: blockCode })
    } else {
      startBot(current.name, config)
    }
  }

  if (!user) return <><Header /><main className="app-main"><div className="container" style={{textAlign:'center',paddingTop:'8rem'}}><h2>Please sign in to create bots</h2></div></main></>

  return (
    <>
      <Header />
      <main className="app-main">
        <div className="container">
          <div className="dash-header fade-in">
            <div>
              <h1 className="dash-header__title">Bot Builder</h1>
              <p className="dash-header__subtitle">Build and deploy automated trading strategies</p>
            </div>
            <Link to="/dashboard" className="btn btn--outline">Back to Dashboard</Link>
          </div>

          <div className="bots-layout fade-in-up">
            <GlassCard className="bots-sidebar">
              <h3 className="bots-sidebar__title">Strategies</h3>
              {STRATEGIES.map(s => (
                <div key={s.id} className={`bots-strategy ${selected === s.id ? 'bots-strategy--active' : ''}`} onClick={() => !botRunning && setSelected(s.id)}>
                  <div className="bots-strategy__icon">{s.icon}</div>
                  <div>
                    <div className="bots-strategy__name">{s.name}</div>
                    <div className="bots-strategy__desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </GlassCard>

            <div className="bots-main">
              {selected === 'visual' ? (
                <GlassCard style={{marginBottom:'2rem',overflow:'hidden'}}>
                  <div className="dash-panel__header"><h3>Visual Block Builder</h3><span className="vol-panel__status">● Drag & Drop</span></div>
                  <BotBlockly onCodeGenerated={setBlockCode} onStrategyChange={(b) => console.log('blocks:', b)} />
                </GlassCard>
              ) : (
                <GlassCard style={{marginBottom:'2rem'}}>
                  <div className="dash-panel__header"><h3>Strategy: {current?.name}</h3></div>
                  <p style={{fontSize:'1.3rem',color:'var(--du-text-less-prominent)',marginBottom:'2rem',padding:'0 2rem'}}>{current?.desc}</p>
                  <div className="bots-config" style={{padding:'0 2rem 2rem'}}>
                    <div className="form-group"><label className="form-label">Asset</label>
                      <select className="form-input" value={config.asset} onChange={e => setConfig(p => ({...p, asset: e.target.value}))}>
                        {['Vol 10','Vol 25','Vol 50','Vol 75','Vol 100','Bull Market','Bear Market'].map(a => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                    <div className="form-group"><label className="form-label">Contract Type</label>
                      <select className="form-input" value={config.contractType} onChange={e => setConfig(p => ({...p, contractType: e.target.value}))}>
                        {['Rise/Fall','Match/Differ','Even/Odd','Over/Under'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="form-group"><label className="form-label">Initial Stake ($)</label><input type="number" className="form-input" value={config.stake} onChange={e => setConfig(p => ({...p, stake: Number(e.target.value)}))} /></div>
                    <div className="form-group"><label className="form-label">Duration (ticks)</label><input type="number" className="form-input" value={config.duration} onChange={e => setConfig(p => ({...p, duration: Number(e.target.value)}))} /></div>
                    <div className="form-group"><label className="form-label">Profit Threshold ($)</label><input type="number" className="form-input" value={config.profitThreshold} onChange={e => setConfig(p => ({...p, profitThreshold: Number(e.target.value)}))} /></div>
                    <div className="form-group"><label className="form-label">Max Trades</label><input type="number" className="form-input" value={config.maxTrades} onChange={e => setConfig(p => ({...p, maxTrades: Number(e.target.value)}))} /></div>
                  </div>
                </GlassCard>
              )}

              <div className="bots-controls fade-in-up" style={{display:'flex',gap:'1rem',marginBottom:'2rem'}}>
                {!botRunning ? (
                  <button className="btn btn--primary btn--lg glow-btn" onClick={handleStart}>▶ Start Bot</button>
                ) : (
                  <button className="btn btn--outline btn--lg" style={{borderColor:'var(--du-text-loss-danger)',color:'var(--du-text-loss-danger)'}} onClick={stopBot}>⏹ Stop Bot</button>
                )}
                <button className="btn btn--ghost btn--lg" onClick={() => setConfig({...config})}>Reset Config</button>
              </div>

              <GlassCard>
                <div className="dash-panel__header"><h3>Bot Journal</h3>{botRunning && <span className="vol-panel__status">● Running</span>}</div>
                <div className="bot-log">
                  {botLog.length === 0 ? (
                    <div className="bot-log__empty">Start the bot to see activity logs</div>
                  ) : (
                    botLog.map((log, i) => <div className="bot-log__entry" key={i}>{log}</div>)
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
