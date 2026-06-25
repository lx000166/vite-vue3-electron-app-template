import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives
} from 'unocss'

export default defineConfig({
  shortcuts: {
    'app-shell': 'min-h-screen w-full overflow-hidden bg-[#d0d4da] text-slate-800',
    'panel-card':
      'rounded-6 border border-white/55 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-md'
  },
  theme: {
    fontFamily: {
      sans: ['MF MiMeng', 'Fira Code', 'Microsoft YaHei', 'PingFang SC', 'sans-serif'],
      mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace']
    }
  },
  presets: [presetUno(), presetAttributify(), presetTypography(), presetIcons()],
  transformers: [transformerDirectives()]
})
