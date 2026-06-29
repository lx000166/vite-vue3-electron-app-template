/**
 * 窗口创建模块 — 浏览器窗口实例化、配置、状态持久化与页面加载
 *
 * - 使用 electron-window-state 记住窗口位置/尺寸
 * - 无边框窗口 + 自定义标题栏
 * - 外部链接在系统浏览器中打开
 * - 开发模式加载 dev server URL，生产模式加载本地 HTML
 */
import { BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import windowStateKeeper from 'electron-window-state'
import icon from '../../resources/icon.png?asset'

/**
 * 创建主窗口
 *
 * 配置要点：
 * - frame: false  → 无系统边框，配合前端自定义 TitleBar
 * - show: false   → 延迟显示，等待渲染就绪后展示，避免白屏
 * - sandbox: false → @electron-toolkit 工具函数需要关闭沙箱
 */
function createWindow(): void {
  // ── 窗口状态持久化 ──────────────────────────
  const windowState = windowStateKeeper({
    defaultWidth: 900,
    defaultHeight: 670
  })

  const mainWindow = new BrowserWindow({
    // 尺寸/位置：从上次保存的状态恢复
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,

    // 延迟显示，避免白屏闪烁
    show: false,

    // 无边框窗口（前端自定义 TitleBar）
    frame: false,

    // 菜单栏：Alt 键临时显示
    autoHideMenuBar: true,

    // Linux 图标
    ...(process.platform === 'linux' ? { icon } : {}),

    // 预加载脚本
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // 窗口移动/缩放时自动保存状态
  windowState.manage(mainWindow)

  // 渲染进程就绪后显示窗口
  mainWindow.on('ready-to-show', () => mainWindow.show())

  // 外部链接 → 系统默认浏览器打开
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // ── 页面加载 ────────────────────────────────
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    // 开发模式：加载 Vite dev server
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    // 生产模式：加载打包后的 HTML
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

export { createWindow }
