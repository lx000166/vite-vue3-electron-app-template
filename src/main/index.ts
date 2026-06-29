/**
 * 主进程入口 — 应用生命周期管理
 *
 * 职责：
 * - 单实例锁，防止多开
 * - 等待 Electron ready 后创建窗口并注册 IPC
 * - 处理 macOS Dock 和所有窗口关闭的退出逻辑
 *
 * 具体实现委托给：
 * - window.ts   → 浏览器窗口创建与配置
 * - ipc.ts      → 主进程端 IPC 事件注册
 */
import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createWindow } from './window'
import { registerIpcHandlers } from './ipc'

// ── 单实例锁 ──────────────────────────────────
// 防止用户多次启动应用；第二个实例触发时激活已有窗口
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const win = BrowserWindow.getAllWindows()[0]
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
}

// ── 应用就绪 ──────────────────────────────────
app.whenReady().then(() => {
  // Windows 任务栏分组 ID
  electronApp.setAppUserModelId('com.electron')

  // 开发环境：为每个新窗口绑定 DevTools 快捷键
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 注册所有 IPC 通信通道（必须在创建窗口前）
  registerIpcHandlers()

  // 创建主窗口
  createWindow()

  // macOS：点击 Dock 图标且无窗口时重新创建
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// ── 应用退出 ──────────────────────────────────
// 所有窗口关闭时退出（macOS 应用通常不退出，此处统一）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
