import { nextTick, onMounted, onActivated } from 'vue'

export function useRefreshHook(refresh: DefaultFunction) {
  let mounted: boolean

  onMounted(() => {
    refresh()
    nextTick(() => {
      mounted = true
    }).then(() => {})
  })

  onActivated(() => {
    if (mounted) {
      refresh()
    }
  })
}
