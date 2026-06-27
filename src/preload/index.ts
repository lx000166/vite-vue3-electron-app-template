// 预加载脚本 — 安全地向渲染进程暴露 Electron API
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// ── 窗口控制 API（通过 IPC 通知主进程）─────────
const windowAPI = {
  /** 最小化窗口 */
  windowMinimize: () => ipcRenderer.send('window:minimize'),
  /** 切换最大化/还原 */
  windowToggleMaximize: () => ipcRenderer.send('window:toggle-maximize'),
  /** 关闭窗口 */
  windowClose: () => ipcRenderer.send('window:close'),
  /** 打开 DevTools（开发用） */
  openDevTools: () => ipcRenderer.send('window:open-devtools'),
  forceReload: () => ipcRenderer.send("window:force-reload"),
}

// ── 暴露到渲染进程 ────────────────────────────
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('electronAPI', windowAPI)
  } catch (error) {
    console.error('[preload] contextBridge 暴露失败:', error)
  }
} else {
  // 仅在 contextIsolation 关闭时回退（安全风险，不推荐）
  // @ts-ignore contextIsolation=false 时 window 上动态挂载 electron
  window.electron = electronAPI
  // @ts-ignore contextIsolation=false 时 window 上动态挂载 electronAPI
  window.electronAPI = windowAPI
}
