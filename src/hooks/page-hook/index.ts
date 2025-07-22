import type { Router } from 'vue-router'

import { PageType } from '@ems/pageTypes.ts'
import { unref } from 'vue'

import { useRouter } from 'vue-router'
import { REDIRECT_NAME } from '@rts/constant'
import type { RouteLocationRawEx } from 'page-hook'

function handleError(error: Error) {
  console.error(error)
}

export function useGotoRouteHook(_router?: Router) {
  const { push, replace } = _router || useRouter()
  function go(opt: RouteLocationRawEx = PageType.BASE_HOME, isReplace = false) {
    if (!opt) {
      return
    }
    isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError)
  }
  return go
}

export const useRedoRouteHook = (_router?: Router) => {
  const { replace, currentRoute } = _router || useRouter()
  const { query, params = {}, name, fullPath } = unref(currentRoute.value)
  function redo(): Promise<boolean> {
    return new Promise((resolve) => {
      if (name === REDIRECT_NAME) {
        resolve(false)
        return
      }
      if (name && Object.keys(params).length > 0) {
        params['_redirect_type'] = 'name'
        params['path'] = String(name)
      } else {
        params['_redirect_type'] = 'path'
        params['path'] = fullPath
      }
      replace({ name: REDIRECT_NAME, params, query }).then(() => resolve(true))
    })
  }
  return redo
}
