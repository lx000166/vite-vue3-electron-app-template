import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import windowStateKeeper from 'electron-window-state'
import icon from '../../resources/icon.png?asset'

// ── 单实例锁 ────────────────────────────────────
// 防止用户多次启动应用，第二次启动时激活已有窗口
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const mainWindow = BrowserWindow.getAllWindows()[0]
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

function createWindow(): void {
  // ── 窗口状态持久化（记忆上次位置和尺寸）──────
  const windowState = windowStateKeeper({
    defaultWidth: 900,
    defaultHeight: 670
  })

  // ── 创建浏览器窗口 ──────────────────────────────
  const mainWindow = new BrowserWindow({
    // [尺寸/位置] 从上次保存的状态恢复，首次使用默认值
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,

    // [显示控制] 设为 false，等 ready-to-show 事件触发后再显示，
    // 避免用户看到白屏闪烁
    show: false,

    // [窗口边框] 设为 false 移除系统标题栏和边框，
    // 实现无边框窗口，可配合前端自定义标题栏
    frame: false,

    // [菜单栏] 自动隐藏菜单栏（Windows/Linux），
    // 按下 Alt 键可临时显示
    autoHideMenuBar: true,

    // [平台配置] Linux 下设置应用图标（macOS/Win 由打包器处理）
    ...(process.platform === 'linux' ? { icon } : {}),

    // [安全与预加载]
    webPreferences: {
      // 预加载脚本路径：用于在渲染进程和主进程之间安全地暴露 API
      preload: join(__dirname, '../preload/index.js'),
      // 关闭沙箱：@electron-toolkit/utils 部分功能需要 Node.js 环境，
      // 生产环境如需启用，需通过 contextBridge 暴露受限 API
      sandbox: false
    }
  })

  // ── 注册窗口状态变化监听 ────────────────────
  // 窗口移动/缩放时自动保存位置和尺寸到本地文件
  windowState.manage(mainWindow)

  // ── 窗口就绪后显示 ──────────────────────────
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // ── 外部链接处理 ──────────────────────────────
  // 拦截 window.open 调用，改为在系统默认浏览器中打开，
  // 防止渲染进程导航到外部 URL
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // ── 加载页面 ──────────────────────────────────
  // 开发模式：加载 Vite 开发服务器 URL（支持 HMR 热更新）
  // 生产模式：加载构建后的本地 HTML 文件
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ── 应用生命周期 ──────────────────────────────────
// Electron 初始化完成后创建窗口。
// 只有在这个事件之后才能使用 BrowserWindow 等 API。
app.whenReady().then(() => {
  // 设置 Windows 任务栏上的应用 User Model ID，
  // 用于将应用窗口分组显示
  electronApp.setAppUserModelId('com.electron')

  // 开发环境下 F12 打开/关闭 DevTools，
  // 生产环境中忽略 Ctrl+R 刷新快捷键
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC 通信示例：渲染进程发送 'ping'，主进程打印 'pong'
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  // macOS 特有行为：点击 Dock 图标且没有窗口时重新创建窗口
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// ── 退出处理 ─────────────────────────────────────
// 所有窗口关闭时退出应用（macOS 除外，macOS 应用通常
// 保持活跃直到用户按 Cmd+Q 显式退出）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
