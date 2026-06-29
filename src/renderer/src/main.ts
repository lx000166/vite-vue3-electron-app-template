/**
 * 渲染进程入口 — 初始化 Vue 应用
 *
 * 加载顺序：
 * 1. UnoCSS reset + 原子 CSS + 全局样式
 * 2. 创建 Vue 实例
 * 3. 注册 Pinia（状态管理）+ Vue Router（路由）
 * 4. 挂载到 #app
 */
// ── 样式导入 ──────────────────────────────────
import '@unocss/reset/tailwind.css'
import 'uno.css'
import './assets/main.css'

// ── 框架核心 ──────────────────────────────────
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
