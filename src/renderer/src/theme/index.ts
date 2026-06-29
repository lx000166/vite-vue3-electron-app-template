/**
 * Naive UI 主题配置 — 中文 locale + 自定义主题覆盖
 *
 * - locale/dateLocale：中文语言包（日期选择器等组件使用）
 * - themeOverrides：全局主题变量覆盖（按需开启）
 *
 * 在 App.vue 中通过 <n-config-provider> 注入
 */
import { zhCN, dateZhCN } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'

/** Naive UI 全局主题覆盖（按需开启） */
export const themeOverrides: GlobalThemeOverrides = {
  common: {
    // primaryColor: '#2080f0',
    // borderRadius: '6px',
  },
  Menu: {
    itemColorHover: 'rgba(0,0,0,0.06)'
  }
}

/** 主题配置集合（直接传给 n-config-provider） */
export const themeConfig = {
  locale: zhCN,
  dateLocale: dateZhCN,
  themeOverrides
}
