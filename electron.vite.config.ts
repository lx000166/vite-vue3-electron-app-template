/**
 * electron-vite 构建配置
 *
 * 三层构建：
 * - main    主进程（Node.js 环境）
 * - preload 预加载脚本（contextBridge）
 * - renderer 渲染进程（Vue + Vite + UnoCSS）
 *
 * 关键插件：
 * - vue()            Vue SFC 编译
 * - VueRouter()      文件路由自动生成 + importMode:'sync' 同步导入
 * - UnoCSS()         原子 CSS 引擎
 * - AutoImport()     Vue/Router/Pinia/VueUse/NaiveUI 自动导入
 * - Components()     NaiveUI 组件自动注册
 */
import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'vue-router/vite'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    // ── 路径别名 ───────────────────────────────
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    // ── CSS 预处理器 ───────────────────────────
    css: {
      preprocessorOptions: {
        scss: {}
      }
    },
    // ── Vite 插件 ──────────────────────────────
    plugins: [
      // Vue SFC 编译
      vue(),

      // 文件路由：src/renderer/src/pages/** → 自动生成路由表
      // importMode: 'sync' — Electron 环境关闭懒加载，路由切换零延迟
      VueRouter({
        routesFolder: 'src/renderer/src/pages',
        dts: 'src/renderer/src/types/typed-router.d.ts',
        importMode: 'sync'
      }),

      // UnoCSS 原子 CSS
      UnoCSS(),

      // 自动导入：Vue / Router / Pinia / VueUse / NaiveUI hooks
      AutoImport({
        dts: 'src/types/auto-imports.d.ts',
        dirs: ['src/stores', 'src/composables'],
        imports: [
          'vue',
          'vue-router',
          'pinia',
          '@vueuse/core',
          {
            'naive-ui': ['useDialog', 'useLoadingBar', 'useMessage', 'useNotification']
          }
        ],
        resolvers: [NaiveUiResolver()]
      }),

      // 组件自动注册：NaiveUI 组件 + src/components/
      Components({
        dts: 'src/types/components.d.ts',
        dirs: ['src/components'],
        resolvers: [NaiveUiResolver()]
      })
    ]
  }
})
