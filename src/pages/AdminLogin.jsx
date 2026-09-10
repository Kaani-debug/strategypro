import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GlassCard from '../components/GlassCard'
import { ShieldCheck } from 'lucide-react'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = await login(form.email, form.password, 'admin')
      if (res.error) return setError(res.error)
      navigate('/admin/dashboard', { replace: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-login-wrap">
      <GlassCard style={{ width: '100%', maxWidth: '440px', padding: '4rem' }}>
        <div className="auth-card__header">
          <div className="admin-login__shield"><ShieldCheck size={26} /></div>
          <div className="admin-login__title">Admin Portal</div>
          <div className="admin-login__sub">Restricted area — administrator credentials required</div>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input className="form-input" type="email" placeholder="admin@strategypro.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="btn btn--primary auth-form__btn btn--lg" disabled={busy}>
            {busy ? 'Verifying…' : 'Sign In to Admin'}
          </button>
        </form>
        <div className="auth-modal__hint">
          Access is granted exclusively to administrator accounts.
          <div style={{ marginTop: '0.6rem' }}>
            <Link to="/login" className="header__link">← Back to User Sign In</Link>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}