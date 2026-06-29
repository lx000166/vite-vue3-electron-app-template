/**
 * 预加载脚本 — 通过 contextBridge 安全地向渲染进程暴露 Electron API
 *
 * 暴露的全局对象：
 * - window.electron   → @electron-toolkit/preload 提供的 API
 * - window.electronAPI → 自定义窗口控制 API（最小化、最大化、关闭、DevTools）
 */
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// ── 窗口控制 API ──────────────────────────────
// 通过 IPC 向主进程发送操作指令
const windowAPI = {
  /** 最小化当前窗口 */
  windowMinimize: () => ipcRenderer.send('window:minimize'),
  /** 切换最大化 / 还原 */
  windowToggleMaximize: () => ipcRenderer.send('window:toggle-maximize'),
  /** 关闭当前窗口 */
  windowClose: () => ipcRenderer.send('window:close'),
  /** 打开开发者工具（仅开发模式显示按钮） */
  openDevTools: () => ipcRenderer.send('window:open-devtools'),
  /** 清除缓存并强制刷新（仅开发模式显示按钮） */
  forceReload: () => ipcRenderer.send('window:force-reload')
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
  // contextIsolation 关闭时的回退方案（不推荐，存在安全风险）
  // @ts-ignore contextIsolation=false 时 window 动态挂载
  window.electron = electronAPI
  // @ts-ignore contextIsolation=false 时 window 动态挂载
  window.electronAPI = windowAPI
}
