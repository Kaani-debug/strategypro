import { useEffect, useMemo, useRef, useState } from 'react'
import { Circle, Loader2, Pause, Play, Square, Zap } from 'lucide-react'
import { marketById, strategyById, useAnalysisStore } from '../../state/analysisStore'
import { useSessionStore } from '../../state/sessionStore'

const CONTRACT_CLOSED_WINDOW_MS = 5000
const ERROR_WINDOW_MS = 3500

export default function RunControl() {
  const analysis = useAnalysisStore()
  const sessionStatus = useSessionStore(s => s.session.status)
  const connectedSession = useSessionStore(s => s.session.connected)
  const trades = useSessionStore(s => s.trades)
  const boosted = useSessionStore(s => s.boosted)
  const startSession = useSessionStore(s => s.startSession)
  const stopSession = useSessionStore(s => s.stopSession)
  const setBoosted = useSessionStore(s => s.setBoosted)

  const phase = analysis.phase
  const paused = analysis.paused
  const connected = analysis.connected
  const recentErrorAt = analysis.recentErrorAt
  const market = analysis.market
  const strategy = analysis.strategy

  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const lastResolved = useMemo(() => {
    for (let i = trades.length - 1; i >= 0; i -= 1) {
      const t = trades[i]
      if (t.status === 'won' || t.status === 'lost') return t
    }
    return null
  }, [trades])

  const closedAtRef = useRef(0)
  const [closedAt, setClosedAt] = useState(0)
  useEffect(() => {
    if (lastResolved?.exitTime && lastResolved.exitTime !== closedAtRef.current) {
      closedAtRef.current = lastResolved.exitTime
      setClosedAt(Date.now())
    }
  }, [lastResolved])

  const status = useMemo(() => {
    if (sessionStatus === 'running' && !connectedSession) {
      return { key: 'reconnecting', label: 'Reconnecting', tone: 'warn', detail: 'Market stream interrupted — session context preserved' }
    }
    if (paused) {
      return { key: 'paused', label: 'Paused', tone: 'warn', detail: 'Market monitoring suspended by user' }
    }
    if (sessionStatus === 'running') {
      return { key: 'running', label: 'Running', tone: 'ok', detail: `Trading session active on ${market} with ${strategyById(strategy).label}` }
    }
    if (!connected) {
      return { key: 'reconnecting', label: 'Reconnecting', tone: 'warn', detail: 'Market stream interrupted — context preserved' }
    }
    if (phase === 'analyzing') {
      return { key: 'analyzing', label: 'Analyzing', tone: 'info', detail: 'Signal evaluation pipeline in progress' }
    }
    if (phase === 'validating') {
      return { key: 'validating', label: 'Validating', tone: 'info', detail: 'Strategy rules and execution prerequisites being verified' }
    }
    if (phase === 'collecting') {
      return { key: 'collecting', label: 'Collecting data', tone: 'info', detail: 'Live price samples being captured for the current analysis' }
    }
    if (phase === 'done') {
      return { key: 'completed', label: 'Completed', tone: 'ok', detail: 'Analysis complete — ready to run a session' }
    }
    if (phase === 'idle') {
      return { key: 'idle', label: 'Idle', tone: 'muted', detail: 'Ready — awaiting analysis request' }
    }
    if (sessionStatus === 'stopped') {
      return { key: 'stopped', label: 'Stopped', tone: 'danger', detail: 'Trading session stopped' }
    }
    if (now - recentErrorAt < ERROR_WINDOW_MS) {
      return { key: 'error', label: 'Error', tone: 'danger', detail: 'Recoverable error — engine realigning' }
    }
    if (now - closedAt < CONTRACT_CLOSED_WINDOW_MS) {
      return { key: 'contract-closed', label: 'Contract closed', tone: 'info', detail: 'Latest contract settled' }
    }
    return { key: 'idle', label: 'Idle', tone: 'muted', detail: 'Ready — waiting for analysis' }
  }, [sessionStatus, connectedSession, paused, connected, phase, market, strategy, now, recentErrorAt, closedAt])

  const running = sessionStatus === 'running'
  const canRun = phase === 'done' && !running
  const canPause = phase === 'analyzing' || phase === 'validating' || phase === 'collecting' || running

  const handleRun = () => {
    if (!canRun) return
    const sym = marketById(market)
    const account = useAnalysisStore.getState().account
    startSession({ strategy: strategyById(strategy).label, symbol: sym.id, startBalance: account.balance })
    useAnalysisStore.getState().appendLog({ category: 'success', message: `Trading session started — ${strategyById(strategy).label} on ${market} (${account.label})`, code: 'RUN-200' })
  }

  const handleStop = () => {
    stopSession()
    useAnalysisStore.getState().appendLog({ category: 'info', message: `Trading session stopped on ${market}`, code: 'RUN-201' })
  }

  const handlePause = () => {
    useAnalysisStore.getState().setPaused(!paused)
  }

  return (
    <section className="ws-run">
      <div className="ws-run__controls">
        <button
          className={`ws-run-btn ${running ? 'ws-run-btn--stop' : ''} ${!canRun ? 'ws-run-btn--locked' : ''}`}
          onClick={running ? handleStop : handleRun}
          disabled={!running && !canRun}
          title={!canRun && !running ? 'Complete an analysis before running a session' : running ? 'Stop session' : 'Start trading session'}
        >
          {running ? <Square size={15} /> : <Play size={15} />}
          <span>{running ? 'Stop' : 'Run'}</span>
        </button>

        <button
          className={`ws-pause-btn ${paused ? 'active' : ''}`}
          onClick={handlePause}
          disabled={!canPause && !paused}
          title="Pause / resume market monitoring"
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
          <span>{paused ? 'Resume' : 'Pause'}</span>
        </button>

        <div className="ws-run__speed">
          <Zap size={13} />
          <span>{boosted ? 'Boosted' : 'Normal'} speed</span>
          <button
            className={`ws-run__toggle ${boosted ? 'boosted' : ''}`}
            onClick={() => setBoosted(!boosted)}
            aria-label="Toggle execution speed"
          >
            <span className="ws-run__knob" />
          </button>
        </div>
      </div>

      <div className={`ws-status ws-status--${status.tone}`}>
        <div className="ws-status__badge">
          {status.key === 'running' || status.key === 'analyzing' || status.key === 'validating' || status.key === 'collecting' ? (
            <Loader2 size={13} className="spin" />
          ) : status.key === 'idle' ? (
            <Circle size={12} />
          ) : null}
          <span>{status.label}</span>
        </div>
        <span className="ws-status__detail">{status.detail}</span>
      </div>
    </section>
  )
}
