# DRG: Survivor 助手

《Deep Rock Galactic: Survivor》的成就查询 + 武器指南 + 装备图鉴工具。

玩游戏时开手机或浏览器就能查——哪个成就怎么解锁、武器超频哪家强、捡到的装备有什么用，一目了然。

## 功能速览

| 模块 | 能干什么 |
|---|---|
| **成就查询** | 300 项成就全收录，可按分类筛选、关键词搜索、按难度（极难/难/普通）过滤 |
| **武器指南** | 42 把武器的评级、官网标签、超频效果和正式名字，一键筛选职业/标签 |
| **装备图鉴** | 20 件局内装备，同时展示**官网原文**和**攻略解读**，两不耽误 |
| **中英双语** | 一键切换简体中文 / English |
| **PWA 离线** | 手机加主屏幕后像原生 App 一样用，没网也能查 |

## 在线版

部署在云服务器上，手机浏览器打开就能用。建议用 Chrome / Edge 打开后 **「添加到主屏幕」**，体验更好。

> 在线版链接请联系项目维护者获取。

## 本地运行

```bash
# 克隆
git clone git@github.com:Is-Ming/drg-survivor-helper-dev.git
cd drg-survivor-helper

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

构建产物在 `dist/` 目录，用任意静态服务器（nginx、caddy 等）直接托管即可。

## 技术栈

React 18 · TypeScript · Vite 5 · Material UI · Tailwind CSS · PWA (vite-plugin-pwa) · Vitest

## 许可

MIT
