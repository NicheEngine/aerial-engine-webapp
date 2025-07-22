/**
 * Global authority directive
 * Used for fine-grained control of component purview
 * @Example v-auth="RoleEnum.TEST"
 */
import type { App, Directive, DirectiveBinding } from 'vue'

import { usePurviewHook } from '@hks/purview'

function isPurview(element: Element, binding: any) {
  const { hasPurview } = usePurviewHook()

  const value = binding.value
  if (!value) return
  if (!hasPurview(value)) {
    element.parentNode?.removeChild(element)
  }
}

const mounted = (element: Element, binding: DirectiveBinding) => {
  isPurview(element, binding)
}

const PURVIEW_DIRECTIVE: Directive = {
  mounted,
}

export function setupPurviewDirective(app: App) {
  app.directive('auth', PURVIEW_DIRECTIVE)
}

export default PURVIEW_DIRECTIVE
