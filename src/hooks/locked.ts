import { ref, unref } from 'vue'

export function useLockedHook<P extends any[] = any[], V = any>(
  callback: (...args: P) => Promise<V>,
) {
  const lockedRef = ref(false)
  return async function (...args: P) {
    if (unref(lockedRef)) return
    lockedRef.value = true
    try {
      const result = await callback(...args)
      lockedRef.value = false
      return result
    } catch (error) {
      lockedRef.value = false
      throw error
    }
  }
}
