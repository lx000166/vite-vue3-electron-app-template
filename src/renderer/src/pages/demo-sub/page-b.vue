<!--
  子页面 B /demo-sub/page-b

  嵌套在 demo-sub/index.vue 的 <router-view /> 内，
  不加入侧边栏菜单。
-->
<script setup lang="ts">
definePage({
  meta: {
    requiresAuth: true,
    addMenu: false
  }
})
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <div class="panel-card w-96 text-center">
      <span class="i-icon-park-outline-setting-two text-4xl text-blue-500" />
      <h2 class="text-xl font-bold mt-4">子页面 B</h2>
      <p class="text-gray-400 mt-2">子路由自动匹配目录结构，无需手动配置路由表</p>
    </div>
  </div>
</template>
