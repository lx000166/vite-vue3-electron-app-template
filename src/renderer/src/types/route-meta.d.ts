/**
 * 路由元信息类型扩展 — 为 vue-router 的 RouteMeta 添加自定义字段
 *
 * 使用方式：在页面 .vue 文件中通过 definePage({ meta: {...} }) 声明
 *
 * 字段说明：
 * - layout       布局模式：none（无标题栏）/ header（仅标题栏）/ sidebar（标题栏+侧边栏）
 * - requiresAuth 是否需要登录才能访问
 * - addMenu      是否加入侧边栏菜单
 * - sort         菜单排序（升序，越小越靠前）
 * - menuTitle    菜单显示名称
 * - menuIcon     菜单图标（对应 @iconify-json/icon-park-outline 图标名）
 */
import 'vue-router'

declare module 'vue-router' {
  export interface RouteMeta {
    /** 布局模式：none | header | sidebar */
    layout?: 'none' | 'header' | 'sidebar'
    /** 是否需要登录鉴权 */
    requiresAuth?: boolean
    /** 是否加入侧边栏菜单 */
    addMenu?: boolean
    /** 菜单排序权重（升序） */
    sort?: number
    /** 菜单显示名称 */
    menuTitle?: string
    /** 菜单图标名（IconPark Outline） */
    menuIcon?: string
  }
}

export {}
