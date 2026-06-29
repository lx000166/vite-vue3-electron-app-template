<!--
  PageFade — 路由页面过渡容器（自闭环）

  内部通过 beforeEach 捕获新旧页面 sort 关系，动态决定过渡动画：
  - page-fade  淡入淡出（默认，无 sort 的页面或同 sort）
  - page-up    向上翻页（新 sort > 旧 sort）
  - page-down  向下翻页（新 sort < 旧 sort）

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
    console.log(curr > prev ? 'page-down' : 'page-up')
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
/* ── 共用：leave 元素覆盖在上层 ───────────────── */
.page-fade-leave-active,
.page-up-leave-active,
.page-down-leave-active {
  position: absolute;
  inset: 0;
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

/* ═══ 向上翻页 ═══ */
.page-up-enter-active,
.page-up-leave-active {
  transition: all 0.44s ease;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
}
.page-up-enter-active {
  top: 0;
}
.page-up-leave-active {
  z-index: 1;
}
.page-up-enter-from {
  top: 100vh;
}
.page-up-leave-from {
  top: 0;
}
.page-up-leave-to {
  top: -100vh;
}

/* ═══ 向下翻页 ═══ */
.page-down-enter-active,
.page-down-leave-active {
  transition: all 0.44s ease;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
}
.page-down-enter-active {
  top: 0;
}
.page-down-leave-active {
  z-index: 1;
}
.page-down-enter-from {
  top: -100vh;
}
.page-down-leave-from {
  top: 0;
}
.page-down-leave-to {
  top: 100vh;
}
</style>
