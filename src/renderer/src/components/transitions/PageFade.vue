<!--
  PageFade — 路由页面过渡容器（自闭环）

  内部通过 beforeEach 捕获新旧页面 sort 关系，动态决定过渡动画：
  - page-fade  淡入淡出（默认，无 sort 的页面或同 sort）
  - page-up    向上翻页（新 sort > 旧 sort）
  - page-down  向下翻页（新 sort < 旧 sort）

  使用 transform 而非 top 实现位移，GPU 加速、无布局冲突。
  CSS 必须是非 scoped：Vue Transition 把 class 加在 slot 内容的根元素上。
-->
<script setup lang="ts">
const router = useRouter()

/** 过渡动画名（beforeEach 中直接赋值，to/from 均为可靠快照） */
const transitionName = ref('page-fade')
router.beforeEach((to, from) => {
  const prev = from.meta.sort as number | undefined
  const curr = to.meta.sort as number | undefined
  if (prev === undefined || curr === undefined || prev === curr) {
    transitionName.value = 'page-fade'
  } else {
    transitionName.value = curr > prev ? 'page-up' : 'page-down'
  }
})
</script>

<template>
  <Transition :name="transitionName">
    <slot />
  </Transition>
</template>

<!-- Transition 动画 CSS：必须非 scoped -->
<style>
/* ── 共用：enter/leave 都绝对定位占满容器 ──────── */
.page-fade-enter-active,
.page-fade-leave-active,
.page-up-enter-active,
.page-up-leave-active,
.page-down-enter-active,
.page-down-leave-active {
  position: absolute;
  inset: 0;
}
/* leave 在上层，确保移出动画可见 */
.page-fade-leave-active,
.page-up-leave-active,
.page-down-leave-active {
  z-index: 1;
}

/* ═══ 淡入淡出（默认） ═══ */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.44s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

/* ═══ 向上翻页（新 sort > 旧 sort） ═══ */
.page-up-enter-active {
  transition: transform 0.44s ease-out;
}

.page-up-leave-active {
  transition:
    transform 0.5s ease-in-out,
    opacity 0.5s ease;
  /* opacity 2s ease; */
}

.page-up-enter-from {
  transform: translateY(100%) scale(1.2);
}
.page-up-leave-to {
  transform: translateY(-100%) scale(0.7);
  opacity: 0.2;
}

/* ═══ 向下翻页（新 sort < 旧 sort） ═══ */
.page-down-enter-active {
  transition: transform 0.44s ease-out;
}

.page-down-leave-active {
  transition:
    transform 0.5s ease-in-out,
    opacity 0.5s ease;
}

.page-down-enter-from {
  transform: translateY(-100%) scale(1.2);
}
.page-down-leave-to {
  transform: translateY(100%) scale(0.7);
  opacity: 0.2;
}
</style>
