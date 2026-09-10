import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GlassCard from '../components/GlassCard'

export default function Login() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [tab, setTab] = useState('login')
  const [adminMode, setAdminMode] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (adminMode) {
      const res = login(form.email, form.password)
      if (res.error) return setError(res.error)
      if (!['admin', 'superadmin'].includes(res.user.role)) return setError('Admin access requires an administrator account.')
      return navigate('/admindata')
    }
    const res = tab === 'login' ? login(form.email, form.password) : register({ email: form.email, password: form.password, name: form.name })
    if (res.error) setError(res.error)
    else navigate('/app')
  }

  return (
    <>
      <Header />
      <main className="app-main">
        <div className="auth-page">
          <GlassCard style={{width:'100%',maxWidth:'440px',padding:'4rem'}}>
            <div className="auth-card__header">
              <div style={{fontSize:'2.4rem',fontWeight:700,marginBottom:'2rem'}}>Strategy<span style={{color:'var(--du-brand-red-coral)'}}>Pro</span></div>
              {adminMode ? (
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.8rem',marginBottom:'2rem'}}>
                  <div className="auth-modal__tabs">
                    <button type="button" className="auth-modal__tab active">Admin Portal</button>
                  </div>
                  <button type="button" className="auth-link" onClick={() => setAdminMode(false)}>← Back to User Sign In</button>
                </div>
              ) : (
                <div className="auth-modal__tabs" style={{marginBottom:'2rem'}}>
                  <button className={`auth-modal__tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
                  <button className={`auth-modal__tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Sign Up</button>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
              {!adminMode && tab === 'register' && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required />
              </div>
              {error && <div className="auth-error">{error}</div>}
              <button type="submit" className="btn btn--primary auth-form__btn btn--lg">
                {adminMode ? 'Admin Sign In' : tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            {adminMode ? (
              <div style={{textAlign:'center',fontSize:'1.1rem',color:'var(--du-text-less-prominent)',marginTop:'2rem'}}>
                Only administrator accounts can access the admin panel.
              </div>
            ) : (
              <div style={{textAlign:'center',fontSize:'1.1rem',color:'var(--du-text-less-prominent)',marginTop:'2rem'}}>
                Sign in to your real account to start trading with funded money.
                <div style={{marginTop:'0.6rem'}}>
                  <button type="button" className="auth-link" onClick={() => setAdminMode(true)}>Admin Login (restricted)</button>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </main>
      <Footer />
    </>
  )
}
