<!--
  TitleSlide — 标题栏垂直滑动过渡

  从顶部滑入/滑出，位移距离 = CSS 变量 --title-h。
  0.44s 与页面/侧边栏动画时长保持一致。
-->
<template>
  <Transition name="title-slide">
    <slot />
  </Transition>
</template>

<style scoped>
.title-slide-enter-active {
  transition: transform 0.44s ease;
}
.title-slide-enter-from {
  transform: translateY(calc(var(--title-h) * -1));
}
.title-slide-leave-active {
  transition: transform 0.44s ease;
}
.title-slide-leave-to {
  transform: translateY(calc(var(--title-h) * -1));
}
</style>
