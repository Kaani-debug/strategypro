import {
  CheckCircle2,
  Circle,
  Loader2,
  Play,
  RefreshCw,
  ScanSearch,
  Target,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from 'lucide-react'
import { DATA_READY_TICKS, STRATEGIES, marketById, useAnalysisStore } from '../../state/analysisStore'

const PHASE_META = {
  idle: { label: 'Idle', tone: 'muted' },
  collecting: { label: 'Collecting data', tone: 'info' },
  analyzing: { label: 'Analyzing', tone: 'warn' },
  validating: { label: 'Validating', tone: 'info' },
  done: { label: 'Analysis complete', tone: 'ok' },
}

export default function SignalAnalyzer() {
  const market = useAnalysisStore(s => s.market)
  const strategy = useAnalysisStore(s => s.strategy)
  const phase = useAnalysisStore(s => s.phase)
  const ticksCollected = useAnalysisStore(s => s.ticksCollected)
  const dataReady = useAnalysisStore(s => s.dataReady)
  const tick = useAnalysisStore(s => s.tick)
  const tickDir = useAnalysisStore(s => s.tickDir)
  const matches = useAnalysisStore(s => s.matches)
  const connected = useAnalysisStore(s => s.connected)
  const analysis = useAnalysisStore(s => s.analysis)
  const setStrategy = useAnalysisStore(s => s.setStrategy)
  const startAnalysis = useAnalysisStore(s => s.startAnalysis)
  const openAnalysis = useAnalysisStore(s => s.openAnalysis)

  const marketMeta = marketById(market)
  const phaseMeta = PHASE_META[phase] || PHASE_META.idle

  const running = analysis.active && !analysis.interrupted
  const interrupted = analysis.interrupted
  const hasResult = !!analysis.result

  let btnLabel = 'Analyse'
  let btnDisabled = !connected
  let btnTitle = connected ? 'Launch the signal analysis pipeline' : 'Waiting for market stream…'
  if (interrupted) {
    btnLabel = 'Recovering…'
    btnDisabled = true
    btnTitle = 'Market stream interrupted — analysis will resume automatically'
  } else if (running) {
    btnLabel = analysis.open ? 'Analysis in progress…' : 'View analysis'
    btnDisabled = analysis.open
    btnTitle = 'Open the analysis window'
  } else if (hasResult) {
    btnLabel = 'New Analysis'
    btnTitle = 'Begin another analysis cycle without refreshing'
  }

  const handleAnalyse = () => {
    if (running) {
      openAnalysis()
      return
    }
    if (interrupted || !connected) return
    startAnalysis()
  }

  const progress = Math.min(100, Math.round((ticksCollected / DATA_READY_TICKS) * 100))

  return (
    <section className="ws-analyzer">
      <div className="ws-analyzer__head">
        <div className="ws-analyzer__title">
          <Target size={16} />
          <span>Signal Analyzer</span>
        </div>
        <span className={`ws-phase ws-phase--${phaseMeta.tone}`}>
          {running ? <Loader2 size={12} className="spin" /> : phase === 'done' ? <CheckCircle2 size={12} /> : <Circle size={12} />}
          {phaseMeta.label}
        </span>
      </div>

      <div className="ws-analyzer__grid">
        <div className="ws-analyzer__col ws-analyzer__col--strategy">
          <label className="ws-analyzer__label">Strategy</label>
          <select className="ws-select" value={strategy} onChange={e => setStrategy(e.target.value)}>
            {STRATEGIES.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="ws-analyzer__col">
          <span className="ws-analyzer__label">Target market</span>
          <span className="ws-analyzer__value ws-analyzer__value--market">{marketMeta.id}</span>
          <span className="ws-analyzer__sub">{marketMeta.label}</span>
        </div>

        <div className="ws-analyzer__col ws-analyzer__col--tick">
          <span className="ws-analyzer__label">Live tick</span>
          <span className={`ws-tick ws-tick--${tickDir}`}>
            {tickDir === 'up' ? <TrendingUp size={14} /> : tickDir === 'down' ? <TrendingDown size={14} /> : null}
            {tick.toFixed(2)}
          </span>
          <span className={`ws-dot-pulse ${connected ? 'ws-dot-pulse--on' : ''}`} />
        </div>

        <div className="ws-analyzer__col ws-analyzer__col--matches">
          <span className="ws-analyzer__label">Signal matches</span>
          <span className={`ws-matches ${matches >= 5 ? 'ws-matches--hot' : ''}`}>
            <ScanSearch size={14} />
            {matches}
          </span>
          <span className="ws-analyzer__sub">qualifying conditions</span>
        </div>

        <div className="ws-analyzer__col ws-analyzer__col--data">
          <div className="ws-analyzer__label-row">
            <span className="ws-analyzer__label">Data readiness</span>
            <span className="ws-analyzer__pct">{dataReady ? '100%' : `${progress}%`}</span>
          </div>
          <div className="ws-progress">
            <div className="ws-progress__fill" style={{ width: `${dataReady ? 100 : progress}%` }} />
          </div>
          <span className="ws-analyzer__sub">
            {dataReady ? 'Live data threshold reached' : `${ticksCollected}/${DATA_READY_TICKS} ticks collected`}
          </span>
        </div>

        <div className="ws-analyzer__col ws-analyzer__col--action">
          <button
            className={`ws-analyse ${btnDisabled ? 'ws-analyse--disabled' : ''}`}
            onClick={handleAnalyse}
            disabled={btnDisabled}
            title={btnTitle}
          >
            {running || interrupted ? <Loader2 size={15} className="spin" /> : hasResult ? <RefreshCw size={15} /> : <Play size={15} />}
            {btnLabel}
          </button>
        </div>
      </div>

      {hasResult && !running && (
        <button className="ws-analyzer__outcome" onClick={openAnalysis}>
          {analysis.result.qualifies ? <CheckCircle2 size={14} /> : <TriangleAlert size={14} />}
          <span>
            {analysis.result.qualifies
              ? `Valid opportunity identified — ${analysis.result.dir} at ${analysis.result.confidence}% confidence`
              : `No qualifying opportunity — ${analysis.result.matches}/${analysis.result.total} criteria below threshold`}
          </span>
          <em>Open analysis window</em>
        </button>
      )}

      {!hasResult && (
        <div className="ws-analyzer__hint">
          {running
            ? 'Analysis pipeline running — every stage is streamed live to the analysis window.'
            : interrupted
              ? 'Market stream interrupted — the analysis will resume automatically once connected.'
              : dataReady
                ? 'Live data is ready — launch the analysis pipeline to evaluate current market conditions.'
                : 'Collecting live ticks in the background — analysis can be launched at any time.'}
        </div>
      )}
    </section>
  )
}
