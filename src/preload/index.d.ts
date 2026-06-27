// 预加载脚本类型声明
import { ElectronAPI } from '@electron-toolkit/preload'

/** 窗口控制 API */
interface WindowControlAPI {
  windowMinimize: () => void
  windowToggleMaximize: () => void
  windowClose: () => void
  openDevTools: () => void
  forceReload: () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    electronAPI: WindowControlAPI
  }
}
