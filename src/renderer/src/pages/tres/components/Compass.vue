<!--
  Compass — 3D 场景方位指南针（屏幕左下角）

  职责：
  - 通过 useLoop 实时获取相机水平朝向角
  - 用 cientos Html 渲染 2D 指南针 UI（内层 fixed 定位到左下角）
  - 盘面反向旋转，使 N 标记始终指向场景北方

  Props：无
  Emits：无
-->
<script setup lang="ts">
import { Vector3 } from 'three'
import { Html } from '@tresjs/cientos'
import { useLoop } from '@tresjs/core'

// ── 方位角计算 ────────────────────────────────
/** 盘面旋转角（deg）：相机朝 -z 时为 0，顺时针为正 */
const rotation = ref(0)
/** 临时方向向量（复用，避免每帧分配） */
const dir = new Vector3()

const { onBeforeRender } = useLoop()
onBeforeRender((state) => {
  if (!state.camera?.value) return
  state.camera.value.getWorldDirection(dir)
  // 水平方位角：atan2(dir.x, dir.z)，相机朝 -z（场景北方）时为 0
  const yaw = Math.atan2(dir.x, dir.z)
  // 盘面反向旋转，使 N 标记始终指向场景北方
  const target = (-yaw * 180) / Math.PI
  // 最短路径插值：将增量归一化到 [-180, 180]，
  // 避免 atan2 在 ±180° 边界跳变时盘面反向旋转一整圈
  let delta = target - rotation.value
  // 归一化到 [-180, 180]：((d+180) % 360 + 360) % 360 - 180
  delta = ((((delta + 180) % 360) + 360) % 360) - 180
  rotation.value += delta
})
</script>

<template>
  <!--
    Html：DOM 覆盖层载体。
    Teleport 到 body 的原因：Html 外层 div 带 transform（投影定位），
    fixed 定位的包含块会变为该元素，导致左下角定位失效。
  -->
  <Html :transform="false" :occlude="false" pointer-events="none">
    <Teleport to="body">
      <div class="compass">
        <!-- 旋转盘面：N/E/S/W 方位标记随相机旋转 -->
        <div class="compass__dial" :style="{ transform: `rotate(${rotation}deg)` }">
          <span class="compass__mark compass__mark--n">N</span>
          <span class="compass__mark compass__mark--e">E</span>
          <span class="compass__mark compass__mark--s">S</span>
          <span class="compass__mark compass__mark--w">W</span>
        </div>
        <!-- 固定指针：指示当前相机朝向 -->
        <div class="compass__pointer"></div>
      </div>
    </Teleport>
  </Html>
</template>

<style scoped>
/* ── 指南针容器：fixed 定位屏幕左下角 ─────────── */
/* iOS 液态玻璃质感：浅色背景下 backdrop-filter 不可见（背后无细节可模糊），
   玻璃感主要靠自身渐变 + 内阴影高光体现 */
.compass {
  position: fixed;
  left: 20px;
  bottom: 20px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.78) 0%,
    rgba(255, 255, 255, 0.32) 48%,
    rgba(255, 255, 255, 0.58) 100%
  );
  -webkit-backdrop-filter: blur(20px) saturate(200%);
  backdrop-filter: blur(20px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.35),
    inset 0 2px 6px rgba(255, 255, 255, 0.65),
    inset 0 -3px 8px rgba(255, 255, 255, 0.25),
    0 4px 16px rgba(0, 0, 0, 0.1);
}

/* ── 旋转盘面 ───────────────────────────────── */
.compass__dial {
  position: absolute;
  inset: 0;
  transition: transform 0.1s linear;
}

/* ── 方位标记 ───────────────────────────────── */
.compass__mark {
  position: absolute;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
}

.compass__mark--n {
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  color: #e11d48;
}

.compass__mark--e {
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
}

.compass__mark--s {
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
}

.compass__mark--w {
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
}

/* ── 固定指针（指向当前朝向） ────────────────── */
.compass__pointer {
  position: absolute;
  top: -3px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 10px solid #e11d48;
}
</style>
