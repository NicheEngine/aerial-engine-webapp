import { watchEffect, ref } from 'vue'
import type { Ref } from 'vue'
import type { IntersectObserverProps } from 'intersect-hook'

export function useIntersectHook({
  target,
  root,
  onIntersect,
  rootMargin = '0px',
  threshold = 0.1,
}: IntersectObserverProps) {
  let cleanup = () => {}
  const observer: Ref<Nullable<IntersectionObserver>> = ref(null)
  const stopEffect = watchEffect(() => {
    cleanup()

    observer.value = new IntersectionObserver(onIntersect, {
      root: root ? root.value : null,
      rootMargin,
      threshold,
    })

    const current = target.value

    current && observer.value.observe(current)

    cleanup = () => {
      if (observer.value) {
        observer.value.disconnect()
        target.value && observer.value.unobserve(target.value)
      }
    }
  })

  return {
    observer,
    stop: () => {
      cleanup()
      stopEffect()
    },
  }
}

export default useIntersectHook
