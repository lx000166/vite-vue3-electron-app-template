<!-- TitleBar -->
<script setup lang="ts">
import { useAppStore } from '@renderer/stores/app'

const router = useRouter()
const route = useRoute()
const flipped = computed(() => route.meta.layout === 'header')
const pageTitle = computed(() => {
  const app = useAppStore().title
  const menu = route.meta.menuTitle
  return menu ? `${app} - ${menu}` : app
})

function minimize(): void {
  window.electronAPI?.windowMinimize()
}
function toggleMaximize(): void {
  window.electronAPI?.windowToggleMaximize()
}
function closeWindow(): void {
  window.electronAPI?.windowClose()
}
function goBack(): void {
  router.back()
}
function openDevTools(): void {
  window.electronAPI?.openDevTools()
}
function forceReload(): void {
  window.electronAPI?.forceReload()
}
</script>

<template>
  <header
    class="drag absolute top-0 left-0 right-0 z-20 overflow-hidden backdrop-blur-4px"
    :style="{ height: 'var(--title-h)', perspective: '1800px' }"
  >
    <div class="prism" :class="{ flipped }">
      <!-- A 面 -->
      <div class="face face-a">
        <div class="absolute inset-0 z-1" />
        <div class="absolute inset-0 z-2 bg-white/40" />
        <TitleBarFace
          :back-visible="false"
          :title="pageTitle"
          @back="goBack"
          @minimize="minimize"
          @toggle-maximize="toggleMaximize"
          @close="closeWindow"
          @open-dev-tools="openDevTools"
          @force-reload="forceReload"
        />
      </div>
      <!-- B 面 -->
      <div class="face face-b">
        <div class="absolute inset-0 z-1" />
        <div class="absolute inset-0 z-2 bg-gradient-to-b from-white/60 to-white/20" />
        <TitleBarFace
          :back-visible="true"
          :title="pageTitle"
          @back="goBack"
          @minimize="minimize"
          @toggle-maximize="toggleMaximize"
          @close="closeWindow"
          @open-dev-tools="openDevTools"
          @force-reload="forceReload"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
.prism {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.44s ease;
  transform-origin: top center;
}
.prism.flipped {
  transform: rotateX(-90deg);
}
.face {
  position: absolute;
  inset: 0;
}
.face-a {
  transform: rotateX(0deg);
}
.face-b {
  transform: rotateX(90deg);
  transform-origin: top center;
}
</style>
