<!--
  次级路由演示 /demo-sub

  父路由：包含二级导航 + <router-view /> 子路由出口
  布局：sidebar（标题栏 + 侧边栏）
  鉴权：需要登录
-->
<script setup lang="ts">
const route = useRoute()
const router = useRouter()

definePage({
  meta: {
    layout: 'sidebar',
    requiresAuth: true,
    addMenu: true,
    sort: 99,
    menuTitle: '次级路由',
    menuIcon: 'folder-open'
  }
})
</script>

<template>
  <MainContainer>
    <div class="h-full flex flex-col gap-4">
      <!-- 二级导航 -->
      <div class="flex gap-2">
        <n-button
          :type="route.path === '/demo-sub/page-a' ? 'primary' : 'default'"
          @click="router.push('/demo-sub/page-a')"
        >
          子页面 A
        </n-button>
        <n-button
          :type="route.path === '/demo-sub/page-b' ? 'primary' : 'default'"
          @click="router.push('/demo-sub/page-b')"
        >
          子页面 B
        </n-button>
      </div>

      <!-- 子路由出口 -->
      <div class="flex-1">
        <router-view />
      </div>
    </div>
  </MainContainer>
</template>
