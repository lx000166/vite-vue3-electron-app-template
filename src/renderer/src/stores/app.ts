/**
 * 应用全局状态 — Pinia setup store
 *
 * 管理：
 * - title    应用标题（显示在 TitleBar）
 * - subtitle 副标题（预留，未在 UI 中使用）
 * - setTitle 修改标题
 */
export const useAppStore = defineStore('app', () => {
  /** 应用标题 */
  const title = ref('vite-vue3-tres-app')
  /** 副标题（预留扩展） */
  const subtitle = ref('Electron + Vue 3 + UnoCSS + Naive UI')

  /** 修改应用标题 */
  function setTitle(value: string): void {
    title.value = value
  }

  return {
    title,
    subtitle,
    setTitle
  }
})
