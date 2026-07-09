// 管理员登录弹窗：SHA-256 验证（纯 JS，兼容 HTTP），不可逆
import { useState, type FormEvent } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material'
import { useLang } from '../i18n/LangContext'

// 管理密码 SHA-256 哈希（预计算，不可逆，明文不存于代码）
const ADMIN_PASSWORD_HASH = '86a6c90c00c971ae42f9f6e36c73277f79fe0ad823dc3d335c2b25df16bd7d4b'
const ADMIN_STORAGE_KEY = 'drg-helper-admin-token'

/**
 * 纯 JS SHA-256 实现（兼容 HTTP 环境，无需 Web Crypto API）
 * 注意：此实现仅用于登录验证，非安全审计级；密码不可逆。
 */
function sha256(input: string): string {
  // 常量
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
    0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
    0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]

  const rightRotate = (x: number, c: number) => (x >>> c) | (x << (32 - c)) >>> 0
  const toHex = (n: number) => n.toString(16).padStart(8, '0')

  // UTF-8 encode
  const utf8 = encodeURIComponent(input).replace(
    /%([0-9A-F]{2})/g,
    (_, h) => String.fromCharCode(parseInt(h, 16))
  )
  const msg: number[] = []
  for (let i = 0; i < utf8.length; i++) msg.push(utf8.charCodeAt(i))

  // Append 0x80 + padding
  const bitLen = msg.length * 8
  msg.push(0x80)
  while ((msg.length * 8) % 512 !== 448) msg.push(0)

  // Append length in bits as big-endian 64-bit
  for (let i = 0; i < 8; i++) msg.push(i < 4 ? 0 : (bitLen >>> ((7 - i) * 8)) & 0xff)

  // Process chunks
  let H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]

  for (let chunk = 0; chunk < msg.length; chunk += 64) {
    const W: number[] = []
    for (let t = 0; t < 16; t++) {
      W[t] = (msg[chunk + t * 4] << 24) | (msg[chunk + t * 4 + 1] << 16) |
             (msg[chunk + t * 4 + 2] << 8) | msg[chunk + t * 4 + 3]
    }
    for (let t = 16; t < 64; t++) {
      const s0 = rightRotate(W[t - 15], 7) ^ rightRotate(W[t - 15], 18) ^ (W[t - 15] >>> 3)
      const s1 = rightRotate(W[t - 2], 17) ^ rightRotate(W[t - 2], 19) ^ (W[t - 2] >>> 10)
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0
    }

    let [a, b, c, d, e, f, g, h] = H

    for (let t = 0; t < 64; t++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)
      const ch = (e & f) ^ ((~e) & g)
      const temp1 = (h + S1 + ch + K[t] + W[t]) >>> 0
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const temp2 = (S0 + maj) >>> 0

      h = g
      g = f
      f = e
      e = (d + temp1) >>> 0
      d = c
      c = b
      b = a
      a = (temp1 + temp2) >>> 0
    }

    H = [
      H[0] + a, H[1] + b, H[2] + c, H[3] + d,
      H[4] + e, H[5] + f, H[6] + g, H[7] + h,
    ].map((v) => v >>> 0) as typeof H
  }

  return H.map(toHex).join('')
}

/** 检查是否已登录（localStorage token） */
export function checkAdminLoggedIn(): boolean {
  try {
    return localStorage.getItem(ADMIN_STORAGE_KEY) === ADMIN_PASSWORD_HASH
  } catch {
    return false
  }
}

/** 退出登录 */
export function adminLogout(): void {
  try {
    localStorage.removeItem(ADMIN_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function AdminLogin({
  open,
  onLogin,
}: {
  open: boolean
  onLogin: () => void
}) {
  const { lang } = useLang()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const hash = sha256(password)
      if (hash === ADMIN_PASSWORD_HASH) {
        localStorage.setItem(ADMIN_STORAGE_KEY, hash)
        setPassword('')
        onLogin()
      } else {
        setError(lang === 'zh' ? '密码错误' : 'Incorrect password')
      }
    } catch {
      setError(lang === 'zh' ? '验证失败，请重试' : 'Verification failed, please retry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} maxWidth="xs" fullWidth disableEscapeKeyDown>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {lang === 'zh' ? '管理员登录' : 'Admin Login'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {lang === 'zh' ? '请输入管理密码' : 'Enter admin password'}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            fullWidth
            type="password"
            label={lang === 'zh' ? '密码' : 'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" disabled={loading || !password}>
            {loading
              ? lang === 'zh'
                ? '验证中…'
                : 'Verifying…'
              : lang === 'zh'
                ? '登录'
                : 'Login'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
