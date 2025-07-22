import type { MenuSetting } from 'app-settings'
import { computed, unref, ref } from 'vue'
import { useAppStore } from 'app-store'
import { SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from '@ems/appTypes.ts'
import { MenuModeType, MenuStyleType, TriggerType } from '@ems/menuTypes.ts'
import { useFullContentHook } from '@hks/fullContent.ts'

const mixSideHasChildren = ref(false)

export function useMenuSettingHook() {
  const { fullContent } = useFullContentHook()
  const appStore = useAppStore()

  const getShowSidebar = computed(() => {
    return (
      unref(getSplit) ||
      (unref(getShowMenu) && unref(getMenuMode) !== MenuModeType.HORIZONTAL && !unref(fullContent))
    )
  })

  const getCollapsed = computed(() => appStore.getMenuSetting.collapsed)

  const getMenuType = computed(() => appStore.getMenuSetting.type)

  const getMenuMode = computed(() => appStore.getMenuSetting.mode)

  const getMenuFixed = computed(() => appStore.getMenuSetting.fixed)

  const getShowMenu = computed(() => appStore.getMenuSetting.show)

  const getMenuHidden = computed(() => appStore.getMenuSetting.hidden)

  const getMenuWidth = computed(() => appStore.getMenuSetting.menuWidth)

  const getTrigger = computed(() => appStore.getMenuSetting.trigger)

  const getMenuTheme = computed(() => appStore.getMenuSetting.theme)

  const getSplit = computed(() => appStore.getMenuSetting.split)

  const getMenuBgColor = computed(() => appStore.getMenuSetting.bgColor)

  const getMixSideTrigger = computed(() => appStore.getMenuSetting.mixSideTrigger)

  const getCanDrag = computed(() => appStore.getMenuSetting.canDrag)

  const getAccordion = computed(() => appStore.getMenuSetting.accordion)

  const getMixSideFixed = computed(() => appStore.getMenuSetting.mixSideFixed)

  const getTopMenuAlign = computed(() => appStore.getMenuSetting.topMenuAlign)

  const getCloseMixSidebarOnChange = computed(() => appStore.getMenuSetting.closeMixSidebarOnChange)

  const getIsSidebarType = computed(() => unref(getMenuType) === MenuStyleType.SIDEBAR)

  const getIsTopMenu = computed(() => unref(getMenuType) === MenuStyleType.TOP_MENU)

  const getCollapsedShowTitle = computed(() => appStore.getMenuSetting.collapsedShowTitle)

  const getShowTopMenu = computed(() => {
    return unref(getMenuMode) === MenuModeType.HORIZONTAL || unref(getSplit)
  })

  const getShowHeaderTrigger = computed(() => {
    if (
      unref(getMenuType) === MenuStyleType.TOP_MENU ||
      !unref(getShowMenu) ||
      unref(getMenuHidden)
    ) {
      return false
    }

    return unref(getTrigger) === TriggerType.HEADER
  })

  const getIsHorizontal = computed(() => {
    return unref(getMenuMode) === MenuModeType.HORIZONTAL
  })

  const getIsMixSidebar = computed(() => {
    return unref(getMenuType) === MenuStyleType.MIX_SIDEBAR
  })

  const getIsMixMode = computed(() => {
    return unref(getMenuMode) === MenuModeType.INLINE && unref(getMenuType) === MenuStyleType.MIX
  })

  const getRealWidth = computed(() => {
    if (unref(getIsMixSidebar)) {
      return unref(getCollapsed) && !unref(getMixSideFixed)
        ? unref(getMiniWidthNumber)
        : unref(getMenuWidth)
    }
    return unref(getCollapsed) ? unref(getMiniWidthNumber) : unref(getMenuWidth)
  })

  const getMiniWidthNumber = computed(() => {
    const { collapsedShowTitle, siderHidden } = appStore.getMenuSetting
    return siderHidden ? 0 : collapsedShowTitle ? SIDE_BAR_SHOW_TIT_MINI_WIDTH : SIDE_BAR_MINI_WIDTH
  })

  const getCalcContentWidth = computed(() => {
    const width =
      unref(getIsTopMenu) || !unref(getShowMenu) || (unref(getSplit) && unref(getMenuHidden))
        ? 0
        : unref(getIsMixSidebar)
          ? (unref(getCollapsed) ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH) +
            (unref(getMixSideFixed) && unref(mixSideHasChildren) ? unref(getRealWidth) : 0)
          : unref(getRealWidth)

    return `calc(100% - ${unref(width)}px)`
  })

  // Set menu configuration
  function setMenuSetting(menuSetting: Partial<MenuSetting>): void {
    appStore.setProjectConfig({ menuSetting })
  }

  function toggleCollapsed() {
    setMenuSetting({
      collapsed: !unref(getCollapsed),
    })
  }
  return {
    setMenuSetting,

    toggleCollapsed,

    getMenuFixed,
    getRealWidth,
    getMenuType,
    getMenuMode,
    getShowMenu,
    getCollapsed,
    getMiniWidthNumber,
    getCalcContentWidth,
    getMenuWidth,
    getTrigger,
    getSplit,
    getMenuTheme,
    getCanDrag,
    getCollapsedShowTitle,
    getIsHorizontal,
    getIsSidebarType,
    getAccordion,
    getShowTopMenu,
    getShowHeaderTrigger,
    getTopMenuAlign,
    getMenuHidden,
    getIsTopMenu,
    getMenuBgColor,
    getShowSidebar,
    getIsMixMode,
    getIsMixSidebar,
    getCloseMixSidebarOnChange,
    getMixSideTrigger,
    getMixSideFixed,
    mixSideHasChildren,
  }
}

export default useMenuSettingHook
