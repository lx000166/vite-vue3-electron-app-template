<!-- MainContainer -->
<template>
  <div
    class="w-full h-full box-border"
    style="
      padding-left: var(--side-w);
      padding-top: var(--title-h);
      transition: padding 0.44s ease-in-out;
    "
  >
    <div class="p-16px w-full h-full box-border">
      <div
        class="rounded-8px bg-white/30 shadow-[0_2px_12px_rgba(0,0,0,0.08)] w-full h-full box-border"
      >
        <div class="p-16px w-full h-full box-border">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
