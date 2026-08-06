import { useEffect, useRef, useState } from 'react'
import { Activity, Pause, Play, Radio } from 'lucide-react'
import { CATEGORY_LABELS, useAnalysisStore } from '../../state/analysisStore'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'warn', label: 'Warnings' },
  { id: 'error', label: 'Errors' },
  { id: 'signal', label: 'Signals' },
  { id: 'connection', label: 'Connection' },
]

const WARN_CATS = ['warning', 'error']
const ERROR_CATS = ['error']
const SIGNAL_CATS = ['signal']

const matchesFilter = (entry, filter) => {
  if (filter === 'all') return true
  if (filter === 'warn') return WARN_CATS.includes(entry.category)
  if (filter === 'error') return ERROR_CATS.includes(entry.category)
  if (filter === 'signal') return SIGNAL_CATS.includes(entry.category)
  if (filter === 'connection') return entry.category === 'connection'
  return true
}

const timeOf = ts => new Date(ts).toLocaleTimeString()

export default function ActivityConsole() {
  const log = useAnalysisStore(s => s.log)
  const connected = useAnalysisStore(s => s.connected)
  const [filter, setFilter] = useState('all')
  const [scrollingPaused, setScrollingPaused] = useState(false)
  const scrollerRef = useRef(null)
  const stickRef = useRef(true)

  const entries = filter === 'all' ? log : log.filter(e => matchesFilter(e, filter))

  useEffect(() => {
    const el = scrollerRef.current
    if (el && !scrollingPaused && stickRef.current) el.scrollTop = el.scrollHeight
  }, [entries.length, scrollingPaused])

  const handleScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60
  }

  const jumpToLatest = () => {
    stickRef.current = true
    setScrollingPaused(false)
    const el = scrollerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }

  return (
    <section className="ws-console">
      <div className="ws-console__head">
        <div className="ws-console__title">
          <Radio size={14} className={connected ? 'ws-console__live' : ''} />
          <span>System Activity Console</span>
          <span className="ws-console__count">{entries.length} events</span>
        </div>
        <div className="ws-console__tools">
          <div className="ws-console__filters">
            {FILTERS.map(f => (
              <button
                key={f.id}
                className={`ws-console__filter ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            className="ws-console__tool"
            onClick={() => setScrollingPaused(p => !p)}
            title={scrollingPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
          >
            {scrollingPaused ? <Play size={13} /> : <Pause size={13} />}
          </button>
          <button
            className="ws-console__tool"
            onClick={jumpToLatest}
            title="Jump to latest"
          >
            <Activity size={13} />
          </button>
        </div>
      </div>

      <div className="ws-console__body" ref={scrollerRef} onScroll={handleScroll}>
        {entries.length === 0 && (
          <div className="ws-console__empty">No events match the current filter.</div>
        )}
        {entries.map(e => (
          <div key={e.id} className={`ws-log ws-log--${e.category}`}>
            <span className="ws-log__time">{timeOf(e.ts)}</span>
            <span className="ws-log__tag">{CATEGORY_LABELS[e.category] || e.category}</span>
            <span className="ws-log__msg">{e.message}</span>
            {e.code && <span className="ws-log__code">{e.code}</span>}
          </div>
        ))}
      </div>
    </section>
  )
}
