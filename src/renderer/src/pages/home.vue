<!-- /home -->
<script setup lang="ts">
definePage({
  meta: { layout: 'sidebar', requiresAuth: true, addMenu: true, sort: 1, menuTitle: '首页', menuIcon: 'home' }
})
</script>

<template>
  <MainContainer>
    <div class="h-full flex flex-col items-center justify-center gap-4">
      <h1 class="text-2xl font-bold">欢迎回来</h1>
      <p class="text-gray-500">这是首页，通过侧边栏导航到其他页面。</p>

      <div class="scene mt-4">
        <div class="prism">
          <div class="face face-front">Front</div>
          <div class="face face-top">Top</div>
          <div class="face face-back">Back</div>
          <div class="face face-bottom">Bottom</div>
        </div>
      </div>
      <p class="text-gray-400 text-sm">CSS 3D Transform 四棱柱旋转</p>
    </div>
  </MainContainer>
</template>

<style scoped>
.scene { perspective: 800px; width: 600px; height: 150px; }
.prism { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; animation: rotate 8s linear infinite; }
.face { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; color: #fff; backface-visibility: visible; }
.face-front  { background: rgba(66,133,244,0.75); transform: rotateX(0deg) translateZ(50px); }
.face-top    { background: rgba(52,168,83,0.75);  transform: rotateX(90deg) translateZ(50px); }
.face-back   { background: rgba(251,188,4,0.75);  transform: rotateX(180deg) translateZ(50px); }
.face-bottom { background: rgba(234,67,53,0.75);  transform: rotateX(-90deg) translateZ(50px); }
@keyframes rotate { from { transform: rotateX(0deg); } to { transform: rotateX(-360deg); } }
</style>
