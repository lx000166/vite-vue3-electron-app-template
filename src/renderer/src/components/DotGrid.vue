<!--
  DotGrid — 点阵背景容器

  使用 CSS radial-gradient 渲染等距点阵，零 DOM 开销、GPU 合成。
  内部 <slot /> 可放置任意内容。

  Props：
  - dotSize   点半径（px），默认 1.5
  - dotGap    点间距（px），默认 20
  - dotColor  点颜色，默认 rgba(0,0,0,0.12)
  - bgColor   背景色，默认 transparent
-->
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    dotSize?: number
    dotGap?: number
    dotColor?: string
    bgColor?: string
  }>(),
  {
    dotSize: 1.5,
    dotGap: 20,
    dotColor: 'rgba(0,0,0,0.12)',
    bgColor: 'transparent'
  }
)

/** 计算 background-image + background-size 的 inline style */
const dotStyle = computed(() => ({
  backgroundImage: `radial-gradient(circle, ${props.dotColor} ${props.dotSize}px, transparent ${props.dotSize}px)`,
  backgroundSize: `${props.dotGap}px ${props.dotGap}px`,
  backgroundColor: props.bgColor
}))
</script>

<template>
  <div class="dot-grid w-full h-full" :style="dotStyle">
    <slot />
  </div>
</template>

<style scoped>
.dot-grid {
  /* w-full h-full 由 UnoCSS 提供，此处仅作 fallback */
  pointer-events: none;
}
.dot-grid > * {
  pointer-events: auto;
}
</style>
