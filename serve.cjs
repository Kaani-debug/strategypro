const http = require('http')
const fs = require('fs')
const path = require('path')

const distDir = path.join(__dirname, 'dist')
const port = 5173

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

http.createServer((req, res) => {
  let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url)
  const ext = path.extname(filePath)
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback: serve index.html for all routes
      fs.readFile(path.join(distDir, 'index.html'), (err2, data2) => {
        if (err2) {
          res.writeHead(404)
          res.end('Not found')
          return
        }
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(data2)
      })
      return
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    res.end(data)
  })
}).listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}/`)
  console.log(`Serving: ${distDir}`)
})
