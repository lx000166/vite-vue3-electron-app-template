<!--
  首页 /home

  - 欢迎页面 + CSS 3D Transform 四棱柱旋转演示
  - 布局：sidebar（标题栏 + 侧边栏）
  - 鉴权：需要登录
-->
<script setup lang="ts">
import { useAuthStore } from '@renderer/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
definePage({
  meta: {
    layout: 'sidebar',
    requiresAuth: true,
    addMenu: true,
    sort: 1,
    menuTitle: '首页',
    menuIcon: 'home'
  }
})

/** 退出登录：清除 token 并跳转登录页 */
function doLogout(): void {
  authStore.logout()
  router.replace('/login')
}
</script>

<template>
  <MainContainer>
    <!-- 欢迎区 -->
    <div class="h-full flex flex-col items-center justify-center gap-4">
      <h1 class="text-2xl font-bold">欢迎回来</h1>
      <p class="text-gray-500">这是首页，通过侧边栏导航到其他页面。</p>

      <!-- 3D 四棱柱演示 -->
      <div class="scene mt-4">
        <div class="prism">
          <div class="face face-front">Front</div>
          <div class="face face-top">Top</div>
          <div class="face face-back">Back</div>
          <div class="face face-bottom">Bottom</div>
        </div>
      </div>
      <p class="text-gray-400 text-sm">CSS 3D Transform 四棱柱旋转</p>
      <n-button class="mt-4" @click="doLogout">退出登录</n-button>
    </div>
  </MainContainer>
</template>

<style scoped>
/* ── 3D 场景容器 ────────────────────────────── */
.scene {
  perspective: 800px;
  width: 600px;
  height: 150px;
}

/* ── 四棱柱（旋转动画） ──────────────────────── */
.prism {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: rotate 8s linear infinite;
}

/* ── 棱柱面（共用样式） ──────────────────────── */
.face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  backface-visibility: visible;
}

/* ── 四个面：颜色 + 3D 位置 ──────────────────── */
.face-front {
  background: rgba(66, 133, 244, 0.75);
  transform: rotateX(0deg) translateZ(50px);
}
.face-top {
  background: rgba(52, 168, 83, 0.75);
  transform: rotateX(90deg) translateZ(50px);
}
.face-back {
  background: rgba(251, 188, 4, 0.75);
  transform: rotateX(180deg) translateZ(50px);
}
.face-bottom {
  background: rgba(234, 67, 53, 0.75);
  transform: rotateX(-90deg) translateZ(50px);
}

/* ── 旋转关键帧 ─────────────────────────────── */
@keyframes rotate {
  from {
    transform: rotateX(0deg);
  }
  to {
    transform: rotateX(-360deg);
  }
}
</style>
