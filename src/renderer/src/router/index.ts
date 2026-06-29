/**
 * 路由配置 — Hash 模式 + 文件路由 + 全局守卫
 *
 * - 路由表由 vue-router/vite 插件根据 src/pages/ 自动生成
 * - beforeEach 守卫负责：根路径重定向、登录态校验、页面过渡动画名
 * - 鉴权依赖 stores/auth.ts 中的 useAuthStore
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from '@renderer/stores/auth'

const router = createRouter({
  // Electron 环境使用 Hash 模式（兼容 file:// 协议）
  history: createWebHashHistory(),
  routes
})

// ── 全局守卫 ──────────────────────────────────
router.beforeEach((to) => {
  const authStore = useAuthStore()

  // 根路径 → 首页
  if (to.path === '/') {
    return '/home'
  }

  // 已登录用户访问登录页 → 首页
  if (to.path === '/login' && authStore.isLoggedIn) {
    return '/home'
  }

  // 需登录页面 & 未登录 → 登录页
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return '/login'
  }

  return true
})

export default router
