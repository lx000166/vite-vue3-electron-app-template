<!--
  SkyEnvironment — 天空环境子组件（背景 + 环境光照）

  职责：
  - 加载本地 EXR 天空贴图（Poly Haven Morning Sky，CC0 授权）
  - 设为 scene.background（清晨天空背景）
  - 设为 scene.environment（PMREM 转换，供材质反射与间接光）

  注意：必须作为 TresCanvas 的子组件渲染，useTres 才能取到上下文。

  Props：无
  Emits：无
-->
<script setup lang="ts">
import { EquirectangularReflectionMapping, PMREMGenerator, type WebGLRenderer } from 'three'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'
import { useTres } from '@tresjs/core'
// ?url 导入让 Vite 处理路径与打包（Poly Haven Morning Sky 1K，CC0 授权；
// 4K 备用版见 morning_sky_4k_backup.exr）
import skyUrl from '../../../assets/hdr/morning_sky_1k.exr?url'

// ── 天空贴图加载（EXR → 背景 + 环境光） ───────
const { renderer, scene } = useTres()

onMounted(async () => {
  // useTres 的 renderer 类型为泛型 Renderer，运行时实为 WebGLRenderer，需断言
  const sky = await new EXRLoader().loadAsync(skyUrl)
  // 等距柱状投影需声明映射方式，PMREM 转换才能正确采样
  sky.mapping = EquirectangularReflectionMapping
  // 天空背景：覆盖页面渐变背景，呈现清晨天空氛围
  scene.value.background = sky
  // 环境光照：转换为 PMREM，供球体/地面等材质反射与间接光使用
  const pmremGenerator = new PMREMGenerator(renderer as WebGLRenderer)
  scene.value.environment = pmremGenerator.fromEquirectangular(sky).texture
  pmremGenerator.dispose()
})
</script>

<template>
  <!-- 占位 Group：组件本身不渲染任何几何体 -->
  <TresGroup />
</template>
