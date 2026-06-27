<!--
  [...all] — 404 兜底页
  匹配所有未定义的路由
-->
<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center gap-4">
    <p class="text-4xl text-gray-300">404</p>
    <p class="text-gray-500">页面不存在</p>
    <n-button @click="router.push('/home')">返回首页</n-button>
  </div>
</template>
