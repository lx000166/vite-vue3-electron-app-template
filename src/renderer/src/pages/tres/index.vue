<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos'
import { Vector3 } from 'three'
import SceneStage from './components/SceneStage.vue'
import Ground from './components/Ground.vue'
import GridLines from './components/GridLines.vue'
import Compass from './components/Compass.vue'
import PreviewBalls from './components/PreviewBalls.vue'
import OfficeBlock from './components/OfficeBlock.vue'
import HighRail from './components/HighRail.vue'
import WarehouseBlock from './components/WarehouseBlock.vue'
import CameraInfo from './components/CameraInfo.vue'

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

const cameraPosition = new Vector3(55.1, 36.5, 93.2)
// 目标点由方位 -152.9°、俯仰 -15.5°、距离 114.7 推算：位置 + 方向 × 距离
const cameraLookAt = new Vector3(4.74, 5.85, -5.19)

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
    <!-- 环境组件：画布 + 光照，场景内容经插槽注入 -->
    <SceneStage v-if="showCanvas">
      <TresPerspectiveCamera
        :position="cameraPosition"
        :look-at="cameraLookAt"
        :near="0.1"
        :far="1000"
      />
      <!-- 物流网格：Canvas 纹理实现，透明度编码在像素中 -->
      <GridLines />
      <OrbitControls
        :target="cameraLookAt"
        :max-polar-angle="1.3"
        :min-distance="20"
        :max-distance="120"
      />

      <!-- 地面：方形边缘渐隐 -->
      <Ground />

      <PreviewBalls />
      <!-- 办公楼占位白模（未来替换）：南方 + 东侧两个 -->
      <!-- <OfficeBlock :x="0" :z="30" /> -->
      <OfficeBlock :x="30" :z="30" />
      <OfficeBlock :x="-30" :z="30" />
      <!-- 高架高铁占位（办公楼南侧，东西向） -->
      <HighRail />
      <!-- 仓库占位白模（北侧东西角） -->
      <WarehouseBlock :x="35" :z="-30" />
      <WarehouseBlock :x="35" :z="5" />
      <WarehouseBlock :x="-35" :z="-30" />
      <WarehouseBlock :x="-35" :z="5" />
      <!-- 屏幕左下角方位指南针 -->
      <Compass />
      <!-- 右下角相机实时状态 -->
      <CameraInfo />
    </SceneStage>
    <FadeIn>
      <div
        v-if="showMask"
        class="mask absolute top-0 left-0 w-screen h-screen z-70 bg-#e8f7fb"
      ></div>
    </FadeIn>
  </div>
</template>

<style scoped>
/* TresJS canvas 容器 — 必须有实际规则，空 style 会触发 Vite 8 编译 bug */
.tres-placeholder {
  /* 透明 canvas 下的页面背景：浅色天空渐变，避免纯色背景的单调 */
  background: linear-gradient(180deg, #e8f7fb 0%, #f3fbfd 50%, #eef8ee 100%);
}
</style>
