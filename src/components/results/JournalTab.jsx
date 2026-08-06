import { useEffect, useMemo, useRef, useState } from 'react'
import { Download, BookOpen, TriangleAlert, Cpu, Landmark, XCircle, Info } from 'lucide-react'
import { useSessionStore } from '../../state/sessionStore'
import { exportJournal } from './export'
import { fmtDateTime, fmtTime } from './utils'

const PAGE_SIZE = 60

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'info', label: 'Information' },
  { id: 'warning', label: 'Warnings' },
  { id: 'error', label: 'Errors' },
  { id: 'trade', label: 'Trading Events' },
  { id: 'system', label: 'System Messages' },
  { id: 'account', label: 'Account' },
]

const CATEGORY_META = {
  info: { label: 'Info', cls: 'tr-j__badge--ai', Icon: Info },
  trade: { label: 'Trade', cls: 'tr-j__badge--trade', Icon: BookOpen },
  system: { label: 'System', cls: 'tr-j__badge--system', Icon: Cpu },
  warning: { label: 'Warning', cls: 'tr-j__badge--warning', Icon: TriangleAlert },
  error: { label: 'Error', cls: 'tr-j__badge--error', Icon: XCircle },
  account: { label: 'Account', cls: 'tr-j__badge--account', Icon: Landmark },
}

const TYPE_BADGE = {
  ai: 'tr-j__badge--ai',
  trade: 'tr-j__badge--trade',
  system: 'tr-j__badge--system',
  warning: 'tr-j__badge--warning',
  error: 'tr-j__badge--error',
  account: 'tr-j__badge--account',
  info: 'tr-j__badge--ai',
  market: 'tr-j__badge--system',
}

function RiskChip({ level }) {
  if (!level) return null
  return <span className={`tr-j__chip tr-j__risk--${level}`}>{level}</span>
}

function SignalMeta({ entry }) {
  if (!entry.direction) return null
  return (
    <div className="tr-j__meta">
      <span className={`tr-j__chip tr-j__dir--${entry.direction === 'Rise' ? 'rise' : 'fall'}`}>{entry.direction}</span>
      <span className="tr-j__chip">Strength {entry.strength}/100</span>
      <RiskChip level={entry.riskLevel} />
      {entry.marketConditions ? <span className="tr-j__chip tr-j__chip--dim">{entry.marketConditions}</span> : null}
    </div>
  )
}

function JournalEntry({ entry }) {
  const meta = CATEGORY_META[entry.category] || CATEGORY_META.system
  const Icon = meta.Icon
  const badge = TYPE_BADGE[entry.type] || meta.cls
  return (
    <div className="tr-j__entry">
      <div className="tr-j__top">
        <span className={`tr-j__badge ${badge}`}>{meta.label}</span>
        <span className="tr-j__time" title={fmtDateTime(entry.timestamp)}>{fmtTime(entry.timestamp)}</span>
      </div>
      <div className="tr-j__title">
        <Icon size={14} />
        <span>{entry.title}</span>
      </div>
      {entry.details ? <div className="tr-j__details">{entry.details}</div> : null}
      <SignalMeta entry={entry} />
      {entry.indicators?.length ? (
        <div className="tr-j__tags">
          {entry.indicators.map(i => (
            <span key={i} className="tr-j__tag">{i}</span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default function JournalTab() {
  const journal = useSessionStore(s => s.journal)
  const session = useSessionStore(s => s.session)
  const [filter, setFilter] = useState('all')
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [newCount, setNewCount] = useState(0)
  const scrollRef = useRef(null)
  const prevLen = useRef(journal.length)
  const atTop = useRef(true)

  useEffect(() => {
    const added = journal.length - prevLen.current
    prevLen.current = journal.length
    if (added > 0 && !atTop.current) {
      setNewCount(c => c + added)
    }
  }, [journal.length])

  const entries = useMemo(() => {
    const f = filter === 'all' ? null : filter
    const filtered = f ? journal.filter(j => (j.category || j.type) === f) : journal
    return filtered.slice(0, limit)
  }, [journal, filter, limit])

  const total = filter === 'all' ? journal.length : journal.filter(j => (j.category || j.type) === filter).length

  const handleScroll = e => {
    const el = e.currentTarget
    atTop.current = el.scrollTop < 40
    if (atTop.current && newCount > 0) setNewCount(0)
  }

  const jumpTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    atTop.current = true
    setNewCount(0)
  }

  return (
    <div className="tr-scroll" ref={scrollRef} onScroll={handleScroll}>
      <div className="tr-j">
        <div className="tr-j__toolbar">
          <div className="tr-j__filters">
            {FILTERS.map(f => (
              <button
                key={f.id}
                className={`tr-j__filter ${filter === f.id ? 'tr-j__filter--active' : ''}`}
                onClick={() => { setFilter(f.id); setLimit(PAGE_SIZE) }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            className="tr-btn tr-btn--sm"
            onClick={() => exportJournal(journal, `journal-${session.id.toLowerCase()}`)}
            disabled={!journal.length}
            aria-label="Download full journal"
          >
            <Download size={14} />
            <span>Download</span>
          </button>
        </div>

        {!entries.length ? (
          <div className="tr-empty">
            <BookOpen size={28} />
            <span>Journal entries will be logged automatically as the bot trades</span>
          </div>
        ) : (
          <div className="tr-j__list">
            {entries.map(e => (
              <JournalEntry key={e.id} entry={e} />
            ))}
          </div>
        )}

        {total > limit ? (
          <button className="tr-loadmore" onClick={() => setLimit(l => l + PAGE_SIZE)}>
            Load more ({total - limit} remaining)
          </button>
        ) : null}

        {newCount > 0 ? (
          <button className="tr-j__new" onClick={jumpTop}>
            ↓ {newCount} new {newCount === 1 ? 'entry' : 'entries'}
          </button>
        ) : null}
      </div>
    </div>
  )
}
