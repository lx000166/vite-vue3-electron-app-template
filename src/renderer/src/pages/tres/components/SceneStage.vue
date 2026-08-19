<!--
  SceneStage — 场景环境组件（画布 + 光照 + 天空）

  职责：
  - 包裹 TresCanvas 并配置渲染参数（透明背景、阴影、常驻渲染）
  - 提供基础光照：环境光打底 + 平行光模拟太阳
  - 内部渲染天空子组件（SkyEnvironment）：EXR 天空背景 + 全局环境光照
  - 场景内容（相机 / 网格 / 球体等）通过默认插槽注入

  Props：无
  Emits：无
-->
<script setup lang="ts">
import { PCFShadowMap, Vector3 } from 'three'
import { TresCanvas } from '@tresjs/core'
import SkyEnvironment from './SkyEnvironment.vue'

// ── 光照参数 ──────────────────────────────────
/** 平行光位置：模拟太阳从 45° 斜上方照射 */
const lightPosition = new Vector3(15, 25, 15)
</script>

<template>
  <!-- PCFShadowMap：PCFSoftShadowMap 已被 r185 弃用，显式指定 -->
  <TresCanvas
    :clear-alpha="0"
    shadows
    :shadow-map-type="PCFShadowMap"
    alpha
    render-mode="always"
    preserve-drawing-buffer
  >
    <!-- 光照：环境光打底 + 平行光模拟太阳（微暖色，投射阴影） -->
    <TresAmbientLight :intensity="0.6" color="#FFFFFF" />
    <TresDirectionalLight
      :position="lightPosition"
      :intensity="2.5"
      color="#FFF3E0"
      cast-shadow
      :shadow-camera-near="1"
      :shadow-camera-far="200"
      :shadow-camera-left="-100"
      :shadow-camera-right="100"
      :shadow-camera-top="100"
      :shadow-camera-bottom="-100"
      :shadow-bias="-0.0005"
    />

    <!-- 天空：EXR 背景 + 环境光照（必须为 TresCanvas 子组件才能用 useTres） -->
    <SkyEnvironment />

    <!-- 场景内容插槽：由调用方注入相机 / 网格 / 控制 / 球体等 -->
    <slot />
  </TresCanvas>
</template>
