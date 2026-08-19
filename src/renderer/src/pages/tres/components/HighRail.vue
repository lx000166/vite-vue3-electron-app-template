<!--
  HighRail — 高架高铁占位白模

  职责：
  - 东西向（x 轴）170m 高铁高架占位：桥墩 + 轨道梁 + 车厢
  - 位置：办公楼南侧约 5m（中线 z=35）
  - 结构：底部间隔桥墩（每墩两根圆柱）→ 1m 厚轨道梁 → 20m 长车厢
  - 整体高度约 10.5m，不超过办公楼高度（12m）
  - 占位用途：未来替换为高铁/高架桥模型

  Props：无
  Emits：无
-->
<script setup lang="ts">
import { Vector3 } from 'three'

// ── 高架参数 ──────────────────────────────────
/** 轨道总长（m，东西向） */
const RAIL_LENGTH = 170
/** 高架中线 z 坐标（m）：办公楼南侧 5m 间距（楼南面 z=32.5，轨道北沿 37.5） */
const RAIL_Z = 40
/** 轨道梁宽（m） */
const RAIL_WIDTH = 5
/** 轨道梁厚（m） */
const RAIL_THICK = 1
/** 梁顶高度（m）：车厢底面，总高控制在楼高（12m）以内 */
const DECK_TOP = 7.5
/** 桥墩圆柱半径（m） */
const PIER_RADIUS = 0.5
/** 桥墩间距（m） */
const PIER_GAP = 20
/** 每墩两根圆柱的横向间距（m，垂直于轨道方向） */
const PIER_SPAN = 1.5
/** 车厢长（m，沿轨道方向） */
const CAR_LENGTH = 20
/** 车厢宽与高（m） */
const CAR_SIZE = 3

// ── 派生参数 ──────────────────────────────────
/** 桥墩高度（m）：从地面到梁底 */
const PIER_HEIGHT = DECK_TOP - RAIL_THICK
/** 轨道梁中心高度（m） */
const DECK_Y = PIER_HEIGHT + RAIL_THICK / 2
/** 车厢中心高度（m） */
const CAR_Y = DECK_TOP + CAR_SIZE / 2
/** 高架组整体位置 */
const groupPosition = new Vector3(0, 0, RAIL_Z)

// ── 桥墩布局 ──────────────────────────────────
// 沿轨道均布墩位（-80 ~ 80，间隔 20m，共 9 墩）
const pierXs: number[] = []
for (let x = -80; x <= 80; x += PIER_GAP) {
  pierXs.push(x)
}

/** 每墩左侧圆柱位置（z 向负偏移） */
const pierLefts = pierXs.map((x) => new Vector3(x, PIER_HEIGHT / 2, -PIER_SPAN))
/** 每墩右侧圆柱位置（z 向正偏移） */
const pierRights = pierXs.map((x) => new Vector3(x, PIER_HEIGHT / 2, PIER_SPAN))
/** 轨道梁位置（组内 z=0） */
const deckPosition = new Vector3(0, DECK_Y, 0)
/** 车厢位置（组内 z=0，x 居中） */
const carPosition = new Vector3(0, CAR_Y, 0)
</script>

<template>
  <TresGroup :position="groupPosition">
    <!-- ═══ 桥墩：间隔均布，每墩两根并列圆柱 ═══ -->
    <TresMesh v-for="(pos, i) in pierLefts" :key="`l${i}`" :position="pos" cast-shadow>
      <TresCylinderGeometry :args="[PIER_RADIUS, PIER_RADIUS, PIER_HEIGHT, 12]" />
      <TresMeshStandardMaterial color="#FFFFFF" :roughness="0.6" :metalness="0" />
    </TresMesh>
    <TresMesh v-for="(pos, i) in pierRights" :key="`r${i}`" :position="pos" cast-shadow>
      <TresCylinderGeometry :args="[PIER_RADIUS, PIER_RADIUS, PIER_HEIGHT, 12]" />
      <TresMeshStandardMaterial color="#FFFFFF" :roughness="0.6" :metalness="0" />
    </TresMesh>

    <!-- ═══ 轨道梁：1m 厚长条 ═══ -->
    <TresMesh :position="deckPosition" cast-shadow>
      <TresBoxGeometry :args="[RAIL_LENGTH, RAIL_THICK, RAIL_WIDTH]" />
      <TresMeshStandardMaterial color="#FFFFFF" :roughness="0.6" :metalness="0" />
    </TresMesh>

    <!-- ═══ 车厢：20m 长白色方柱 ═══ -->
    <TresMesh :position="carPosition" cast-shadow>
      <TresBoxGeometry :args="[CAR_LENGTH, CAR_SIZE, CAR_SIZE]" />
      <TresMeshStandardMaterial color="#FFFFFF" :roughness="0.6" :metalness="0" />
    </TresMesh>
  </TresGroup>
</template>
