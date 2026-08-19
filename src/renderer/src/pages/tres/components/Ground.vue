<!--
  Ground — 场景地面组件（白色大理石质感 + 轻微反光）

  职责：
  - 渲染 100×100 方形白色大理石地坪（单张纹理，无重复平铺）
  - 程序化生成大理石纹理（冷白基底 + 浅蓝灰细纹 + 矿物斑点）
  - 方形边缘虚化：中心区域不透明，四边逐渐淡出融入背景
  - 低粗糙度 + clearcoat 配合环境反射，呈现反光质感
  - 略微低于 y=0，避免与网格线 z-fighting

  Props：无
  Emits：无
-->
<script setup lang="ts">
import { CanvasTexture, Vector3 } from 'three'

// ── 地面参数 ──────────────────────────────────
/** 地面宽度（m） */
const GROUND_WIDTH = 170
/** 地面深度（m） */
const GROUND_DEPTH = 120
/** 边缘渐隐宽度（m）：距边 10m 处开始虚化，中心完整尺寸 150×100 */
const FADE_MARGIN = 10
/** 纹理宽度（px） */
const TEXTURE_WIDTH = 1024
/** 纹理高度（px）：按 170:120 长宽比计算，避免纹理拉伸 */
const TEXTURE_HEIGHT = Math.round((TEXTURE_WIDTH * GROUND_DEPTH) / GROUND_WIDTH)
/** 地面位置：y=-0.01 略低于网格平面，防止 z-fighting */
const groundPosition = new Vector3(0, -0.01, 0)

/**
 * 程序化生成大理石纹理（含方形边缘渐隐）
 *
 * 步骤：
 * ① Canvas 绘制冷白基底 + 随机浅蓝灰细纹 + 矿物斑点
 * ② 两次 destination-in 线性渐变叠加（水平 + 垂直），
 *    边缘 FADE_MARGIN 宽度内线性淡出，中心完整区域不透明
 *
 * @returns 单张覆盖地面的大理石 CanvasTexture（sRGB）
 */
function createMarbleTexture(): CanvasTexture {
  const w = TEXTURE_WIDTH
  const h = TEXTURE_HEIGHT
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  if (ctx) {
    // 冷白蓝基底（设计稿色 #dce2f5 的基础上加深蓝色调）
    ctx.fillStyle = '#d5ddf2'
    ctx.fillRect(0, 0, w, h)

    // 随机浅蓝灰细纹：批次绘制（按透明度分档，每档一次 stroke，
    // 51800 条线仅 5 次绘制调用，大幅降低生成耗时），线条较淡
    const LINE_ALPHA_LEVELS = [0.08, 0.11, 0.14, 0.17, 0.2]
    const LINE_TOTAL = 51800
    // 每档收集线段坐标 [x1, y1, x2, y2]
    const lineBatches = LINE_ALPHA_LEVELS.map(() => [] as number[])
    for (let i = 0; i < LINE_TOTAL; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      const angle = Math.random() * Math.PI
      const len = 25 + Math.random() * 110
      const level = Math.floor(Math.random() * LINE_ALPHA_LEVELS.length)
      lineBatches[level].push(x, y, x + Math.cos(angle) * len, y + Math.sin(angle) * len)
    }

    // 每档合并为一条路径绘制一次
    ctx.lineWidth = 2.2
    lineBatches.forEach((lines, idx) => {
      ctx.strokeStyle = `rgba(168, 186, 222, ${LINE_ALPHA_LEVELS[idx]})`
      ctx.beginPath()
      for (let j = 0; j < lines.length; j += 4) {
        ctx.moveTo(lines[j], lines[j + 1])
        ctx.lineTo(lines[j + 2], lines[j + 3])
      }
      ctx.stroke()
    })

    // 淡斑点：更小更密，模拟大理石矿物颗粒
    for (let i = 0; i < 800; i++) {
      ctx.fillStyle = `rgba(138, 158, 200, ${0.1 + Math.random() * 0.2})`
      ctx.beginPath()
      ctx.arc(Math.random() * w, Math.random() * h, 0.8 + Math.random() * 2.2, 0, Math.PI * 2)
      ctx.fill()
    }

    // 方形 alpha 蒙版：两次 destination-in 线性渐变叠加（保持 canvas 预乘 alpha 语义）
    // 渐隐比例按各自方向的 FADE_MARGIN 占边长比例计算
    const fadeX = FADE_MARGIN / GROUND_WIDTH
    const fadeY = FADE_MARGIN / GROUND_DEPTH

    // 水平方向：中心不透明，左右边缘渐隐
    const gx = ctx.createLinearGradient(0, 0, w, 0)
    gx.addColorStop(0, 'rgba(255, 255, 255, 0)')
    gx.addColorStop(fadeX, 'rgba(255, 255, 255, 1)')
    gx.addColorStop(1 - fadeX, 'rgba(255, 255, 255, 1)')
    gx.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillStyle = gx
    ctx.fillRect(0, 0, w, h)

    // 垂直方向：再叠加一次，两次相乘得到方形四边渐隐（四角更早淡出）
    const gy = ctx.createLinearGradient(0, 0, 0, h)
    gy.addColorStop(0, 'rgba(255, 255, 255, 0)')
    gy.addColorStop(fadeY, 'rgba(255, 255, 255, 1)')
    gy.addColorStop(1 - fadeY, 'rgba(255, 255, 255, 1)')
    gy.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = gy
    ctx.fillRect(0, 0, w, h)
  }

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = 'srgb'
  return texture
}

// 组件挂载期间仅生成一次纹理
const marbleTexture = createMarbleTexture()
</script>

<template>
  <!-- 大理石地坪：方形边缘渐隐融入背景，接收阴影，clearcoat 呈现反光 -->
  <TresMesh :position="groundPosition" :rotation-x="-Math.PI / 2" receive-shadow>
    <TresPlaneGeometry :args="[GROUND_WIDTH, GROUND_DEPTH]" />
    <TresMeshPhysicalMaterial
      color="#FFFFFF"
      :map="marbleTexture"
      transparent
      :roughness="0.12"
      :metalness="0"
      :clearcoat="1"
      :clearcoat-roughness="0.1"
      :env-map-intensity="1.2"
    />
  </TresMesh>
</template>
