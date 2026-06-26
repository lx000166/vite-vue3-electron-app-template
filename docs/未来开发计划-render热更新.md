# 未来开发计划：Renderer 热更新（本地目录热替换方案）

> 状态：📋 设计阶段，待实施
> 日期：2026-06-26

---

## 目标

Electron 应用更新时，**仅替换 Vue/Renderer 部分的打包产物**（约 600 KB），无需重新下载整个 87 MB 安装包。同时支持**快速回滚**到任意历史版本。

---

## 架构概览

```
安装目录 (dist/win-unpacked/)
├── vite-vue3-tres-app.exe       ← Electron 二进制，永不热更新
├── resources/
│   └── app.asar                  ← main + preload + node_modules，大版本升级时更新
│
用户数据目录 (%APPDATA%/vite-vue3-tres-app/)
├── renderer/
│   ├── v1.0.0/                   ← 首次安装时从 app.asar 释放的兜底版本
│   │   ├── index.html
│   │   └── assets/
│   ├── v1.0.1/                   ← 热更新下载的版本
│   │   ├── index.html
│   │   └── assets/
│   └── v1.0.2/                   ← 每次更新保留历史版本
│       ├── index.html
│       └── assets/
└── renderer-version.json         ← 记录版本状态
```

### 版本状态文件 `renderer-version.json`

```json
{
  "current": "v1.0.2",
  "previous": "v1.0.1",
  "builtin": "v1.0.0",
  "installed": ["v1.0.0", "v1.0.1", "v1.0.2"],
  "maxVersions": 3,
  "lastCheck": "2026-06-26T10:00:00Z",
  "lastUpdate": "2026-06-26T10:05:00Z"
}
```

---

## 完整流程

### 一、打包阶段（构建时）

#### 1.1 修改 `electron-builder.yml`

```yaml
# 将 renderer 产物从 asar 中拆出，单独输出为 zip
asar: true
asarUnpack:
  - resources/**
  - out/renderer/**       # renderer 独立于 asar 之外

# 新增：打包 renderer 为独立 zip 供热更新
extraResources:
  - from: out/renderer
    to: renderer-builtin    # 内置兜底版本
```

#### 1.2 发布时额外产物

每次发版除了安装包，额外上传一个 `renderer-v1.0.x.zip` 到静态服务器：

```
https://your-server.com/updates/
├── renderer/
│   ├── v1.0.0.zip          ← 首次发版的 renderer
│   ├── v1.0.1.zip          ← 每次发版新增
│   ├── v1.0.2.zip
│   └── latest.json         ← 最新版本信息
└── (electron-builder 安装包)
```

#### 1.3 `latest.json` 格式

```json
{
  "version": "v1.0.2",
  "url": "https://your-server.com/updates/renderer/v1.0.2.zip",
  "sha256": "abc123...",
  "releaseDate": "2026-06-26",
  "releaseNotes": "修复3D模型加载问题；优化首页渲染性能",
  "minAppVersion": "1.0.0"
}
```

---

### 二、主进程逻辑（运行时）

#### 2.1 启动流程

```
应用启动
  │
  ├── 1. 读取 renderer-version.json
  │     ├── 文件存在 → 获取 current 版本号
  │     └── 文件不存在 → 首次启动
  │
  ├── 2. 定位 renderer 目录
  │     ├── 优先：%APPDATA%/renderer/{current}/
  │     ├── 兜底1：安装目录 out/renderer/（asarUnpack 后的内置版本）
  │     └── 兜底2：app.asar 内置路径（开发阶段）
  │
  ├── 3. 加载 renderer/index.html
  │     ├── 成功 → 显示窗口
  │     └── 失败 → 标记当前版本异常 → 切到 previous 版本 → 重试
  │
  └── 4. 后台检查更新（异步，不阻塞启动）
        └── 有新版本 → 下载 → 解压 → 更新 version.json → 等待下次启动生效
```

#### 2.2 主进程代码示例

```ts
// src/main/updater/renderer-loader.ts

import { app } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'

interface VersionState {
  current: string
  previous: string
  builtin: string
  installed: string[]
  maxVersions: number
}

const USER_DATA = app.getPath('userData')
const VERSION_FILE = join(USER_DATA, 'renderer-version.json')
const RENDERER_DIR = join(USER_DATA, 'renderer')

/**
 * 获取当前生效的 renderer 路径（按优先级）
 * 1. 用户数据目录下的最新热更新版本
 * 2. 安装目录下的内置版本（asarUnpack）
 * 3. asar 内的打包版本（开发/兜底）
 */
function getRendererPath(): string {
  const state = loadVersionState()

  if (state) {
    // 优先使用热更新版本
    const hotPath = join(RENDERER_DIR, state.current, 'index.html')
    if (existsSync(hotPath)) {
      return hotPath
    }

    // 当前版本异常，回退到上一版本
    if (state.previous) {
      const prevPath = join(RENDERER_DIR, state.previous, 'index.html')
      if (existsSync(prevPath)) {
        markCurrentVersionBusted(state)
        return prevPath
      }
    }
  }

  // 兜底：安装目录内置版本
  const builtinPath = join(__dirname, '../renderer-builtin/index.html')
  if (existsSync(builtinPath)) {
    return builtinPath
  }

  // 最终兜底：asar 内路径
  return join(__dirname, '../renderer/index.html')
}

/**
 * 加载版本状态文件
 */
function loadVersionState(): VersionState | null {
  try {
    if (existsSync(VERSION_FILE)) {
      return JSON.parse(readFileSync(VERSION_FILE, 'utf-8'))
    }
  } catch {
    // 文件损坏，忽略
  }
  return null
}

/**
 * 标记当前版本异常，自动回退
 */
function markCurrentVersionBusted(state: VersionState): void {
  state.previous = state.builtin  // 回退到内置版本
  saveVersionState(state)
}

function saveVersionState(state: VersionState): void {
  writeFileSync(VERSION_FILE, JSON.stringify(state, null, 2), 'utf-8')
}
```

#### 2.3 更新检查逻辑

```ts
// src/main/updater/renderer-updater.ts

import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync, createWriteStream, unlinkSync } from 'fs'
import { pipeline } from 'stream/promises'
import { createGunzip } from 'zlib'
import * as tar from 'tar'

interface UpdateInfo {
  version: string
  url: string
  sha256: string
  releaseNotes: string
}

const UPDATE_URL = 'https://your-server.com/updates/renderer/latest.json'
const USER_DATA = app.getPath('userData')
const RENDERER_DIR = join(USER_DATA, 'renderer')
const VERSION_FILE = join(USER_DATA, 'renderer-version.json')

/**
 * 检查并下载 renderer 更新
 * - 请求 latest.json 获取最新版本信息
 * - 如果本地版本 < 远程版本，下载 zip 并解压
 * - 更新版本状态文件
 * - 注意：下载完成后不立即切换，等用户下次启动生效
 */
async function checkAndDownloadUpdate(): Promise<UpdateInfo | null> {
  try {
    // 1. 获取远程版本信息
    const response = await fetch(UPDATE_URL)
    const remote: UpdateInfo = await response.json()

    // 2. 对比本地版本
    const state = loadVersionState()
    if (state && state.current === remote.version) {
      return null  // 已是最新
    }

    // 3. 下载 renderer zip
    const zipPath = join(USER_DATA, `renderer-${remote.version}.zip`)
    await downloadFile(remote.url, zipPath)

    // 4. 校验 SHA256（可选但推荐）
    // const actualHash = await sha256File(zipPath)
    // if (actualHash !== remote.sha256) throw new Error('SHA256 mismatch')

    // 5. 解压到版本目录
    const versionDir = join(RENDERER_DIR, remote.version)
    if (!existsSync(versionDir)) {
      mkdirSync(versionDir, { recursive: true })
    }
    await extractZip(zipPath, versionDir)

    // 6. 清理下载文件
    unlinkSync(zipPath)

    // 7. 更新版本状态
    updateVersionState(state, remote.version)

    // 8. 清理旧版本（只保留 maxVersions 个）
    cleanupOldVersions(state)

    return remote
  } catch (error) {
    console.error('Renderer update check failed:', error)
    return null
  }
}

/**
 * 流式下载文件，避免内存爆炸
 */
async function downloadFile(url: string, destPath: string): Promise<void> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const fileStream = createWriteStream(destPath)
  const reader = response.body?.getReader()
  // ... 流式写入（伪代码，实际需处理 ReadableStream → Node WriteStream）
}

/**
 * 解压 zip 到目标目录
 */
async function extractZip(zipPath: string, destDir: string): Promise<void> {
  // 使用 adm-zip 或 extract-zip 解压
  // 跨平台方案：使用 Node 原生 + 第三方库
}

/**
 * 更新版本状态
 */
function updateVersionState(state: VersionState | null, newVersion: string): void {
  const maxVersions = state?.maxVersions ?? 3

  const newState: VersionState = {
    current: state?.current ?? 'v1.0.0',  // 等下次启动才切
    previous: state?.current ?? null,
    builtin: state?.builtin ?? 'v1.0.0',
    installed: [...(state?.installed ?? []), newVersion],
    maxVersions
  }

  saveVersionState(newState)
}

/**
 * 切换版本（在下次启动时由 loader 调用）
 */
function switchToVersion(version: string): void {
  const state = loadVersionState()
  if (!state || !state.installed.includes(version)) {
    throw new Error(`Version ${version} not installed`)
  }

  state.previous = state.current
  state.current = version
  saveVersionState(state)

  // 提示：需重启应用
  // dialog.showMessageBox({ message: '更新已就绪，请重启应用' })
}

/**
 * 清理超过保留数量的旧版本
 */
function cleanupOldVersions(state: VersionState): void {
  const versions = state.installed
  const max = state.maxVersions

  if (versions.length <= max) return

  // 按版本号排序，删除最早的
  const toRemove = versions.sort().slice(0, versions.length - max)

  for (const v of toRemove) {
    const dir = join(RENDERER_DIR, v)
    if (existsSync(dir)) {
      // 递归删除目录
      // fs.rmSync(dir, { recursive: true })
    }
    state.installed = state.installed.filter(x => x !== v)
  }

  saveVersionState(state)
}
```

---

### 三、渲染进程逻辑（Vue 端）

#### 3.1 版本信息展示

```vue
<!-- src/renderer/src/components/VersionInfo.vue -->
<script setup lang="ts">
const version = ref('')
const updateInfo = ref(null)

onMounted(async () => {
  // 通过 IPC 获取版本信息
  version.value = await window.electronAPI.getRendererVersion()
  updateInfo.value = await window.electronAPI.checkForUpdate()
})

function applyUpdate(): void {
  window.electronAPI.applyUpdate()  // 通知主进程切换版本并重启
}
</script>

<template>
  <div>
    <span>当前版本：{{ version }}</span>
    <n-button v-if="updateInfo" @click="applyUpdate">
      更新到 {{ updateInfo.version }} 并重启
    </n-button>
  </div>
</template>
```

#### 3.2 IPC 桥接

```ts
// src/preload/index.ts

contextBridge.exposeInMainWorld('electronAPI', {
  // 获取当前生效的 renderer 版本
  getRendererVersion: () => ipcRenderer.invoke('renderer:get-version'),

  // 检查是否有可用更新
  checkForUpdate: () => ipcRenderer.invoke('renderer:check-update'),

  // 应用更新（切换版本 + 重启）
  applyUpdate: () => ipcRenderer.invoke('renderer:apply-update'),

  // 获取更新日志
  getReleaseNotes: (version: string) => ipcRenderer.invoke('renderer:release-notes', version)
})
```

---

### 四、发布流程

```
1. pnpm build          ← 构建主进程 + renderer
2. 打包 renderer       ← 把 out/renderer/ 打成 renderer-v1.0.x.zip
3. 计算 SHA256         ← 用于客户端校验
4. 上传到静态服务器     ← renderer-v1.0.x.zip + 更新 latest.json
5. (可选) pnpm build:win ← 发布完整安装包（含内置兜底版本）
```

#### 自动化脚本

```bash
#!/bin/bash
# scripts/publish-renderer.sh

VERSION=$(node -p "require('./package.json').version")
RENDERER_ZIP="renderer-v${VERSION}.zip"
RENDERER_DIR="out/renderer"

# 1. 打包 renderer 为 zip
cd $RENDERER_DIR && zip -r "../../${RENDERER_ZIP}" .

# 2. 计算 SHA256
SHA256=$(sha256sum "${RENDERER_ZIP}" | cut -d ' ' -f 1)

# 3. 更新 latest.json
cat > latest.json <<EOF
{
  "version": "v${VERSION}",
  "url": "https://your-server.com/updates/renderer/${RENDERER_ZIP}",
  "sha256": "${SHA256}",
  "releaseDate": "$(date -I)",
  "releaseNotes": ""
}
EOF

# 4. 上传到服务器
# scp ${RENDERER_ZIP} latest.json user@server:/path/to/updates/renderer/
```

---

### 五、边界情况处理

| 场景 | 处理方式 |
|------|----------|
| **首次启动（无 userData）** | 使用安装目录内置版本，后台静默释放到 userData |
| **当前版本文件损坏** | 自动回退到 previous → builtin → asar 内置 |
| **version.json 损坏** | 视为首次启动，从内置版本重建 |
| **下载中断** | 删除不完整的 zip，下次启动重新下载 |
| **磁盘空间不足** | 下载前检查可用空间；解压失败不切换版本 |
| **更新服务器不可达** | 跳过本次检查，不影响应用正常使用 |
| **SHA256 校验失败** | 删除下载文件，不安装，下次重试 |
| **历史版本超限** | 按版本号排序，删除最旧的，保留最新的 N 个 |

---

### 六、依赖

| 包 | 用途 |
|----|------|
| `adm-zip` 或 `extract-zip` | 解压 renderer zip |
| (无额外依赖) | 版本管理、下载逻辑均用 Node 内置 API |

---

### 七、与方案一（electron-updater）的关系

两个方案可以**共存**：

```
方案一（electron-updater）
  → 负责：main 进程 + node_modules 的大版本升级（偶尔，几十 MB）
  → 触发：弹窗提示下载完整安装包

方案三（本地热替换）
  → 负责：renderer 的频繁热更新（每次发版，几百 KB）
  → 触发：后台静默下载，下次启动自动生效
```

**优先级**：先实现方案三（renderer 热更新是刚需，改动频率最高），后续按需加上方案一。

---

### 八、实施步骤预估

| 步骤 | 工作量 | 说明 |
|------|--------|------|
| 1. 改造 `electron-builder.yml` | 小 | 添加 asarUnpack |
| 2. 实现 renderer-loader | 中 | 版本管理 + 兜底逻辑 |
| 3. 实现 renderer-updater | 中 | 下载 + 解压 + 校验 |
| 4. 实现 IPC 桥接 | 小 | preload 暴露版本 API |
| 5. Vue 端版本信息组件 | 小 | 展示版本 + 手动检查更新 |
| 6. 发布脚本 | 小 | 自动化打包上传 |
| 7. 测试（首次/更新/回滚/离线） | 中 | 各场景验证 |
| **总计** | **~2-3 天** | — |

---

### 九、参考

- [Electron app.getPath()](https://www.electronjs.org/docs/latest/api/app#appgetpathname)
- [Electron asar 文档](https://www.electronjs.org/docs/latest/tutorial/asar-archives)
- [Vite 构建产物结构](https://vite.dev/guide/build.html)
