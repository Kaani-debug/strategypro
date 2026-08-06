export const fmtMoney = (n, d = 2) => {
  const v = Number(n) || 0
  const sign = v < 0 ? '-' : ''
  return `${sign}$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}`
}

export const fmtSignedMoney = n => {
  const v = Number(n) || 0
  if (v === 0) return fmtMoney(0)
  return (v > 0 ? '+' : '-') + fmtMoney(Math.abs(v))
}

export const fmtPct = (n, d = 1) => `${(Number(n) || 0).toFixed(d)}%`

export const fmtTime = ts => new Date(ts).toLocaleTimeString('en-GB', { hour12: false })

export const fmtDateTime = ts =>
  new Date(ts).toLocaleString('en-GB', { hour12: false, day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' })

export const fmtDuration = sec => {
  const s = Math.max(0, Math.floor(Number(sec) || 0))
  const m = Math.floor(s / 60)
  const r = s % 60
  return m ? `${m}m ${String(r).padStart(2, '0')}s` : `${s}s`
}

export const fmtElapsed = ms => {
  const s = Math.max(0, Math.floor((Number(ms) || 0) / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(r).padStart(2, '0')
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

export const pnlClass = n => {
  const v = Number(n) || 0
  return v > 0 ? 'text-green' : v < 0 ? 'text-red' : ''
}

export const statusLabel = status => {
  if (status === 'running') return 'Running'
  if (status === 'disconnected') return 'Reconnecting'
  if (status === 'stopped') return 'Stopped'
  if (status === 'idle') return 'Idle'
  return status
}

export const statusBadge = status => {
  if (status === 'running') return 'badge badge--active'
  if (status === 'disconnected') return 'badge badge--suspended'
  if (status === 'stopped') return 'badge badge--suspended'
  return 'badge'
}

export const tradeStatusBadge = status => {
  if (status === 'won') return 'badge badge--won'
  if (status === 'lost') return 'badge badge--lost'
  if (status === 'error') return 'badge badge--suspended'
  return 'badge badge--active'
}

export const tradeStatusLabel = status => (status === 'won' ? 'Won' : status === 'lost' ? 'Lost' : status === 'error' ? 'Error' : 'Open')
