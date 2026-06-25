import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

/**
 * 生成圆角窗口区域，供 Windows / Linux 的 setShape 使用。
 * 通过顶部和底部逐行收窄宽度，拼出近似真实圆角窗口。
 * 内部使用 0.1 像素精度采样，让圆角边缘更细腻。
 * @param 窗口宽度 当前窗口宽度
 * @param 窗口高度 当前窗口高度
 * @param 圆角半径 圆角半径
 */
function 生成圆角窗口区域(
  窗口宽度: number,
  窗口高度: number,
  圆角半径: number
): Electron.Rectangle[] {
  // 区域集合(rectangles)用于描述窗口真实可见和可点击区域。
  const 区域集合: Electron.Rectangle[] = []
  const 有效半径 = Math.max(0, Math.min(圆角半径, Math.floor(Math.min(窗口宽度, 窗口高度) / 2)))
  const 采样精度 = 0.1

  const 计算左侧缩进 = (垂直位置: number): number => {
    if (垂直位置 < 有效半径) {
      const 顶部偏移 = Math.max(0, 有效半径 - 垂直位置 - 1)
      return Math.ceil(有效半径 - Math.sqrt(有效半径 * 有效半径 - 顶部偏移 * 顶部偏移))
    }

    if (垂直位置 >= 窗口高度 - 有效半径) {
      const 底部偏移 = Math.max(0, 垂直位置 - (窗口高度 - 有效半径))
      return Math.ceil(有效半径 - Math.sqrt(有效半径 * 有效半径 - 底部偏移 * 底部偏移))
    }

    return 0
  }

  for (let 当前行 = 0; 当前行 < 窗口高度; 当前行 += 1) {
    let 左侧缩进 = 0

    // 每一行内部再按 0.1 精度采样，取该行所需的最大缩进，避免边缘过于生硬。
    for (let 采样偏移 = 0; 采样偏移 < 1; 采样偏移 += 采样精度) {
      左侧缩进 = Math.max(左侧缩进, 计算左侧缩进(当前行 + 采样偏移))
    }

    const 当前宽度 = Math.max(1, 窗口宽度 - 左侧缩进 * 2)

    区域集合.push({
      x: 左侧缩进,
      y: 当前行,
      width: 当前宽度,
      height: 1
    })
  }

  return 区域集合
}

function createWindow(): void {
  // 主窗口尺寸(windowSize)用于统一维护透明无边框窗口大小。
  const 主窗口尺寸 = {
    width: 900,
    height: 670
  }
  // 圆角半径(cornerRadius)用于控制异形窗口圆角大小。
  const 圆角半径 = 8

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 主窗口尺寸.width,
    height: 主窗口尺寸.height,
    show: false,
    frame: false,
    transparent: true,
    hasShadow: false,
    backgroundColor: '#00000000',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    // 异形圆角(shape)在非 macOS 平台上通过 setShape 生成真实圆角窗口。
    if (process.platform !== 'darwin') {
      mainWindow.setShape(生成圆角窗口区域(主窗口尺寸.width, 主窗口尺寸.height, 圆角半径))
    }

    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
