<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos'
import { TresCanvas } from '@tresjs/core'
import { Vector3 } from 'three'

definePage({
  meta: {
    layout: 'header',
    requiresAuth: true,
    addMenu: true,
    sort: 50,
    menuTitle: '3D视图',
    menuIcon: 'cube',
    // 进出 3D 页面只用淡入淡出，避免 page-up/down 的 transform/scale 卡顿
    transitionName: 'page-fade'
  }
})

const cameraPosition = new Vector3(17, 17, 30)
const cameraLookAt = new Vector3(0, 0, 0)

// ── 离开前遮罩覆盖 + 卸载 canvas ──
const showCanvas = ref(true)

/** canvas 卸载期间的纯色遮罩，z-10 确保盖住 canvas 防止闪白 */
const showMask = ref(false)

/**
 * 离开动画前的清理流程：先遮后卸。
 *
 * 关键思路：不在"canvas 卸载时机"上死磕竞态，
 * 而是用一个同色遮罩提前覆盖在 canvas 上方。
 * 遮罩渲染完成后，canvas 再怎么卸都不会被用户看到。
 *
 * 时序：
 * ① showMask = true  → 同色遮罩渲染到 canvas 上层
 * ② await rAF()      → 等浏览器完成遮罩合成
 * ③ showCanvas = false → v-if 卸载 TresCanvas（遮罩已盖住，无感知）
 * ④ await rAF()      → 等浏览器完成 canvas 移除
 * ⑤ 导航继续         → Transition 在遮罩（纯色背景）上做动画
 */
onBeforeRouteLeave(async () => {
  useLoading().start()
  showMask.value = true
  await sleep(330)
  await new Promise((r) => requestAnimationFrame(r))
  showCanvas.value = false
  await new Promise((r) => requestAnimationFrame(r))
  useLoading().done()
})
</script>

<template>
  <!--
    遮罩方案：canvas + 同色覆盖层。
    - TresCanvas：v-if 控制，离开前卸载
    - mask：z-10 遮罩，先于 canvas 卸载前显示，盖住一切异常
  -->
  <div class="tres-placeholder w-screen h-screen relative no-drag">
    <TresCanvas
      v-if="showCanvas"
      clear-color="#82DBC5"
      shadows
      alpha
      render-mode="always"
      preserve-drawing-buffer
    >
      <TresPerspectiveCamera
        :position="cameraPosition"
        :look-at="cameraLookAt"
        :near="0.1"
        :far="1000"
      />
      <TresGridHelper :args="[100, 50]" />
      <OrbitControls :max-polar-angle="1.3" :min-distance="20" :max-distance="120" />
    </TresCanvas>
    <FadeIn>
      <div
        v-if="showMask"
        class="mask absolute top-0 left-0 w-screen h-screen z-70 bg-#82dbc5"
      ></div>
    </FadeIn>
    <div class="absolute z-100 bottom-20px">
      <n-button @click="showMask = true">test = true</n-button>
      <n-button @click="showMask = false">test = false</n-button>
    </div>
  </div>
</template>

<style scoped>
/* TresJS canvas 容器 — 必须有实际规则，空 style 会触发 Vite 8 编译 bug */
.tres-placeholder {
  background-color: transparent;
}
</style>
