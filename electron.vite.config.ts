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
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {}
      }
    },
    plugins: [
      vue(),
      VueRouter({
        routesFolder: 'src/renderer/src/pages',
        dts: 'src/renderer/src/types/typed-router.d.ts'
      }),
      UnoCSS(),
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
      Components({
        dts: 'src/types/components.d.ts',
        dirs: ['src/components'],
        resolvers: [NaiveUiResolver()]
      })
    ]
  }
})
