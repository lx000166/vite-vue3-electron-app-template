/**
 * 登录状态管理 — Pinia setup store（localStorage 持久化）
 *
 * - token     存储在 localStorage，刷新/重启后保持登录态
 * - isLoggedIn 派生计算：token 非空即为已登录
 * - login     保存 token 并写入 localStorage
 * - logout    清除 token 并移除 localStorage 记录
 */
export const useAuthStore = defineStore('auth', () => {
  /** localStorage 存储键 */
  const STORAGE_KEY = 'app-login-token'

  // 从 localStorage 恢复登录状态
  const token = ref(localStorage.getItem(STORAGE_KEY) ?? '')

  /** 是否已登录（派生状态：token 非空） */
  const isLoggedIn = computed(() => !!token.value)

  /** 登录：保存 token 并持久化到 localStorage */
  function login(t: string): void {
    token.value = t
    localStorage.setItem(STORAGE_KEY, t)
  }

  /** 登出：清除 token 并移除 localStorage 记录 */
  function logout(): void {
    token.value = ''
    localStorage.removeItem(STORAGE_KEY)
  }

  return { token, isLoggedIn, login, logout }
})
