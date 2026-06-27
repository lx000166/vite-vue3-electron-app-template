# vite-vue3-electron-app-template

Electron 桌面应用模板 — Vue 3 + TypeScript + Vite 8 + Naive UI + IconPark

## 技术栈

| 类别 | 技术 |
|------|------|
| 桌面框架 | Electron 42 |
| 前端框架 | Vue 3.5（Composition API + `<script setup>`） |
| 构建工具 | electron-vite 6 + Vite 8（Rolldown） |
| 类型系统 | TypeScript 6 |
| UI 组件 | Naive UI 2.44（自动按需注册） |
| 图标 | IconPark Outline ~2600 图标（UnoCSS safelist 全量） |
| CSS 方案 | UnoCSS 66（class + Attributify）+ SCSS |
| 状态管理 | Pinia 3 |
| 路由 | Vue Router 5.1（Hash 模式 + 文件路由 + `definePage`） |
| 工具库 | VueUse 14 |
| 代码规范 | ESLint 10 + Prettier |

## 快速开始

```bash
pnpm install
pnpm dev        # 开发模式（Vite HMR + Electron 窗口）
pnpm build      # 生产构建
pnpm build:win  # Windows 安装包 + 绿色版 zip
```

## 项目结构

```
src/
├── main/                       # 主进程（生命周期 + 窗口 + IPC）
├── preload/                    # 预加载脚本（安全桥接）
└── renderer/src/
    ├── App.vue                 # 根组件（布局 + CSS 变量传递）
    ├── pages/                  # 文件路由（自动生成）
    ├── components/             # TitleBar / SideMenu / MainContainer
    ├── stores/                 # Pinia（app + auth）
    ├── composables/            # useMenu
    ├── config/                 # menu-icons
    ├── theme/                  # NaiveUI 主题 + 中文 locale
    ├── router/                 # 鉴权守卫
    ├── types/                  # 类型声明
    └── assets/                 # 字体 / CSS
```

## 页面

| 路由 | 页面 | 布局 |
|------|------|------|
| `/login` | 登录 | 无标题栏 |
| `/home` | 首页（3D 四棱柱） | 标题栏 + 侧边栏 |
| `/setting` | 设置 | 标题栏 + 侧边栏 |
| `/tres` | 3D 视图（header 翻转） | 标题栏（无侧边栏） |
| `/icons` | IconPark 图标库 | 标题栏 + 侧边栏 |

## 特性

- 🪟 无边框窗口 + 自定义标题栏（3D 翻转动画）
- 🧭 文件路由 + `definePage` 声明式菜单
- 🎨 IconPark 2600+ 图标全量可用，零配置
- 📦 打包优化：app.asar 7.6 MB，安装包 82 MB
- 🧹 纯前端依赖自动隔离（不进入安装包）
- 💾 窗口状态持久化 + 单实例锁
- 💡 仅 dev 模式显示：DevTools 按钮 + 强制刷新按钮

## 提交检查

```bash
pnpm lint && pnpm typecheck
```

## 项目规则

详见 `AGENTS.md` 和 `.agents/skills/`。
