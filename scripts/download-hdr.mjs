/**
 * 下载 HDR 环境贴图脚本 — 从 three.js 官方示例仓库拉取（Poly Haven CC0 资源）
 *
 * 用法：node scripts/download-hdr.mjs
 *
 * 来源：
 * - 主源：jsDelivr CDN（国内访问稳定）
 * - 备用源：GitHub raw
 * 文件说明：1k 分辨率等距柱状投影 HDR/EXR，均为 CC0 授权，体积 ~1MB 以内
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── 下载清单（文件名 → 场景氛围说明） ──────────
// 文件列表以 three.js@r185 仓库实际存在的文件为准
const FILES = [
  'venice_sunset_1k.hdr', // 日落暖调环境（金色氛围）
  'blouberg_sunrise_2_1k.hdr', // 日出海边环境（暖橙渐变）
  'monochrome_studio_02_1k.hdr', // 影棚中性光环境（适合产品级镜面展示）
  'quarry_01_1k.hdr', // 白天矿场环境（明亮通透）
  'spruit_sunrise_1k.hdr' // 日出旷野环境（柔和暖调）
]

// ── 输出目录 ──────────────────────────────────
const OUT_DIR = join(__dirname, '..', 'src', 'renderer', 'src', 'assets', 'hdr')

// CDN 域名前缀，优先 jsDelivr，失败后回退 GitHub raw
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r185/examples/textures/equirectangular/'
const RAW_BASE = 'https://raw.githubusercontent.com/mrdoob/three.js/r185/examples/textures/equirectangular/'

/**
 * 下载单个文件，主源失败自动回退备用源
 *
 * @param url 下载地址
 * @returns 响应对象或 null
 */
async function fetchWithFallback(url) {
  for (const base of [CDN_BASE, RAW_BASE]) {
    try {
      const res = await fetch(base + url, { signal: AbortSignal.timeout(60000) })
      if (res.ok && Number(res.headers.get('content-length') ?? 0) > 0) return res
      console.warn(`  ${base} 返回异常，尝试备用源...`)
    } catch (err) {
      console.warn(`  ${base} 下载失败：${err.message}`)
    }
  }
  return null
}

/** 主流程：创建目录并逐个下载 */
async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  console.log(`输出目录：${OUT_DIR}\n`)

  let failed = 0
  for (const name of FILES) {
    const res = await fetchWithFallback(name)
    if (!res) {
      console.error(`✗ ${name} 下载失败`)
      failed++
      continue
    }
    const buffer = Buffer.from(await res.arrayBuffer())
    await writeFile(join(OUT_DIR, name), buffer)
    console.log(`✓ ${name}  (${(buffer.length / 1024).toFixed(0)} KB)`)
  }

  console.log(failed === 0 ? '\n全部下载完成' : `\n${failed} 个文件失败，请检查网络后重试`)
}

await main()
