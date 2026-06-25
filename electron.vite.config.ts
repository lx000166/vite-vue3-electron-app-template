import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
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
    plugins: [
      vue(),
      UnoCSS(),
      AutoImport({
        dts: 'src/auto-imports.d.ts',
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
        dts: 'src/components.d.ts',
        dirs: ['src/components'],
        resolvers: [NaiveUiResolver()]
      })
    ]
  }
})
