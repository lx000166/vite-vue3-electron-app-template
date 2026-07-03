<!--
  子页面 A /demo-sub/page-a

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
      <span class="i-icon-park-outline-file-success text-4xl text-green-500" />
      <h2 class="text-xl font-bold mt-4">子页面 A</h2>
      <p class="text-gray-400 mt-2">这是通过 &lt;router-view /&gt; 渲染的子页面</p>
    </div>
  </div>
</template>
