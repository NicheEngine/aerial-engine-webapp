import type { RootSetting } from 'app-settings'

import { computed } from 'vue'

import { useAppStore } from 'app-store'
import { ContentWidthType, ThemeModeType } from '@ems/appTypes.ts'

export function useRootSettingHook() {
  const appStore = useAppStore()

  const computedPageLoading = computed(() => appStore.getPagesLoading())

  const computedOpenKeepAlive = computed(() => appStore.getProjectSetting().openKeepAlive)

  const computedSettingButtonPosition = computed(
    () => appStore.getProjectSetting().settingButtonPosition,
  )

  const computedCanEmbedIFramePage = computed(() => appStore.getProjectSetting().canEmbedIFramePage)

  const computedPurviewMode = computed(() => appStore.getProjectSetting().purviewType)

  const computedShowLogo = computed(() => appStore.getProjectSetting().showLogo)

  const computedContentMode = computed(() => appStore.getProjectSetting().contentMode)

  const computedUseOpenBackTop = computed(() => appStore.getProjectSetting().useOpenBackTop)

  const computedShowSettingButton = computed(() => appStore.getProjectSetting().showSettingButton)

  const computedUseErrorHandle = computed(() => appStore.getProjectSetting().useErrorHandle)

  const computedShowFooter = computed(() => appStore.getProjectSetting().showFooter)

  const computedShowBreadCrumb = computed(() => appStore.getProjectSetting().showBreadCrumb)

  const computedThemeColor = computed(() => appStore.getProjectSetting().themeColor)

  const computedShowBreadCrumbIcon = computed(() => appStore.getProjectSetting().showBreadCrumbIcon)

  const computedFullContent = computed(() => appStore.getProjectSetting().fullContent)

  const computedColorWeak = computed(() => appStore.getProjectSetting().colorWeak)

  const computedGrayMode = computed(() => appStore.getProjectSetting().grayMode)

  const computedLockedTime = computed(() => appStore.getProjectSetting().lockTime)

  const computedShowDarkModeToggle = computed(() => appStore.getProjectSetting().showDarkModeToggle)

  const computedThemeMode = computed(() => appStore.getThemeMode())

  const computedLayoutContentMode = computed(() =>
    appStore.getProjectConfig.contentMode === ContentWidthType.FULL
      ? ContentWidthType.FULL
      : ContentWidthType.FIXED,
  )

  function setRootSetting(rootSetting: Partial<RootSetting>) {
    appStore.setProjectSetting(rootSetting)
  }

  function setThemeMode(themeNode: ThemeModeType) {
    appStore.setThemeMode(themeNode)
  }
  return {
    setRootSetting,
    setThemeMode,
    computedSettingButtonPosition,
    computedFullContent,
    computedColorWeak,
    computedGrayMode,
    computedLayoutContentMode,
    computedPageLoading,
    computedOpenKeepAlive,
    computedCanEmbedIFramePage,
    computedPurviewMode,
    computedShowLogo,
    computedUseErrorHandle,
    computedShowBreadCrumb,
    computedShowBreadCrumbIcon,
    computedUseOpenBackTop,
    computedShowSettingButton,
    computedShowFooter,
    computedContentMode,
    computedLockedTime,
    computedThemeColor,
    computedThemeMode,
    computedShowDarkModeToggle,
  }
}

export default useRootSettingHook
