<!-- SideMenu — 侧边栏（绝对定位，覆盖在 main 上方） -->
<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { h } from 'vue'
import { useMenu } from '@renderer/composables/useMenu'
import { FALLBACK_ICON } from '@renderer/config/menu-icons'

const props = defineProps<{ collapsed: boolean }>()
const emit = defineEmits<{ toggle: [] }>()

const router = useRouter()
const route = useRoute()
const { menuItems } = useMenu()

const ICON_PREFIX = 'i-icon-park-outline'

function renderIcon(iconName?: string) {
  const name = iconName ?? FALLBACK_ICON
  return () => h('div', { class: `${ICON_PREFIX}-${name} text-[18px]` })
}

const menuOptions = computed<MenuOption[]>(() =>
  menuItems.value.map((item) => ({
    label: item.title,
    key: item.path,
    icon: renderIcon(item.icon)
  }))
)

function handleMenuClick(key: string): void {
  router.push(key)
}
const activeKey = computed(() => route.path)
</script>

<template>
  <aside
    class="absolute left-0 flex flex-col border-r border-#ffffff11 bg-white/30 backdrop-blur-md transition-all duration-200 overflow-hidden z-10"
    :style="{
      top: 'var(--title-h)',
      height: 'calc(100% - var(--title-h))',
      width: 'var(--side-w)'
    }"
  >
    <div class="no-drag flex-1 mt-2px overflow-hidden" :style="{ width: 'var(--side-w)' }">
      <n-menu
        :root-indent="18"
        :value="activeKey"
        :options="menuOptions"
        :collapsed="collapsed"
        :collapsed-width="60"
        :default-expand-all="true"
        @update:value="handleMenuClick"
      />
    </div>

    <div class="no-drag absolute bottom-2 h-10 w-full px-2 z-10">
      <button
        class="w-full h-full rounded-8px flex items-center justify-center text-gray-400 hover:bg-gray-300 hover:text-gray-600 transition-colors"
        @click="emit('toggle')"
      >
        <span v-if="collapsed" class="i-icon-park-outline-right text-16px" title="展开菜单"></span>
        <span v-else class="i-icon-park-outline-left text-16px" title="折叠菜单"></span>
      </button>
    </div>
  </aside>
</template>
