<!--
  登录页 /login

  - Mock 登录：点击按钮生成临时 token 并跳转首页
  - 布局：none（无标题栏、无侧边栏，全屏居中）
  - 鉴权：不需要登录
-->
<script setup lang="ts">
import { useAuthStore } from '@renderer/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

definePage({
  meta: { layout: 'none', requiresAuth: false }
})

/** Mock 登录：生成临时 token 并跳转首页 */
function doLogin(): void {
  authStore.login('mock-token-' + Date.now())
  router.replace('/home')
}
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <n-button type="primary" size="large" @click="doLogin"> 登 录 </n-button>
  </div>
</template>
