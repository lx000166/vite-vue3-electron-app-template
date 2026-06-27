<!-- /setting -->
<script setup lang="ts">
import { useAuthStore } from '@renderer/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

definePage({
  meta: { layout: 'sidebar', requiresAuth: true, addMenu: true, sort: 99, menuTitle: '设置', menuIcon: 'setting' }
})

function doLogout(): void {
  authStore.logout()
  router.replace('/login')
}
</script>

<template>
  <MainContainer>
    <div class="h-full flex flex-col items-center justify-center gap-4">
      <h1 class="text-2xl font-bold">设置</h1>
      <p class="text-gray-500">系统设置页面（待开发）。</p>
      <n-button class="mt-4" @click="doLogout">退出登录</n-button>
    </div>
  </MainContainer>
</template>
