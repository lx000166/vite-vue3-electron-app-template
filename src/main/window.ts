// 窗口创建 — 浏览器窗口实例化、配置、加载
import { BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import windowStateKeeper from 'electron-window-state'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // 窗口状态持久化（记忆上次位置和尺寸）
  const windowState = windowStateKeeper({
    defaultWidth: 900,
    defaultHeight: 670
  })

  const mainWindow = new BrowserWindow({
    // [尺寸/位置] 从上次保存的状态恢复，首次使用默认值
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,

    // [显示控制] 延迟显示，避免白屏闪烁
    show: false,

    // [窗口边框] 无边框窗口
    frame: false,

    // [菜单栏] 自动隐藏，Alt 键临时显示
    autoHideMenuBar: true,

    // [平台] Linux 图标
    ...(process.platform === 'linux' ? { icon } : {}),

    // [安全] 预加载脚本
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false // @electron-toolkit/utils 需要
    }
  })

  // 窗口移动/缩放时自动保存状态
  windowState.manage(mainWindow)

  // 渲染进程就绪后显示窗口
  mainWindow.on('ready-to-show', () => mainWindow.show())

  // 外部链接 → 系统浏览器打开
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 加载页面
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

export { createWindow }
