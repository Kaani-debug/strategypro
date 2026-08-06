import { useEffect } from 'react'
import { Download, FileDown, FileJson, FileSpreadsheet, FileText, X, RotateCcw, ListChecks, Activity, BookOpen, Play, Square } from 'lucide-react'
import { useAnalysisStore, marketById, strategyById } from '../../state/analysisStore'
import { useSessionStore } from '../../state/sessionStore'
import SummaryTab from './SummaryTab'
import TransactionsTab from './TransactionsTab'
import JournalTab from './JournalTab'
import SessionStatsFooter from './SessionStatsFooter'
import { exportCSV, exportExcel, exportJSON, exportPDF } from './export'
import { fmtElapsed, statusBadge, statusLabel } from './utils'

const TABS = [
  { id: 'summary', label: 'Summary', Icon: Activity },
  { id: 'transactions', label: 'Transactions', Icon: ListChecks },
  { id: 'journal', label: 'Journal', Icon: BookOpen },
]

function ExportMenu({ onSelect }) {
  const session = useSessionStore(s => s.session)
  const trades = useSessionStore(s => s.trades)
  const journal = useSessionStore(s => s.journal)

  const items = [
    { label: 'Export as PDF', Icon: FileText, run: () => exportPDF(session, trades, journal) },
    { label: 'Export as CSV', Icon: FileDown, run: () => exportCSV(session, trades) },
    { label: 'Export as Excel', Icon: FileSpreadsheet, run: () => exportExcel(session, trades, journal) },
    { label: 'Export as JSON', Icon: FileJson, run: () => exportJSON(session, trades, journal) },
  ]

  return (
    <div className="tr-export__menu">
      {items.map(item => (
        <button
          key={item.label}
          className="tr-export__item"
          onClick={() => { item.run(); onSelect() }}
        >
          <item.Icon size={15} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}

export default function TradeResultsPanel() {
  const panelOpen = useSessionStore(s => s.panelOpen)
  const activeTab = useSessionStore(s => s.activeTab)
  const setActiveTab = useSessionStore(s => s.setActiveTab)
  const closePanel = useSessionStore(s => s.closePanel)
  const exportOpen = useSessionStore(s => s.exportOpen)
  const setExportOpen = useSessionStore(s => s.setExportOpen)
  const resetSession = useSessionStore(s => s.resetSession)
  const session = useSessionStore(s => s.session)
  const trades = useSessionStore(s => s.trades)
  const journal = useSessionStore(s => s.journal)
  const startSession = useSessionStore(s => s.startSession)
  const stopSession = useSessionStore(s => s.stopSession)

  const phase = useAnalysisStore(s => s.phase)
  const running = session.status === 'running'
  const canRun = phase === 'done' && !running

  useEffect(() => {
    const add = entry => useSessionStore.getState()._addJournal(entry)
    const unsub = useAnalysisStore.subscribe((state, prev) => {
      if (state.account !== prev.account) {
        add({
          type: 'account',
          title: `Account switched to ${state.account.label}`,
          details: `${state.account.label} · ${state.account.currency} · ${state.account.id}`,
        })
      }
      if (state.market !== prev.market) {
        add({
          type: 'market',
          title: `Market updated to ${state.market}`,
          details: `Analysis context switched to ${state.market}`,
        })
      }
      if (state.paused !== prev.paused) {
        add({
          type: 'system',
          title: state.paused ? 'Bot paused' : 'Bot resumed',
          details: state.paused ? 'Market monitoring suspended' : 'Market monitoring active',
        })
      }
    })
    return unsub
  }, [])

  const handleRun = () => {
    if (!canRun) return
    const sym = marketById(useAnalysisStore.getState().market)
    const account = useAnalysisStore.getState().account
    startSession({ strategy: strategyById(useAnalysisStore.getState().strategy).label, symbol: sym.id, startBalance: account.balance })
    useAnalysisStore.getState().appendLog({ category: 'success', message: `Trading session started — ${strategyById(useAnalysisStore.getState().strategy).label} on ${sym.id} (${account.label})`, code: 'RUN-200' })
  }

  const handleStop = () => {
    if (!running) return
    stopSession()
    useAnalysisStore.getState().appendLog({ category: 'info', message: `Trading session stopped on ${useAnalysisStore.getState().market}`, code: 'RUN-201' })
  }

  return (
    <div className={`tr-root ${panelOpen ? 'tr-root--open' : ''}`}>
      <div className="tr-backdrop" onClick={closePanel} />

      <aside className={`tr-panel ${panelOpen ? 'tr-panel--open' : ''}`} aria-hidden={!panelOpen}>
        <header className="tr-panel__header">
          <div className="tr-panel__titlebar">
            <div className="tr-panel__titles">
              <h2 className="tr-panel__title">Trading Session Results</h2>
              <span className="tr-panel__session">{session.id} · {session.botName}</span>
            </div>
            <div className="tr-panel__actions">
              <div className="tr-export">
                <button
                  className={`tr-btn ${exportOpen ? 'tr-btn--active' : ''}`}
                  onClick={() => setExportOpen(!exportOpen)}
                  disabled={!trades.length && !journal.length}
                  aria-label="Export results"
                >
                  <Download size={15} />
                  <span>Export</span>
                </button>
                {exportOpen ? <ExportMenu onSelect={() => setExportOpen(false)} /> : null}
              </div>
              <button className="tr-panel__close" onClick={closePanel} aria-label="Close panel">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="tr-panel__statusrow">
            <span className={statusBadge(session.status)}>{statusLabel(session.status)}</span>
            <span className="tr-panel__statusstr">
              {session.status === 'running' ? 'Session live' : session.status === 'stopped' ? 'Session ended' : 'Awaiting run'} · {session.strategy} on {session.symbol}
            </span>
            <span className="tr-panel__elapsed">{fmtElapsed(session.elapsedMs)}</span>
          </div>
        </header>

        <nav className="tr-tabs">
          {TABS.map(tab => {
            const Icon = tab.Icon
            const count = tab.id === 'transactions' ? trades.length : tab.id === 'journal' ? journal.length : null
            return (
              <button
                key={tab.id}
                className={`tr-tabs__item ${activeTab === tab.id ? 'tr-tabs__item--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {count !== null && count > 0 ? <span className="tr-tabs__count">{count}</span> : null}
              </button>
            )
          })}
        </nav>

        <div className="tr-content">
          <div className={`tr-content__pane ${activeTab === 'summary' ? 'tr-content__pane--active' : ''}`}>
            <SummaryTab />
          </div>
          <div className={`tr-content__pane ${activeTab === 'transactions' ? 'tr-content__pane--active' : ''}`}>
            <TransactionsTab />
          </div>
          <div className={`tr-content__pane ${activeTab === 'journal' ? 'tr-content__pane--active' : ''}`}>
            <JournalTab />
          </div>
        </div>

        <SessionStatsFooter />

        <div className="tr-bottom">
          <button
            className="tr-bottom__btn tr-bottom__btn--run"
            onClick={handleRun}
            disabled={!canRun}
            title={phase !== 'done' ? 'Complete an analysis before running the bot' : ''}
          >
            <Play size={16} />
            <span>Run Bot</span>
          </button>
          <button
            className="tr-bottom__btn tr-bottom__btn--stop"
            onClick={handleStop}
            disabled={!running}
          >
            <Square size={15} />
            <span>Stop Bot</span>
          </button>
          <button className="tr-bottom__reset" onClick={resetSession} aria-label="Reset session data">
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        </div>
      </aside>
    </div>
  )
}
