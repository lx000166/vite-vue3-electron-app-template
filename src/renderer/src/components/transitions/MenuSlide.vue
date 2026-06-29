<!--
  MenuSlide — 侧边栏水平滑动过渡

  从左侧滑入/滑出，位移距离 = CSS 变量 --side-w。
  0.44s 与页面/标题栏动画时长保持一致。
-->
<template>
  <Transition name="menu-slide">
    <slot />
  </Transition>
</template>

<style scoped>
.menu-slide-enter-active {
  transition: transform 0.44s ease;
}
.menu-slide-enter-from {
  transform: translateX(calc(var(--side-w) * -1));
}
.menu-slide-leave-active {
  transition: transform 0.44s ease;
  z-index: 1;
}
.menu-slide-leave-to {
  transform: translateX(calc(var(--side-w) * -1));
}
</style>
