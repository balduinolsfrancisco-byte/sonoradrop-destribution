/**
 * Servidor estático de produção para a SonoraDrop.
 * - serve a pasta dist/
 * - fallback SPA (qualquer rota devolve index.html)
 * - aceita qualquer Host (necessário para o proxy de preview)
 */
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.join(__dirname, 'dist')
const PORT = Number(process.env.PORT || 8080)
const HOST = process.env.HOST || '0.0.0.0'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
}

const server = http.createServer((req, res) => {
  let pathname
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  } catch {
    res.writeHead(400).end('Pedido inválido')
    return
  }

  const resolved = path.normalize(path.join(ROOT, pathname))
  const candidate = resolved.startsWith(ROOT) && fs.existsSync(resolved) && fs.statSync(resolved).isFile()
    ? resolved
    : path.join(ROOT, 'index.html')

  fs.readFile(candidate, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Erro ao ler ficheiro')
      return
    }
    const ext = path.extname(candidate)
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    })
    res.end(data)
  })
})

server.listen(PORT, HOST, () => {
  console.log(`SonoraDrop a servir ${ROOT} em http://${HOST}:${PORT}`)
})
