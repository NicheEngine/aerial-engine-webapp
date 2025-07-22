import { on } from 'dom-util'
import { isServer } from '@uts/staple.ts'
import type { ComponentPublicInstance, DirectiveBinding, ObjectDirective } from 'vue'

import type { OutsideHandler, OutsideFlushCache } from 'outside-directive'

const nodeCaches: OutsideFlushCache = new Map()

let startClick: MouseEvent

if (!isServer) {
  on(document, 'mousedown', (event: MouseEvent) => (startClick = event))
  on(document, 'mouseup', (event: MouseEvent) => {
    for (const { handler } of nodeCaches.values()) {
      handler(event, startClick)
    }
  })
}

function createOutsideHandler(el: HTMLElement, binding: DirectiveBinding): OutsideHandler {
  let excludes: HTMLElement[] = []
  if (Array.isArray(binding.arg)) {
    excludes = binding.arg
  } else {
    // due to current implementation on binding type is wrong the type casting is necessary here
    excludes.push(binding.arg as unknown as HTMLElement)
  }
  return function (mouseup, mousedown) {
    const popperRef = (
      binding.instance as ComponentPublicInstance<{
        popperRef: Nullable<HTMLElement>
      }>
    ).popperRef
    const mouseUpTarget = mouseup.target as Node
    const mouseDownTarget = mousedown.target as Node
    const isBound = !binding || !binding.instance
    const isTargetExists = !mouseUpTarget || !mouseDownTarget
    const isContainedByEl = el.contains(mouseUpTarget) || el.contains(mouseDownTarget)
    const isSelf = el === mouseUpTarget

    const isTargetExcluded =
      (excludes.length && excludes.some((item) => item?.contains(mouseUpTarget))) ||
      (excludes.length && excludes.includes(mouseDownTarget as HTMLElement))
    const isContainedByPopper =
      popperRef && (popperRef.contains(mouseUpTarget) || popperRef.contains(mouseDownTarget))
    if (
      isBound ||
      isTargetExists ||
      isContainedByEl ||
      isSelf ||
      isTargetExcluded ||
      isContainedByPopper
    ) {
      return
    }
    binding.value()
  }
}

const outsideDirective: ObjectDirective = {
  beforeMount(element, binding) {
    nodeCaches.set(element, {
      handler: createOutsideHandler(element, binding),
      binding: binding.value,
    })
  },
  updated(element, binding) {
    nodeCaches.set(element, {
      handler: createOutsideHandler(element, binding),
      binding: binding.value,
    })
  },
  unmounted(element) {
    nodeCaches.delete(element)
  },
}

export default outsideDirective
