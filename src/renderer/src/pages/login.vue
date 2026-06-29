<!--
  登录页 /login

  - Mock 登录：点击按钮生成临时 token 并跳转首页
  - 布局：none（无标题栏、无侧边栏，全屏居中）
  - 鉴权：不需要登录
  - 视觉：浅色柔光背景 + 浮动光晕 + 毛玻璃按钮
-->
<script setup lang="ts">
import { useAuthStore } from '@renderer/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

definePage({
  meta: { layout: 'none', requiresAuth: false }
})

/** Mock 登录：生成临时 token 并跳转首页 */
function doLogin(): void {
  authStore.login('mock-token-' + Date.now())
  router.replace('/home')
}
</script>

<template>
  <div
    class="login-page drag h-screen overflow-hidden relative flex flex-col items-center justify-center select-none"
  >
    <!-- ═══ 背景装饰：浮动光晕 ═══ -->
    <div class="aurora aurora-1" />
    <div class="aurora aurora-2" />
    <div class="aurora aurora-3" />

    <!-- ═══ 主内容区 ═══ -->
    <div class="relative z-1 flex flex-col items-center gap-8">
      <!-- 应用图标 / Logo -->
      <div class="logo-ring">
        <span class="inline-block i-icon-park-outline-view-grid-detail text-[48px] text-slate-500" />
      </div>

      <!-- 应用标题 -->
      <div class="flex flex-col items-center gap-1">
        <h1 class="text-3xl font-bold text-slate-800 tracking-wider">lx000</h1>
        <p class="text-sm text-slate-400">Digital Twin Platform</p>
      </div>

      <!-- 登录按钮（no-drag 确保可点击） -->
      <button class="login-btn no-drag" @click="doLogin">
        <span class="btn-text">登 录</span>
        <span class="btn-glow" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ── 页面背景：浅色柔光渐变 ──────────────────── */
.login-page {
  background: linear-gradient(135deg, #f0f4ff 0%, #e8ecf4 40%, #f0f4ff 100%);
}

/* ── 浮动光晕球体（柔和彩色） ────────────────── */
.aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.25;
  pointer-events: none;
}
.aurora-1 {
  width: 400px;
  height: 400px;
  background: #93c5fd;
  top: -100px;
  right: -80px;
  animation: float-1 8s ease-in-out infinite;
}
.aurora-2 {
  width: 300px;
  height: 300px;
  background: #c4b5fd;
  bottom: -80px;
  left: -60px;
  animation: float-2 10s ease-in-out infinite;
}
.aurora-3 {
  width: 250px;
  height: 250px;
  background: #67e8f9;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: float-3 12s ease-in-out infinite;
}

@keyframes float-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-30px, 20px) scale(1.1); }
  66% { transform: translate(20px, -15px) scale(0.95); }
}
@keyframes float-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(25px, -20px) scale(1.15); }
}
@keyframes float-3 {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  33% { transform: translate(-40%, -60%) scale(1.1); }
  66% { transform: translate(-60%, -40%) scale(0.9); }
}

/* ── Logo 圆环 ──────────────────────────────── */
.logo-ring {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: logo-pulse 3s ease-in-out infinite;
}
@keyframes logo-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.15); }
  50% { box-shadow: 0 0 36px rgba(59, 130, 246, 0.3); }
}

/* ── 登录按钮：毛玻璃浅色 ────────────────────── */
.login-btn {
  position: relative;
  padding: 14px 64px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.55);
  color: #334155;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.3em;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}
.login-btn:hover {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(59, 130, 246, 0.35);
  box-shadow: 0 0 32px rgba(59, 130, 246, 0.18);
  transform: translateY(-1px);
}
.login-btn:active {
  transform: scale(0.97);
}

/* 按钮光晕脉冲 */
.btn-glow {
  position: absolute;
  inset: -2px;
  border-radius: 14px;
  background: linear-gradient(135deg, #93c5fd, #c4b5fd, #67e8f9);
  opacity: 0;
  z-index: -1;
  filter: blur(8px);
  animation: glow-breathe 2.5s ease-in-out infinite;
}
@keyframes glow-breathe {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.45; }
}

.btn-text {
  position: relative;
  z-index: 1;
}
</style>
