---
name: vue-best-practices
description: Vue 3 最佳实践。涉及 Vue SFC、Composition API、组件设计、路由、状态管理时使用。强制使用 `<script setup lang="ts">`。
license: MIT
---

# Vue 3 Best Practices — 本项目约定

本项目使用 Vue 3 + Composition API + `<script setup lang="ts">`。所有 Vue 相关任务必须遵守以下约定。

## 组件编写规范

### SFC 结构（按此顺序）
```vue
<script setup lang="ts">
// 1. 导入（仅需手动导入的类型、第三方库）
// 2. Props / Emits 定义
// 3. 状态（ref / reactive）
// 4. 计算属性（computed）
// 5. 方法
// 6. 生命周期钩子
// 7. 监听器（watch / watchEffect）
</script>

<template>
  <!-- 模板使用 PascalCase 组件名 + kebab-case DOM 属性 -->
</template>

<style scoped>
  /* 仅在不适合 UnoCSS 的场景写普通 CSS */
</style>
```

### 组件拆分原则

拆分组件的触发条件（满足任一即拆分）：
- 单个组件承担多个独立职责（如数据管理 + 多种 UI 区域）
- 模板有 3 个以上独立区块（表单、列表、筛选区、底部状态栏等）
- 存在可复用的重复模板片段（卡片、列表项等）

```
feature/
├── FeatureContainer.vue    # 容器组件（数据 + 编排）
├── FeatureForm.vue         # 表单组件
├── FeatureList.vue         # 列表组件
└── FeatureItem.vue         # 列表项组件
```

## 数据流

- **Props 向下，Events 向上** — 主要通信方式
- **Pinia Store** — 跨组件/跨页面共享状态
- **provide/inject — 🚫 禁止使用**，跨层级数据共享改用 Pinia store
- **避免全局变量** — 不使用 `app.config.globalProperties`

## 样式规则（重要）

**优先使用 UnoCSS**，支持两种写法：

```vue
<!-- ✅ 方式一：原子 class -->
<div class="flex items-center gap-3 rounded-4 bg-white/70 px-4 py-3">

<!-- ✅ 方式二：属性模式（Attributify） -->
<div flex="~ items-center" gap="3" rounded="4" bg="white/70" px="4" py="3">
```

**仅在以下场景使用 SCSS**：
- 全局 CSS reset 和字体注册
- 复杂动画、伪元素等 UnoCSS 难以表达的场景
- 深层嵌套选择器

```vue
<!-- ⚠️ 仅在必要时：scoped SCSS -->
<style lang="scss" scoped>
.complex-animation { /* ... */ }
</style>
```

## 本项目全局可用（无需手动 import）

以下已通过 `unplugin-auto-import` 全局注册，直接使用即可：

- **Vue**：`ref`、`computed`、`watch`、`onMounted`、`nextTick`、`defineComponent`...
- **VueUse**：全部函数（`useNow`、`useDark`、`useTitle`、`useDateFormat`...）
- **Vue Router**：`useRouter`、`useRoute`、`onBeforeRouteLeave`...
- **Pinia**：`defineStore`、`storeToRefs`、`createPinia`...
- **Naive UI 消息**：`useMessage`、`useDialog`、`useNotification`、`useLoadingBar`
- **自定义 Store**：`src/stores/` 下的导出（如 `useAppStore`）
- **自定义 Composables**：`src/composables/` 下的导出

## Naive UI 组件（模板中直接使用）

以下已通过 `unplugin-vue-components` 自动注册：
`NButton`、`NCard`、`NConfigProvider`、`NDialogProvider`、`NMessageProvider`、`NNotificationProvider`、`NScrollbar`、`NSpace`
以及 `src/components/` 下的所有组件。

## 文件路由

`src/renderer/src/pages/` 下新建 `.vue` 文件即自动生成路由：
- `pages/index.vue` → `/`
- `pages/users.vue` → `/users`
- `pages/users/[id].vue` → `/users/:id`

## 类型安全

- 自动生成的 `.d.ts` 文件在 `src/renderer/src/types/`，提供路由名/参数自动补全
- Props / Emits 始终用 `defineProps<>()` / `defineEmits<>()` 显式类型标注
- 避免 `any`，优先使用 `unknown` 或具体类型

## 检查清单

提交前确认：
- [ ] 样式优先使用 UnoCSS，非必要不写普通 CSS
- [ ] 组件不超过一个明确职责
- [ ] 全局可用 API 未手动 import
- [ ] Props / Emits 已类型标注
- [ ] 无 `any` 类型（或已注明理由）
- [ ] `pnpm lint` 和 `pnpm typecheck` 通过
