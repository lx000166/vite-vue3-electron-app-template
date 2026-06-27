<!-- TitleBarFace -->
<script setup lang="ts">
defineProps<{ bgClass: string; backVisible: boolean; title: string }>()
const emit = defineEmits<{
  back: []
  minimize: []
  toggleMaximize: []
  close: []
  openDevTools: []
  forceReload: []
}>()
const isDev = import.meta.env.DEV
</script>

<template>
  <div class="blur blur-white" />
  <div class="bg" :class="bgClass" />
  <div class="inner">
    <div class="no-drag left-box">
      <button
        v-if="backVisible"
        class="btn px-3 flex items-center text-[#1a1a1a] hover:bg-black/8 transition-colors duration-150"
        @click="emit('back')"
      >
        <span class="inline-block i-icon-park-outline-arrow-left text-[16px]"></span>
      </button>
      <span v-else class="inline-block i-icon-park-outline-arrow-left text-[16px] invisible"></span>
    </div>

    <Transition name="title-fade" mode="in-out">
      <span :key="title" class="title text-sm text-[#1a1a1a] w-[220px] truncate text-left">{{
        title
      }}</span>
    </Transition>

    <div class="no-drag right-box">
      <button
        v-if="isDev"
        class="btn px-4 flex items-center text-[#1a1a1a] hover:bg-black/8 transition-colors duration-150"
        title="清除缓存并强制刷新"
        @click="emit('forceReload')"
      >
        <span class="inline-block i-icon-park-outline-refresh text-[16px]"></span>
      </button>
      <button
        v-if="isDev"
        class="btn px-4 flex items-center text-[#1a1a1a] hover:bg-black/8 transition-colors duration-150"
        title="打开控制台"
        @click="emit('openDevTools')"
      >
        <span class="inline-block i-icon-park-outline-terminal text-[16px]"></span>
      </button>
      <button
        class="btn px-4 flex items-center text-[#1a1a1a] hover:bg-black/8 transition-colors duration-150"
        @click="emit('minimize')"
      >
        <span class="inline-block i-icon-park-outline-minus text-[16px]"></span>
      </button>
      <button
        class="btn px-4 flex items-center text-[#1a1a1a] hover:bg-black/8 transition-colors duration-150"
        @click="emit('toggleMaximize')"
      >
        <span class="inline-block i-icon-park-outline-full-screen text-[16px]"></span>
      </button>
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
.blur {
  position: absolute;
  inset: 0;
  z-index: 1;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.blur-white {
  background: rgba(255, 255, 255, 0.05);
}
.bg {
  position: absolute;
  inset: 0;
  z-index: 2;
}
.bg-white-60 {
  background: rgba(255, 255, 255, 0.6);
}
.bg-gradient {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.2));
}
.inner {
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
  z-index: 3;
}
.left-box {
  display: flex;
  align-items: center;
  height: 100%;
  width: 68px;
  flex-shrink: 0;
}
.right-box {
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: auto;
}
.title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}
.btn {
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
}

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
