/**
 * UnoCSS 配置 — 原子 CSS 引擎设置
 *
 * Presets：
 * - presetWind3       Tailwind CSS v3 兼容层（建议用 presetWind3 替代 presetUno）
 * - presetAttributify 属性模式：支持 flex="~" 等简写
 * - presetTypography  排版预设：prose 类名
 * - presetIcons       IconPark Outline ~2600 图标 → class="i-icon-park-outline-{name}"
 *
 * Safelist：全量图标类名，避免 UnoCSS 按需扫描遗漏动态生成的菜单图标
 */
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind3,
  transformerDirectives
} from 'unocss'
import iconParkIcons from '@iconify-json/icon-park-outline/icons.json'

export default defineConfig({
  // ── 快捷方式 ────────────────────────────────
  shortcuts: {
    'app-shell': 'min-h-screen w-full overflow-hidden bg-[#d0d4da] text-slate-800',
    'panel-card':
      'rounded-6 border border-white/55 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-md'
  },

  // ── 主题：字体 ──────────────────────────────
  theme: {
    fontFamily: {
      sans: ['MF MiMeng', 'Fira Code', 'Microsoft YaHei', 'PingFang SC', 'sans-serif'],
      mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace']
    }
  },

  // ── 预设 ────────────────────────────────────
  presets: [presetWind3(), presetAttributify(), presetTypography(), presetIcons()],

  // ── 转换器：支持 @apply 等指令 ───────────────
  transformers: [transformerDirectives()],

  // IconPark 全量 safelist — 动态菜单图标不丢失
  safelist: Object.keys(iconParkIcons.icons).map((k) => `i-icon-park-outline-${k}`)
})
