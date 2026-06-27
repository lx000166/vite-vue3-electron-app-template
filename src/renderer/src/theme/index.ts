import { zhCN, dateZhCN } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    // primaryColor: '#2080f0',
    // borderRadius: '6px',
  },
  Menu: {
    itemColorHover: 'rgba(0,0,0,0.06)'
  }
}

export const themeConfig = {
  locale: zhCN,
  dateLocale: dateZhCN,
  themeOverrides
}
