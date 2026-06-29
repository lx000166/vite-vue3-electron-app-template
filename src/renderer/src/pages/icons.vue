<!--
  图标库浏览页 /icons

  - IconPark Outline ~2600 图标全量展示
  - 支持搜索过滤（按图标名）
  - 使用 virtual scroll（content-visibility）优化大量 DOM 节点
  - 布局：sidebar（标题栏 + 侧边栏）
  - 鉴权：需要登录
-->
<script setup lang="ts">
import iconParkIcons from '@iconify-json/icon-park-outline/icons.json'

definePage({
  meta: {
    layout: 'sidebar',
    requiresAuth: true,
    addMenu: true,
    sort: 10,
    menuTitle: '图标库',
    menuIcon: 'all-application'
  }
})

/** 全部图标名称列表 */
const icons = Object.keys(iconParkIcons.icons)

/** 搜索关键词 */
const search = ref('')

/** 按关键词过滤后的图标列表（实时响应） */
const filtered = computed(() =>
  search.value ? icons.filter((i) => i.includes(search.value.toLowerCase())) : icons
)
</script>

<template>
  <MainContainer>
    <div class="h-full flex flex-col">
      <!-- 搜索框 -->
      <input
        v-model="search"
        class="mb-4 px-3 py-2 rounded-6px border border-gray-200 bg-white/50 outline-none text-sm w-full max-w-300px"
        placeholder="搜索图标..."
      />

      <!-- 图标网格 -->
      <n-scrollbar style="flex: 1">
        <div class="grid grid-cols-6 gap-2">
          <!-- 每个图标项 -->
          <div
            v-for="name in filtered"
            :key="name"
            class="icon-cell flex flex-col items-center gap-1 p-3 rounded-6px hover:bg-black/5 transition-colors cursor-pointer"
            :title="name"
          >
            <!-- 图标 -->
            <span
              class="inline-block text-[24px] text-[#1a1a1a]"
              :class="'i-icon-park-outline-' + name"
            ></span>
            <!-- 名称 -->
            <span class="text-10px text-gray-400 truncate w-full text-center">{{ name }}</span>
          </div>
        </div>

        <!-- 无匹配提示 -->
        <div v-if="filtered.length === 0" class="text-center text-gray-400 py-8">无匹配图标</div>
      </n-scrollbar>
    </div>
  </MainContainer>
</template>

<style scoped>
/* ── 图标单元格性能优化 ──────────────────────── */
.icon-cell {
  content-visibility: auto;
  contain-intrinsic-size: 80px;
}
</style>
