<!--
  TresScene — 3D 场景内容组件

  在 TresCanvas 内部渲染，Tres* 标签由 TresJS 运行时注入。
-->
<script setup lang="ts">
import { Vector3 } from 'three'
import { useLoop } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'

const cameraPosition = new Vector3(3, 3, 8)
const cameraLookAt = new Vector3(0, 0, 0)
const lightPosition = new Vector3(3, 5, 2)

// ── 立方体旋转（逐轴增量） ─────────────────
const cubeRef = ref()
const { onBeforeRender } = useLoop()
onBeforeRender(({ delta }) => {
  if (cubeRef.value) {
    cubeRef.value.rotation.x += delta * 0.3
    cubeRef.value.rotation.y += delta * 0.5
  }
})
</script>

<template>
  <TresPerspectiveCamera
    :position="cameraPosition"
    :look-at="cameraLookAt"
  />
  <OrbitControls />
  <TresAmbientLight :intensity="0.5" />
  <TresDirectionalLight
    :position="lightPosition"
    :intensity="1"
  />
  <TresMesh ref="cubeRef">
    <TresBoxGeometry :args="[1, 1, 1]" />
    <TresMeshStandardMaterial color="#3b82f6" />
  </TresMesh>
  <TresGridHelper :args="[10, 10]" />
</template>
