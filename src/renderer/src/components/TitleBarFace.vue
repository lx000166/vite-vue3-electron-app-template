<!--
  TitleBarFace — 标题栏单面内容

  布局：左区域（返回按钮）| 居中标题 | 右区域（窗口控制按钮组）

  Props：
  - backVisible  是否显示返回箭头
  - title        页面标题文本（带淡入淡出过渡动画）

  Emits：
  - back / minimize / toggleMaximize / close          → 窗口控制
  - openDevTools / forceReload（仅 dev 模式显示按钮）  → 开发工具
-->
<script setup lang="ts">
defineProps<{ backVisible: boolean; title: string }>()
const emit = defineEmits<{
  back: []
  minimize: []
  toggleMaximize: []
  close: []
  openDevTools: []
  forceReload: []
}>()

/** 是否为开发环境（控制 DevTools / 强制刷新按钮显隐） */
const isDev = import.meta.env.DEV
</script>

<template>
  <div class="inner">
    <!-- ═══ 左侧：返回按钮 ═══ -->
    <div class="no-drag left-box">
      <button
        v-if="backVisible"
        class="btn px-3 flex items-center text-[#1a1a1a] hover:bg-black/8 transition-colors duration-150"
        @click="emit('back')"
      >
        <span class="inline-block i-icon-park-outline-arrow-left text-[16px]"></span>
      </button>
      <!-- 占位：保持标题居中 -->
      <span v-else class="inline-block i-icon-park-outline-arrow-left text-[16px] invisible"></span>
    </div>

    <!-- ═══ 居中：页面标题（带淡入淡出动画） ═══ -->
    <Transition :duration="50" name="title-fade" mode="in-out">
      <span :key="title" class="title text-sm text-[#1a1a1a] w-[220px] truncate text-left">{{
        title
      }}</span>
    </Transition>

    <!-- ═══ 右侧：窗口控制按钮组 ═══ -->
    <div class="no-drag right-box">
      <!-- 强制刷新（仅 dev） -->
      <button
        v-if="isDev"
        class="btn px-4 flex items-center text-[#1a1a1a] hover:bg-black/8 transition-colors duration-150"
        title="清除缓存并强制刷新"
        @click="emit('forceReload')"
      >
        <span class="inline-block i-icon-park-outline-refresh text-[16px]"></span>
      </button>

      <!-- DevTools（仅 dev） -->
      <button
        v-if="isDev"
        class="btn px-4 flex items-center text-[#1a1a1a] hover:bg-black/8 transition-colors duration-150"
        title="打开控制台"
        @click="emit('openDevTools')"
      >
        <span class="inline-block i-icon-park-outline-terminal text-[16px]"></span>
      </button>

      <!-- 最小化 -->
      <button
        class="btn px-4 flex items-center text-[#1a1a1a] hover:bg-black/8 transition-colors duration-150"
        @click="emit('minimize')"
      >
        <span class="inline-block i-icon-park-outline-minus text-[16px]"></span>
      </button>

      <!-- 最大化/还原 -->
      <button
        class="btn px-4 flex items-center text-[#1a1a1a] hover:bg-black/8 transition-colors duration-150"
        @click="emit('toggleMaximize')"
      >
        <span class="inline-block i-icon-park-outline-full-screen text-[16px]"></span>
      </button>

      <!-- 关闭 -->
      <button
        class="btn px-4 flex items-center text-[#1a1a1a] hover:bg-red/70 hover:text-white transition-colors duration-150"
        @click="emit('close')"
      >
        <span class="inline-block i-icon-park-outline-close text-[16px]"></span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ── 布局 ───────────────────────────────────── */
.inner {
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
  z-index: 3;
}

/* ── 左区域（返回按钮容器） ──────────────────── */
.left-box {
  display: flex;
  align-items: center;
  height: 100%;
  width: 68px;
  flex-shrink: 0;
}

/* ── 右区域（窗口按钮容器） ──────────────────── */
.right-box {
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: auto;
}

/* ── 居中标题 ───────────────────────────────── */
.title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

/* ── 按钮基础 ───────────────────────────────── */
.btn {
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* ── 标题淡入淡出过渡 ───────────────────────── */
.title-fade-enter-active {
  transition: opacity 0.2s ease;
}
.title-fade-leave-active {
  transition: opacity 0.15s ease;
}
.title-fade-enter-from,
.title-fade-leave-to {
  opacity: 0;
}
</style>
