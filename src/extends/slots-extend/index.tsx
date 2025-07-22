import type { Slots } from 'vue'
import { isFunction } from '@uts/staple'

export function slotValue(slots: Slots, slot = 'default', data?: any) {
  if (!slots || !Reflect.has(slots, slot)) {
    return null
  }
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`)
    return null
  }
  const slotValue = slots[slot]
  if (!slotValue) return null
  return slotValue(data)
}

export function extendSlots(slots: Slots, excludeKeys: string[] = []) {
  const slotKeys = Object.keys(slots)
  const result: any = {}
  slotKeys.map((key) => {
    if (excludeKeys.includes(key)) {
      return null
    }
    result[key] = (data?: any) => slotValue(slots, key, data)
  })
  return result
}
