const download = (filename, content, mime) => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const esc = value => {
  const v = String(value ?? '')
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`
  return v
}

const sheetName = session =>
  `${session.botName.replace(/\s+/g, '-').toLowerCase()}-${session.id.toLowerCase()}`

export const exportCSV = (session, trades) => {
  const headers = ['Trade ID', 'Session', 'Symbol', 'Type', 'Stake', 'Payout', 'Buy Price', 'Sell Price', 'Entry Spot', 'Exit Spot', 'Profit / Loss', 'Status', 'Duration (s)', 'Execution Time', 'Latency (ms)']
  const rows = trades.map(t => [
    t.id,
    t.sessionId,
    t.symbol,
    t.contractType,
    t.stake,
    t.payout,
    t.buyPrice,
    t.sellPrice,
    t.entrySpot,
    t.exitSpot,
    t.profit,
    t.status,
    t.duration,
    new Date(t.entryTime).toISOString(),
    t.latencyMs,
  ])
  const csv = [headers, ...rows].map(r => r.map(esc).join(',')).join('\r\n')
  download(`${sheetName(session)}.csv`, `\uFEFF${csv}`, 'text/csv;charset=utf-8')
}

export const exportJournal = (journal, name = 'journal') => {
  const headers = ['Timestamp', 'Category', 'Type', 'Title', 'Details']
  const rows = journal.map(j => [
    new Date(j.timestamp).toISOString(),
    j.category || j.type,
    j.type,
    j.title,
    j.details,
  ])
  const csv = [headers, ...rows].map(r => r.map(esc).join(',')).join('\r\n')
  download(`${name}.csv`, `\uFEFF${csv}`, 'text/csv;charset=utf-8')
}

export const exportJSON = (session, trades, journal) => {
  const payload = {
    exportedAt: new Date().toISOString(),
    session: {
      id: session.id,
      botName: session.botName,
      strategy: session.strategy,
      symbol: session.symbol,
      stake: session.stake,
      status: session.status,
      startTime: session.startTime,
      endTime: session.endTime,
      elapsedMs: session.elapsedMs,
      startBalance: session.startBalance,
    },
    transactions: trades,
    journal,
  }
  download(`${sheetName(session)}.json`, JSON.stringify(payload, null, 2), 'application/json')
}

const xmlEsc = value => String(value ?? '').replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))

export const exportExcel = (session, trades, journal) => {
  const headerRow = cells => `<Row>${cells.map(c => `<Cell ss:StyleID="h"><Data ss:Type="String">${xmlEsc(c)}</Data></Cell>`).join('')}</Row>`
  const dataRow = cells => `<Row>${cells.map(c => `<Cell><Data ss:Type="String">${xmlEsc(c)}</Data></Cell>`).join('')}</Row>`
  const txHeader = ['Trade ID', 'Symbol', 'Type', 'Stake', 'Payout', 'Buy', 'Sell', 'Entry', 'Exit', 'P/L', 'Status', 'Duration', 'Executed At', 'Latency (ms)']
  const txRows = trades.map(t => dataRow([t.id, t.symbol, t.contractType, t.stake, t.payout, t.buyPrice, t.sellPrice, t.entrySpot, t.exitSpot, t.profit, t.status, `${t.duration}s`, new Date(t.entryTime).toISOString(), `${t.latencyMs}ms`]))
  const jrHeader = ['Time', 'Type', 'Title', 'Details']
  const jrRows = journal.map(j => dataRow([new Date(j.timestamp).toISOString(), j.type, j.title, j.details]))
  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Styles>
<Style ss:ID="h"><Font ss:Bold="1" ss:Color="#ffffff"/><Interior ss:Color="#ff444f" ss:Pattern="Solid"/></Style>
</Styles>
<Worksheet ss:Name="Transactions"><Table>
${headerRow(txHeader)}
${txRows.join('\n')}
</Table></Worksheet>
<Worksheet ss:Name="Journal"><Table>
${headerRow(jrHeader)}
${jrRows.join('\n')}
</Table></Worksheet>
</Workbook>`
  download(`${sheetName(session)}.xls`, xml, 'application/vnd.ms-excel')
}

export const exportPDF = (session, trades, journal) => {
  const rows = trades
    .map(
      t => `<tr>
        <td>${t.id}</td><td>${t.symbol}</td><td>${t.contractType}</td><td>${t.stake}</td>
        <td>${t.payout}</td><td>${t.profit}</td><td>${t.status}</td><td>${t.duration}s</td>
      </tr>`,
    )
    .join('')
  const jr = journal
    .map(j => `<li><b>${new Date(j.timestamp).toLocaleString()}</b> [${j.type}] ${j.title}${j.details ? ` — ${j.details}` : ''}</li>`)
    .join('')
  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) return
  win.document.write(`<!doctype html><html><head><title>Trade Results — ${session.id}</title><style>
    body{font-family:Inter,Arial,sans-serif;color:#222;padding:32px;font-size:13px}
    h1{font-size:20px;margin:0 0 4px}h2{font-size:14px;margin:24px 0 8px;border-bottom:2px solid #ff444f;padding-bottom:4px}
    .meta{display:grid;grid-template-columns:repeat(4,1fr);gap:8px 24px;margin:16px 0}
    .meta div{background:#f2f3f4;border-radius:8px;padding:8px 12px}
    .meta b{display:block;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:.4px}
    table{width:100%;border-collapse:collapse;margin-top:8px}
    th,td{border:1px solid #ddd;padding:6px 8px;text-align:left;font-size:12px}
    th{background:#ff444f;color:#fff}
    tr:nth-child(even) td{background:#fafafa}
    ul{list-style:none;padding:0;margin:0}
    li{padding:6px 0;border-bottom:1px solid #eee}
  </style></head><body>
    <h1>Trade Results Report</h1>
    <div style="color:#999">${session.botName} — ${session.strategy}</div>
    <div class="meta">
      <div><b>Session ID</b>${session.id}</div>
      <div><b>Status</b>${session.status}</div>
      <div><b>Symbol</b>${session.symbol}</div>
      <div><b>Stake</b>$${session.stake}</div>
      <div><b>Started</b>${session.startTime ? new Date(session.startTime).toLocaleString() : '—'}</div>
      <div><b>Ended</b>${session.endTime ? new Date(session.endTime).toLocaleString() : '—'}</div>
      <div><b>Trades</b>${trades.length}</div>
      <div><b>Won / Lost</b>${trades.filter(t => t.status === 'won').length} / ${trades.filter(t => t.status === 'lost').length}</div>
      <div><b>Total Stake</b>$${trades.reduce((a, t) => a + t.stake, 0).toFixed(2)}</div>
      <div><b>Total Payout</b>$${trades.reduce((a, t) => a + t.payout, 0).toFixed(2)}</div>
      <div><b>Net P/L</b>$${trades.reduce((a, t) => a + t.profit, 0).toFixed(2)}</div>
      <div><b>ROI</b>${((trades.reduce((a, t) => a + t.profit, 0) / (trades.reduce((a, t) => a + t.stake, 0) || 1)) * 100).toFixed(1)}%</div>
    </div>
    <h2>Transactions</h2>
    ${trades.length ? `<table><tr><th>ID</th><th>Symbol</th><th>Type</th><th>Stake</th><th>Payout</th><th>P/L</th><th>Status</th><th>Duration</th></tr>${rows}</table>` : '<p>No transactions yet.</p>'}
    <h2>Journal</h2>
    ${journal.length ? `<ul>${jr}</ul>` : '<p>No journal entries yet.</p>'}
    <script>window.onload=function(){setTimeout(function(){window.print()},300)}</script>
  </body></html>`)
  win.document.close()
}
