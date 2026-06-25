export const useAppStore = defineStore('app', () => {
  const title = ref('vite-vue3-tres-app')
  const subtitle = ref('Electron + Vue 3 + UnoCSS + Naive UI')

  function setTitle(value: string): void {
    title.value = value
  }

  return {
    title,
    subtitle,
    setTitle
  }
})
