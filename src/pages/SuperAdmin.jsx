import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GlassCard from '../components/GlassCard'

export default function SuperAdmin() {
  const { user, users, updateUser } = useAuth()
  const [config, setConfig] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sp_config')) || {} } catch { return {} }
  })
  const [saved, setSaved] = useState('')

  useEffect(() => { localStorage.setItem('sp_config', JSON.stringify(config)) }, [config])

  if (!user || user.role !== 'superadmin') {
    return <div className="admin-layout"><SuperSidebar /><main className="admin-main"><h2>Super Admin access required.</h2></main></div>
  }

  const handleSave = (section) => { setSaved(`${section} saved!`); setTimeout(() => setSaved(''), 2000) }

  const registry = [
    { key: 'app_version', val: '2.0.0' },
    { key: 'platform_name', val: 'StrategyPro' },
    { key: 'oauth_provider', val: 'Deriv' },
    { key: 'ws_endpoint', val: config.wsEndpoint || 'wss://ws.derivws.com/websockets/v3' },
    { key: 'oauth_uri', val: config.oauthUri || 'oauth.deriv.com' },
    { key: 'default_demo_balance', val: `$${(config.demoBalance || 10000).toLocaleString()}` },
    { key: 'maintenance_mode', val: config.maintenance ? 'Enabled' : 'Disabled' },
    { key: 'max_bots_per_user', val: String(config.maxBots || 10) },
  ]

  const adminUsers = users.filter(u => ['admin', 'superadmin'].includes(u.role))

  return (
    <div className="admin-layout">
      <SuperSidebar />
      <main className="admin-main">
        <div className="admin-header fade-in">
          <div>
            <h1 className="admin-header__title">Super Admin Panel</h1>
            <p className="admin-header__subtitle">Full system configuration and platform control</p>
          </div>
          {saved && <div className="text-green" style={{fontWeight:500}}>✓ {saved}</div>}
        </div>

        <div className="dash-grid" style={{gridTemplateColumns:'repeat(3, 1fr)',gap:'2rem'}}>
          <GlassCard>
            <div className="dash-panel__header"><h3>System Health</h3></div>
            <div style={{padding:'1.6rem'}}>
              {[
                { label: 'Server Status', value: 'Online', color: 'var(--du-text-profit-success)' },
                { label: 'WebSocket', value: config.maintenance ? 'Maintenance' : 'Connected', color: config.maintenance ? 'var(--du-text-warning)' : 'var(--du-text-profit-success)' },
                { label: 'API Latency', value: '24ms' },
                { label: 'Active Users', value: users.filter(u => u.status === 'active').length },
                { label: 'Uptime', value: '99.97%', color: 'var(--du-text-profit-success)' },
              ].map((r, i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'0.8rem 0',borderBottom:'1px solid var(--du-general-active)'}}>
                  <span style={{color:'var(--du-text-less-prominent)',fontSize:'1.2rem'}}>{r.label}</span>
                  <span style={{fontWeight:500,fontSize:'1.3rem',color: r.color || 'inherit'}}>{r.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="dash-panel__header"><h3>Platform Configuration</h3></div>
            <div style={{padding:'1.6rem'}}>
              <div className="form-group" style={{marginBottom:'1.2rem'}}>
                <label className="form-label">Maintenance Mode</label>
                <select className="form-input" value={config.maintenance ? 'true' : 'false'} onChange={e => setConfig(p => ({...p, maintenance: e.target.value === 'true'}))}>
                  <option value="false">Disabled</option>
                  <option value="true">Enabled</option>
                </select>
              </div>
              <div className="form-group" style={{marginBottom:'1.2rem'}}>
                <label className="form-label">Default Starting Balance ($)</label>
                <input type="number" className="form-input" value={config.demoBalance || 10000} onChange={e => setConfig(p => ({...p, demoBalance: Number(e.target.value)}))} />
              </div>
              <div className="form-group" style={{marginBottom:'1.2rem'}}>
                <label className="form-label">Max Bots Per User</label>
                <input type="number" className="form-input" value={config.maxBots || 10} onChange={e => setConfig(p => ({...p, maxBots: Number(e.target.value)}))} />
              </div>
              <button className="btn btn--primary" style={{width:'100%',justifyContent:'center'}} onClick={() => handleSave('Config')}>Save Configuration</button>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="dash-panel__header"><h3>API Configuration</h3></div>
            <div style={{padding:'1.6rem'}}>
              <div className="form-group" style={{marginBottom:'1.2rem'}}>
                <label className="form-label">WebSocket Endpoint</label>
                <input className="form-input" value={config.wsEndpoint || ''} placeholder="wss://ws.derivws.com/..." onChange={e => setConfig(p => ({...p, wsEndpoint: e.target.value}))} />
              </div>
              <div className="form-group" style={{marginBottom:'1.2rem'}}>
                <label className="form-label">OAuth URI</label>
                <input className="form-input" value={config.oauthUri || ''} placeholder="oauth.deriv.com" onChange={e => setConfig(p => ({...p, oauthUri: e.target.value}))} />
              </div>
              <button className="btn btn--primary" style={{width:'100%',justifyContent:'center'}} onClick={() => handleSave('API')}>Save API Settings</button>
            </div>
          </GlassCard>
        </div>

        <div className="dash-grid" style={{gridTemplateColumns:'1fr 1fr',gap:'2rem',marginTop:'2rem'}}>
          <GlassCard>
            <div className="dash-panel__header"><h3>System Registry</h3></div>
            <div style={{padding:'1.6rem'}}>
              {registry.map((r, i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'0.8rem 0',borderBottom:'1px solid var(--du-general-active)',fontSize:'1.2rem'}}>
                  <span style={{color:'var(--du-text-less-prominent)'}}>{r.key}</span>
                  <span style={{fontWeight:500}}>{r.val}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="dash-panel__header"><h3>Admin Accounts ({adminUsers.length})</h3></div>
            <div style={{padding:'1.6rem'}}>
              {adminUsers.map(u => (
                <div key={u.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.8rem 0',borderBottom:'1px solid var(--du-general-active)'}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:'1.3rem'}}>{u.name}</div>
                    <div style={{fontSize:'1.1rem',color:'var(--du-text-less-prominent)'}}>{u.email} · {u.role}</div>
                  </div>
                  <span className="badge badge--won">{u.status}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  )
}

function SuperSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <aside className="admin-sidebar">
      <Link to="/" className="header__logo" style={{margin:'2rem',fontSize:'1.8rem'}}>Strategy<span>Pro</span></Link>
      <div style={{padding:'0 2rem',marginBottom:'1rem',fontSize:'1.1rem',color:'rgba(255,255,255,0.5)'}}>{user?.role?.toUpperCase()}</div>
      <nav className="admin-nav">
        <Link to="/admin/dashboard" className="admin-nav__link">Dashboard</Link>
        <Link to="/admin/flossin" className="admin-nav__link">Users</Link>
        <Link to="/admin/flossin" className="admin-nav__link">Bots</Link>
        <Link to="/admin/superadmin" className="admin-nav__link admin-nav__link--active">Super Admin</Link>
      </nav>
      <div style={{marginTop:'auto',padding:'1rem'}}>
        <Link to="/" className="admin-nav__link admin-nav__link--back">← Site</Link>
        <button onClick={() => { logout(); navigate('/admin/login') }} className="admin-nav__link" style={{background:'none',border:'none',width:'100%',textAlign:'left',color:'rgba(255,255,255,0.5)'}}>Logout</button>
      </div>
    </aside>
  )
}
