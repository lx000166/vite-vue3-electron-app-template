# vite-vue3-tres-app

Electron 桌面应用 — Vue 3 + TypeScript + Vite 8 + Naive UI

## 技术栈

| 类别     | 技术                                          |
| -------- | --------------------------------------------- |
| 桌面框架 | Electron 42                                   |
| 前端框架 | Vue 3.5（Composition API + `<script setup>`） |
| 构建工具 | electron-vite 6 + Vite 8（Rolldown）          |
| 类型系统 | TypeScript 6                                  |
| UI 组件  | Naive UI 2.44（自动按需注册）                 |
| CSS 方案 | UnoCSS 66（原子 class + 属性模式）+ SCSS      |
| 状态管理 | Pinia 3                                       |
| 路由     | Vue Router 5.1（Hash 模式 + 文件路由）        |
| 工具库   | VueUse 14                                     |
| 代码规范 | ESLint 10 + Prettier                          |

## 快速开始

### 环境要求

- Node.js ≥ 20.19 或 ≥ 22.12
- pnpm（推荐）

### 安装

```bash
pnpm install
```

### 开发

```bash
pnpm dev
```

启动后 Electron 窗口自动打开，Vite 8 HMR 热更新，渲染进程运行在 `http://localhost:5173`。

### 构建

```bash
# 类型检查 + 生产构建
pnpm build

# 平台打包
pnpm build:win      # Windows (NSIS)
pnpm build:mac      # macOS (DMG)
pnpm build:linux    # Linux (AppImage/snap/deb)
```

### 代码检查

```bash
pnpm lint           # ESLint
pnpm typecheck      # 全量类型检查
pnpm format         # Prettier 格式化
```

## 项目结构

```
src/
├── main/index.ts              # Electron 主进程
├── preload/index.ts            # 预加载脚本
└── renderer/
    ├── index.html
    └── src/
        ├── App.vue             # 根组件
        ├── main.ts             # 渲染进程入口
        ├── pages/              # 📁 文件路由（自动生成）
        ├── views/              # 📄 手动路由
        ├── components/         # 公共组件（自动注册）
        ├── stores/             # Pinia 状态管理
        ├── router/index.ts     # 路由配置
        ├── types/              # 自动生成类型声明
        └── assets/             # 静态资源
```

### 路由机制

| 方式     | 目录     | 说明                         |
| -------- | -------- | ---------------------------- |
| 文件路由 | `pages/` | 文件名即路由路径，自动懒加载 |
| 手动路由 | `views/` | 在 `router/index.ts` 中配置  |

## 项目规则

- **样式优先使用 UnoCSS**：全局 reset、字体注册等少数场景才写普通 CSS
- **全局自动导入**：Vue/VueUse/Pinia/Router/NaiveUI API 无需手动 import
- **组件自动注册**：Naive UI 和 `components/` 下组件模板中直接使用
- 详细约定见 `AGENTS.md` 和 `.agents/skills/`

## 窗口配置

- 无边框窗口（`frame: false`）
- 隐藏菜单栏，按 Alt 临时显示
- 外部链接在系统浏览器中打开
- 单实例锁，防止重复启动
- 窗口状态持久化（记忆位置/尺寸）

## 样式方案

- **优先使用 UnoCSS**：支持原子 class（`class="flex p-4"`）和属性模式（`flex="~" p="4"`）
- **SCSS**：复杂动画、全局样式等场景使用 `.scss` 文件
- Naive UI 主题和中文 locale 在 `src/renderer/src/theme/index.ts` 中配置

## 打包优化

安装包已实施多项体积优化（详见 `AGENTS.md`）：

- 移除 `shamefully-hoist`，pnpm 原生隔离 devDependencies
- 仅保留中英文语言包（locales: 48→1.2 MB）
- NSIS 7z 固实压缩
- 排除 node_modules 中的文档/测试/声明文件

## 配置文件

| 文件                      | 用途                  |
| ------------------------- | --------------------- |
| `electron.vite.config.ts` | Vite + 插件           |
| `electron-builder.yml`    | 打包配置              |
| `tsconfig.*.json`         | TypeScript 配置       |
| `eslint.config.mjs`       | ESLint 10 flat config |
| `uno.config.ts`           | UnoCSS 预设与主题     |
| `.npmrc`                  | 镜像源配置            |

## AI 开发指引

本项目为 AI 编码助手提供了完整的上下文文件和技能：

- `AGENTS.md` — 项目全面指引（技术栈、架构、约定）
- `CLAUDE.md` — 同上（多助手兼容）
- `.agents/skills/` — 领域技能文件
  - `vue-best-practices` — Vue 3 最佳实践
  - `electron-desktop-pattern` — Electron 桌面开发模式
  - `smart-commit` — 智能分批提交
