<!--
  WarehouseBlock — 仓库占位白模

  职责：
  - 在指定平面坐标（x, z）放置仓库白模：
    地台 40×40×1m + 其上仓库 38×38×3m
  - 占位用途：验证仓库的位置与比例，后续替换为仓库模型

  Props：
  - x  地台中心 X 坐标（m），默认 0
  - z  地台中心 Z 坐标（m），默认 0
-->
<script setup lang="ts">
import { ExtrudeGeometry, Shape, Vector3 } from 'three'

// ── Props ─────────────────────────────────────
const props = withDefaults(defineProps<{ x?: number; z?: number }>(), {
  x: 0,
  z: 0
})

// ── 仓库参数 ──────────────────────────────────
/** 地台尺寸（长×宽，m） */
const PLATFORM_SIZE = 40
/** 地台高度（m） */
const PLATFORM_H = 1
/** 仓库尺寸（长×宽，m） */
const WAREHOUSE_SIZE = 38
/** 仓库高度（m） */
const WAREHOUSE_H = 3
/** 屋顶截面底宽（m，z 方向，超出地台 1m/侧） */
const ROOF_WIDTH = 22
/** 屋顶截面高度（m） */
const ROOF_HEIGHT = 1
/** 屋顶长度（m，x 方向，超出仓库 2m/侧） */
const ROOF_LENGTH = 42

// ── 屋顶几何：扁三棱柱 ────────────────────────
// Shape 定义等腰三角形截面（底 22、高 1），Extrude 沿 +z 拉伸 42m
const shape = new Shape()
shape.moveTo(-ROOF_WIDTH / 2, 0)
shape.lineTo(ROOF_WIDTH / 2, 0)
shape.lineTo(0, ROOF_HEIGHT)
shape.closePath()

const roofGeometry = new ExtrudeGeometry(shape, { depth: ROOF_LENGTH, bevelEnabled: false })
// 旋转 -90°：拉伸方向（z）转为 x，使屋顶长边沿 x、截面位于 z-y 平面
roofGeometry.rotateY(-Math.PI / 2)
// 旋转后几何中心偏移到 x=-21，平移回原点使屋顶与仓库同中心
roofGeometry.translate(ROOF_LENGTH / 2, 0, 0)

// ── 派生位置 ──────────────────────────────────
/** 地台位置：y=高度一半贴地 */
const platformPosition = computed(() => new Vector3(props.x, PLATFORM_H / 2, props.z))
/** 仓库位置：坐落在地台上，y=地台顶 + 高度一半 */
const warehousePosition = computed(
  () => new Vector3(props.x, PLATFORM_H + WAREHOUSE_H / 2, props.z)
)
/** 屋顶位置：坐落在仓库顶，y=仓库顶 + 屋顶高度一半 */
const roofPosition = computed(
  () => new Vector3(props.x, PLATFORM_H + WAREHOUSE_H + ROOF_HEIGHT / 2, props.z)
)
</script>

<template>
  <!-- 地台：白色方台，接收并投射阴影 -->
  <TresMesh :position="platformPosition" cast-shadow receive-shadow>
    <TresBoxGeometry :args="[PLATFORM_SIZE, PLATFORM_H, 20]" />
    <TresMeshStandardMaterial color="#FFFFFF" :roughness="0.6" :metalness="0" />
  </TresMesh>

  <!-- 仓库主体：坐落在地台上的白色体块 -->
  <TresMesh :position="warehousePosition" cast-shadow>
    <TresBoxGeometry :args="[WAREHOUSE_SIZE, WAREHOUSE_H, 18]" />
    <TresMeshStandardMaterial color="#FFFFFF" :roughness="0.6" :metalness="0" />
  </TresMesh>

  <!-- 屋顶：扁三棱柱（42×22×1），坐落在仓库顶部 -->
  <TresMesh :position="roofPosition" :geometry="roofGeometry" cast-shadow>
    <TresMeshStandardMaterial color="#FFFFFF" :roughness="0.6" :metalness="0" />
  </TresMesh>
</template>
