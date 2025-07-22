import { ref, computed, unref } from 'vue'
import type { ComputedRef } from 'vue'
import { useEventListenerHook } from 'event-hook'
import { SCREEN_FITTER, SizeType, ScreenType } from '@ems/breakpointTypes.ts'
import type { BreakpointOptions } from 'breakpoint-hook'

let globalScreenRef: ComputedRef<SizeType | undefined>
let globalWidthRef: ComputedRef<number>
let globalRealWidthRef: ComputedRef<number>

export function useBreakpointHook() {
  return {
    screenRef: computed(() => unref(globalScreenRef)),
    widthRef: globalWidthRef,
    ScreenType,
    realWidthRef: globalRealWidthRef,
  }
}

export function createBreakpointListener(callback?: (options: BreakpointOptions) => void) {
  const sizeRef = ref<SizeType>(SizeType.XL)
  const screenRef = ref<ScreenType>(ScreenType.XXL)
  const realWidthRef = ref(window.innerWidth)

  function windowWidth() {
    const width = document.body.clientWidth
    const xs = SCREEN_FITTER.get(SizeType.XS)!
    const sm = SCREEN_FITTER.get(SizeType.SM)!
    const md = SCREEN_FITTER.get(SizeType.MD)!
    const lg = SCREEN_FITTER.get(SizeType.LG)!
    const xl = SCREEN_FITTER.get(SizeType.XL)!
    const xxl = SCREEN_FITTER.get(SizeType.XXL)!
    if (width < xs) {
      sizeRef.value = SizeType.XS
      screenRef.value = xs
    } else if (width < sm) {
      sizeRef.value = SizeType.SM
      screenRef.value = sm
    } else if (width < md) {
      sizeRef.value = SizeType.MD
      screenRef.value = md
    } else if (width < lg) {
      sizeRef.value = SizeType.LG
      screenRef.value = lg
    } else if (width < xl) {
      sizeRef.value = SizeType.XL
      screenRef.value = xl
    } else {
      sizeRef.value = SizeType.XXL
      screenRef.value = xxl
    }
    realWidthRef.value = width
  }

  useEventListenerHook({
    el: window,
    name: 'resize',
    listener: () => {
      windowWidth()
      resizeWindow()
    },
  })

  windowWidth()
  globalScreenRef = computed(() => unref(sizeRef))
  globalWidthRef = computed((): number => SCREEN_FITTER.get(unref(sizeRef)!)!)
  globalRealWidthRef = computed((): number => unref(realWidthRef))

  function resizeWindow() {
    callback?.({
      screen: globalScreenRef,
      width: globalWidthRef,
      realWidth: globalRealWidthRef,
      screenType: screenRef.value,
      screenFitter: SCREEN_FITTER,
      sizeType: sizeRef.value,
    })
  }

  resizeWindow()
  return {
    screenRef: globalScreenRef,
    widthRef: globalWidthRef,
    realWidthRef: globalRealWidthRef,
  }
}
