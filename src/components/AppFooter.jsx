import { useState, useEffect, useRef } from 'react'
import { Settings, Save, Globe, Clock, Wifi, WifiOff, TriangleAlert, Moon, Sun } from 'lucide-react'
import RiskDisclaimerModal from './RiskDisclaimerModal'
import { useTheme } from '../context/ThemeContext'

export default function AppFooter() {
  const { theme, toggle } = useTheme()
  const [serverTime, setServerTime] = useState(new Date())
  const [online, setOnline] = useState(navigator.onLine)
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsRef = useRef(null)
  const isDark = theme === 'dark'

  useEffect(() => {
    const timer = setInterval(() => setServerTime(new Date()), 1000)
    const netHandler = () => setOnline(navigator.onLine)
    window.addEventListener('online', netHandler)
    window.addEventListener('offline', netHandler)
    return () => { clearInterval(timer); window.removeEventListener('online', netHandler); window.removeEventListener('offline', netHandler) }
  }, [])

  useEffect(() => {
    if (!settingsOpen) return
    const onDown = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') setSettingsOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [settingsOpen])

  return (
    <footer className="app-footer">
      <div className="app-footer__left">
        <button className="app-footer__btn app-footer__btn--risk" onClick={() => setDisclaimerOpen(true)}>
          <TriangleAlert size={14} />
          <span>Risk Disclaimer</span>
        </button>
        <RiskDisclaimerModal open={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} />
        <div className="app-footer__divider" />
        <button className="app-footer__btn"><Globe size={14} /> EN</button>
      </div>
      <div className="app-footer__right">
        <div className="app-footer__settings" ref={settingsRef}>
          <button
            className={`app-footer__btn ${settingsOpen ? 'app-footer__btn--active' : ''}`}
            onClick={() => setSettingsOpen(o => !o)}
          >
            <Settings size={14} /> Settings
          </button>
          {settingsOpen && (
            <div className="app-footer__menu">
              <div className="app-footer__menu-title">Settings</div>
              <button className="app-footer__menu-item" onClick={toggle} title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
                <span className="app-footer__menu-label">Dark mode</span>
                <span className={`app-footer__switch ${isDark ? 'app-footer__switch--on' : ''}`}>
                  <span className="app-footer__switch-knob" />
                </span>
              </button>
            </div>
          )}
        </div>
        <button className="app-footer__btn"><Save size={14} /> Save</button>
        <div className="app-footer__divider" />
        <div className="app-footer__time">
          <Clock size={12} />
          <span>{serverTime.toLocaleTimeString()}</span>
        </div>
        <div className="app-footer__divider" />
        <div className={`app-footer__network ${online ? 'online' : 'offline'}`}>
          {online ? <Wifi size={12} /> : <WifiOff size={12} />}
          <span>{online ? 'Connected' : 'Offline'}</span>
        </div>
      </div>
    </footer>
  )
}
