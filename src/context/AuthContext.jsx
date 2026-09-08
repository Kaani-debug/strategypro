import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const ROLES = { USER: 'user', ADMIN: 'admin', SUPERADMIN: 'superadmin' }

const MOCK_USERS = [
  { id: 'U002', email: 'admin@strategypro.com', password: 'admin123', name: 'Admin User', role: 'admin', avatar: 'AU', createdAt: '2024-11-01', status: 'active', bots: 0, balance: 50000 },
  { id: 'U003', email: 'super@strategypro.com', password: 'super123', name: 'Super Admin', role: 'superadmin', avatar: 'SA', createdAt: '2024-06-01', status: 'active', bots: 0, balance: 100000 },
  { id: 'U004', email: 'john@example.com', password: 'pass123', name: 'John Doe', role: 'user', avatar: 'JD', createdAt: '2025-03-10', status: 'active', bots: 3, balance: 12450 },
  { id: 'U005', email: 'jane@example.com', password: 'pass123', name: 'Jane Smith', role: 'user', avatar: 'JS', createdAt: '2025-02-20', status: 'active', bots: 5, balance: 24800 },
  { id: 'U006', email: 'bob@example.com', password: 'pass123', name: 'Bob Wilson', role: 'user', avatar: 'BW', createdAt: '2025-04-05', status: 'suspended', bots: 1, balance: 3200 },
  { id: 'U007', email: 'alice@example.com', password: 'pass123', name: 'Alice Brown', role: 'user', avatar: 'AB', createdAt: '2025-01-25', status: 'active', bots: 2, balance: 8900 },
  { id: 'U008', email: 'alex@strategypro.com', password: 'admin123', name: 'Alex Manager', role: 'admin', avatar: 'AM', createdAt: '2024-12-01', status: 'active', bots: 0, balance: 25000 },
]

function loadUsers() {
  try {
    const saved = localStorage.getItem('sp_users')
    if (saved) {
      const parsed = JSON.parse(saved)
      return parsed.filter(u => u.email !== 'demo@strategypro.com')
    }
  } catch {}
  return MOCK_USERS
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(loadUsers)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    localStorage.setItem('sp_users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    const token = localStorage.getItem('sp_token')
    if (token) {
      try {
        const u = JSON.parse(token)
        const fresh = users.find(x => x.id === u.id)
        if (fresh && fresh.status === 'active') setUser(fresh)
        else { localStorage.removeItem('sp_token'); setUser(null) }
      } catch { localStorage.removeItem('sp_token') }
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) return { error: 'Invalid email or password' }
    if (found.status === 'suspended') return { error: 'Account suspended. Contact support.' }
    const { password: _, ...safe } = found
    setUser(safe)
    localStorage.setItem('sp_token', JSON.stringify(safe))
    return { success: true, user: safe }
  }

  const register = (data) => {
    if (users.find(u => u.email === data.email)) return { error: 'Email already registered' }
    const maxId = users.reduce((m, u) => Math.max(m, parseInt((u.id || 'U0').slice(1), 10) || 0), 0)
    const nu = { id: 'U' + String(maxId + 1).padStart(3, '0'), ...data, role: 'user', status: 'active', bots: 0, balance: 0, avatar: data.name.split(' ').map(n => n[0]).join(''), createdAt: new Date().toISOString().split('T')[0] }
    setUsers(p => [...p, nu])
    const { password: _, ...safe } = nu
    setUser(safe)
    localStorage.setItem('sp_token', JSON.stringify(safe))
    return { success: true, user: safe }
  }

  const logout = () => { setUser(null); localStorage.removeItem('sp_token') }

  const updateUser = (id, updates) => {
    setUsers(p => p.map(u => u.id === id ? { ...u, ...updates } : u))
    if (user?.id === id) setUser(p => ({ ...p, ...updates }))
  }

  const fundAccount = (amount) => {
    const amt = Math.round(Number(amount) * 100) / 100
    if (!user || !amt || amt <= 0) return false
    const nextBalance = Math.round((user.balance + amt) * 100) / 100
    setUsers(p => p.map(u => (u.id === user.id ? { ...u, balance: nextBalance } : u)))
    setUser(p => (p ? { ...p, balance: nextBalance } : p))
    return true
  }

  const deleteUser = (id) => {
    setUsers(p => p.filter(u => u.id !== id))
    if (user?.id === id) logout()
  }

  const hasRole = (...roles) => user && roles.includes(user.role)

  return (
    <AuthContext.Provider value={{ user, users, loading, login, register, logout, updateUser, deleteUser, fundAccount, hasRole, ROLES, setUsers }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
