import { useState } from 'react'
import { Play, Square, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSessionStore } from '../state/sessionStore'
import RiskDisclaimerModal from './RiskDisclaimerModal'

export default function BotControlBar() {
  const { user } = useAuth()
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)
  const running = useSessionStore(s => s.session.status === 'running')
  const boosted = useSessionStore(s => s.boosted)
  const startSession = useSessionStore(s => s.startSession)
  const stopSession = useSessionStore(s => s.stopSession)
  const setBoosted = useSessionStore(s => s.setBoosted)

  const handleRun = () => startSession({ startBalance: Number(user?.balance) || 10000 })
  const handleStop = () => stopSession()

  return (
    <>
      <div className="bot-controlbar">
        <div className="bot-controlbar__inner">
          <div className="bot-controlbar__center">
            <button
              className={`bot-controlbar__run-btn ${running ? 'running' : ''}`}
              onClick={running ? handleStop : handleRun}
            >
              {running ? <Square size={16} /> : <Play size={16} />}
              <span>{running ? 'Stop' : 'Run'}</span>
            </button>

            <div className="bot-controlbar__speed">
              <Zap size={14} />
              <span>Execution speed: {boosted ? 'Boosted speed' : 'Normal speed'}</span>
              <button
                className={`bot-controlbar__speed-toggle ${boosted ? 'boosted' : ''}`}
                onClick={() => setBoosted(!boosted)}
                aria-label="Toggle speed"
              >
                <span className="bot-controlbar__toggle-knob" />
              </button>
            </div>
          </div>

          <span className={`bot-controlbar__message ${running ? '' : 'stopped'}`}>
            {running ? 'Bot is running' : 'Bot has stopped'}
          </span>
        </div>
      </div>

      <RiskDisclaimerModal open={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} />
    </>
  )
}
