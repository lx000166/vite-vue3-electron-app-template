import { createRouter, createWebHashHistory } from 'vue-router'
import { routes as autoRoutes } from 'vue-router/auto-routes'

/** 手动配置的路由（放在 views/ 目录下） */
const manualRoutes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@renderer/views/HomeView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  // 手动路由在前，文件路由在后——两者可并存
  routes: [...manualRoutes, ...autoRoutes]
})

export default router
