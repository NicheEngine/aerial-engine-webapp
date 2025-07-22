import type { TransitionSetting } from 'app-settings'
import { computed } from 'vue'
import { useAppStore } from 'app-store'

export function useTransitionSettingHook() {
  const appStore = useAppStore()

  const computedEnableTransition = computed(() => appStore.getTransitionSetting()?.enable)

  const computedOpenNProgress = computed(() => appStore.getTransitionSetting()?.openNProgress)

  const computedOpenPageLoading = computed((): boolean => {
    return !!appStore.getTransitionSetting()?.openPageLoading
  })

  const computedBasicTransition = computed(() => appStore.getTransitionSetting()?.basicTransition)

  function setTransitionSetting(transitionSetting: Partial<TransitionSetting>) {
    appStore.setProjectSetting({ transitionSetting })
  }
  return {
    setTransitionSetting,
    computedEnableTransition,
    computedOpenNProgress,
    computedOpenPageLoading,
    computedBasicTransition,
  }
}
export default useTransitionSettingHook
