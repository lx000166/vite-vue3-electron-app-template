// 侧边栏菜单数据 — 从已注册路由中提取 addMenu:true 的页面

export interface MenuItem {
  /** 路由路径 */
  path: string
  /** 菜单显示名 */
  title: string
  /** 排序（越小越靠前） */
  sort: number
  /** NaiveUI 图标名（可选） */
  icon?: string
}

export function useMenu(): { menuItems: import('vue').ComputedRef<MenuItem[]> } {
  const router = useRouter()

  /** 从路由表中提取的菜单项列表 */
  const menuItems = computed<MenuItem[]>(() => {
    const items = router
      .getRoutes()
      // 只保留标记了 addMenu:true 的路由
      .filter((route) => route.meta.addMenu === true)
      .map((route) => ({
        path: route.path,
        title: (route.meta.menuTitle as string) ?? (route.name as string) ?? route.path,
        sort: (route.meta.sort as number) ?? 99,
        icon: route.meta.menuIcon as string | undefined
      }))
      // 按 sort 升序排列
      .sort((a, b) => a.sort - b.sort)

    // 开发环境校验：addMenu:true 但缺少 sort/menuTitle 时告警
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
