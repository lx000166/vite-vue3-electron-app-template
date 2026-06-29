// 路由配置 — 文件路由（vue-router/vite 自动生成）+ 登录鉴权守卫
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from '@renderer/stores/auth'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// ── 全局鉴权守卫 ──────────────────────────────
router.beforeEach((to) => {
  const authStore = useAuthStore()

  // 根路径重定向到首页
  if (to.path === '/') {
    return '/home'
  }

  // 已登录用户访问登录页 → 跳转首页
  if (to.path === '/login' && authStore.isLoggedIn) {
    return '/home'
  }

  // 需要登录的页面 & 未登录 → 跳转登录页
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return '/login'
  }

  // 放行
  return true
})

export default router
