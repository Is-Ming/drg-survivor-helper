// DRG Survivor Helper —— 零依赖 Node 常驻服务（数据持久化 + 静态托管）
// 启动：node server/index.js   （端口 8787，可用环境变量 PORT 覆盖；ADMIN_PASSWORD_HASH 为必填项，缺失则拒绝启动）
//
// API（无缓存，每次请求实时读盘）：
//   GET    /api/baseline        -> server/data/baseline.json
//   GET    /api/overrides       -> server/data/overrides.json
//   PUT    /api/overrides       -> 以请求体整体覆盖写 overrides.json（需 X-Admin-Token）
//   DELETE /api/overrides       -> 清空 overrides.json 为 {}（需 X-Admin-Token）
//   POST   /api/pin-baseline    -> 固化：mv baseline.json -> baseline-v{n}.json（备份）；合并 overrides 进 baseline（deepMerge），而非整体替换；overrides 保持不动（需 X-Admin-Token）
// 非 /api 路由：优先托管 dist/（生产构建产物），回退 public/，SPA 回落 index.html。
'use strict'

const http = require('http')
const fs = require('fs')
const path = require('path')
const { mergeDatasets } = require('./merge')

const __dirname0 = __dirname
const DATA_DIR = path.join(__dirname0, 'data')
const ROOT_DIR = path.join(__dirname0, '..')
const DIST_DIR = path.join(ROOT_DIR, 'dist')
const PUBLIC_DIR = path.join(ROOT_DIR, 'public')

const BASELINE_FILE = path.join(DATA_DIR, 'baseline.json')
const OVERRIDES_FILE = path.join(DATA_DIR, 'overrides.json')

const PORT = parseInt(process.env.PORT || '8787', 10)
// 强鉴权：管理员令牌哈希必须由环境变量注入（systemd 经 EnvironmentFile=.../server/.env 提供）。
// 源码绝不内置任何真实/默认令牌——未配置则启动即失败（fail-closed），杜绝未授权 admin 访问。
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH
if (!ADMIN_PASSWORD_HASH) {
  throw new Error(
    'ADMIN_PASSWORD_HASH is required — 请在 server/.env 中配置（参考 server/.env.example），或通过环境变量注入。',
  )
}

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
}

function sendJson(res, status, data) {
  const body = typeof data === 'string' ? data : JSON.stringify(data)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
  })
  res.end(body)
}

function readJsonFile(file) {
  const raw = fs.readFileSync(file, 'utf8')
  return JSON.parse(raw)
}

function writeJsonFile(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8')
}

function checkAuth(req) {
  return req.headers['x-admin-token'] === ADMIN_PASSWORD_HASH
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > 5 * 1024 * 1024) req.destroy() // 防滥用：上限 5MB
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

// 固化：把当前 overrides（增量）合并进 baseline（而非整体替换），原数据绝不丢失。
// 流程：找到当前最大 baseline-v{n}.json -> n+1 -> 把 baseline.json 备份为 baseline-v{n}.json
//      -> 读取刚备份走的旧 baseline 作为 base，读取 overrides.json 作为增量
//      -> merged = mergeDatasets(oldBaseline, overrides) -> 写回 baseline.json
//      -> overrides.json 保持不动（不写、不删）。
function pinBaseline() {
  const files = fs.readdirSync(DATA_DIR)
  let maxN = 0
  for (const f of files) {
    const m = /^baseline-v(\d+)\.json$/.exec(f)
    if (m) maxN = Math.max(maxN, parseInt(m[1], 10))
  }
  const nextN = maxN + 1
  const archived = path.join(DATA_DIR, `baseline-v${nextN}.json`)
  // mv baseline.json -> baseline-v{n}.json（备份当前全量）
  fs.renameSync(BASELINE_FILE, archived)
  // 读取被备份走的旧 baseline 作为 base，读取 overrides 作为增量
  const oldBaseline = readJsonFile(archived)
  const overrides = readJsonFile(OVERRIDES_FILE)
  // 合并增量进 baseline（deepMerge），保留 baseline 原有全量数据
  const merged = mergeDatasets(oldBaseline, overrides)
  // 写回 baseline.json（覆盖原路径）
  writeJsonFile(BASELINE_FILE, merged)
  // 注意：overrides.json 保持不动
  return nextN
}

async function handleApi(req, res, urlPath) {
  // 写操作先鉴权
  const isWrite = req.method === 'PUT' || req.method === 'DELETE' || req.method === 'POST'
  if (isWrite && !checkAuth(req)) {
    return sendJson(res, 401, { error: 'unauthorized' })
  }

  try {
    if (req.method === 'GET' && urlPath === '/api/baseline') {
      return sendJson(res, 200, readJsonFile(BASELINE_FILE))
    }
    if (req.method === 'GET' && urlPath === '/api/overrides') {
      return sendJson(res, 200, readJsonFile(OVERRIDES_FILE))
    }
    if (req.method === 'PUT' && urlPath === '/api/overrides') {
      const raw = await readBody(req)
      const body = raw ? JSON.parse(raw) : {}
      writeJsonFile(OVERRIDES_FILE, body)
      return sendJson(res, 200, { ok: true })
    }
    if (req.method === 'DELETE' && urlPath === '/api/overrides') {
      writeJsonFile(OVERRIDES_FILE, {})
      return sendJson(res, 200, { ok: true })
    }
    if (req.method === 'POST' && urlPath === '/api/pin-baseline') {
      const version = pinBaseline()
      return sendJson(res, 200, { ok: true, version })
    }
    // 永久删除某装备：从 baseline.json 的 equipments 按 name 移除该条（需 X-Admin-Token，已在上方校验）。
    // urlPath 已在入口处 decodeURIComponent，此处直接取末段为装备名。
    const eqMatch = /^\/api\/equipment\/(.+)$/.exec(urlPath)
    if (req.method === 'DELETE' && eqMatch) {
      const name = eqMatch[1]
      const baseline = readJsonFile(BASELINE_FILE)
      const before = baseline.equipments.length
      baseline.equipments = baseline.equipments.filter((e) => e.name !== name)
      if (baseline.equipments.length === before) {
        // 未找到该装备
        return sendJson(res, 404, { ok: false })
      }
      writeJsonFile(BASELINE_FILE, baseline)
      return sendJson(res, 200, { ok: true })
    }
    return sendJson(res, 404, { error: 'not found' })
  } catch (err) {
    return sendJson(res, 500, { error: 'internal error', message: String(err && err.message || err) })
  }
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const ct = CONTENT_TYPES[ext] || 'application/octet-stream'
  res.writeHead(200, { 'Content-Type': ct, 'Cache-Control': 'no-cache' })
  fs.createReadStream(filePath).pipe(res)
}

function serveStatic(req, res, urlPath) {
  const rel = urlPath === '/' ? '/index.html' : urlPath
  const safe = path.normalize(rel).replace(/^(\.\.[/\\])+/, '')
  for (const base of [DIST_DIR, PUBLIC_DIR]) {
    const filePath = path.join(base, safe)
    if (filePath.startsWith(base + path.sep) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return sendFile(res, filePath)
    }
  }
  // SPA 回落
  const idx = path.join(DIST_DIR, 'index.html')
  if (fs.existsSync(idx)) return sendFile(res, idx)
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('Not Found')
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
  if (urlPath.startsWith('/api/')) {
    return handleApi(req, res, urlPath)
  }
  if (req.method === 'GET' || req.method === 'HEAD') {
    return serveStatic(req, res, urlPath)
  }
  res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('Method Not Allowed')
})

server.listen(PORT, () => {
  console.log(`[drg-server] listening on http://localhost:${PORT}`)
  console.log(`[drg-server] data dir: ${DATA_DIR}`)
  console.log(`[drg-server] static: ${fs.existsSync(DIST_DIR) ? DIST_DIR : PUBLIC_DIR + ' (dist 未构建)'}`)
})
