import { nextTick, unref } from 'vue'
import type { Ref } from 'vue'
import type { Options as SortableOptions } from 'sortablejs'

export function useSortableHook(
  element: HTMLElement | Ref<HTMLElement>,
  options?: SortableOptions,
) {
  function initSortable() {
    nextTick(async () => {
      if (!element) return
      const Sortable = (await import('sortablejs')).default
      Sortable.create(unref(element), {
        animation: 500,
        delay: 400,
        delayOnTouchOnly: true,
        ...options,
      })
    }).then(() => {})
  }

  return { initSortable }
}
