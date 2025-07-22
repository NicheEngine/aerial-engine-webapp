import type { MultiTabsSetting } from 'app-settings'

import { computed } from 'vue'

import { useAppStore } from 'app-store'

export function useMultiTabsSettingHook() {
  const appStore = useAppStore()

  const computedShowMultipleTab = computed(() => appStore.getMultiTabsSetting.show)

  const computedShowQuick = computed(() => appStore.getMultiTabsSetting.showQuick)

  const computedShowRedo = computed(() => appStore.getMultiTabsSetting.showRedo)

  const computedShowFold = computed(() => appStore.getMultiTabsSetting.showFold)

  function setMultiTabsSetting(multiTabsSetting: Partial<MultiTabsSetting>) {
    appStore.setProjectConfig({ multiTabsSetting })
  }

  return {
    setMultiTabsSetting,
    computedShowMultipleTab,
    computedShowQuick,
    computedShowRedo,
    computedShowFold,
  }
}

export default useMultipleTabSettingHook
