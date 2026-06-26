import { zhCN, dateZhCN } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'

/** Naive UI 主题变量覆盖（可按需调整） */
export const themeOverrides: GlobalThemeOverrides = {
  common: {
    // primaryColor: '#2080f0',
    // borderRadius: '6px',
  }
}

/** Naive UI 全局配置（中文 + 主题） */
export const themeConfig = {
  locale: zhCN,
  dateLocale: dateZhCN,
  themeOverrides
}
