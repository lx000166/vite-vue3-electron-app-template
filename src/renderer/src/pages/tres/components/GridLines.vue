<!--
  GridLines — 物流网格线组件（Canvas 纹理实现）

  职责：
  - 用 Canvas 绘制网格线纹理（含中心十字线），透明度直接编码进像素 rgba，
    替代 TresGridHelper（其内部材质透明度在 TresJS 中难以可靠设置）
  - 网格 150×100，2m 一格，若隐若现的地砖缝隙感

  Props：无
  Emits：无
-->
<script setup lang="ts">
import { CanvasTexture, Vector3 } from 'three'

// ── 网格参数 ──────────────────────────────────
/** 网格宽度（m） */
const GRID_WIDTH = 150
/** 网格深度（m） */
const GRID_DEPTH = 100
/** 单元格边长（m） */
const CELL_SIZE = 2
/** 横向单元格数量 */
const CELL_X = GRID_WIDTH / CELL_SIZE
/** 纵向单元格数量 */
const CELL_Y = GRID_DEPTH / CELL_SIZE
/** 纹理宽度（px） */
const TEXTURE_WIDTH = 1024
/** 纹理高度（px）：按 150:100 长宽比计算，避免纹理拉伸 */
const TEXTURE_HEIGHT = Math.round((TEXTURE_WIDTH * GRID_DEPTH) / GRID_WIDTH)
/** 普通网格线颜色（灰色 + 低透明度，若隐若现） */
const LINE_COLOR = 'rgba(160, 170, 184, 0.05)'
/** 中心十字线颜色（仅比普通线稍突出） */
const CROSS_COLOR = 'rgba(160, 170, 184, 0.01)'
/** 网格平面位置：y=0.01 略高于地面，避免 z-fighting */
const gridPosition = new Vector3(0, 0.01, 0)

/**
 * 程序化生成网格线纹理
 *
 * 透明度直接写入像素颜色（rgba alpha），不依赖材质 opacity 管线，
 * 保证半透明效果稳定生效。
 *
 * @returns 网格线 CanvasTexture（sRGB）
 */
function createGridTexture(): CanvasTexture {
  const w = TEXTURE_WIDTH
  const h = TEXTURE_HEIGHT
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  if (ctx) {
    const stepX = w / CELL_X
    const stepY = h / CELL_Y

    // 普通网格线
    ctx.strokeStyle = LINE_COLOR
    ctx.lineWidth = 1.5
    ctx.beginPath()
    for (let i = 0; i <= CELL_X; i++) {
      const x = i * stepX
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
    }
    for (let j = 0; j <= CELL_Y; j++) {
      const y = j * stepY
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
    }
    ctx.stroke()

    // 中心十字线：单独绘制，稍深稍粗
    const cx = w / 2
    const cy = h / 2
    ctx.strokeStyle = CROSS_COLOR
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, cy)
    ctx.lineTo(w, cy)
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx, h)
    ctx.stroke()
  }

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = 'srgb'
  return texture
}

// 组件挂载期间仅生成一次纹理
const gridTexture = createGridTexture()
</script>

<template>
  <!-- 网格线层：透明纹理平面，位于地面之上 -->
  <TresMesh :position="gridPosition" :rotation-x="-Math.PI / 2">
    <TresPlaneGeometry :args="[GRID_WIDTH, GRID_DEPTH]" />
    <TresMeshBasicMaterial :map="gridTexture" transparent />
  </TresMesh>
</template>
