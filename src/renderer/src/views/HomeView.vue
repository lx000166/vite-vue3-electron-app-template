<script setup lang="ts">
const title = useAppStore().title
const subTitle = useAppStore().subtitle
</script>

<template>
  <div class="flex min-h-[200px] flex-col items-center justify-center gap-4">
    <span class="text-xl font-bold">{{ title }}</span>
    <span class="text-sm text-slate-500">{{ subTitle }}</span>
  </div>
</template>
