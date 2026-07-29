import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GlassCard from '../components/GlassCard'

export default function FlossinAdmin() {
  const { user, users, updateUser, deleteUser } = useAuth()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', email: '', password: 'pass123', role: 'user' })

  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    return <div className="admin-layout"><AdminSidebar2 /><main className="admin-main"><h2>Access denied.</h2></main></div>
  }

  const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()) || u.id?.toLowerCase().includes(search))

  const handleEdit = (u) => { setEditing(u.id); setEditForm({ name: u.name, email: u.email, role: u.role, status: u.status, balance: u.balance }) }
  const handleSave = (id) => { updateUser(id, editForm); setEditing(null) }
  const handleAdd = () => {
    const nu = { id: 'U' + String(users.length + 1).padStart(3, '0'), ...addForm, status: 'active', bots: 0, balance: 10000, avatar: addForm.name.split(' ').map(n => n[0]).join(''), createdAt: new Date().toISOString().split('T')[0] }
    updateUser(nu.id, nu)
    setShowAdd(false); setAddForm({ name: '', email: '', password: 'pass123', role: 'user' })
  }

  const totalBots = users.reduce((s, u) => s + (u.bots || 0), 0)
  const totalProfit = users.reduce((s, u) => s + ((u.balance || 0) - 10000 > 0 ? (u.balance - 10000) : 0), 0)

  return (
    <div className="admin-layout">
      <AdminSidebar2 />
      <main className="admin-main">
        <div className="admin-header fade-in">
          <div>
            <h1 className="admin-header__title">Flossin Admin Panel</h1>
            <p className="admin-header__subtitle">Full user and bot management</p>
          </div>
        </div>

          <div className="dash-grid fade-in-up" style={{gridTemplateColumns:'repeat(3, 1fr)',marginBottom:'2rem'}}>
          <GlassCard glow style={{padding:'1.6rem',textAlign:'center'}}>
            <div style={{fontSize:'2.4rem',fontWeight:700,color:'var(--du-brand-red-coral)'}}>{users.length}</div>
            <div style={{fontSize:'1.2rem',color:'var(--du-text-less-prominent)'}}>Total Users</div>
          </GlassCard>
          <GlassCard glow style={{padding:'1.6rem',textAlign:'center'}}>
            <div style={{fontSize:'2.4rem',fontWeight:700,color:'var(--du-text-profit-success)'}}>{totalBots}</div>
            <div style={{fontSize:'1.2rem',color:'var(--du-text-less-prominent)'}}>Running Bots</div>
          </GlassCard>
          <GlassCard glow style={{padding:'1.6rem',textAlign:'center'}}>
            <div style={{fontSize:'2.4rem',fontWeight:700,color:'var(--du-text-profit-success)'}}>${totalProfit.toLocaleString()}</div>
            <div style={{fontSize:'1.2rem',color:'var(--du-text-less-prominent)'}}>Total Profit Generated</div>
          </GlassCard>
        </div>

        <GlassCard className="fade-in-up">
          <div className="dash-panel__header">
            <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
              <h3>All Users ({filtered.length})</h3>
              <input className="form-input" style={{width:'200px',padding:'0.4rem 1rem',fontSize:'1.2rem'}} placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn--primary" style={{fontSize:'1.1rem',padding:'0.4rem 1.2rem',height:'auto'}} onClick={() => setShowAdd(true)}>+ Add User</button>
          </div>

          {showAdd && (
            <div style={{padding:'1.6rem 2rem',borderBottom:'1px solid var(--du-general-active)',display:'flex',gap:'1rem',alignItems:'flex-end',background:'var(--du-general-section-1)'}}>
              <div className="form-group" style={{flex:1}}><label className="form-label">Name</label><input className="form-input" style={{padding:'0.6rem',fontSize:'1.2rem'}} value={addForm.name} onChange={e => setAddForm(p => ({...p, name: e.target.value}))} /></div>
              <div className="form-group" style={{flex:1}}><label className="form-label">Email</label><input className="form-input" style={{padding:'0.6rem',fontSize:'1.2rem'}} value={addForm.email} onChange={e => setAddForm(p => ({...p, email: e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Role</label><select className="form-input" style={{padding:'0.6rem',fontSize:'1.2rem'}} value={addForm.role} onChange={e => setAddForm(p => ({...p, role: e.target.value}))}>
                {['user','admin','superadmin'].map(r => <option key={r}>{r}</option>)}
              </select></div>
              <button className="btn btn--primary" style={{fontSize:'1.1rem',padding:'0.6rem 1.2rem',height:'auto'}} onClick={handleAdd}>Create</button>
              <button className="btn btn--ghost" style={{fontSize:'1.1rem'}} onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          )}

          <table className="dash-table">
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Bots</th><th>Balance</th><th>Created</th><th></th></tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  {editing === u.id ? (
                    <>
                      <td>{u.id}</td>
                      <td><input className="form-input" style={{padding:'0.3rem',fontSize:'1.1rem'}} value={editForm.name} onChange={e => setEditForm(p => ({...p, name: e.target.value}))} /></td>
                      <td><input className="form-input" style={{padding:'0.3rem',fontSize:'1.1rem'}} value={editForm.email} onChange={e => setEditForm(p => ({...p, email: e.target.value}))} /></td>
                      <td><select className="form-input" style={{padding:'0.3rem',fontSize:'1.1rem'}} value={editForm.role} onChange={e => setEditForm(p => ({...p, role: e.target.value}))}>
                        {['user','admin','superadmin'].map(r => <option key={r}>{r}</option>)}
                      </select></td>
                      <td><select className="form-input" style={{padding:'0.3rem',fontSize:'1.1rem'}} value={editForm.status} onChange={e => setEditForm(p => ({...p, status: e.target.value}))}>
                        {['active','suspended','inactive'].map(s => <option key={s}>{s}</option>)}
                      </select></td>
                      <td>{u.bots}</td>
                      <td><input className="form-input" style={{padding:'0.3rem',fontSize:'1.1rem',width:'80px'}} type="number" value={editForm.balance} onChange={e => setEditForm(p => ({...p, balance: Number(e.target.value)}))} /></td>
                      <td>{u.createdAt}</td>
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
                      <td style={{fontSize:'1.1rem',color:'var(--du-text-less-prominent)'}}>{u.createdAt}</td>
                      <td>
                        <button className="btn btn--ghost" style={{fontSize:'1.1rem'}} onClick={() => handleEdit(u)}>✏️</button>
                        <button className="btn btn--ghost" style={{fontSize:'1.1rem',color:'var(--du-text-loss-danger)'}} onClick={() => deleteUser(u.id)}>🗑️</button>
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

function AdminSidebar2() {
  const { user, logout } = useAuth()
  return (
    <aside className="admin-sidebar">
      <Link to="/" className="header__logo" style={{margin:'2rem',fontSize:'1.8rem'}}>Strategy<span>Pro</span></Link>
      <div style={{padding:'0 2rem',marginBottom:'1rem',fontSize:'1.1rem',color:'rgba(255,255,255,0.5)'}}>{user?.role?.toUpperCase()}</div>
      <nav className="admin-nav">
        <Link to="/admindata" className="admin-nav__link">Dashboard</Link>
        <Link to="/flossin-admin" className="admin-nav__link admin-nav__link--active">Users</Link>
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
