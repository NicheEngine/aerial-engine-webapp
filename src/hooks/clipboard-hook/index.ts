import { ref, watch } from 'vue'

import { isDefined } from '@uts/staple.ts'
import type { ClipboardOptions } from 'clipboard-hook'

export function useClipboardHook(initial?: string) {
  const clipboardRef = ref(initial || '')
  const isSuccessRef = ref(false)
  const copiedRef = ref(false)

  watch(
    clipboardRef,
    (value?: string) => {
      if (isDefined(value)) {
        copiedRef.value = true
        isSuccessRef.value = clipboardText(value)
      }
    },
    { immediate: !!initial, flush: 'sync' },
  )

  return { clipboardRef, isSuccessRef, copiedRef }
}

export function clipboardText(input: string, { target = document.body }: ClipboardOptions = {}) {
  const element = document.createElement('textarea')
  const previouslyFocusedElement = document.activeElement

  element.value = input

  element.setAttribute('readonly', '')
  ;(element.style as any).contain = 'strict'
  element.style.position = 'absolute'
  element.style.left = '-9999px'
  element.style.fontSize = '12pt'

  const selection = document.getSelection()
  let originalRange
  if (selection && selection.rangeCount > 0) {
    originalRange = selection.getRangeAt(0)
  }

  target.append(element)
  element.select()

  element.selectionStart = 0
  element.selectionEnd = input.length

  let isSuccess = false
  // try {
  //   isSuccess = document.execCommand('copy')
  // } catch (e: any) {
  //   throw new Error(e)
  // }
  navigator.clipboard
    .writeText(input)
    .then(() => {
      isSuccess = true
    })
    .catch((error) => {
      throw new Error(error)
    })

  element.remove()

  if (originalRange && selection) {
    selection.removeAllRanges()
    selection.addRange(originalRange)
  }

  if (previouslyFocusedElement) {
    ;(previouslyFocusedElement as HTMLElement).focus()
  }
  return isSuccess
}
