import type { EChartsOption } from 'echarts'
import type { Ref } from 'vue'
import { useTimeoutHook } from './timeout.ts'
import { tryOnUnmounted } from '@vueuse/core'
import { unref, nextTick, watch, computed, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useEventListenerHook } from 'event-hook'
import { useBreakpointHook } from 'breakpoint-hook'
import echarts from 'echarts-extend'
import { useRootSettingHook } from 'setting-hook'
import { ScreenType } from '@ems/breakpointTypes.ts'

export function useEChartsHook(
  elRef: Ref<HTMLDivElement>,
  theme: 'light' | 'dark' | 'default' = 'default',
) {
  const { getDarkMode: getSysDarkMode } = useRootSettingHook()

  const getDarkMode = computed(() => {
    return theme === 'default' ? getSysDarkMode.value : theme
  })
  let chartInstance: echarts.ECharts | null = null
  let resizeListener: DefaultFunction = resize
  const cacheOptions = ref({}) as Ref<EChartsOption>
  let removeResize: DefaultFunction = () => {}

  resizeListener = useDebounceFn(resize, 200)

  const getOptions = computed(() => {
    if (getDarkMode.value !== 'dark') {
      return cacheOptions.value as EChartsOption
    }
    return {
      backgroundColor: 'transparent',
      ...cacheOptions.value,
    } as EChartsOption
  })

  function initCharts(t = theme) {
    const el = unref(elRef)
    if (!el || !unref(el)) {
      return
    }

    chartInstance = echarts.init(el, t)
    const { removeEvent } = useEventListenerHook({
      el: window,
      name: 'resize',
      listener: resizeListener,
    })
    removeResize = removeEvent
    const { widthRef } = useBreakpointHook()
    if (unref(widthRef) <= ScreenType.MD || el.offsetHeight === 0) {
      useTimeoutHook(() => {
        resizeListener()
      }, 30)
    }
  }

  function setOptions(options: EChartsOption, clear = true) {
    cacheOptions.value = options
    if (unref(elRef)?.offsetHeight === 0) {
      useTimeoutHook(() => {
        setOptions(unref(getOptions))
      }, 30)
      return
    }
    nextTick(() => {
      useTimeoutHook(() => {
        if (!chartInstance) {
          initCharts(getDarkMode.value as 'default')

          if (!chartInstance) return
        }
        clear && chartInstance?.clear()

        chartInstance?.setOption(unref(getOptions))
      }, 30)
    }).then(() => {})
  }

  function resize() {
    chartInstance?.resize({
      animation: {
        duration: 300,
        easing: 'quadraticIn',
      },
    })
  }

  watch(
    () => getDarkMode.value,
    (theme) => {
      if (chartInstance) {
        chartInstance.dispose()
        initCharts(theme as 'default')
        setOptions(cacheOptions.value)
      }
    },
  )

  tryOnUnmounted(() => {
    if (!chartInstance) return
    removeResize()
    chartInstance.dispose()
    chartInstance = null
  })

  function getInstance(): echarts.ECharts | null {
    if (!chartInstance) {
      initCharts(getDarkMode.value as 'default')
    }
    return chartInstance
  }

  return {
    setOptions,
    resize,
    echarts,
    getInstance,
  }
}
