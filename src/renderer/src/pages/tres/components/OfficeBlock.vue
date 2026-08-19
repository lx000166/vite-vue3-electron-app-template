<!--
  OfficeBlock — 办公楼占位白模

  职责：
  - 在指定平面坐标（x, z）放置 5×5×5 白色体块，底部贴地
  - 占位用途：验证办公楼的位置与比例，后续替换为办公楼模型

  Props：
  - x  体块平面 X 坐标（m），默认 0
  - z  体块平面 Z 坐标（m），默认 30（南方）
-->
<script setup lang="ts">
import { Vector3 } from 'three'

// ── Props ─────────────────────────────────────
const props = withDefaults(defineProps<{ x?: number; z?: number }>(), {
  x: 0,
  z: 30
})

// ── 体块参数 ──────────────────────────────────
/** 体块尺寸（宽×高×深，m） */
const BLOCK_SIZE = 12
/** 体块位置：y=高度一半使底部贴地 */
const blockPosition = computed(() => new Vector3(props.x, BLOCK_SIZE / 2, props.z))
</script>

<template>
  <!-- 办公楼占位白模：白色标准材质，投射阴影 -->
  <TresMesh :position="blockPosition" cast-shadow>
    <TresBoxGeometry :args="[15, BLOCK_SIZE, 5]" />
    <TresMeshStandardMaterial color="#FFFFFF" :roughness="0.6" :metalness="0" />
  </TresMesh>
</template>
