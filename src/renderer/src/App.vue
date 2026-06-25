<template>
  <n-config-provider>
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <div
            class="h-screen w-screen border-2px border-red box-border app-wapper"
            style="border-radius: 14px; overflow: hidden"
          >
            <div class="gg h-full w-full">
              <n-scrollbar style="max-height: 100%">
                <router-view />
              </n-scrollbar>
            </div>
          </div>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
<style>
.app-wapper {
  --app-w: calc(100vw - 4px);
  --app-h: calc(100vh - 4px);
}
</style>
