import { isRef, nextTick, ref, unref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated'
import { useWindowSizeHook } from 'window-size-hook'
import { useLayoutHeight } from '/@/layouts/default/content/useContentViewHeight'
import { viewportOffset } from 'dom-util'
import { isNumber, isString } from '@uts/staple.ts'
import type { CompensateHeight, Upward } from 'content-height-hook'

/**
 * 动态计算内容高度，根据锚点dom最下坐标到屏幕最下坐标，根据传入dom的高度、padding、margin等值进行动态计算
 * 最终获取合适的内容高度
 * @param flag 用于开启计算的响应式标识
 * @param anchorRef 锚点组件 Ref<ElRef | ComponentRef>
 * @param subtractHeightRefs 待减去高度的组件列表 Ref<ElRef | ComponentRef>
 * @param subtractSpaceRefs 待减去空闲空间(margins/paddings)的组件列表 Ref<ElRef | ComponentRef>
 * @param offsetHeightRef 计算偏移的响应式高度，计算高度时将直接减去此值
 * @param upwardSpace 向上递归减去空闲空间的 层级 或 直到指定class为止 数值为2代表向上递归两次|数值为ant-layout表示向上递归直到碰见.ant-layout为止
 * @returns 响应式高度
 */
export function useContentHeightHook(
  flag: ComputedRef<boolean>,
  anchorRef: Ref,
  subtractHeightRefs: Ref[],
  subtractSpaceRefs: Ref[],
  upwardSpace: Ref<Upward> | ComputedRef<Upward> | Upward = 0,
  offsetHeightRef: Ref<number> = ref(0),
) {
  const contentHeight: Ref<Nullable<number>> = ref(null)
  const { footerHeightRef: layoutFooterHeightRef } = useLayoutHeight()
  let compensateHeight: CompensateHeight = {
    layoutFooter: true,
  }

  const setCompensate = (params: CompensateHeight) => {
    compensateHeight = params
  }

  function redoHeight() {
    nextTick(() => {
      calcContentHeight().then(() => {})
    }).then(() => {})
  }

  function calcSubtractSpace(
    element: Element | null | undefined,
    direction: 'all' | 'top' | 'bottom' = 'all',
  ): number {
    function numberPx(px: string) {
      return Number(px.replace(/[^\d]/g, ''))
    }
    let subtractHeight = 0
    const ZERO_PX = '0px'
    if (element) {
      const cssStyle = getComputedStyle(element)
      const marginTop = numberPx(cssStyle?.marginTop ?? ZERO_PX)
      const marginBottom = numberPx(cssStyle?.marginBottom ?? ZERO_PX)
      const paddingTop = numberPx(cssStyle?.paddingTop ?? ZERO_PX)
      const paddingBottom = numberPx(cssStyle?.paddingBottom ?? ZERO_PX)
      if (direction === 'all') {
        subtractHeight += marginTop
        subtractHeight += marginBottom
        subtractHeight += paddingTop
        subtractHeight += paddingBottom
      } else if (direction === 'top') {
        subtractHeight += marginTop
        subtractHeight += paddingTop
      } else {
        subtractHeight += marginBottom
        subtractHeight += paddingBottom
      }
    }
    return subtractHeight
  }

  function getElement(element: any): Nullable<HTMLDivElement> {
    if (element == null) {
      return null
    }
    return (element instanceof HTMLDivElement ? element : element.$el) as HTMLDivElement
  }

  async function calcContentHeight() {
    if (!flag.value) {
      return
    }
    // Add a delay to get the correct height
    await nextTick()

    const anchorElement = getElement(unref(anchorRef))
    if (!anchorElement) {
      return
    }
    const { bottomIncludeBody } = viewportOffset(anchorElement)

    // subtract elements height
    let subtractHeight = 0
    subtractHeightRefs.forEach((item) => {
      subtractHeight += getElement(unref(item))?.offsetHeight ?? 0
    })

    // subtract margins / paddings
    let subtractSpaceHeight = calcSubtractSpace(anchorElement) ?? 0
    subtractSpaceRefs.forEach((item) => {
      subtractSpaceHeight += calcSubtractSpace(getElement(unref(item)))
    })

    // upwardSpace
    let upwardSpaceHeight = 0
    function upward(element: Element | null, upwardLvlOrClass: number | string | null | undefined) {
      if (element && upwardLvlOrClass) {
        const parent = element.parentElement
        if (parent) {
          if (isString(upwardLvlOrClass)) {
            if (!parent.classList.contains(upwardLvlOrClass)) {
              upwardSpaceHeight += calcSubtractSpace(parent, 'bottom')
              upward(parent, upwardLvlOrClass)
            } else {
              upwardSpaceHeight += calcSubtractSpace(parent, 'bottom')
            }
          } else if (isNumber(upwardLvlOrClass)) {
            if (upwardLvlOrClass > 0) {
              upwardSpaceHeight += calcSubtractSpace(parent, 'bottom')
              upward(parent, --upwardLvlOrClass)
            }
          }
        }
      }
    }
    if (isRef(upwardSpace)) {
      upward(anchorElement, unref(upwardSpace))
    } else {
      upward(anchorElement, upwardSpace)
    }

    let height =
      bottomIncludeBody -
      unref(layoutFooterHeightRef) -
      unref(offsetHeightRef) -
      subtractHeight -
      subtractSpaceHeight -
      upwardSpaceHeight

    // compensation height
    const calcCompensateHeight = () => {
      compensateHeight.elements?.forEach((item) => {
        height += getElement(unref(item))?.offsetHeight ?? 0
      })
    }
    if (compensateHeight.layoutFooter && unref(layoutFooterHeightRef) > 0) {
      calcCompensateHeight()
    } else {
      calcCompensateHeight()
    }

    contentHeight.value = height
  }

  onMountedOrActivated(() => {
    nextTick(() => {
      calcContentHeight().then(() => {})
    }).then(() => {})
  })
  useWindowSizeHook(
    () => {
      calcContentHeight().then(() => {})
    },
    50,
    { immediate: true },
  )
  watch(
    () => [layoutFooterHeightRef.value],
    () => {
      calcContentHeight().then(() => {})
    },
    {
      flush: 'post',
      immediate: true,
    },
  )

  return { redoHeight, setCompensate, contentHeight }
}

export default useContentHeightHook
