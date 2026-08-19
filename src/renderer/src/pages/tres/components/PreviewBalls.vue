<!--
  PreviewBalls — 材质预览三球组件

  职责：
  - 场景中心并排三颗球，展示三种典型材质表现（参考 Poly Haven 等站点预览布局）：
    ① 镜面金属球（metalness 1，完全反射环境）
    ② 蓝色油漆球（clearcoat 清漆涂层，汽车烤漆质感）
    ③ 白色半光泽球（基础漫反射展示）
  - 反射内容由 SceneStage 的天空环境贴图（scene.environment）提供

  Props：无
  Emits：无
-->
<script setup lang="ts">
import { Vector3 } from 'three'

// ── 布局参数 ──────────────────────────────────
/** 球体半径（m） */
const BALL_RADIUS = 1
/** 球体细分段数：越大表面越平滑，反射更清晰 */
const BALL_SEGMENTS = 64
/** 球体并排间距（m） */
const BALL_GAP = 6
/** 球心高度（m）：= 半径 + 离地余量，球底贴合地面 */
const BALL_HEIGHT = 8.6

/** 金属球位置：左侧 */
const metalPosition = new Vector3(-BALL_GAP, BALL_HEIGHT, 0)
/** 油漆球位置：居中 */
const paintPosition = new Vector3(0, BALL_HEIGHT, 0)
/** 白球位置：右侧 */
const whitePosition = new Vector3(BALL_GAP, BALL_HEIGHT, 0)
</script>

<template>
  <!-- ═══ 镜面金属球：metalness 全反射 ═══ -->
  <TresMesh :position="metalPosition" cast-shadow>
    <TresSphereGeometry :args="[BALL_RADIUS, BALL_SEGMENTS, BALL_SEGMENTS]" />
    <TresMeshStandardMaterial
      color="#FFFFFF"
      :metalness="1"
      :roughness="0.05"
      :env-map-intensity="0.6"
    />
  </TresMesh>

  <!-- ═══ 红色油漆球：clearcoat 清漆涂层 ═══ -->
  <TresMesh :position="paintPosition" cast-shadow>
    <TresSphereGeometry :args="[BALL_RADIUS, BALL_SEGMENTS, BALL_SEGMENTS]" />
    <TresMeshPhysicalMaterial
      color="#DC2626"
      :metalness="0"
      :roughness="0.15"
      :clearcoat="1"
      :clearcoat-roughness="0.05"
      :env-map-intensity="0.8"
    />
  </TresMesh>

  <!-- ═══ 白色半光泽球：基础漫反射 ═══ -->
  <TresMesh :position="whitePosition" cast-shadow>
    <TresSphereGeometry :args="[BALL_RADIUS, BALL_SEGMENTS, BALL_SEGMENTS]" />
    <TresMeshStandardMaterial
      color="#F5F6F8"
      :metalness="0"
      :roughness="0.35"
      :env-map-intensity="0.4"
    />
  </TresMesh>
</template>
