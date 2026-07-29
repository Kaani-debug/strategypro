import { useState, useEffect } from 'react'
import { Play, Square, Settings, Save, Globe, Clock, Wifi, WifiOff } from 'lucide-react'

export default function AppFooter() {
  const [serverTime, setServerTime] = useState(new Date())
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState('1x')
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const timer = setInterval(() => setServerTime(new Date()), 1000)
    const netHandler = () => setOnline(navigator.onLine)
    window.addEventListener('online', netHandler)
    window.addEventListener('offline', netHandler)
    return () => { clearInterval(timer); window.removeEventListener('online', netHandler); window.removeEventListener('offline', netHandler) }
  }, [])

  return (
    <footer className="app-footer">
      <div className="app-footer__left">
        <button className={`app-footer__btn app-footer__btn--run ${isRunning ? 'running' : ''}`} onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? <Square size={14} /> : <Play size={14} />}
          <span>{isRunning ? 'Stop' : 'Run'}</span>
        </button>
        <div className="app-footer__divider" />
        <div className="app-footer__speed">
          <button className={`app-footer__speed-btn ${speed === '0.5x' ? 'active' : ''}`} onClick={() => setSpeed('0.5x')}>0.5x</button>
          <button className={`app-footer__speed-btn ${speed === '1x' ? 'active' : ''}`} onClick={() => setSpeed('1x')}>1x</button>
          <button className={`app-footer__speed-btn ${speed === '2x' ? 'active' : ''}`} onClick={() => setSpeed('2x')}>2x</button>
          <button className={`app-footer__speed-btn ${speed === '5x' ? 'active' : ''}`} onClick={() => setSpeed('5x')}>5x</button>
        </div>
        <div className="app-footer__divider" />
        <button className="app-footer__btn"><Globe size={14} /> EN</button>
      </div>
      <div className="app-footer__right">
        <button className="app-footer__btn"><Settings size={14} /> Settings</button>
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
