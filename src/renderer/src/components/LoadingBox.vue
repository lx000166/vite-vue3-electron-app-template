<!--
  LoadingBox — 全局加载指示器

  内部直接引用 useLoading() store，无需外部传 props。
  放在 App.vue 中即可。
-->
<script setup lang="ts">
const loading = useLoading()
</script>

<template>
  <div class="fixed inset-0 z-600 pointer-events-none top-0 left-0">
    <!-- 遮罩 -->
    <Transition name="loading-mask">
      <div v-if="loading.mask && loading.display" class="absolute inset-0 bg-black/10" />
    </Transition>

    <!-- header-bottom loader（hb） -->
    <Transition name="loading-hb">
      <div
        v-if="loading.display && (!loading.type || loading.type === 'hb')"
        class="absolute flex justify-center items-center w-full flex-col"
        style="top: var(--title-h)"
      >
        <div class="relative mt-4">
          <div class="loader-hb absolute top-0" />
          <div class="loader-hb-2 absolute top-0" />
        </div>
      </div>
    </Transition>

    <!-- header-inset loader（hi） -->
    <Transition name="loading-hi">
      <div
        v-if="loading.display && loading.type === 'hi'"
        class="absolute flex justify-center items-center w-full"
        style="top: 0; height: var(--title-h)"
      >
        <div class="loader-h" />
      </div>
    </Transition>
  </div>
</template>

<!-- ═══ Transition 动画 ═══ -->
<style>
.loading-mask-enter-active {
  transition: opacity 0.3s ease;
}
.loading-mask-leave-active {
  transition: opacity 0.25s ease;
}
.loading-mask-enter-from,
.loading-mask-leave-to {
  opacity: 0;
}

.loading-hb-enter-active,
.loading-hi-enter-active {
  transition:
    transform 0.12s ease,
    opacity 0.12s ease;
}
.loading-hb-leave-active,
.loading-hi-leave-active {
  transition:
    transform 0.44s ease,
    opacity 0.44s ease;
}
.loading-hb-enter-from,
.loading-hb-leave-to,
.loading-hi-enter-from,
.loading-hi-leave-to {
  transform: translateY(-35%);
  opacity: 0;
}
</style>

<!-- ═══ loader-hb / loader-hb-2（蓝紫青渐变，和登录页光晕同源） ═══ -->
<style scoped>
.loader-hb {
  height: 32px;
  aspect-ratio: 0.866;
  display: grid;
  background: conic-gradient(
    from -121deg at right,
    #0000,
    rgba(147, 197, 253, 0.4) 1deg 60deg,
    #0000 61deg
  );
  animation: l12 2.5s infinite linear;
  transform-origin: 33% 50%;
}
.loader-hb:before,
.loader-hb:after {
  position: relative;
  z-index: 1;
  content: '';
  grid-area: 1/1;
  background: conic-gradient(
    from -121deg at right,
    #0000,
    rgba(196, 181, 253, 0.5) 1deg 60deg,
    #0000 61deg
  );
  transform-origin: inherit;
  animation: inherit;
}
.loader-hb:before {
  animation-duration: 2.9s;
  animation-delay: -0.48s;
}
.loader-hb:after {
  background: conic-gradient(
    from -121deg at right,
    #0000,
    rgba(103, 232, 249, 0.55) 1deg 60deg,
    #0000 61deg
  );
  animation-duration: 3.3s;
  animation-delay: -1.1s;
}
@keyframes l12 {
  100% {
    transform: rotate(1turn);
  }
}

.loader-hb-2 {
  height: 32px;
  aspect-ratio: 0.866;
  display: grid;

  background: conic-gradient(
    from -121deg at right,
    #0000,
    rgba(147, 197, 253, 0.6) 1deg 60deg,
    #0000 61deg
  );
  animation: l12 3.7s infinite linear;
  transform-origin: 33% 50%;
  animation-delay: -1.85s;
}
.loader-hb-2:before,
.loader-hb-2:after {
  position: relative;
  z-index: 1;
  content: '';
  grid-area: 1/1;
  background: conic-gradient(
    from -121deg at right,
    #0000,
    rgba(196, 181, 253, 0.7) 1deg 60deg,
    #0000 61deg
  );
  transform-origin: inherit;
  animation: inherit;
}
.loader-hb-2:before {
  position: relative;
  z-index: 10;
  animation-duration: 4.1s;
  animation-delay: -2.73s;
}
.loader-hb-2:after {
  z-index: 11;
  background: conic-gradient(
    from -121deg at right,
    #0000,
    rgba(103, 232, 249, 0.75) 1deg 60deg,
    #0000 61deg
  );
  animation:
    l12 4.5s infinite linear,
    pulse 8s infinite ease;
  animation-delay: -3.75s, 0s;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>

<!-- ═══ loader-h ═══ -->
<style scoped>
.loader-h {
  height: calc(var(--title-h) - 10px);
  aspect-ratio: 2;
  border-bottom: 2px solid #0000;
  background: linear-gradient(90deg, #524656 50%, #0000 0) -25% 100% / 50% 2px repeat-x border-box;
  position: relative;
  animation: l3-0 0.75s linear infinite;
}
.loader-h:before {
  content: '';
  position: absolute;
  inset: auto 42.5% 0;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #46cfbda1;
  animation: l3-1 0.75s cubic-bezier(0, 900, 1, 900) infinite;
}
@keyframes l3-0 {
  to {
    background-position: -125% 100%;
  }
}
@keyframes l3-1 {
  0%,
  2% {
    bottom: 0%;
  }
  98%,
  to {
    bottom: 0.1%;
  }
}
</style>
