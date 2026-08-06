import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GlassCard from '../components/GlassCard'

export default function AdminDashboard() {
  const { user, users, updateUser, deleteUser } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})

  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    return <div className="admin-layout"><AdminSidebar /><main className="admin-main"><h2>Access denied. Admin privileges required.</h2></main></div>
  }

  const activeUsers = users.filter(u => u.status === 'active').length
  const totalBots = users.reduce((s, u) => s + (u.bots || 0), 0)
  const totalBalance = users.reduce((s, u) => s + (u.balance || 0), 0)

  const handleEdit = (u) => { setEditing(u.id); setEditForm({ name: u.name, email: u.email, role: u.role, status: u.status, balance: u.balance }) }
  const handleSave = (id) => { updateUser(id, editForm); setEditing(null) }
  const handleDelete = (id) => { if (confirm('Delete this user?')) deleteUser(id) }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header fade-in">
          <div>
            <h1 className="admin-header__title">Admin Dashboard</h1>
            <p className="admin-header__subtitle">Platform management and user oversight</p>
          </div>
          <div className="admin-header__meta">
            <GlassCard style={{padding:'1rem 2rem',display:'flex',gap:'2rem'}}>
              <span>Users: <strong>{users.length}</strong></span>
              <span>Active: <strong className="text-green">{activeUsers}</strong></span>
              <span>Bots: <strong>{totalBots}</strong></span>
              <span>Volume: <strong>${(totalBalance / 1000).toFixed(1)}K</strong></span>
            </GlassCard>
          </div>
        </div>

        <GlassCard>
          <div className="dash-panel__header">
            <h3>User Management ({users.length} total)</h3>
            <button className="btn btn--primary" style={{fontSize:'1.1rem',padding:'0.4rem 1.2rem',height:'auto'}} onClick={() => navigate('/flossin-admin')}>Manage All</button>
          </div>
          <table className="dash-table">
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Bots</th><th>Balance</th><th></th></tr></thead>
            <tbody>
              {users.slice(0, 8).map(u => (
                <tr key={u.id}>
                  {editing === u.id ? (
                    <>
                      <td>{u.id}</td>
                      <td><input className="form-input" style={{padding:'0.4rem',fontSize:'1.2rem'}} value={editForm.name} onChange={e => setEditForm(p => ({...p, name: e.target.value}))} /></td>
                      <td><input className="form-input" style={{padding:'0.4rem',fontSize:'1.2rem'}} value={editForm.email} onChange={e => setEditForm(p => ({...p, email: e.target.value}))} /></td>
                      <td><select className="form-input" style={{padding:'0.4rem',fontSize:'1.2rem'}} value={editForm.role} onChange={e => setEditForm(p => ({...p, role: e.target.value}))}>
                        {['user','admin','superadmin'].map(r => <option key={r}>{r}</option>)}
                      </select></td>
                      <td><select className="form-input" style={{padding:'0.4rem',fontSize:'1.2rem'}} value={editForm.status} onChange={e => setEditForm(p => ({...p, status: e.target.value}))}>
                        {['active','suspended','inactive'].map(s => <option key={s}>{s}</option>)}
                      </select></td>
                      <td>{u.bots}</td>
                      <td><input className="form-input" style={{padding:'0.4rem',fontSize:'1.2rem',width:'100px'}} type="number" value={editForm.balance} onChange={e => setEditForm(p => ({...p, balance: Number(e.target.value)}))} /></td>
                      <td>
                        <button className="btn btn--ghost" style={{fontSize:'1.1rem'}} onClick={() => handleSave(u.id)}>💾</button>
                        <button className="btn btn--ghost" style={{fontSize:'1.1rem'}} onClick={() => setEditing(null)}>✕</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{u.id}</td>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td><span className={`badge badge--${u.role === 'superadmin' ? 'won' : u.role === 'admin' ? 'active' : ''}`}>{u.role}</span></td>
                      <td><span className={`badge badge--${u.status === 'active' ? 'won' : u.status === 'suspended' ? 'lost' : 'active'}`}>{u.status}</span></td>
                      <td>{u.bots}</td>
                      <td>${u.balance?.toLocaleString()}</td>
                      <td>
                        <button className="btn btn--ghost" style={{fontSize:'1.1rem'}} onClick={() => handleEdit(u)}>✏️</button>
                        <button className="btn btn--ghost" style={{fontSize:'1.1rem',color:'var(--du-text-loss-danger)'}} onClick={() => handleDelete(u.id)}>🗑️</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </main>
    </div>
  )
}

function AdminSidebar() {
  const { user, logout } = useAuth()
  return (
    <aside className="admin-sidebar">
      <Link to="/" className="header__logo" style={{margin:'2rem',fontSize:'1.8rem'}}>Strategy<span>Pro</span></Link>
      <div style={{padding:'0 2rem',marginBottom:'1rem',fontSize:'1.1rem',color:'rgba(255,255,255,0.5)'}}>{user?.role?.toUpperCase()}</div>
      <nav className="admin-nav">
        <Link to="/admindata" className="admin-nav__link admin-nav__link--active">Dashboard</Link>
        <Link to="/flossin-admin" className="admin-nav__link">Users</Link>
        <Link to="/flossin-admin" className="admin-nav__link">Bots</Link>
        <Link to="/superadmin" className="admin-nav__link">Settings</Link>
        <Link to="/superadmin" className="admin-nav__link">Super Admin</Link>
      </nav>
      <div style={{marginTop:'auto',padding:'1rem'}}>
        <Link to="/" className="admin-nav__link admin-nav__link--back">← Site</Link>
        <button onClick={logout} className="admin-nav__link" style={{background:'none',border:'none',width:'100%',textAlign:'left',color:'rgba(255,255,255,0.5)'}}>Logout</button>
      </div>
    </aside>
  )
}
