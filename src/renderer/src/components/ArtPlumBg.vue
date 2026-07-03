<!--
  ArtPlumBg — 有机树枝生长动画背景（移植自 Anthony Fu 的 ArtPlum）

  Canvas 2D 从四边随机位置向中间生长分形树枝，mask-image 边缘渐隐。
  内部 <slot /> 可放置任意内容，canvas 在底层不拦截交互。

  Props：
  - color     树枝颜色，默认 #88888825
  - branch    前 N 步分支概率（高），默认 30
  - len       最大线段长度，默认 6
  - delay     启动延迟（ms），默认 500（等待页面过渡动画结束）
  - sides     从哪些边生成，默认 ['top','left','right','bottom']，可传 ['top'] 等
-->
<script setup lang="ts">
import type { Fn } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    color?: string
    branch?: number
    len?: number
    delay?: number
    sides?: string[]
  }>(),
  {
    color: '#88888825',
    branch: 30,
    len: 6,
    delay: 500,
    sides: () => ['top', 'left', 'right', 'bottom']
  }
)

const r180 = Math.PI
const r90 = Math.PI / 2
const r15 = Math.PI / 12

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const size = reactive(useElementSize(containerRef))
const { random } = Math

const startFn = ref<Fn>(() => {})
const stopped = ref(false)

function initCanvas(canvas: HTMLCanvasElement, width = 400, height = 400, _dpi?: number) {
  const ctx = canvas.getContext('2d')!

  const dpr = window.devicePixelRatio || 1
  // @ts-expect-error vendor
  const bsr = ctx.webkitBackingStorePixelRatio || (ctx as any).mozBackingStorePixelRatio || (ctx as any).msBackingStorePixelRatio || (ctx as any).oBackingStorePixelRatio || (ctx as any).backingStorePixelRatio || 1

  const dpi = _dpi || dpr / bsr

  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  canvas.width = dpi * width
  canvas.height = dpi * height
  ctx.scale(dpi, dpi)

  return { ctx, dpi }
}

function polar2cart(x = 0, y = 0, r = 0, theta = 0) {
  const dx = r * Math.cos(theta)
  const dy = r * Math.sin(theta)
  return [x + dx, y + dy]
}

function start() {
  startFn.value()
}

onMounted(async () => {
  const canvas = canvasRef.value!
  const { width: w, height: h } = size
  const { ctx } = initCanvas(canvas, w, h)
  const { width, height } = canvas

  let steps: Fn[] = []
  let prevSteps: Fn[] = []

  const step = (x: number, y: number, rad: number, counter: { value: number } = { value: 0 }) => {
    const length = random() * props.len
    counter.value += 1

    const [nx, ny] = polar2cart(x, y, length, rad)

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(nx, ny)
    ctx.stroke()

    const rad1 = rad + random() * r15
    const rad2 = rad - random() * r15

    // out of bounds
    if (nx < -100 || nx > size.width + 100 || ny < -100 || ny > size.height + 100) return

    const rate = counter.value <= props.branch ? 0.8 : 0.5

    // left branch
    if (random() < rate) steps.push(() => step(nx, ny, rad1, counter))

    // right branch
    if (random() < rate) steps.push(() => step(nx, ny, rad2, counter))
  }

  let lastTime = performance.now()
  const interval = 1000 / 40 // 40fps

  let controls: ReturnType<typeof useRafFn>

  const frame = () => {
    if (performance.now() - lastTime < interval) return

    prevSteps = steps
    steps = []
    lastTime = performance.now()

    if (!prevSteps.length) {
      controls.pause()
      stopped.value = true
    }

    prevSteps.forEach((i) => {
      if (random() < 0.5) steps.push(i)
      else i()
    })
  }

  controls = useRafFn(frame, { immediate: false })

  const randomMiddle = () => random() * 0.6 + 0.2

  startFn.value = () => {
    controls.pause()
    ctx.clearRect(0, 0, width, height)
    ctx.lineWidth = 1
    ctx.strokeStyle = props.color
    prevSteps = []

    // 每次 start 从 size 实时获取容器尺寸（非闭包旧值）
    const cw = size.width
    const ch = size.height

    // 根据 sides prop 决定从哪些边生长
    const sideMap: Record<string, () => void> = {
      top: () => step(randomMiddle() * cw, -5, r90),
      bottom: () => step(randomMiddle() * cw, ch + 5, -r90),
      left: () => step(-5, randomMiddle() * ch, 0),
      right: () => step(cw + 5, randomMiddle() * ch, r180)
    }
    steps = props.sides.map((s) => sideMap[s]).filter(Boolean)

    controls.resume()
    stopped.value = false
  }

  sleep(props.delay).then(() => startFn.value())
})

// ── 容器尺寸变化时重绘 ──
watch([() => size.width, () => size.height], ([w, h]) => {
  if (!w || !h) return
  const canvas = canvasRef.value!
  const dpr = window.devicePixelRatio || 1
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.getContext('2d')!.scale(dpr, dpr)
  start()
})

const mask = computed(() => 'radial-gradient(circle, transparent, black);')

defineExpose({ start })
</script>

<template>
  <div
    ref="containerRef"
    class="art-plum-bg relative w-full h-full"
    style="overflow: hidden"
  >
    <canvas ref="canvasRef" class="absolute inset-0 pointer-events-none" :style="`mask-image: ${mask};-webkit-mask-image: ${mask};`" />
    <div class="relative z-10 w-full h-full">
      <slot />
    </div>
  </div>
</template>
