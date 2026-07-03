<!--
  ParticleBg — 动态粒子连线背景

  使用 Canvas 2D 渲染随机粒子的漂移 + 近距连线效果。
  内部 <slot /> 可放置任意内容，canvas 在底层不拦截交互。

  Props：
  - particleCount  粒子数量，默认 40
  - particleColor  粒子颜色，默认 rgba(100,100,100,0.18)
  - lineColor      连线颜色，默认同 particleColor
  - speed          移动速度（px/帧），默认 0.3
  - connectDist    连线最大距离（px），默认 120
  - bgColor        背景色，默认 transparent
-->
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    particleCount?: number
    particleColor?: string
    lineColor?: string
    speed?: number
    connectDist?: number
    bgColor?: string
  }>(),
  {
    particleCount: 40,
    particleColor: 'rgba(100,100,100,0.18)',
    lineColor: '',
    speed: 0.3,
    connectDist: 120,
    bgColor: 'transparent'
  }
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const size = reactive(useElementSize(containerRef))

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

let particles: Particle[] = []
const lineClr = computed(() => props.lineColor || props.particleColor)

/** 初始化粒子数组 */
function initParticles(w: number, h: number): void {
  const { random } = Math
  particles = Array.from({ length: props.particleCount }, () => ({
    x: random() * w,
    y: random() * h,
    vx: (random() - 0.5) * props.speed * 2,
    vy: (random() - 0.5) * props.speed * 2
  }))
}

/** 更新单帧：移动 + 反弹 + 绘制 */
function tick(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')!
  const w = size.width
  const h = size.height

  // 移动粒子 & 边界反弹
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < 0 || p.x > w) p.vx *= -1
    if (p.y < 0 || p.y > h) p.vy *= -1
  }

  // 绘制
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 连线（距离近的粒子对）
  ctx.strokeStyle = lineClr.value
  ctx.lineWidth = 0.8
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < props.connectDist) {
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        // 透明度随距离衰减
        ctx.globalAlpha = 1 - dist / props.connectDist
        ctx.stroke()
      }
    }
  }
  ctx.globalAlpha = 1

  // 粒子点
  ctx.fillStyle = props.particleColor
  for (const p of particles) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
    ctx.fill()
  }
}

/** Canvas 尺寸同步容器 */
watch([() => size.width, () => size.height], ([w, h]) => {
  const canvas = canvasRef.value
  if (!canvas || !w || !h) return
  const dpr = window.devicePixelRatio || 1
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.getContext('2d')!.scale(dpr, dpr)
  initParticles(w, h)
})

onMounted(() => {
  initParticles(size.width, size.height)
  useRafFn(tick)
})
</script>

<template>
  <div ref="containerRef" class="particle-bg relative w-full h-full" :style="{ backgroundColor: bgColor }">
    <canvas ref="canvasRef" class="absolute inset-0 pointer-events-none" />
    <div class="relative z-1 w-full h-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.particle-bg {
  overflow: hidden;
}
</style>
