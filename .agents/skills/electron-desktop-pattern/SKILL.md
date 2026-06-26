---
name: electron-desktop-pattern
description: Electron 桌面应用开发模式。涉及主进程、窗口管理、IPC 通信、预加载脚本、electron-builder 打包等 Electron 特定功能时使用。
license: MIT
---

# Electron Desktop Pattern — 桌面应用开发模式

当任务涉及 Electron 主进程、窗口创建、IPC 通信、预加载脚本、系统集成等功能时，遵循以下模式。

## 进程架构

```
┌──────────────────────────────────────────┐
│  主进程 (Main Process)                    │
│  src/main/index.ts                       │
│  - 窗口管理、生命周期、IPC 监听            │
│  - 可访问 Node.js 完整 API                │
└──────────────┬───────────────────────────┘
               │ IPC
┌──────────────┴───────────────────────────┐
│  预加载脚本 (Preload Script)              │
│  src/preload/index.ts                    │
│  - contextBridge 暴露安全 API 给渲染进程    │
│  - 有限的 Node.js 能力                   │
└──────────────┬───────────────────────────┘
               │
┌──────────────┴───────────────────────────┐
│  渲染进程 (Renderer Process)              │
│  src/renderer/                           │
│  - Vue 3 应用，浏览器环境                 │
│  - 通过预加载暴露的 API 与主进程通信        │
└──────────────────────────────────────────┘
```

## 窗口创建模式

```ts
// src/main/index.ts
const mainWindow = new BrowserWindow({
  width: 900,             // 窗口宽度
  height: 670,            // 窗口高度
  show: false,            // 延迟显示，避免白屏闪烁
  frame: false,           // 无边框窗口
  autoHideMenuBar: true,  // 隐藏菜单栏，Alt 键临时显示
  webPreferences: {
    preload: join(__dirname, '../preload/index.js'),
    sandbox: false
  }
})

// 就绪后显示
mainWindow.on('ready-to-show', () => mainWindow.show())

// 开发/生产模式加载
if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
  mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
} else {
  mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
}
```

## IPC 通信模式

### 主进程（监听）
```ts
// src/main/index.ts
import { ipcMain } from 'electron'

ipcMain.on('channel-name', (event, ...args) => {
  // 处理来自渲染进程的请求
  event.reply('channel-name-reply', result)
})

ipcMain.handle('invoke-channel', async (event, ...args) => {
  // 处理 invoke/handle 模式的请求（支持 async/await）
  return result
})
```

### 预加载脚本（暴露 API）
```ts
// src/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  doSomething: (args) => ipcRenderer.invoke('invoke-channel', args),
  onEvent: (callback) => ipcRenderer.on('event-channel', callback)
})
```

### 渲染进程（调用）
```ts
// 在 .vue 文件中
const result = await window.electronAPI.doSomething(data)
```

## 外部链接处理

始终拦截 `window.open`，在系统默认浏览器中打开：
```ts
mainWindow.webContents.setWindowOpenHandler((details) => {
  shell.openExternal(details.url)
  return { action: 'deny' }
})
```

## 平台差异处理

```ts
// macOS 特殊行为
if (process.platform === 'darwin') {
  // 点击 Dock 图标重新创建窗口
}

// Linux 图标设置
...(process.platform === 'linux' ? { icon } : {})

// Windows 任务栏分组
electronApp.setAppUserModelId('com.electron')
```

## 构建与打包

- `electron-vite build` — 分别构建 main（SSR）、preload（SSR）、renderer（client）
- `electron-builder --win/mac/linux` — 平台打包
- `electron-builder.yml` — 打包配置（排除源码文件、平台目标、自动更新）
- Electron 二进制从 npmmirror 镜像下载（`.npmrc` 配置）

## 调试

- 开发环境：渲染进程自动打开 DevTools（F12），主进程日志输出到终端
- 生产环境：`Ctrl+R` 快捷键被禁用（`optimizer.watchWindowShortcuts`）
- Vite 8 Rolldown：主进程/预加载构建极快（< 500ms）

## 注意事项

- 不要在渲染进程中直接使用 Node.js API（需通过预加载桥接）
- 主进程代码可使用中文命名（本项目约定）
- `sandbox: false` 为当前配置，生产环境建议开启
- Electron 42 基于 Chromium 146 / Node 24，使用前检查 API 兼容性
