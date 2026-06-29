<!--
  SideMenu — 侧边栏菜单（绝对定位，覆盖在主内容上方）

  功能：
  - NaiveUI n-menu 渲染菜单项（数据来自 useMenu composable）
  - 支持折叠/展开，宽度通过 CSS 变量 --side-w 控制
  - 折叠状态由父组件 App.vue 管理，localStorage 持久化
-->
<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { h } from 'vue'
import { useMenu } from '@renderer/composables/useMenu'
import { FALLBACK_ICON } from '@renderer/config/menu-icons'

defineProps<{ collapsed: boolean }>()
const emit = defineEmits<{ toggle: [] }>()

const router = useRouter()
const route = useRoute()
const { menuItems } = useMenu()

/** UnoCSS 图标类名前缀 */
const ICON_PREFIX = 'i-icon-park-outline'

/** 渲染菜单图标：返回 NaiveUI render 函数 */
function renderIcon(iconName?: string) {
  const name = iconName ?? FALLBACK_ICON
  return () => h('div', { class: `${ICON_PREFIX}-${name} text-[18px]` })
}

/** 将 MenuItem 转换为 NaiveUI MenuOption 格式 */
const menuOptions = computed<MenuOption[]>(() =>
  menuItems.value.map((item) => ({
    label: item.title,
    key: item.path,
    icon: renderIcon(item.icon)
  }))
)

/** 菜单点击 → 路由跳转 */
function handleMenuClick(key: string): void {
  router.push(key)
}

/** 当前激活的菜单项（高亮） */
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
    <!-- 菜单区域 -->
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

    <!-- 折叠/展开按钮（底部固定） -->
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
