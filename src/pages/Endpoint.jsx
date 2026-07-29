import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Endpoint() {
  const [appId, setAppId] = useState('')
  const [serverUrl, setServerUrl] = useState('wss://ws.derivws.com/websockets/v3?app_id=')
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    localStorage.setItem('deriv_app_id', appId)
    localStorage.setItem('deriv_server_url', serverUrl)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <>
      <Header />
      <main className="app-main">
        <div className="container" style={{maxWidth:'600px',margin:'0 auto',paddingTop:'8rem'}}>
          <div className="dash-header" style={{marginBottom:'3rem'}}>
            <div>
              <h1 className="dash-header__title">API Endpoint</h1>
              <p className="dash-header__subtitle">Configure your Deriv API connection</p>
            </div>
            <Link to="/dashboard" className="btn btn--outline" style={{fontSize:'1.2rem',padding:'0.6rem 1.6rem',height:'auto'}}>Back</Link>
          </div>

          <div className="dash-panel">
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">OAuth App ID</label>
                <input type="text" className="form-input" placeholder="e.g. 12345" value={appId} onChange={e => setAppId(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Server URL</label>
                <input type="text" className="form-input" value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
              </div>
              <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
                <button type="submit" className="btn btn--primary">Save Configuration</button>
                {saved && <span style={{color:'var(--du-text-profit-success)',fontSize:'1.3rem'}}>✓ Saved successfully</span>}
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
