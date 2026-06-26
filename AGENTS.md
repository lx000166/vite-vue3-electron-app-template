# AGENTS.md

## 语言约定

- **请始终用中文进行思考推理（reasoning）和回复，包括思维链部分。**

## 关键命令

- `pnpm dev` — 启动 Electron 开发环境（Vite 8 HMR + Electron 42 窗口）
- `pnpm build` — 类型检查 + 生产构建（`electron-vite build`），输出到 `out/`
- `pnpm build:win` / `pnpm build:mac` / `pnpm build:linux` — 平台打包（electron-builder）
- `pnpm lint` — ESLint 10 检查
- `pnpm typecheck` — 全量类型检查（node + web）
- `pnpm typecheck:node` — 仅主进程/预加载脚本类型检查
- `pnpm typecheck:web` — 仅渲染进程 vue-tsc 类型检查
- `pnpm format` — Prettier 格式化
- 提交前检查：`pnpm lint && pnpm typecheck`

## 技术栈

| 层级      | 技术                                                 | 版本       |
| --------- | ---------------------------------------------------- | ---------- |
| 桌面框架  | Electron                                             | 42         |
| 前端框架  | Vue 3 + Composition API + `<script setup lang="ts">` | 3.5        |
| 构建工具  | electron-vite + Vite（Rolldown）                     | 6 beta / 8 |
| 类型系统  | TypeScript                                           | 6          |
| UI 组件库 | Naive UI（自动按需注册）                             | 2.44       |
| CSS 方案  | UnoCSS（原子化优先）+ SCSS（复杂样式）               | 66 / 1.x   |
| 状态管理  | Pinia                                                | 3          |
| 路由      | Vue Router（Hash 模式 + 文件路由）                   | 5.1        |
| 工具库    | VueUse                                               | 14         |
| 代码规范  | ESLint 10 + Prettier                                 | —          |

## 架构与目录

```
src/
├── main/index.ts              # Electron 主进程（无边框窗口 + 生命周期）
├── preload/index.ts            # 预加载脚本（安全桥接）
└── renderer/
    ├── index.html              # 入口 HTML
    └── src/
        ├── App.vue             # 根组件（Naive UI Provider 包裹）
        ├── main.ts             # 渲染进程入口（挂载 Pinia/Router/UnoCSS）
        ├── pages/              # 📁 文件路由：自动扫描生成路由
        │   ├── index.vue       #   → /
        │   └── demo.vue        #   → /demo
        ├── views/              # 📄 手动路由：在 router/index.ts 中显式配置
        │   └── HomeView.vue    #   → /home
        ├── components/         # 公共组件（自动注册，无需 import）
        ├── stores/             # Pinia 状态管理（自动导入）
        ├── router/index.ts     # 路由配置（手动 + 文件路由合并）
        ├── types/              # 自动生成的类型声明（不提交 Git）
        │   ├── auto-imports.d.ts      # AutoImport 全局类型
        │   ├── components.d.ts        # 组件自动注册类型
        │   ├── typed-router.d.ts      # 文件路由类型
        │   └── env.d.ts               # Vite 客户端类型引用
        └── assets/             # 静态资源（字体、图标、CSS）
```

### 路由机制（双模式并存）

| 模式         | 目录     | 路由定义方式                                            |
| ------------ | -------- | ------------------------------------------------------- |
| **文件路由** | `pages/` | 文件名自动映射为路由路径，由 `vue-router/vite` 插件生成 |
| **手动路由** | `views/` | 在 `router/index.ts` 的 `manualRoutes` 数组中手动配置   |

- 文件路由命名规则：`pages/index.vue` → `/`，`pages/users/[id].vue` → `/users/:id`
- 手动路由优先：同名路径以 `manualRoutes` 中的为准（数组在前面）
- 所有页面组件自动懒加载（代码分割）

### AutoImport 全局可用（无需手动 import）

- **Vue API**：`ref`、`computed`、`watch`、`onMounted`、`nextTick` 等
- **VueUse**：`useNow`、`useDateFormat`、`useTitle`、`useDark` 等全部函数
- **Vue Router**：`useRouter`、`useRoute`、`onBeforeRouteLeave` 等
- **Pinia**：`defineStore`、`storeToRefs`、`createPinia` 等
- **Naive UI**：`useMessage`、`useDialog`、`useNotification`、`useLoadingBar`
- **自定义目录**：`src/stores/`、`src/composables/` 下的导出自动可用

### 组件自动注册（无需手动 import）

Naive UI 组件（`NButton`、`NCard`、`NConfigProvider`、`NSpace`、`NScrollbar` 等）以及 `src/components/` 下的组件在模板中直接使用，由 `unplugin-vue-components` 按需注册。

## 命名与编码约定

- **样式优先使用 UnoCSS**：支持原子 class（`class="flex p-4"`）和属性模式（`flex="~" p="4"`），全局 reset、字体注册、复杂动画等场景使用 SCSS
- **主进程代码**：函数名、变量名使用中文，贴近业务语义（如 `生成圆角窗口区域`）
- **渲染进程代码**：函数名、变量名使用英文驼峰命名，类型使用 PascalCase
- **Vue SFC 顺序**：`<script setup lang="ts">` → `<template>` → `<style>`（或 UnoCSS 工具类）
- **组件拆分**：单个组件不超过一个明确职责，复杂页面拆分为容器组件 + 展示组件
- **状态管理**：跨组件共享状态用 Pinia store，局部状态用 `ref`/`reactive`
- **数据流**：Props 向下，Events 向上，**禁止使用 `provide/inject`**，跨层级共享状态统一用 Pinia store

## 窗口与主进程

- **无边框窗口**：`frame: false`，可在渲染进程自定义标题栏
- **菜单栏**：`autoHideMenuBar: true`，Alt 键临时显示
- **外部链接**：通过 `shell.openExternal()` 在系统浏览器打开
- **单实例锁**：`app.requestSingleInstanceLock()` 防止多开
- **窗口状态持久化**：`electron-window-state` 记忆窗口位置和尺寸
- **IPC 通信**：主进程 `ipcMain.on()` 监听，预加载脚本通过 `contextBridge` 暴露 API
- **Electron 版本**：42（Chromium 146 / Node 24），API 参考 [electronjs.org/docs](https://electronjs.org/docs)

## 构建与打包

- `electron-vite build` 分别构建 main / preload / renderer 三套环境
- `electron-builder` 打包为平台安装包（NSIS / DMG / AppImage / snap / deb）+ 绿色版 zip
- `electron-builder.yml` 中排除源码和配置文件，仅保留运行所需
- 自动更新已去除（`publish` 配置已移除，`dev-app-update.yml` 已删除）

### 打包体积优化（已实施）

| 优化项               | 方式                                                         | 效果                      |
| -------------------- | ------------------------------------------------------------ | ------------------------- |
| devDependencies 隔离 | 移除 `shamefully-hoist`，pnpm 原生区分 prod/dev              | app.asar 77→57 MB         |
| 语言包精简           | `electronLanguages: [zh-CN, en-US]`                          | locales 48→1.2 MB（↓97%） |
| 多余文件排除         | 过滤 node_modules 中的 CHANGELOG/LICENSE/md/test/map/ts 文件 | 减少无用文件              |
| 安装包压缩           | NSIS 7z 固实压缩                                             | 安装包 107→87 MB          |
| 文档排除             | 排除 `AGENTS.md`、`CLAUDE.md`、`.agents/`                    | 减少非运行时文件          |

> 剩余的 57 MB app.asar 主要为 Naive UI 组件库（~39 MB）及其运行时依赖，已通过 `unplugin-vue-components` 按需加载。

## 检查范围

- 生成的类型文件（`src/renderer/src/types/auto-imports.d.ts`、`components.d.ts`、`typed-router.d.ts`）不提交到 Git
- `node_modules/`、`out/`、`dist/` 已在 `.gitignore` 中排除
- ESLint 忽略：`node_modules`、`dist`、`out`、`auto-imports.d.ts`、`components.d.ts`

## 配置文件索引

| 文件                                                         | 用途                                                             |
| ------------------------------------------------------------ | ---------------------------------------------------------------- |
| `electron.vite.config.ts`                                    | Vite + 插件配置（Vue、UnoCSS、AutoImport、Components、文件路由） |
| `electron-builder.yml`                                       | 打包配置（平台目标、NSIS、自动更新）                             |
| `tsconfig.json` / `tsconfig.node.json` / `tsconfig.web.json` | TypeScript 配置                                                  |
| `eslint.config.mjs`                                          | ESLint 10 flat config                                            |
| `uno.config.ts`                                              | UnoCSS 预设、快捷方式、主题                                      |
| `.npmrc`                                                     | npm 镜像 + Electron 二进制镜像                                   |
| `.prettierrc.yaml`                                           | Prettier 格式化规则                                              |
