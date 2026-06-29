<!--
  MainContainer — 主内容容器

  自动适配布局：
  - padding-left  = var(--side-w)  给侧边栏留空间
  - padding-top   = var(--title-h) 给标题栏留空间
  - transition 平滑过渡，配合侧边栏折叠动画

  内层嵌套：外层 padding → 白色圆角卡片 → 内 padding（slot 插槽）
-->
<template>
  <!-- 外层：响应侧边栏/标题栏尺寸，平滑过渡 -->
  <div
    class="w-full h-full box-border"
    style="
      padding-left: var(--side-w);
      padding-top: var(--title-h);
      transition: padding 0.44s ease-in-out;
    "
  >
    <!-- 中层：留白 -->
    <div class="p-16px w-full h-full box-border">
      <!-- 内层：白色圆角卡片 -->
      <div
        class="rounded-8px bg-white/30 shadow-[0_2px_12px_rgba(0,0,0,0.08)] w-full h-full box-border"
      >
        <!-- 内容区：插槽 -->
        <div class="p-16px w-full h-full box-border">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
