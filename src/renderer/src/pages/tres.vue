<!--
  3D 视图页 /tres

  - ⚠️ 待开发：预留用于 TresJS（Three.js）3D 园区场景
  - 布局：header（仅标题栏翻转至 B 面，无侧边栏）
  - 鉴权：需要登录
-->
<script setup lang="ts">
definePage({
  meta: {
    layout: 'header',
    requiresAuth: true,
    addMenu: true,
    sort: 50,
    menuTitle: '3D视图',
    menuIcon: 'view-grid-detail'
  }
})
</script>

<template>
  <div class="flex h-full items-center justify-center">
    <p class="text-xl text-gray-400">3D 视图区域（待开发）</p>
  </div>
</template>
