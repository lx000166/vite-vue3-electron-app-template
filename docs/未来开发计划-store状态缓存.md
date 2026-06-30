# 未来开发计划 — 跨页面状态缓存

## 背景

项目使用 `<Transition>` 实现路由页面过渡动画（淡入淡出 / 上下翻页），依赖子元素的 DOM 插入/移除触发 leave/enter。

`<keep-alive>` 通过 `activated/deactivated` 控制缓存的组件显隐，**不触发 DOM 移除**，导致 Transition 的 leave 动画无法正常工作。

因此当前未启用 `keep-alive`，页面切换时组件会被销毁重建。

## 影响范围

| 页面 | 丢失的状态 | 优先级 |
|------|-----------|--------|
| `/icons` | 搜索关键词、滚动位置 | 低（用户可接受重新搜索） |
| `/home` | 无有状态交互 | — |
| `/setting` | 无有状态交互 | — |
| `/tres`（未来） | 3D 场景相机位置、模型状态 | 🔴 高 |

## 方案

### 方案 A：Pinia Store 缓存（推荐）

在对应模块的 store 或新 store 中保存关键状态，组件 `onMounted` 时恢复。

```ts
// stores/icon-search.ts
export const useIconSearchStore = defineStore('iconSearch', () => {
  const keyword = ref('')
  return { keyword }
})
```

```vue
<!-- pages/icons.vue -->
<script setup>
const searchStore = useIconSearchStore()
const search = ref(searchStore.keyword)
// 离开前保存
onBeforeUnmount(() => {
  searchStore.keyword = search.value
})
</script>
```

**优点**：完全解耦 Transition，实现简单，可控粒度细。

### 方案 B：sessionStorage 持久化

适用于不需要响应式的简单字符串状态。

```ts
// 写入
sessionStorage.setItem('icon-search', search.value)
// 恢复
const saved = sessionStorage.getItem('icon-search')
```

**优点**：刷新页面也能保留。  
**缺点**：需要手动序列化复杂对象。

### 方案 C：VueUse `useSessionStorage`

```ts
import { useSessionStorage } from '@vueuse/core'
const search = useSessionStorage('icon-search', '')
```

**优点**：响应式 + 自动序列化。

## 实施时机

- 当前页面状态简单，暂无迫切需求
- 待 `/tres` 3D 场景开发时，必须实施方案 A 缓存相机和模型状态
- 届时统一引入 VueUse `createSharedComposable` 或 Pinia store 模式

## 相关文档

- AGENTS.md — "keep-alive 与 Transition 冲突"
