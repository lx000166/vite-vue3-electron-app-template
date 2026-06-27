// 扩展 Vue Router RouteMeta，提供 route.meta.xxx 属性类型提示
import 'vue-router'

declare module 'vue-router' {
  export interface RouteMeta {
    /** 布局模式：none | header | sidebar */
    layout?: 'none' | 'header' | 'sidebar'
    /** 是否需要登录 */
    requiresAuth?: boolean
    /** 是否加入侧边栏菜单 */
    addMenu?: boolean
    /** 菜单排序 */
    sort?: number
    /** 菜单显示名称 */
    menuTitle?: string
    /** 菜单图标 */
    menuIcon?: string
  }
}

export {}
