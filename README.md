# DRG: Survivor 助手

《Deep Rock Galactic: Survivor》的工具类 PWA 应用，提供成就查询、武器指南和装备图鉴。

## 功能

- **成就查询** — 300 项成就全收录，支持分类筛选、关键词搜索和难度分档（极难/难/普通）
- **武器指南** — 42 把武器的评级、标签和超频信息，含官网标签筛选
- **装备图鉴** — 20 件局内装备的双描述展示（官网原文 + 攻略解读）
- **离线可用** — PWA 渐进式 Web 应用，支持安装到桌面和离线访问
- **中英双语** — 界面支持简体中文和英文切换

## 技术栈

- **框架**：React 18 + TypeScript
- **构建**：Vite 5
- **UI**：Material UI (MUI) + Tailwind CSS
- **PWA**：vite-plugin-pwa（Service Worker + 离线缓存）
- **测试**：Vitest + Testing Library
- **部署**：腾讯云服务器（Nginx 反向代理）

## 本地开发

```bash
git clone git@github.com:Is-Ming/drg-survivor-helper-dev.git
cd drg-survivor-helper
npm install
npm run dev
```

## 构建

```bash
npm run build
# 产物输出到 dist/ 目录
```

## 许可

MIT License
