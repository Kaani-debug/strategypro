import { Activity, Landmark, ShieldCheck, Wifi, WifiOff } from 'lucide-react'
import { useAnalysisStore, MARKET_GROUPS, MODES, marketById, modeById } from '../../state/analysisStore'

export default function WorkspaceHeader() {
  const market = useAnalysisStore(s => s.market)
  const mode = useAnalysisStore(s => s.mode)
  const account = useAnalysisStore(s => s.account)
  const phase = useAnalysisStore(s => s.phase)
  const connected = useAnalysisStore(s => s.connected)
  const authOk = useAnalysisStore(s => s.authOk)
  const matches = useAnalysisStore(s => s.matches)
  const setMarket = useAnalysisStore(s => s.setMarket)
  const setMode = useAnalysisStore(s => s.setMode)

  const marketMeta = marketById(market)
  const modeMeta = modeById(mode)

  return (
    <header className="ws-header">
      <div className="ws-header__group ws-header__group--market">
        <label className="ws-header__label" htmlFor="ws-market-select">
          Market / Instrument
        </label>
        <select
          id="ws-market-select"
          className="ws-select"
          value={market}
          onChange={e => setMarket(e.target.value)}
        >
          {MARKET_GROUPS.map(g => (
            <optgroup key={g.label} label={`${g.label} (${g.items.length})`}>
              {g.items.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="ws-header__group ws-header__group--mode">
        <label className="ws-header__label" htmlFor="ws-mode-select">
          Analysis Mode
        </label>
        <select
          id="ws-mode-select"
          className="ws-select"
          value={mode}
          onChange={e => setMode(e.target.value)}
        >
          {MODES.map(m => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>
      </div>

      <div className="ws-header__chips">
        <span className={`ws-chip ${connected ? 'ws-chip--ok' : 'ws-chip--warn'}`}>
          {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
          {connected ? 'Stream connected' : 'Reconnecting'}
        </span>
        <span className="ws-chip ws-chip--auth">
          <ShieldCheck size={12} />
          {authOk ? 'Authenticated' : 'Unauthenticated'}
        </span>
        <span className={`ws-chip ws-chip--balance ws-chip--${account.type}`} title={`${account.label} · ${account.currency}`}>
          <Landmark size={12} />
          {account.type === 'real' ? 'Real' : 'Demo'} · ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className={`ws-chip ws-chip--phase phase-${phase}`}>
          <Activity size={12} />
          {phase === 'idle' ? 'Idle' : phase === 'collecting' ? 'Collecting data' : phase === 'analyzing' ? 'Analyzing' : phase === 'validating' ? 'Validating' : phase === 'done' ? 'Completed' : phase}
        </span>
        <span className="ws-chip ws-chip--matches">
          {matches} matches
        </span>
        <span className="ws-chip ws-chip--context" title={`${marketMeta.label} · ${modeMeta.label}`}>
          {marketMeta.id} / {modeMeta.label}
        </span>
      </div>
    </header>
  )
}
