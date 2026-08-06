import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, Eye } from 'lucide-react'
import { useSessionStore } from '../../state/sessionStore'
import TradeDetailView from './TradeDetailView'
import { fmtSignedMoney, pnlClass, tradeStatusBadge, tradeStatusLabel } from './utils'

const ROW_H = 54
const HEAD_H = 42
const BUFFER = 6

const STATUS_FILTERS = [
  { id: 'all', label: 'All statuses' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' },
  { id: 'open', label: 'Open' },
  { id: 'error', label: 'Error' },
]

function EmptyState({ label }) {
  return (
    <div className="tr-empty">
      <Search size={28} />
      <span>{label}</span>
    </div>
  )
}

export default function TransactionsTab() {
  const trades = useSessionStore(s => s.trades)
  const detailId = useSessionStore(s => s.detailId)
  const setDetail = useSessionStore(s => s.setDetail)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportH, setViewportH] = useState(0)
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return undefined
    const ro = new ResizeObserver(() => setViewportH(el.clientHeight))
    ro.observe(el)
    setViewportH(el.clientHeight)
    return () => ro.disconnect()
  }, [])

  const detail = detailId ? trades.find(t => t.id === detailId) : null

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return trades
      .filter(t => (status === 'all' ? true : t.status === status))
      .filter(t => (q ? `${t.id} ${t.symbol} ${t.contractType}`.toLowerCase().includes(q) : true))
      .sort((a, b) => b.entryTime - a.entryTime)
  }, [trades, query, status])

  const totalH = rows.length * ROW_H
  const start = Math.max(0, Math.floor((scrollTop - HEAD_H) / ROW_H) - BUFFER)
  const end = Math.min(rows.length, Math.ceil((scrollTop - HEAD_H + viewportH) / ROW_H) + BUFFER)
  const visible = rows.slice(start, end)

  if (detail) {
    return <TradeDetailView trade={detail} onClose={() => setDetail(null)} />
  }

  return (
    <div className="tr-tx">
      <div className="tr-toolbar">
        <div className="tr-search">
          <Search size={14} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search ID, symbol, type" />
        </div>
        <select className="tr-select" value={status} onChange={e => setStatus(e.target.value)}>
          {STATUS_FILTERS.map(f => (
            <option key={f.id} value={f.id}>{f.label}</option>
          ))}
        </select>
      </div>

      <div className="tr-tx__table">
        <div className="tr-tx__scroll" ref={scrollRef} onScroll={e => setScrollTop(e.currentTarget.scrollTop)}>
          <div className="tr-tx__virtual" style={{ height: HEAD_H + totalH }}>
            <div className="tr-tx__grid tr-tx__head">
              <span>Trade ID</span>
              <span>Entry / Exit</span>
              <span>Amount</span>
              <span>Status</span>
            </div>

            {!rows.length ? (
              <EmptyState label={trades.length ? 'No trades match your filters' : 'Transactions will appear here as the bot trades'} />
            ) : (
              visible.map((t, i) => (
                <div
                  key={t.id}
                  className="tr-tx__grid tr-tx__row"
                  style={{ height: ROW_H, transform: `translateY(${HEAD_H + (start + i) * ROW_H}px)` }}
                  onClick={() => setDetail(t.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setDetail(t.id) }}
                >
                  <span className="tr-tx__id">{t.id}</span>
                  <span className="tr-tx__spots">
                    <span className="tr-tx__spot"><span className="tr-tx__spot-key">Entry</span>{t.entrySpot.toFixed(2)}</span>
                    <span className="tr-tx__spot tr-tx__spot--exit"><span className="tr-tx__spot-key">Exit</span>{t.exitSpot.toFixed(2)}</span>
                  </span>
                  <span className={`tr-tx__amount ${pnlClass(t.profit)}`}>{t.status === 'open' ? '…' : fmtSignedMoney(t.profit)}</span>
                  <span className="tr-tx__status">
                    <span className={tradeStatusBadge(t.status)}>{tradeStatusLabel(t.status)}</span>
                    <Eye size={13} className="tr-tx__eye" />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
