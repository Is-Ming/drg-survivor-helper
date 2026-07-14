/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'DRG: Survivor 助手',
        short_name: 'DRG助手',
        description: '深岩银河幸存者 成就/武器/装备速查',
        theme_color: '#F5A623',
        background_color: '#0d0d0d',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  // 跳过 outDir 自动清空：本机沙箱 safe-delete 守卫会拦截 vite 对 dist 的批量删除，
  // 导致 build 在 generateSW 之后报错。PWA 功能（manifest/sw）完全保留。
  build: {
    emptyOutDir: false,
  },
  // 开发态代理：前端（vite dev 5173）经同源 /api 访问 Node 常驻服务（8787），
  // 避免跨域；生产构建由 Node 服务同源托管，无需此代理。
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    // 排除中断安装的备份目录 node_modules_bak（含第三方自带测试文件，会因 import 解析失败误报，
    // 属环境噪音而非应用缺陷）以及 node_modules / dist 等默认项。
    exclude: [
      '**/node_modules_bak/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/.git/**',
      '**/.idea/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,eslint,jest,ava,babel,nyc,cypress,tsup,rollup}.config.*',
    ],
  },
})
