import { useAppProviderContext } from '@cps/Application'
import { computed, unref } from 'vue'

export function useAppInjectHook() {
  const values = useAppProviderContext()

  return {
    getIsMobile: computed(() => unref(values.isMobile)),
  }
}

export default useAppInjectHook
