import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ open, onClose }) {
  const { login, register } = useAuth()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const res = tab === 'login'
      ? login(form.email, form.password)
      : register({ email: form.email, password: form.password, name: form.name })
    if (res.error) setError(res.error)
    else onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal glass-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="auth-modal__header">
          <div className="auth-modal__tabs">
            <button className={`auth-modal__tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
            <button className={`auth-modal__tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Sign Up</button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="btn btn--primary auth-form__btn btn--lg">
            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
          <div className="auth-modal__hint">
            Demo accounts: <strong>demo@strategypro.com</strong> / <strong>demo123</strong>
          </div>
        </form>
      </div>
    </div>
  )
}
