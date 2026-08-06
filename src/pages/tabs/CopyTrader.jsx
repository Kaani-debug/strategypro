import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import RiskDisclaimerModal from '../../components/RiskDisclaimerModal'
import {
  WalletCards, Video, Users, Plus, Copy, RefreshCw, X, Square, Play, Zap,
  CheckCircle2, AlertTriangle, Info, Sparkles, ShieldAlert, ChevronDown, ArrowUpRight, Clock3,
} from 'lucide-react'

function CtdBtn({ variant = 'outline', className = '', onClick, children, type = 'button', disabled, title }) {
  return (
    <button type={type} title={title} disabled={disabled} className={`ctd-btn ctd-btn--${variant} ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}

function ToastStack({ messages }) {
  return (
    <div className="ctd-toasts">
      {messages.map(m => (
        <div key={m.id} className={`ctd-toast ctd-toast--${m.type}`}>
          {m.type === 'success' ? <CheckCircle2 size={16} /> : m.type === 'error' ? <AlertTriangle size={16} /> : <Info size={16} />}
          <span>{m.text}</span>
        </div>
      ))}
    </div>
  )
}

function AccountCard({ id, balance, currency }) {
  return (
    <div className="ctd-account">
      <div className="ctd-account__flag">🇺🇸</div>
      <div className="ctd-account__info">
        <div className="ctd-account__labels">
          <span className="ctd-account__type">Deriv Real</span>
          <ChevronDown size={13} />
        </div>
        <span className="ctd-account__id">{id}</span>
      </div>
      <div className="ctd-account__balance">
        <span className="ctd-account__balance-amount">{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        <span className="ctd-account__balance-currency">{currency}</span>
        <span className="ctd-account__live"><span className="ctd-account__live-dot" />Live</span>
      </div>
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div className="ctd-title">
      <span className="ctd-title__line ctd-title__line--left" />
      <span className="ctd-title__text">{children}</span>
      <span className="ctd-title__line ctd-title__line--right" />
    </div>
  )
}

export default function CopyTrader() {
  const { user } = useAuth()
  const [token, setToken] = useState('')
  const [clients, setClients] = useState([])
  const [messages, setMessages] = useState([])
  const [syncing, setSyncing] = useState(false)
  const [trading, setTrading] = useState(false)
  const [demoActive, setDemoActive] = useState(false)
  const [running, setRunning] = useState(false)
  const [boosted, setBoosted] = useState(false)
  const [riskOpen, setRiskOpen] = useState(false)
  const idRef = useRef(1)

  const balance = user?.balance ?? 15247.32
  const acctId = user?.acctId || 'ROT91857080'

  const pushMessage = (type, text) => {
    const msg = { id: Date.now() + Math.random(), type, text }
    setMessages(prev => [...prev, msg])
    setTimeout(() => setMessages(prev => prev.filter(m => m.id !== msg.id)), 4000)
  }

  const shortToken = t => (t.length > 12 ? `${t.slice(0, 4)}…${t.slice(-4)}` : t)

  const addClient = () => {
    const trimmed = token.trim()
    if (!trimmed) { pushMessage('error', 'Please enter a client API token.'); return }
    if (trimmed.length < 8) { pushMessage('error', 'Token looks too short. It should be at least 8 characters.'); return }
    if (clients.some(c => c.token === trimmed)) { pushMessage('error', 'This client is already added.'); return }
    const display = shortToken(trimmed)
    setClients(prev => [...prev, { id: idRef.current++, token: trimmed, display }])
    setToken('')
    pushMessage('success', `Client added: ${display}`)
  }

  const removeClient = id => {
    setClients(prev => prev.filter(c => c.id !== id))
    pushMessage('info', 'Client removed.')
  }

  const sync = () => {
    if (clients.length === 0) { pushMessage('info', 'No clients to sync. Add a client token first.'); return }
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      pushMessage('success', `Synced ${clients.length} client${clients.length > 1 ? 's' : ''}.`)
    }, 1200)
  }

  const toggleTrading = () => {
    const next = !trading
    setTrading(next)
    pushMessage(next ? 'success' : 'info', next ? 'Copy trading started. Mirroring active client trades.' : 'Copy trading stopped.')
  }

  const toggleDemo = () => {
    const next = !demoActive
    setDemoActive(next)
    pushMessage(next ? 'success' : 'info', next ? 'Demo to Real Copytrading enabled.' : 'Demo to Real Copytrading disabled.')
  }

  const guide = () => {
    pushMessage('info', 'Guide: Paste a client API token in the box, then press Add. Use Sync to refresh their latest trades.')
  }

  return (
    <div className="ct-dashboard">
      {/* Secondary header */}
      <section className="ctd-hero">
        <AccountCard id={acctId} balance={balance} currency="USD" />
        <SectionTitle>Client Copy Trading</SectionTitle>
        <div className="ctd-hero-actions">
          <CtdBtn variant="outline" onClick={guide}>
            <Video size={16} />
            Tutorial
          </CtdBtn>
          <CtdBtn variant="green" onClick={toggleDemo}>
            {demoActive ? '■ Stop Demo to Real Copytrading' : '▶ Start Demo to Real Copytrading'}
          </CtdBtn>
        </div>
      </section>

      <ToastStack messages={messages} />

      {/* Start button */}
      <section className="ctd-start-row">
        <CtdBtn variant="green" className="ctd-start-btn" onClick={toggleTrading}>
          {trading ? <Square size={20} /> : '▶'}
          {trading ? 'Stop Copy Trading' : 'Start Copy Trading'}
          {!trading && <ArrowUpRight size={18} />}
        </CtdBtn>
      </section>

      {/* Client management toolbar */}
      <section className="ctd-toolbar">
        <div className="ctd-toolbar__input">
          <input
            type="text"
            className="ctd-input"
            placeholder="Enter client API token..."
            value={token}
            onChange={e => setToken(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addClient() }}
          />
        </div>
        <CtdBtn variant="green" onClick={addClient}>
          <Plus size={16} />
          Add
        </CtdBtn>
        <CtdBtn variant="outline" onClick={sync} disabled={syncing}>
          <RefreshCw size={14} className={syncing ? 'ctd-spin' : ''} />
          {syncing ? 'Syncing...' : 'Sync'}
        </CtdBtn>
        <CtdBtn variant="outline" onClick={guide}>
          <Video size={16} />
          Guide
        </CtdBtn>
      </section>

      {/* Client management panel */}
      <section className="ctd-panel">
        <header className="ctd-panel__header">
          <div className="ctd-panel__count">
            <Copy size={16} />
            <span>Clients</span>
            <span className="ctd-panel__count-chip">{clients.length}</span>
          </div>
          <div className="ctd-panel__status">
            <span className="ctd-panel__status-dot" />
            {clients.length} active
          </div>
        </header>

        <div className="ctd-panel__body">
          {clients.length === 0 ? (
            <div className="ctd-empty">
              <div className="ctd-empty__icon"><Users size={30} /></div>
              <div className="ctd-empty__title">No clients added yet</div>
              <div className="ctd-empty__text">Enter a token above to get started. Once added, your client trades will be mirrored here in real time.</div>
            </div>
          ) : (
            clients.map(client => (
              <div key={client.id} className="ctd-client">
                <div className="ctd-client__avatar">{client.display.charAt(0).toUpperCase()}</div>
                <div className="ctd-client__info">
                  <span className="ctd-client__token">{client.display}</span>
                  <span className="ctd-client__meta">
                    <Clock3 size={12} />
                    Synced just now
                  </span>
                </div>
                <span className="ctd-client__badge"><span className="ctd-client__badge-dot" />Synced</span>
                <button type="button" className="ctd-client__remove" aria-label="Remove client" onClick={() => removeClient(client.id)}>
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Floating execution dock */}
      <div className={`ctd-dock ${running ? 'ctd-dock--running' : ''}`}>
        <button
          type="button"
          className={`ctd-dock__run ${running ? 'ctd-dock__run--stop' : ''}`}
          onClick={() => setRunning(!running)}
        >
          {running ? <Square size={16} /> : <Play size={16} />}
          <span>{running ? 'Stop' : 'Run'}</span>
        </button>
        <div className="ctd-dock__speed">
          <Zap size={15} />
          <div className="ctd-dock__speed-text">
            <span className="ctd-dock__speed-label">Execution Speed</span>
            <span className="ctd-dock__speed-status">{boosted ? 'Boosted Speed' : 'Normal Speed'}</span>
          </div>
        </div>
        <button
          type="button"
          className={`ctd-toggle ${boosted ? 'ctd-toggle--on' : ''}`}
          onClick={() => setBoosted(!boosted)}
          aria-label="Toggle execution speed"
        >
          <span className="ctd-toggle__knob" />
        </button>
      </div>

      {/* AI assistant */}
      <button type="button" className="ctd-ai" title="AI assistant" onClick={() => pushMessage('info', 'AI assistant ready. Ask me anything about copy trading.')}>
        <Sparkles size={26} />
        <span className="ctd-ai__dot" />
      </button>

      {/* Risk disclaimer badge */}
      <button type="button" className="ctd-risk" onClick={() => setRiskOpen(true)}>
        <ShieldAlert size={15} />
        <span>Risk Disclaimer</span>
      </button>

      <RiskDisclaimerModal open={riskOpen} onClose={() => setRiskOpen(false)} />
    </div>
  )
}
