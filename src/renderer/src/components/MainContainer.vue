<!--
  MainContainer — 主内容容器

  两层结构：
  - 外层（根元素）：干净，供 App.vue 的 page-fade Transition 挂载动画 class
  - 内层（padding-wrapper）：响应侧边栏/标题栏尺寸变化，仅过渡 padding
    0.44s 与 App.vue 的 menu-slide / title-slide 动画同步

  内部嵌套：padding-wrapper → 留白 → 白色圆角卡片 → slot 插槽
-->
<template>
  <!-- 外层：零样式负担，Transition class 可以干净挂载 -->
  <div class="w-full h-full">
    <!-- 内层：ping 过渡（隔离，不干扰动画） -->
    <div class="padding-wrapper w-full h-full box-border">
      <div class="p-16px w-full h-full box-border">
        <!-- 白色圆角卡片 -->
        <div
          class="rounded-8px bg-white/30 shadow-[0_2px_12px_rgba(0,0,0,0.08)] w-full h-full box-border"
        >
          <div class="p-16px w-full h-full box-border">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.padding-wrapper {
  padding-left: var(--side-w);
  padding-top: var(--title-h);
  transition-property: padding;
  transition-duration: 0.44s;
  transition-timing-function: ease-in-out;
}
</style>
