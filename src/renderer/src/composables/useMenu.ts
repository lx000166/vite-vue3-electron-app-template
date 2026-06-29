/**
 * 菜单数据组合式函数 — 从 Vue Router 已注册路由中提取菜单项
 *
 * 菜单项来源于各页面 definePage({ meta: { addMenu: true, ... } }) 声明，
 * 自动按 sort 升序排列，包含路由路径、显示名、图标。
 *
 * 开发环境下还会校验 addMenu:true 的页面是否缺少必要 meta 字段。
 */

export interface MenuItem {
  /** 路由路径（菜单项的导航目标） */
  path: string
  /** 菜单显示名称 */
  title: string
  /** 排序权重（升序，越小越靠前，默认 99） */
  sort: number
  /** 菜单图标（IconPark Outline 图标名，可选，缺失用兜底图标） */
  icon?: string
}

/**
 * 从路由表提取侧边栏菜单项
 *
 * @returns menuItems — 排序后的菜单项列表（ComputedRef）
 */
export function useMenu(): { menuItems: import('vue').ComputedRef<MenuItem[]> } {
  const router = useRouter()

  /** 菜单项列表（响应式：路由变化时自动更新） */
  const menuItems = computed<MenuItem[]>(() => {
    const items = router
      .getRoutes()
      // 仅保留标记了 addMenu 的路由
      .filter((route) => route.meta.addMenu === true)
      .map((route) => ({
        path: route.path,
        title: (route.meta.menuTitle as string) ?? (route.name as string) ?? route.path,
        sort: (route.meta.sort as number) ?? 99,
        icon: route.meta.menuIcon as string | undefined
      }))
      // 按 sort 升序排列
      .sort((a, b) => a.sort - b.sort)

    // ── 开发环境校验 ──────────────────────────
    // addMenu:true 但缺少 sort / menuTitle 时警告
    if (import.meta.env.DEV) {
      router.getRoutes().forEach((route) => {
        if (route.meta.addMenu === true) {
          if (route.meta.sort === undefined) {
            console.warn(`[useMenu] ⚠️ ${route.path}: addMenu=true 但缺少 sort`)
          }
          if (!route.meta.menuTitle) {
            console.warn(`[useMenu] ⚠️ ${route.path}: addMenu=true 但缺少 menuTitle`)
          }
        }
      })
    }

    return items
  })

  return { menuItems }
}
