// 独立回归测试：服务端持久化 + 一键固化（场景 1~6）
// 运行：node tests/server-api.mjs
//
// 设计要点：
//  - 在系统临时目录拷贝一份独立 server/（含 data/），服务端只在该副本上读写，
//    绝不污染仓库真实的 server/data（PUT / pin-baseline 会改 baseline.json、生成 baseline-v*.json）。
//  - 通过 ADMIN_PASSWORD_HASH 环境变量在**启动前**注入固定 token（"test-token"），
//    请求时以 X-Admin-Token 头携带同样的值。绝不写真实密钥到仓库文件。
//  - 端口用 8799 避免与常驻 8787 冲突。
//  - 退出前 kill 子进程并删除临时目录。

import { spawn } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = join(__dirname, '..') // tests/.. -> project root
const SERVER_SRC = join(PROJECT_ROOT, 'server')

const PORT = 8799
const TOKEN = 'test-token' // 仅测试用临时值，注入到子进程 env，不落库
const BASE = `http://localhost:${PORT}`

const results = []
function record(name, pass, detail = '') {
  results.push({ name, pass, detail })
  const tag = pass ? 'PASS' : 'FAIL'
  console.log(`[${tag}] ${name}${detail ? ' — ' + detail : ''}`)
}

function safeDeepEqual(a, b) {
  try {
    assert.deepStrictEqual(a, b)
    return true
  } catch {
    return false
  }
}

async function request(method, path, { token, body } = {}) {
  const headers = {}
  if (token) headers['X-Admin-Token'] = token
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  let json = null
  try {
    json = await res.json()
  } catch {
    /* no body / non-json */
  }
  return { status: res.status, json }
}

async function waitForServer(timeoutMs = 15000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(BASE + '/api/baseline')
      if (r.ok) return true
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error('server did not start in time')
}

async function main() {
  const tempServer = mkdtempSync(join(tmpdir(), 'drg-qa-'))
  cpSync(SERVER_SRC, tempServer, { recursive: true })
  const tempDataDir = join(tempServer, 'data')

  const child = spawn('node', [join(tempServer, 'index.js')], {
    env: { ...process.env, ADMIN_PASSWORD_HASH: TOKEN, PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stdout.on('data', () => {})
  child.stderr.on('data', (d) => process.stderr.write('[server] ' + d))

  try {
    await waitForServer()

    // ---------- S1：启动与基础读 ----------
    const baseRes = await request('GET', '/api/baseline')
    record('S1 GET /api/baseline → 200', baseRes.status === 200, `status=${baseRes.status}`)
    const weaponCount = baseRes.json?.weapons?.length
    record('S1 baseline 含 42 weapons', weaponCount === 42, `weapons=${weaponCount}`)
    const ovRes = await request('GET', '/api/overrides')
    record('S1 GET /api/overrides → 200', ovRes.status === 200, `status=${ovRes.status}`)
    const ovEmpty = ovRes.json && Object.keys(ovRes.json).length === 0
    record('S1 overrides 初始为 {}', ovEmpty, JSON.stringify(ovRes.json))

    const B0 = baseRes.json // 固化前的原始 baseline，用于 S6 校验

    // ---------- S2：鉴权 ----------
    const putNoToken = await request('PUT', '/api/overrides', { body: { weapons: {} } })
    record('S2 PUT 无 token → 401', putNoToken.status === 401, `status=${putNoToken.status}`)
    const delNoToken = await request('DELETE', '/api/overrides')
    record('S2 DELETE 无 token → 401', delNoToken.status === 401, `status=${delNoToken.status}`)
    const pinNoToken = await request('POST', '/api/pin-baseline')
    record('S2 POST pin 无 token → 401', pinNoToken.status === 401, `status=${pinNoToken.status}`)
    const putWithToken = await request('PUT', '/api/overrides', { token: TOKEN, body: { weapons: {} } })
    record('S2 PUT 带正确 token → 2xx', putWithToken.status >= 200 && putWithToken.status < 300, `status=${putWithToken.status}`)
    // 复位 overrides 为 {}，保证后续步骤状态干净
    await request('DELETE', '/api/overrides', { token: TOKEN })

    // ---------- S3：override 写入与存储 ----------
    const O1 = { weapons: { 'DeepCore GK2': { chineseName: '测试改名' } } }
    const putO1 = await request('PUT', '/api/overrides', { token: TOKEN, body: O1 })
    record('S3 PUT override → 200', putO1.status === 200, `status=${putO1.status}`)
    const ovAfterPut = await request('GET', '/api/overrides')
    const stored = ovAfterPut.json?.weapons?.['DeepCore GK2']?.chineseName
    record('S3 override 已写入 (DeepCore GK2 → 测试改名)', stored === '测试改名', `stored=${stored}`)

    // ---------- S4：删除指令的存储（"" / null）----------
    const delDir = {
      weapons: { 'DeepCore GK2': { chineseName: '' }, M1000: { chineseName: null } },
    }
    await request('PUT', '/api/overrides', { token: TOKEN, body: delDir })
    const ovDel = await request('GET', '/api/overrides')
    const cnEmpty = ovDel.json?.weapons?.['DeepCore GK2']?.chineseName === ''
    const cnNull = ovDel.json?.weapons?.M1000?.chineseName === null
    record(
      'S4 删除指令原样存储 (""→空串, null→null)',
      cnEmpty && cnNull,
      `gk2=${JSON.stringify(ovDel.json?.weapons?.['DeepCore GK2']?.chineseName)}, m1000=${JSON.stringify(ovDel.json?.weapons?.M1000?.chineseName)}`,
    )
    // 恢复为 O1，准备固化序列
    await request('PUT', '/api/overrides', { token: TOKEN, body: O1 })

    // ---------- S5：恢复默认 ----------
    const delRes = await request('DELETE', '/api/overrides', { token: TOKEN })
    record('S5 DELETE override → 200', delRes.status === 200, `status=${delRes.status}`)
    const ovAfterDel = await request('GET', '/api/overrides')
    record(
      'S5 DELETE 后 overrides 回 {}',
      ovAfterDel.json && Object.keys(ovAfterDel.json).length === 0,
      JSON.stringify(ovAfterDel.json),
    )

    // ---------- S6：一键固化（关键）----------
    await request('PUT', '/api/overrides', { token: TOKEN, body: O1 }) // 确保 overrides = O1
    const pin1 = await request('POST', '/api/pin-baseline', { token: TOKEN })
    record(
      'S6 POST pin → 200 且 version=1',
      pin1.status === 200 && pin1.json?.version === 1,
      `status=${pin1.status}, version=${pin1.json?.version}`,
    )

    // ① baseline-v1.json 生成且内容 == 固化前 baseline (B0)
    const v1Path = join(tempDataDir, 'baseline-v1.json')
    const v1Exists = existsSync(v1Path)
    const v1Eq = v1Exists ? safeDeepEqual(JSON.parse(readFileSync(v1Path, 'utf8')), B0) : false
    record('S6 ① baseline-v1.json 生成且 == 固化前 baseline', v1Exists && v1Eq, v1Exists ? '' : 'file missing')

    // ② baseline.json 内容 == 固化前 overrides（即 O1）
    const baseAfterPin1 = await request('GET', '/api/baseline')
    record('S6 ② baseline.json 内容 == 固化前 overrides (O1)', safeDeepEqual(baseAfterPin1.json, O1), '')

    // ③ overrides.json 保留不动（非空，仍为 O1）
    const ovAfterPin1 = await request('GET', '/api/overrides')
    record('S6 ③ overrides.json 保留不动 (== O1, 非空)', safeDeepEqual(ovAfterPin1.json, O1), '')

    // ④ 再固化一次 → baseline-v2.json，v1 仍在（全量保留）
    const O2 = { weapons: { M1000: { chineseName: '改名M1000' } } }
    await request('PUT', '/api/overrides', { token: TOKEN, body: O2 })
    const pin2 = await request('POST', '/api/pin-baseline', { token: TOKEN })
    record(
      'S6 ④ 第二次 POST pin → 200 且 version=2',
      pin2.status === 200 && pin2.json?.version === 2,
      `status=${pin2.status}, version=${pin2.json?.version}`,
    )

    const v2Path = join(tempDataDir, 'baseline-v2.json')
    const v2Exists = existsSync(v2Path)
    // 第二次固化时 baseline 内容为 O1（第一次固化写入的 overrides）
    const v2Eq = v2Exists ? safeDeepEqual(JSON.parse(readFileSync(v2Path, 'utf8')), O1) : false
    record('S6 ④ baseline-v2.json 生成且 == 固化时 baseline (O1)', v2Exists && v2Eq, v2Exists ? '' : 'file missing')

    const v1Still = v1Exists && safeDeepEqual(JSON.parse(readFileSync(v1Path, 'utf8')), B0)
    record('S6 ④ baseline-v1.json 仍在 (全量保留)', v1Still, '')

    const baseAfterPin2 = await request('GET', '/api/baseline')
    record('S6 ④ 二次固化后 baseline.json == O2', safeDeepEqual(baseAfterPin2.json, O2), '')
    const ovAfterPin2 = await request('GET', '/api/overrides')
    record('S6 ④ overrides.json 仍保留 == O2', safeDeepEqual(ovAfterPin2.json, O2), '')
  } catch (e) {
    record('FATAL', false, String((e && e.stack) || e))
  } finally {
    try {
      child.kill()
    } catch {
      /* ignore */
    }
    try {
      rmSync(tempServer, { recursive: true, force: true })
    } catch {
      /* ignore */
    }
  }

  const passed = results.filter((r) => r.pass).length
  const total = results.length
  const failed = total - passed
  console.log(`\n==== SERVER API TEST SUMMARY: ${passed}/${total} passed (${failed} failed) ====`)
  if (passed !== total) process.exitCode = 1
}

main()
