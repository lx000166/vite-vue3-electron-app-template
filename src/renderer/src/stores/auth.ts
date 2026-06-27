// 登录状态管理 — 持久化存储到 localStorage
export const useAuthStore = defineStore('auth', () => {
  const STORAGE_KEY = 'app-login-token'

  // 从 localStorage 恢复登录状态（持久化）
  const token = ref(localStorage.getItem(STORAGE_KEY) ?? '')

  /** 是否已登录 */
  const isLoggedIn = computed(() => !!token.value)

  /** 登录：保存 token 并持久化 */
  function login(t: string): void {
    token.value = t
    localStorage.setItem(STORAGE_KEY, t)
  }

  /** 登出：清除 token */
  function logout(): void {
    token.value = ''
    localStorage.removeItem(STORAGE_KEY)
  }

  return { token, isLoggedIn, login, logout }
})
