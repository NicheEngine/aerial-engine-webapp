import type { Directive } from 'vue'
import './index.less'
import type { RippleOptions, RippleProto, RippleEventType } from 'ripple-directive'

const options: RippleOptions = {
  event: 'mousedown',
  transition: 400,
}

const RIPPLE_DIRECTIVE: Directive & RippleProto = {
  beforeMount: (element: HTMLElement, binding) => {
    if (binding.value === false) return

    const rippleBackground = element.getAttribute('ripple-background')
    setProps(Object.keys(binding.modifiers), options)

    const background = rippleBackground || RIPPLE_DIRECTIVE.background
    const zIndex = RIPPLE_DIRECTIVE.zIndex

    element.addEventListener(options.event, (event: Event) => {
      if (event instanceof TouchEvent) {
        const rippleEvent = event as RippleEventType
        rippleHandle({
          event: rippleEvent,
          element,
          background,
          zIndex,
        })
      } else {
        throw new Error("the event type is not supported,it is must be 'TouchEvent'")
      }
    })
  },
  updated(el, binding) {
    if (!binding.value) {
      el?.clearRipple?.()
      return
    }
    const bg = el.getAttribute('ripple-background')
    el?.setBackground?.(bg)
  },
}

function rippleHandle({
  event,
  element,
  zIndex,
  background,
}: { event: RippleEventType; element: HTMLElement } & RippleProto) {
  const targetBorder = parseInt(getComputedStyle(element).borderWidth.replace('px', ''))
  const clientX = event.clientX || event.touches[0].clientX
  const clientY = event.clientY || event.touches[0].clientY

  const rect = element.getBoundingClientRect()
  const { left, top } = rect
  const { offsetWidth: width, offsetHeight: height } = element
  const { transition } = options
  const dx = clientX - left
  const dy = clientY - top
  const maxX = Math.max(dx, width - dx)
  const maxY = Math.max(dy, height - dy)
  const style = window.getComputedStyle(element)
  const radius = Math.sqrt(maxX * maxX + maxY * maxY)
  const border = targetBorder > 0 ? targetBorder : 0

  const ripple = document.createElement('div')
  const rippleContainer = document.createElement('div')

  // Styles for ripple
  ripple.className = 'ripple'

  Object.assign(ripple.style ?? {}, {
    marginTop: '0px',
    marginLeft: '0px',
    width: '1px',
    height: '1px',
    transition: `all ${transition}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    borderRadius: '50%',
    pointerEvents: 'none',
    position: 'relative',
    zIndex: zIndex ?? '9999',
    backgroundColor: background ?? 'rgba(0, 0, 0, 0.12)',
  })

  // Styles for rippleContainer
  rippleContainer.className = 'ripple-container'
  Object.assign(rippleContainer.style ?? {}, {
    position: 'absolute',
    left: `${0 - border}px`,
    top: `${0 - border}px`,
    height: '0',
    width: '0',
    pointerEvents: 'none',
    overflow: 'hidden',
  })

  const storedTargetPosition =
    element.style.position.length > 0 ? element.style.position : getComputedStyle(element).position

  if (storedTargetPosition !== 'relative') {
    element.style.position = 'relative'
  }

  rippleContainer.appendChild(ripple)
  element.appendChild(rippleContainer)

  Object.assign(ripple.style, {
    marginTop: `${dy}px`,
    marginLeft: `${dx}px`,
  })

  const {
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
  } = style
  Object.assign(rippleContainer.style, {
    width: `${width}px`,
    height: `${height}px`,
    direction: 'ltr',
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
  })

  setTimeout(() => {
    const wh = `${radius * 2}px`
    Object.assign(ripple.style ?? {}, {
      width: wh,
      height: wh,
      marginLeft: `${dx - radius}px`,
      marginTop: `${dy - radius}px`,
    })
  }, 0)

  function clearRipple() {
    setTimeout(() => {
      ripple.style.backgroundColor = 'rgba(0, 0, 0, 0)'
    }, 250)

    setTimeout(() => {
      rippleContainer?.parentNode?.removeChild(rippleContainer)
    }, 850)
    element.removeEventListener('mouseup', clearRipple, false)
    element.removeEventListener('mouseleave', clearRipple, false)
    element.removeEventListener('dragstart', clearRipple, false)
    setTimeout(() => {
      let clearPosition = true
      for (let i = 0; i < element.childNodes.length; i++) {
        if ((element.childNodes[i] as Recordable).className === 'ripple-container') {
          clearPosition = false
        }
      }

      if (clearPosition) {
        element.style.position = storedTargetPosition !== 'static' ? storedTargetPosition : ''
      }
    }, options.transition + 260)
  }

  if (event.type === 'mousedown') {
    element.addEventListener('mouseup', clearRipple, false)
    element.addEventListener('mouseleave', clearRipple, false)
    element.addEventListener('dragstart', clearRipple, false)
  } else {
    clearRipple()
  }

  ;(element as Recordable).setBackground = (bgColor: string) => {
    if (!bgColor) {
      return
    }
    ripple.style.backgroundColor = bgColor
  }
}

function setProps(modifiers: Recordable, props: Recordable) {
  modifiers.forEach((item: Recordable) => {
    if (isNaN(Number(item))) props.event = item
    else props.transition = item
  })
}

export default RIPPLE_DIRECTIVE
