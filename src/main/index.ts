import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

/**
 * 生成三角形窗口区域，供 Windows / Linux 的 setShape 使用。
 * 这里按窗口底边向上逐行收窄，拼出等腰三角形区域。
 * @param 窗口宽度 当前窗口宽度
 * @param 窗口高度 当前窗口高度
 */
function 生成三角形窗口区域(窗口宽度: number, 窗口高度: number): Electron.Rectangle[] {
  // 区域集合(rectangles)用于拼接异形窗口的有效点击区域。
  const 区域集合: Electron.Rectangle[] = []

  for (let 当前行 = 0; 当前行 < 窗口高度; 当前行 += 1) {
    // 收窄比例(ratio)越接近顶部，保留宽度越小。
    const 收窄比例 = (当前行 + 1) / 窗口高度
    const 当前宽度 = Math.max(1, Math.floor(窗口宽度 * 收窄比例))
    const 起始横坐标 = Math.floor((窗口宽度 - 当前宽度) / 2)

    区域集合.push({
      x: 起始横坐标,
      y: 当前行,
      width: 当前宽度,
      height: 1
    })
  }

  return 区域集合
}

function createWindow(): void {
  // 主窗口尺寸(windowSize)同时用于 BrowserWindow 和异形窗口计算。
  const 主窗口尺寸 = {
    width: 900,
    height: 670
  }

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
    // 异形窗口(shape)目前主要在 Windows / Linux 上生效，macOS 不做设置。
    if (process.platform !== 'darwin') {
      mainWindow.setShape(生成三角形窗口区域(主窗口尺寸.width, 主窗口尺寸.height))
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
