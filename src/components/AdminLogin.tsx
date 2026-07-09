// 管理员登录弹窗：SHA-256 验证，不可逆，密码存 hash
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

// SHA-256 hash of "123qwe!@#QWE" (预计算，不可逆)
const ADMIN_PASSWORD_HASH = '54f3ebc9d00ce107fbaa9e729f9996cda43dd4e75717187848828f8ddc540750'
const ADMIN_STORAGE_KEY = 'drg-helper-admin-token'

/** 浏览器端 SHA-256 哈希 */
async function sha256(input: string): Promise<string> {
  const enc = new TextEncoder()
  const data = enc.encode(input)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const hash = await sha256(password)
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
