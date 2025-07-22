import { watch, unref } from 'vue'
import { useI18nHook } from 'i18n-hook'
import { useTitle } from '@vueuse/core'
import { useSettingHook } from 'setting-hook'
import { useRouter } from 'vue-router'
import { useLocaleStore } from 'locale-store'

import { REDIRECT_NAME } from '@rts/constant'

export function useTitleHook() {
  const { title } = useSettingHook()
  const { t } = useI18nHook()
  const { currentRoute } = useRouter()
  const localeStore = useLocaleStore()

  const pageTitle = useTitle()

  watch(
    [() => currentRoute.value.path, () => localeStore.getLocale],
    () => {
      const route = unref(currentRoute)

      if (route.name === REDIRECT_NAME) {
        return
      }
      const i18nTitle = t(route?.meta?.title as string)
      pageTitle.value = i18nTitle ? ` ${i18nTitle} - ${title} ` : `${title}`
    },
    { immediate: true },
  )
}

export default useTitleHook
