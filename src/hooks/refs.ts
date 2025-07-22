import type { ComponentPublicInstance, Ref, VNodeRef } from 'vue'
import { ref, onBeforeUpdate } from 'vue'

export function useRefsHook(): [Ref<Element[]>, (index: number) => VNodeRef] {
  const refs = ref([]) as Ref<any[]>

  onBeforeUpdate(() => {
    refs.value = []
  })

  const setRefs = (index: number) => {
    return (el: Element | ComponentPublicInstance | null) => {
      if (el) {
        refs.value[index] = el
      }
    }
  }

  return [refs, setRefs]
}

export default useRefsHook
