/**
 * IPC 通信注册 — 主进程端监听事件（渲染进程通过 preload 调用）
 *
 * 涵盖：
 * - 窗口控制：最小化、最大化/还原、关闭
 * - 开发工具：打开 DevTools、强制刷新（缓存穿透）
 */
import { ipcMain, BrowserWindow } from 'electron'

/**
 * 注册所有 IPC 事件处理器
 *
 * 在 app.whenReady() 中调用，必须在创建窗口前完成注册。
 */
function registerIpcHandlers(): void {
  // 示例：渲染进程 ping → 主进程 pong
  ipcMain.on('ping', () => console.log('pong'))

  // ── 窗口控制 ────────────────────────────────
  ipcMain.on('window:minimize', () => {
    BrowserWindow.getFocusedWindow()?.minimize()
  })
  ipcMain.on('window:toggle-maximize', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      win.isMaximized() ? win.unmaximize() : win.maximize()
    }
  })
  ipcMain.on('window:close', () => {
    BrowserWindow.getFocusedWindow()?.close()
  })

  // ── 开发工具（dev 模式专用） ────────────────
  ipcMain.on('window:open-devtools', () => {
    BrowserWindow.getFocusedWindow()?.webContents.openDevTools()
  })
  ipcMain.on('window:force-reload', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      win.webContents.reloadIgnoringCache()
    }
  })
}

export { registerIpcHandlers }
