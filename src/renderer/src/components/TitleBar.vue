<!--
  TitleBar — 自定义标题栏（上下平移双面）

  - A 面（默认）：按钮区无返回箭头 + 页面标题 + 窗口控制
  - B 面（header 布局时）：显示返回箭头 + 页面标题 + 窗口控制
  - 切换：A translateY(0)→(-100%)，B translateY(100%)→(0)
-->
<script setup lang="ts">
import { useAppStore } from '@renderer/stores/app'

const router = useRouter()
const route = useRoute()

/** header 布局时切换到 B 面 */
const flipped = computed(() => route.meta.layout === 'header')

/** 页面标题 */
const pageTitle = computed(() => {
  const store = useAppStore()
  const menu = route.meta.menuTitle
  return unref(menu ? `${store.title} - ${menu}` : store.title)
})

// ── 窗口控制 ──────────────────────────────────
function minimize(): void { window.electronAPI?.windowMinimize() }
function toggleMaximize(): void { window.electronAPI?.windowToggleMaximize() }
function closeWindow(): void { window.electronAPI?.windowClose() }
function goBack(): void { router.back() }
function openDevTools(): void { window.electronAPI?.openDevTools() }
function forceReload(): void { window.electronAPI?.forceReload() }
</script>

<template>
  <header
    class="drag absolute top-0 left-0 right-0 z-20 overflow-hidden backdrop-blur-4px"
    :style="{ height: 'var(--title-h)' }"
  >
    <div class="prism" :class="{ flipped }">
      <!-- ═══ A 面 ═══ -->
      <div class="face face-a">
        <div class="absolute inset-0 z-2 bg-white/60" />
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

      <!-- ═══ B 面 ═══ -->
      <div class="face face-b">
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
/* ── 容器 ───────────────────────────────────── */
.prism {
  position: relative;
  width: 100%;
  height: 100%;
}

/* ── 双面共用 ────────────────────────────────── */
.face {
  position: absolute;
  inset: 0;
  transition: transform 0.44s ease;
}

/* A 面：默认可见 */
.face-a {
  transform: translateY(0);
}
.prism.flipped .face-a {
  transform: translateY(-100%);
}

/* B 面：隐藏在下方 */
.face-b {
  transform: translateY(100%);
}
.prism.flipped .face-b {
  transform: translateY(0);
}
</style>
