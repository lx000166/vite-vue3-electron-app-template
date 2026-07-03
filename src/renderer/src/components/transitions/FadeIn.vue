<!--
  FadeIn — 仅淡入过渡（无离开动画）

  用于嵌套路由的 <router-view /> 外层，子页面切换时新页面淡入，
  旧页面直接消失，避免父页面内容被 Transition 的 absolute 定位影响。
-->
<template>
  <Transition name="fade-in" mode="out-in">
    <slot />
  </Transition>
</template>

<style>
/* ═══ 淡入（enter） ═══ */
.fade-in-enter-active {
  transition: opacity 0.33s ease;
}
.fade-in-enter-from {
  opacity: 0;
}

/* ═══ 离开（leave）：无动画 ═══ */
.fade-in-leave-active {
  display: none;
}
</style>
