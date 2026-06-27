<!-- /login -->
<script setup lang="ts">
import { useAuthStore } from '@renderer/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

definePage({
  meta: { layout: 'none', requiresAuth: false }
})

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
