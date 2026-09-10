import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GlassCard from '../components/GlassCard'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register, user } = useAuth()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = tab === 'login'
        ? await login(form.email, form.password)
        : await register({ email: form.email, password: form.password, name: form.name })
      if (res.error) return setError(res.error)
      const from = location.state?.from
      navigate(from && from.startsWith('/dashboard') === false && !from.startsWith('/admin') ? from : '/dashboard', { replace: true })
    } finally {
      setBusy(false)
    }
  }

  if (user) return null

  return (
    <>
      <Header />
      <main className="app-main">
        <div className="auth-page">
          <GlassCard style={{width:'100%',maxWidth:'440px',padding:'4rem'}}>
            <div className="auth-card__header">
              <div style={{fontSize:'2.4rem',fontWeight:700,marginBottom:'2rem'}}>Strategy<span style={{color:'var(--du-brand-red-coral)'}}>Pro</span></div>
              <div className="auth-modal__tabs" style={{marginBottom:'2rem'}}>
                <button className={`auth-modal__tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
                <button className={`auth-modal__tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Sign Up</button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
              {tab === 'register' && (
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
              <button type="submit" className="btn btn--primary auth-form__btn btn--lg" disabled={busy}>
                {busy ? 'Verifying…' : tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
              <div className="auth-modal__hint">
                {tab === 'login' ? 'User login for regular accounts. Traders only.' : 'Register a regular user account (role: user).'}
              </div>
            </form>
            <div style={{textAlign:'center',fontSize:'1.1rem',color:'var(--du-text-less-prominent)',marginTop:'2rem'}}>
              <Link to="/admin/login" className="auth-link">Admin Login</Link>
            </div>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </>
  )
}