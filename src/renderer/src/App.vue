<!--
  App.vue — 应用根组件

  职责：
  - 注入 Naive UI 全局配置（主题、语言、消息/对话框/通知/加载栏 Provider）
  - 管理布局：通过 CSS 变量 --side-w / --title-h 向下传递尺寸
  - 控制 TitleBar 和 SideMenu 的显隐（基于 route.meta.layout）
  - 侧边栏折叠状态持久化到 localStorage
-->
<script setup lang="ts">
import { themeConfig } from '@renderer/theme'

// ── 布局常量 ──────────────────────────────────
/** 侧边栏展开宽度（px） */
const EXPANDED_WIDTH = 180
/** 侧边栏折叠宽度（px） */
const COLLAPSED_WIDTH = 60
/** 标题栏高度（px） */
const TITLE_BAR_H = 40

// ── 布局模式 ──────────────────────────────────
const route = useRoute()
/** 当前页面布局模式：none | header | sidebar */
const layout = computed(() => (route.meta.layout as string) ?? 'sidebar')

// ── 侧边栏折叠状态 ────────────────────────────
const collapsed = ref(localStorage.getItem('sidebar-collapsed') === 'true')
function toggleCollapse(): void {
  collapsed.value = !collapsed.value
  localStorage.setItem('sidebar-collapsed', String(collapsed.value))
}
/** 侧边栏当前宽度（CSS 变量值） */
const sideW = computed(() => (collapsed.value ? COLLAPSED_WIDTH : EXPANDED_WIDTH) + 'px')
</script>

<template>
  <n-config-provider
    :theme-overrides="themeConfig.themeOverrides"
    :locale="themeConfig.locale"
    :date-locale="themeConfig.dateLocale"
  >
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-loading-bar-provider>
            <main
              class="relative w-screen h-screen overflow-hidden"
              :style="{ '--side-w': sideW, '--title-h': TITLE_BAR_H + 'px' }"
            >
              <!-- 页面内容：动态过渡动画 -->
              <router-view v-slot="{ Component, route: r }">
                <PageFade>
                  <component :is="Component" :key="r.path" />
                </PageFade>
              </router-view>

              <!-- 侧边栏：水平滑动过渡 -->
              <MenuSlide>
                <SideMenu
                  v-if="layout === 'sidebar'"
                  :collapsed="collapsed"
                  @toggle="toggleCollapse"
                />
              </MenuSlide>

              <!-- 标题栏：垂直滑动过渡 -->
              <TitleSlide>
                <TitleBar v-if="layout !== 'none'" />
              </TitleSlide>
            </main>
          </n-loading-bar-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
