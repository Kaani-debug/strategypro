import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { RequireAuth, RequireAdmin, GuestOnly } from './security/guards'
import LiveChat from './components/LiveChat'
import LiveTicker from './components/LiveTicker'
import CookieConsent from './components/CookieConsent'
import Home from './pages/Home'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import AppPage from './pages/AppPage'
import Dashboard from './pages/Dashboard'
import Bots from './pages/Bots'
import CopyTrading from './pages/CopyTrading'
import MarketAnalysis from './pages/MarketAnalysis'
import Callback from './pages/Callback'
import Endpoint from './pages/Endpoint'
import AdminDashboard from './pages/AdminDashboard'
import FlossinAdmin from './pages/FlossinAdmin'
import SuperAdmin from './pages/SuperAdmin'
import TerminalPage from './terminal/TerminalPage'

const APP_ROUTES = ['/', '/app', '/dashboard', '/bots', '/copy-trading', '/market-analysis', '/endpoint', '/admindata', '/flossin-admin', '/superadmin', '/admin', '/admin/login', '/admin/dashboard', '/admin/flossin', '/admin/superadmin', '/terminal']

function AppLayout() {
  const location = useLocation()
  const hideTicker = APP_ROUTES.includes(location.pathname)

  return (
    <>
      <CookieConsent />
      <LiveChat />
      {!hideTicker && <LiveTicker />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/admin/login" element={<GuestOnly><AdminLogin /></GuestOnly>} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin/flossin" element={<RequireAdmin><FlossinAdmin /></RequireAdmin>} />
        <Route path="/admin/superadmin" element={<RequireAdmin><SuperAdmin /></RequireAdmin>} />

        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/app" element={<RequireAuth><AppPage /></RequireAuth>} />
        <Route path="/bots" element={<RequireAuth><Bots /></RequireAuth>} />
        <Route path="/copy-trading" element={<RequireAuth><CopyTrading /></RequireAuth>} />
        <Route path="/market-analysis" element={<RequireAuth><MarketAnalysis /></RequireAuth>} />
        <Route path="/terminal" element={<RequireAuth><TerminalPage /></RequireAuth>} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/endpoint" element={<Endpoint />} />

        <Route path="/admindata" element={<RequireAdmin><Navigate to="/admin/dashboard" replace /></RequireAdmin>} />
        <Route path="/flossin-admin" element={<RequireAdmin><Navigate to="/admin/flossin" replace /></RequireAdmin>} />
        <Route path="/superadmin" element={<RequireAdmin><Navigate to="/admin/superadmin" replace /></RequireAdmin>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </ThemeProvider>
  )
}