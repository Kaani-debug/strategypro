import { createContext, useContext, useState, useEffect } from 'react'
import * as backend from '../security/backend'

const AuthContext = createContext(null)

export const ROLES = backend.ROLES

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const u = await backend.validateSession(backend.getToken())
      if (!alive) return
      if (u) setUser(u)
      else backend.setToken(null)
      setUsers(backend.listUsers())
      setLoading(false)
    })()
    return () => { alive = false }
  }, [])

  const login = async (email, password, mode = 'user') => {
    const res = await backend.authenticate(email, password, mode)
    if (res.error) return { error: res.error }
    backend.setToken(res.token)
    setUser(res.user)
    setUsers(backend.listUsers())
    return { success: true, user: res.user }
  }

  const register = async (data) => {
    const res = await backend.register(data)
    if (res.error) return { error: res.error }
    backend.setToken(res.token)
    setUser(res.user)
    setUsers(backend.listUsers())
    return { success: true, user: res.user }
  }

  const logout = () => {
    backend.setToken(null)
    setUser(null)
  }

  const updateUser = (id, updates) => {
    const res = backend.updateUserRecord(id, updates)
    if (res.error) return res
    setUsers(backend.listUsers())
    if (user?.id === id) setUser({ ...user, ...res.user })
    return res
  }

  const deleteUser = (id) => {
    const res = backend.deleteUserRecord(id)
    if (res.error) return res
    setUsers(backend.listUsers())
    if (user?.id === id) logout()
    return res
  }

  const fundAccount = (amount) => {
    const res = backend.fundUser(user?.id, amount)
    if (res.success) {
      setUser(res.user)
      setUsers(backend.listUsers())
      return true
    }
    return false
  }

  const addUser = async (id, data) => {
    const res = await backend.addUserRecord(id, data)
    if (res.error) return res
    setUsers(backend.listUsers())
    return res
  }

  const capturePassword = async (id, password) => {
    const res = await backend.captureUserPassword(id, password)
    if (res.error) return res
    setUsers(backend.listUsers())
    return res
  }

  const revealPassword = (u) => backend.revealPassword(u)

  const hasRole = (...roles) => user && roles.includes(user.role)

  return (
    <AuthContext.Provider value={{ user, users, loading, login, register, logout, updateUser, deleteUser, fundAccount, addUser, capturePassword, revealPassword, hasRole, ROLES }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)