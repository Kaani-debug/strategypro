export function formatPrice(value: number, digits = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export function formatMoney(value: number, currency = 'USD'): string {
  const sign = value < 0 ? '-' : ''
  return `${sign}${currency} ${Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatSignedMoney(value: number, currency = 'USD'): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${formatMoney(value, currency)}`
}

export function formatPct(value: number): string {
  return `${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}%`
}

export function formatEpochSeconds(epoch: number): string {
  const d = new Date(epoch * 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function formatUTCDateTime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ` +
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} GMT`
  )
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
