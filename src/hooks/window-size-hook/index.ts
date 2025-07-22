import { tryOnMounted, tryOnUnmounted, useDebounceFn } from '@vueuse/core'
import type { WindowSizeOptions } from 'window-size-hook'

export function useWindowSizeHook<T>(
  apply: DefaultFunction<T>,
  wait = 150,
  options?: WindowSizeOptions,
) {
  let handler = () => {
    apply()
  }
  handler = useDebounceFn(handler, wait)
  const start = () => {
    if (options && options.immediate) {
      handler()
    }
    window.addEventListener('resize', handler)
  }
  const stop = () => {
    window.removeEventListener('resize', handler)
  }

  tryOnMounted(() => {
    start()
  })

  tryOnUnmounted(() => {
    stop()
  })
  return [start, stop]
}

export default useWindowSizeHook
