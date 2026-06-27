// IPC 通信 — 主进程端事件注册（渲染进程通过 preload 调用）
import { ipcMain, BrowserWindow } from 'electron'

function registerIpcHandlers(): void {
  // 示例：渲染进程发送 'ping'，主进程打印 'pong'
  ipcMain.on('ping', () => console.log('pong'))

  // ── 窗口控制 ──────────────────────────────
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
