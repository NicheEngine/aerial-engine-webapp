import { computed, onUnmounted, unref, watchEffect } from 'vue'
import { useThrottleFn } from '@vueuse/core'

import { useAppStore } from 'app-store'
import { useLockedStore } from 'locked-store'

import { useUserStore } from 'user-store'
import { useRootSettingHook } from 'setting-hook'

export function useLockedPageHook() {
  const { getLockedTime } = useRootSettingHook()
  const lockedStore = useLockedStore()
  const userStore = useUserStore()
  const appStore = useAppStore()

  let timeId: TimeoutHandle

  function clear(): void {
    window.clearTimeout(timeId)
  }

  function resetCalcLockTimeout(): void {
    // not login
    if (!userStore.getAccessToken()) {
      clear()
      return
    }
    const lockedTime = appStore.getProjectSetting().lockedTime
    if (!lockedTime || lockedTime < 1) {
      clear()
      return
    }
    clear()

    timeId = setTimeout(
      () => {
        lockPage()
      },
      lockedTime * 60 * 1000,
    )
  }

  function lockPage(): void {
    lockedStore.setLockedInfo({
      locked: true,
      passwd: undefined,
    })
  }

  watchEffect((onClean) => {
    if (userStore.getAccessToken()) {
      resetCalcLockTimeout()
    } else {
      clear()
    }
    onClean(() => {
      clear()
    })
  })

  onUnmounted(() => {
    clear()
  })

  const keyupFn = useThrottleFn(resetCalcLockTimeout, 2000)

  return computed(() => {
    if (unref(getLockedTime)) {
      return { onKeyup: keyupFn, onMousemove: keyupFn }
    } else {
      clear()
      return {}
    }
  })
}

export default useLockedPageHook
