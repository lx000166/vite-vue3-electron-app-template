<script setup lang="ts">
import { themeConfig } from '@renderer/theme'
</script>

<template>
  <n-config-provider v-bind="themeConfig">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-loading-bar-provider>
            <router-view />
          </n-loading-bar-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
