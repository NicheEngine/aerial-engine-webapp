import { onMounted, onUnmounted, ref } from 'vue'
import type { ScriptOptions } from 'script-hook'

export function useScriptHook(options: ScriptOptions) {
  const isLoading = ref(false)
  const error = ref(false)
  const success = ref(false)
  let script: HTMLScriptElement

  const promise = new Promise((resolve, reject) => {
    onMounted(() => {
      script = document.createElement('script')
      script.type = 'text/javascript'
      script.onload = function () {
        isLoading.value = false
        success.value = true
        error.value = false
        resolve('')
      }

      script.onerror = function (err) {
        isLoading.value = false
        success.value = false
        error.value = true
        reject(err)
      }

      script.src = options.src
      document.head.appendChild(script)
    })
  })

  onUnmounted(() => {
    script && script.remove()
  })

  return {
    isLoading,
    error,
    success,
    toPromise: () => promise,
  }
}
