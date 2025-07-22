import { computed, unref } from 'vue'

import { useAppStore } from 'app-store'

import { useRouter } from 'vue-router'

export const useFullContentHook = () => {
  const appStore = useAppStore()
  const router = useRouter()
  const { currentRoute } = router

  // Whether to display the content in full screen without displaying the menu
  const fullContent = computed(() => {
    // Query parameters, the full screen is displayed when the address bar has a full parameter
    const route = unref(currentRoute)
    const query = route.query
    if (query && Reflect.has(query, '__full__')) {
      return true
    }
    // Return to the configuration in the configuration file
    return appStore.getProjectConfig.fullContent
  })

  return { fullContent }
}

export default useFullContentHook
