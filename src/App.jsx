import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import LiveChat from './components/LiveChat'
import LiveTicker from './components/LiveTicker'
import Home from './pages/Home'
import Login from './pages/Login'
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

const APP_ROUTES = ['/', '/app', '/dashboard', '/bots', '/copy-trading', '/market-analysis', '/endpoint', '/admindata', '/flossin-admin', '/superadmin', '/terminal']

function AppLayout() {
  const location = useLocation()
  const hideTicker = APP_ROUTES.includes(location.pathname)

  return (
    <>
      <LiveChat />
      {!hideTicker && <LiveTicker />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bots" element={<Bots />} />
        <Route path="/copy-trading" element={<CopyTrading />} />
        <Route path="/market-analysis" element={<MarketAnalysis />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/endpoint" element={<Endpoint />} />
        <Route path="/admindata" element={<AdminDashboard />} />
        <Route path="/flossin-admin" element={<FlossinAdmin />} />
        <Route path="/superadmin" element={<SuperAdmin />} />
        <Route path="/terminal" element={<TerminalPage />} />
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
