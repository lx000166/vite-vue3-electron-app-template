<!-- App.vue -->
<script setup lang="ts">
import { themeConfig } from '@renderer/theme'

const EXPANDED_WIDTH = 180
const COLLAPSED_WIDTH = 60
const TITLE_BAR_H = 40

const route = useRoute()
const layout = computed(() => (route.meta.layout as string) ?? 'sidebar')

const collapsed = ref(localStorage.getItem('sidebar-collapsed') === 'true')
function toggleCollapse(): void {
  collapsed.value = !collapsed.value
  localStorage.setItem('sidebar-collapsed', String(collapsed.value))
}
const sideW = computed(() => (collapsed.value ? COLLAPSED_WIDTH : EXPANDED_WIDTH) + 'px')
</script>

<template>
  <n-config-provider :theme-overrides="themeConfig.themeOverrides" :locale="themeConfig.locale" :date-locale="themeConfig.dateLocale">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-loading-bar-provider>
            <main class="relative w-screen h-screen overflow-hidden" :style="{ '--side-w': sideW, '--title-h': TITLE_BAR_H + 'px' }">
              <router-view />
              <Transition name="menu-slide">
                <SideMenu v-if="layout === 'sidebar'" :collapsed="collapsed" @toggle="toggleCollapse" />
              </Transition>
              <Transition name="title-slide">
                <TitleBar v-if="layout !== 'none'" />
              </Transition>
            </main>
          </n-loading-bar-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
.menu-slide-enter-active { transition: transform 0.44s ease; }
.menu-slide-enter-from   { transform: translateX(calc(var(--side-w) * -1)); }
.menu-slide-leave-active { transition: transform 0.44s ease; z-index: 1; }
.menu-slide-leave-to     { transform: translateX(calc(var(--side-w) * -1)); }

.title-slide-enter-active { transition: transform 0.44s ease; }
.title-slide-enter-from   { transform: translateY(calc(var(--title-h) * -1)); }
.title-slide-leave-active { transition: transform 0.44s ease; }
.title-slide-leave-to     { transform: translateY(calc(var(--title-h) * -1)); }
</style>
