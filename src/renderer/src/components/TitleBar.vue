<!--
  TitleBar — 自定义标题栏（CSS 3D 翻转双面）

  功能：
  - 窗口拖拽手柄（drag 区域）
  - A 面（默认）：显示返回箭头（disabled）+ 页面标题 + 窗口控制按钮
  - B 面（header 布局时翻转显示）：显示返回箭头 + 页面标题 + 窗口控制按钮
  - 翻转触发：route.meta.layout === 'header' → flipped CSS class → rotateX(-90deg)

  CSS 3D 结构：
  header[perspective]
  └── .prism[transform-style:preserve-3d]
      ├── .face-a  rotateX(0deg)   → A 面（正面）
      └── .face-b  rotateX(90deg)  → B 面（顶部翻转到正面）
          flipped 时整个 .prism rotateX(-90deg) → A 面翻到顶部、B 面正面
-->
<script setup lang="ts">
import { useAppStore } from '@renderer/stores/app'

const router = useRouter()
const route = useRoute()

/** 是否触发 3D 翻转（header 布局时翻到 B 面） */
const flipped = computed(() => route.meta.layout === 'header')

/** 页面标题：优先显示菜单名，回退到应用名 */
const pageTitle = computed(() => {
  const store = useAppStore()
  const menu = route.meta.menuTitle
  return unref(menu ? `${store.title} - ${menu}` : store.title)
})

// ── 窗口控制 ──────────────────────────────────
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

// ── 开发工具 ──────────────────────────────────
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
      <!-- ═══ A 面（默认正面） ═══ -->
      <div class="face face-a">
        <!-- 背景层 -->
        <div class="absolute inset-0 z-1" />
        <div class="absolute inset-0 z-2 bg-white/60" />
        <!-- 内容 -->
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

      <!-- ═══ B 面（header 布局时翻转到正面） ═══ -->
      <div class="face face-b">
        <!-- 背景层 -->
        <div class="absolute inset-0 z-1" />
        <div class="absolute inset-0 z-2 bg-gradient-to-b from-white/60 to-white/20" />
        <!-- 内容 -->
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
/* ── 3D 翻转容器 ────────────────────────────── */
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

/* ── A 面：正面（默认可见） ──────────────────── */
.face-a {
  transform: rotateX(0deg);
}

/* ── B 面：顶部（flipped 时旋转到正面） ──────── */
.face-b {
  transform: rotateX(90deg);
  transform-origin: top center;
}
</style>
