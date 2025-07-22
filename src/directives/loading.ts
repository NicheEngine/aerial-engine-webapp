import { createLoading } from '@cps/Loading'
import type { App, Directive } from 'vue'

const LOADING_DIRECTIVE: Directive = {
  mounted(element, binding) {
    const tip = element.getAttribute('loading-tip')
    const background = element.getAttribute('loading-background')
    const size = element.getAttribute('loading-size')
    const fullscreen = binding.modifiers.fullscreen
    element.instance = createLoading(
      {
        tip,
        background,
        size: size || 'large',
        loading: !!binding.value,
        absolute: !fullscreen,
      },
      fullscreen ? document.body : element,
    )
  },
  updated(element, binding) {
    const instance = element.instance
    if (!instance) return
    instance.setTip(element.getAttribute('loading-tip'))
    if (binding.oldValue !== binding.value) {
      instance.setLoading?.(binding.value && !instance.loading)
    }
  },
  unmounted(element) {
    element?.instance?.close()
  },
}

export function setupLoadingDirective(app: App) {
  app.directive('loading', LOADING_DIRECTIVE)
}

export default LOADING_DIRECTIVE
