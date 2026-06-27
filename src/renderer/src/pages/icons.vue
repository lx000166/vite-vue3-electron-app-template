<!-- /icons -->
<script setup lang="ts">
import iconParkIcons from '@iconify-json/icon-park-outline/icons.json'

definePage({
  meta: { layout: 'sidebar', requiresAuth: true, addMenu: true, sort: 10, menuTitle: '图标库', menuIcon: 'all-application' }
})

const icons = Object.keys(iconParkIcons.icons)
const search = ref('')
const filtered = computed(() => search.value ? icons.filter(i => i.includes(search.value.toLowerCase())) : icons)
</script>

<template>
  <MainContainer>
    <div class="h-full flex flex-col">
      <input v-model="search" class="mb-4 px-3 py-2 rounded-6px border border-gray-200 bg-white/50 outline-none text-sm w-full max-w-300px" placeholder="搜索图标..." />
      <n-scrollbar style="flex:1">
        <div class="grid grid-cols-6 gap-2">
          <div v-for="name in filtered" :key="name" class="icon-cell flex flex-col items-center gap-1 p-3 rounded-6px hover:bg-black/5 transition-colors cursor-pointer" :title="name">
            <span class="inline-block text-[24px] text-[#1a1a1a]" :class="'i-icon-park-outline-' + name"></span>
            <span class="text-10px text-gray-400 truncate w-full text-center">{{ name }}</span>
          </div>
        </div>
        <div v-if="filtered.length === 0" class="text-center text-gray-400 py-8">无匹配图标</div>
      </n-scrollbar>
    </div>
  </MainContainer>
</template>

<style scoped>
.icon-cell {
  content-visibility: auto;
  contain-intrinsic-size: 80px;
}
</style>
