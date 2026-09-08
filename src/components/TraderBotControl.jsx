import { useState } from 'react'
import { Play, Square, Zap, Loader2, CircleDot } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSessionStore } from '../state/sessionStore'

export default function TraderBotControl({ mode }) {
  const { user } = useAuth()
  const running = useSessionStore(s => s.session.status === 'running')
  const status = useSessionStore(s => s.session.status)
  const boosted = useSessionStore(s => s.boosted)
  const startSession = useSessionStore(s => s.startSession)
  const stopSession = useSessionStore(s => s.stopSession)
  const setBoosted = useSessionStore(s => s.setBoosted)

  const isManual = mode === 'manual'
  const [stake, setStake] = useState(10)
  const [asset, setAsset] = useState('Vol 100')

  const handleRun = () => {
    if (running) return
    startSession({
      botName: isManual ? 'Manual Trade' : 'Bulk Trade',
      strategy: 'Rise / Fall',
      symbol: asset,
      stake,
      startBalance: Number(user?.balance) || 10000,
    })
  }

  const handleStop = () => {
    if (!running) return
    stopSession()
  }

  return (
    <div className="trader-control">
      <div className="trader-control__head">
        <span className={`trader-control__badge ${running ? 'trader-control__badge--live' : ''}`}>
          {running ? <Loader2 size={13} className="spin" /> : <CircleDot size={12} />}
          {isManual ? 'Manual Trade' : 'Bulk Trade'}
        </span>
        <span className="trader-control__hint">
          {running
            ? 'Bot is running — use Stop Bot to end the session'
            : status === 'stopped'
              ? 'Bot stopped — Run Bot is available to start again'
              : 'Ready — press Run Bot to start trading'}
        </span>
      </div>

      <div className="trader-control__config">
        <label className="form-label">Asset</label>
        <select className="form-input" value={asset} onChange={e => setAsset(e.target.value)} disabled={running}>
          {['Vol 10', 'Vol 25', 'Vol 50', 'Vol 75', 'Vol 100', 'Bull Market', 'Bear Market'].map(a => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <label className="form-label">Stake ($)</label>
        <input
          type="number"
          className="form-input"
          min="1"
          value={stake}
          onChange={e => setStake(Number(e.target.value))}
          disabled={running}
        />
        <label className="form-label">Execution</label>
        <button
          className={`trader-control__speed ${boosted ? 'boosted' : ''}`}
          onClick={() => setBoosted(!boosted)}
          disabled={running}
        >
          <Zap size={14} />
          <span>{boosted ? 'Boosted speed' : 'Normal speed'}</span>
        </button>
      </div>

      <div className="trader-control__actions">
        <button className="trader-control__btn trader-control__btn--run" onClick={handleRun} disabled={running}>
          <Play size={16} />
          <span>Run Bot</span>
        </button>
        <button className="trader-control__btn trader-control__btn--stop" onClick={handleStop} disabled={!running}>
          <Square size={15} />
          <span>Stop Bot</span>
        </button>
      </div>
    </div>
  )
}