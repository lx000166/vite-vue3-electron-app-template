<script setup lang="ts">
import { useMessage } from 'naive-ui'

const appStore = useAppStore()
const message = useMessage()
const now = useNow()
const timeText = useDateFormat(now, 'YYYY-MM-DD HH:mm:ss')

useTitle(appStore.title)

const features = [
  'UnoCSS utilities are ready to use.',
  'Naive UI components are auto-registered.',
  'Vue Router is mounted with hash history.',
  'Pinia and VueUse are available out of the box.'
]

function showReadyMessage(): void {
  message.success('基础配置已经就绪，可以直接开始开发。')
}
</script>

<template>
  <main class="app-shell [-webkit-app-region:no-drag] font-sans">
    <section class="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
      <div class="grid w-full gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <n-card class="panel-card !rounded-8">
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-4">
              <span
                class="inline-flex rounded-full bg-slate-900 px-3 py-1 text-3 text-white/90 tracking-[0.24em] uppercase"
              >
                Electron Desktop
              </span>
              <div class="space-y-3">
                <h1 class="text-10 text-slate-900 leading-none font-600">
                  {{ appStore.title }}
                </h1>
                <p class="max-w-2xl text-4.2 text-slate-600 leading-7">
                  {{ appStore.subtitle }}
                </p>
              </div>
            </div>
            <div class="rounded-5 bg-slate-900 px-4 py-3 text-right text-white shadow-lg">
              <p class="text-3 uppercase tracking-[0.24em] text-white/60">now</p>
              <p class="mt-2 font-mono text-4">
                {{ timeText }}
              </p>
            </div>
          </div>

          <div class="mt-8 flex flex-wrap gap-3">
            <n-button type="primary" size="large" @click="showReadyMessage">
              打开就绪提示
            </n-button>
            <n-button size="large" quaternary> UnoCSS + Naive UI </n-button>
          </div>
        </n-card>

        <n-card class="panel-card !rounded-8">
          <template #header>
            <span class="text-4.5 font-600 text-slate-800">项目底座</span>
          </template>

          <n-space vertical :size="16">
            <div
              v-for="feature in features"
              :key="feature"
              class="flex items-center gap-3 rounded-4 bg-white/70 px-4 py-3 text-slate-700"
            >
              <div class="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span class="leading-6">{{ feature }}</span>
            </div>
          </n-space>

          <div class="mt-6 rounded-4 bg-slate-950 px-4 py-4 text-slate-100">
            <p class="text-3 uppercase tracking-[0.24em] text-slate-400">style rule</p>
            <p class="mt-3 text-4 leading-7 text-slate-200">
              所有样式尽量使用 UnoCSS，只有全局字体、reset 和不适合 utility 的场景再写普通 CSS。
            </p>
          </div>
        </n-card>
      </div>
    </section>
  </main>
</template>
