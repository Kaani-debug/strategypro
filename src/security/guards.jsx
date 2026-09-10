import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, ROLES } from '../context/AuthContext'

export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="guard-loader"><span /><span /><span /></div>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

export function RequireAdmin({ children }) {
  const { user, loading, hasRole } = useAuth()
  const location = useLocation()
  if (loading) return <div className="guard-loader"><span /><span /><span /></div>
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  if (!hasRole(ROLES.ADMIN, ROLES.SUPERADMIN)) return <Navigate to="/dashboard" replace />
  return children
}

export function GuestOnly({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (user) {
    const isAdmin = ['admin', 'superadmin'].includes(user.role)
    const from = location.state?.from
    if (from && isAdmin && from.startsWith('/admin')) return <Navigate to={from} replace />
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace />
  }
  return children
}