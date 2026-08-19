<!--
  CameraInfo — 相机实时状态信息面板（屏幕右下角）

  职责：
  - 通过 useLoop 每帧读取相机位置、方位角、俯仰角、距离
  - 液态玻璃质感面板，实时刷新显示

  Props：无
  Emits：无
-->
<script setup lang="ts">
import { Vector3 } from 'three'
import { Html } from '@tresjs/cientos'
import { useLoop } from '@tresjs/core'

// ── 相机状态（每帧更新） ──────────────────────
/** 相机位置（m） */
const cameraPos = ref({ x: 0, y: 0, z: 0 })
/** 方位角（°）：0 = 场景北方（-z），顺时针为正 */
const yaw = ref(0)
/** 俯仰角（°）：水平为 0，俯视为负 */
const pitch = ref(0)
/** 距离（m）：相机到场景中心的距离 */
const distance = ref(0)

/** 临时方向向量（复用，避免每帧分配） */
const dir = new Vector3()

const { onBeforeRender } = useLoop()
onBeforeRender((state) => {
  if (!state.camera?.value) return
  const cam = state.camera.value

  // 位置与距离
  cameraPos.value = { x: cam.position.x, y: cam.position.y, z: cam.position.z }
  distance.value = cam.position.length()

  // 朝向：方位角与俯仰角
  cam.getWorldDirection(dir)
  yaw.value = (Math.atan2(dir.x, dir.z) * 180) / Math.PI
  pitch.value = (Math.atan2(dir.y, Math.hypot(dir.x, dir.z)) * 180) / Math.PI
})
</script>

<template>
  <!-- Html：DOM 覆盖层，Teleport 到 body 规避 transform 定位影响（同指南针） -->
  <Html :transform="false" :occlude="false" pointer-events="none">
    <Teleport to="body">
      <div class="camera-info">
        <!-- 单行显示：位置 / 方位 / 俯仰 / 距离 -->
        <span class="camera-info__item">
          <span class="camera-info__label">位置</span>
          X {{ cameraPos.x.toFixed(1) }} Y {{ cameraPos.y.toFixed(1) }} Z
          {{ cameraPos.z.toFixed(1) }}
        </span>
        <span class="camera-info__item">
          <span class="camera-info__label">方位</span>
          {{ yaw.toFixed(1) }}°
        </span>
        <span class="camera-info__item">
          <span class="camera-info__label">俯仰</span>
          {{ pitch.toFixed(1) }}°
        </span>
        <span class="camera-info__item">
          <span class="camera-info__label">距离</span>
          {{ distance.toFixed(1) }} m
        </span>
      </div>
    </Teleport>
  </Html>
</template>

<style scoped>
/* ── 面板容器：fixed 定位屏幕右下角，单行布局，低透明度无阴影 ── */
.camera-info {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 12px;
  border-radius: 10px;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.35) 0%,
    rgba(255, 255, 255, 0.15) 48%,
    rgba(255, 255, 255, 0.25) 100%
  );
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  font-size: 12px;
  white-space: nowrap;
}

/* ── 数据项 ─────────────────────────────────── */
.camera-info__item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.camera-info__label {
  color: #9ca3af;
}

.camera-info__item {
  font-family: 'FiraCode', 'Courier New', monospace;
  color: #374151;
}
</style>
