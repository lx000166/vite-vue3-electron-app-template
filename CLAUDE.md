# AGENTS.md

## 语言约定

- **请始终用中文进行思考推理（reasoning）和回复，包括思维链部分。**

## 关键命令

- `pnpm dev` — 启动 Electron 开发环境（Vite 8 HMR + Electron 42 窗口）
- `pnpm build` — 类型检查 + 生产构建（`electron-vite build`），输出到 `out/`
- `pnpm build:win` / `pnpm build:mac` / `pnpm build:linux` — 平台打包（electron-builder）
- `pnpm build:win:zip` — 仅构建绿色版 zip
- `pnpm lint` — ESLint 10 检查
- `pnpm typecheck` — 全量类型检查（node + web）
- `pnpm typecheck:node` — 仅主进程/预加载脚本类型检查
- `pnpm typecheck:web` — 仅渲染进程 vue-tsc 类型检查
- `pnpm format` — Prettier 格式化
- `pnpm clean` — 清理 `out/` 和 `dist/`
- 提交前检查：`pnpm lint && pnpm typecheck`

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 桌面框架 | Electron | 42 |
| 前端框架 | Vue 3 + Composition API + `<script setup lang="ts">` | 3.5 |
| 构建工具 | electron-vite + Vite（Rolldown） | 6 beta / 8 |
| 类型系统 | TypeScript | 6 |
| UI 组件库 | Naive UI（自动按需注册） | 2.44 |
| CSS 方案 | UnoCSS（原子 class + 属性模式）+ SCSS | 66 / 1.x |
| 图标库 | IconPark Outline（UnoCSS safelist 全量，~2600 图标） | — |
| 状态管理 | Pinia | 3 |
| 路由 | Vue Router（Hash 模式 + 文件路由 + `definePage`） | 5.1 |
| 工具库 | VueUse | 14 |
| 代码规范 | ESLint 10 + Prettier | — |

## 架构与目录

```
src/
├── main/
│   ├── index.ts               # 主进程入口（生命周期 + 委托调用）
│   ├── window.ts              # 窗口创建（BrowserWindow 配置 + 状态持久化）
│   └── ipc.ts                 # IPC 通信注册（窗口控制等）
├── preload/
│   ├── index.ts               # 预加载脚本（contextBridge 暴露 API）
│   └── index.d.ts             # 预加载 API 类型声明
└── renderer/
    ├── index.html              # 入口 HTML
    └── src/
        ├── App.vue             # 根组件（NaiveUI Provider + 布局：CSS 变量传递）
        ├── main.ts             # 渲染进程入口（挂载 Pinia/Router/UnoCSS）
        ├── pages/              # 📁 文件路由：vue-router/vite 自动扫描生成
        │   ├── login.vue       #   → /login（无标题栏）
        │   ├── home.vue        #   → /home（侧边栏，3D 四棱柱示例）
        │   ├── setting.vue     #   → /setting（侧边栏，退出登录）
        │   ├── tres.vue        #   → /tres（无侧边栏，header 翻转）
        │   ├── icons.vue       #   → /icons（IconPark 图标库展示）
        │   └── [...all].vue    #   → 404 兜底
        ├── components/         # 公共组件（自动注册）
        │   ├── TitleBar.vue    #   标题栏（3D 翻转 A/B 面）
        │   ├── TitleBarFace.vue #  标题栏单面（三层：模糊/背景/内容）
        │   ├── SideMenu.vue    #   侧边栏菜单（NaiveUI n-menu + 折叠）
        │   └── MainContainer.vue # 主内容容器（自动撑满 + 平滑过渡）
        ├── stores/
        │   ├── app.ts          # 应用全局状态（标题）
        │   └── auth.ts         # 登录状态（localStorage 持久化）
        ├── composables/
        │   └── useMenu.ts      # 菜单数据（从路由 meta 提取）
        ├── config/
        │   └── menu-icons.ts   # 菜单图标常量（兜底图标）
        ├── theme/
        │   └── index.ts        # NaiveUI 主题 + 中文 locale
        ├── router/
        │   └── index.ts        # 路由配置（前置鉴权守卫）
        ├── types/
        │   ├── route-meta.d.ts # RouteMeta 扩展（layout/requiresAuth/addMenu）
        │   ├── env.d.ts        # Vite 客户端类型
        │   ├── auto-imports.d.ts     # 自动生成（不提交 Git）
        │   ├── components.d.ts       # 自动生成（不提交 Git）
        │   └── typed-router.d.ts     # 自动生成（不提交 Git）
        └── assets/
            ├── main.css        # 全局样式 + drag/no-drag 工具类
            ├── fonts.css       # 字体声明（MF MiMeng + FiraCode）
            ├── init.css        # UnoCSS reset
            └── fonts/          # 字体文件
```

### 路由机制

| 模式 | 目录 | 定义方式 |
|------|------|----------|
| **文件路由** | `pages/` | 文件名自动映射，`definePage({ meta })` 声明 meta |
| **手动路由** | `router/index.ts` | `createRouter` 的 routes 数组 |

- 每个页面通过 `definePage({ meta: {...} })` 声明布局模式、菜单信息
- 菜单项由 `useMenu.ts` 从 `router.getRoutes()` 中提取 `addMenu: true` 的路由
- 通配路由 `[...all].vue` 提供 404 兜底

### 布局系统

布局由 `App.vue` 内联管理，通过 CSS 变量 `--side-w` / `--title-h` 向子组件传递尺寸：

```
main (w-screen h-screen overflow-hidden)
├── router-view             z-index: 底层  页面内容
├── SideMenu（absolute）    z-index: 中层  侧边栏覆盖（v-if="layout==='sidebar'"）
└── TitleBar（absolute）    z-index: 顶层  标题栏覆盖（v-if="layout!=='none'"）
```

| layout meta 值 | 标题栏 | 侧边栏 | 适用页面 |
|----------------|--------|--------|----------|
| `none` | 隐藏 | 隐藏 | login |
| `sidebar` | 毛玻璃 | 显示 | home / setting / icons |
| `header` | 翻转 B 面 | 隐藏 | tres |

### AutoImport 全局可用（无需手动 import）

- **Vue API**：`ref`、`computed`、`watch`、`onMounted`、`nextTick` 等
- **VueUse**：全部函数
- **Vue Router**：`useRouter`、`useRoute`、`onBeforeRouteLeave` 等
- **Pinia**：`defineStore`、`storeToRefs`、`createPinia` 等
- **Naive UI**：`useMessage`、`useDialog`、`useNotification`、`useLoadingBar`
- **自定义目录**：`src/stores/`、`src/composables/` 下的导出自动可用

### 组件自动注册（无需手动 import）

Naive UI 组件以及 `src/components/` 下的组件在模板中直接使用。

## 命名与编码约定

- **样式优先使用 UnoCSS**：支持 class 模式（`class="flex p-4"`）和 Attributify 属性模式（`flex="~" p="4"`），复杂样式使用 SCSS
- **主进程代码**：函数名、变量名使用英文（`createWindow`、`registerIpcHandlers`），文件按职责拆分
- **渲染进程代码**：函数名、变量名使用英文驼峰命名，类型使用 PascalCase
- **Vue SFC 顺序**：`<script setup lang="ts">` → `<template>` → `<style scoped>`
- **组件拆分**：单个组件不超过一个明确职责，复杂页面拆分为容器组件 + 展示组件
- **状态管理**：跨组件共享状态用 Pinia store，局部状态用 `ref`/`reactive`
- **数据流**：Props 向下，Events 向上，**禁止使用 `provide/inject`**
- **页面 meta**：通过 `definePage({ meta })` 声明，不在路由文件中硬编码

## 窗口与主进程

- **无边框窗口**：`frame: false`，前端自定义 TitleBar
- **菜单栏**：`autoHideMenuBar: true`，Alt 键临时显示
- **外部链接**：通过 `shell.openExternal()` 在系统浏览器打开
- **单实例锁**：`app.requestSingleInstanceLock()` 防止多开
- **窗口状态持久化**：`electron-window-state` 记忆窗口位置和尺寸
- **IPC 通信**：
  - 窗口控制：`window:minimize` / `window:toggle-maximize` / `window:close` / `window:open-devtools` / `window:force-reload`
  - 预加载暴露：`window.electronAPI`（窗口控制 API）+ `window.electron`（@electron-toolkit 提供）
- **Electron 版本**：42（Chromium 146 / Node 24）

## CSS 变量

App.vue 通过 `:style` 向下传递的 CSS 自定义属性：

| 变量 | 来源 | 用途 |
|------|------|------|
| `--side-w` | App.vue `60` 或 `180`px（折叠/展开） | SideMenu 宽度、MainContainer left-padding、menu-slide 动画距离 |
| `--title-h` | App.vue `40`px | TitleBar 高度、SideMenu top offset、MainContainer top-padding、title-slide 动画距离 |

## 构建与打包

- `electron-vite build` 分别构建 main / preload / renderer 三套环境
- `electron-builder` 打包为 NSIS 安装包 + 绿色版 zip
- `electron-builder.yml` 中排除源码和配置文件，仅保留运行所需
- 自动更新已去除

### 打包体积

| 指标 | 数值 | 说明 |
|------|------|------|
| 安装包 | 82 MB | NSIS 7z 压缩 |
| app.asar | 7.6 MB | 仅含主进程运行时依赖 |
| locales | 1.2 MB | 仅 zh-CN + en-US |

## 检查范围

- 生成的类型文件（`auto-imports.d.ts`、`components.d.ts`、`typed-router.d.ts`）不提交 Git
- `node_modules/`、`out/`、`dist/` 已在 `.gitignore` 中排除
- ESLint 忽略：`node_modules`、`dist`、`out`、`auto-imports.d.ts`、`components.d.ts`、`typed-router.d.ts`

## 配置文件索引

| 文件 | 用途 |
|------|------|
| `electron.vite.config.ts` | Vite + 插件配置（Vue、VueRouter 文件路由、UnoCSS、AutoImport、Components） |
| `electron-builder.yml` | 打包配置（平台目标、NSIS、语言包、文件过滤） |
| `tsconfig.json` / `tsconfig.node.json` / `tsconfig.web.json` | TypeScript 配置 |
| `eslint.config.mjs` | ESLint 10 flat config |
| `uno.config.ts` | UnoCSS 预设、IconPark 全量 safelist |
| `.npmrc` | npm 镜像 + Electron 二进制镜像 |
| `.prettierrc.yaml` | Prettier 格式化规则 |
