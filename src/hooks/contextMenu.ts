import { onUnmounted, getCurrentInstance } from 'vue'
import { createContextMenu, destroyContextMenu } from '@cps/ContextMenu'
import type { ContextMenuItem } from '@cps/ContextMenu'
export type { ContextMenuItem }

export function useContextMenuHook(authRemove = true) {
  if (getCurrentInstance() && authRemove) {
    onUnmounted(() => {
      destroyContextMenu()
    })
  }
  return [createContextMenu, destroyContextMenu]
}

export default useContextMenuHook
