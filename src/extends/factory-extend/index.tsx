import { defineAsyncComponent } from 'vue'
import { Spin } from 'ant-design-vue'
import type { FactoryOptions } from 'factory-extend'

export function createAsyncComponent(loader: DefaultFunction, options: FactoryOptions = {}) {
  const { size = 'small', delay = 100, timeout = 30000, loading = false, retry = true } = options
  return defineAsyncComponent({
    loader,
    loadingComponent: loading ? <Spin spinning={true} size={size} /> : undefined,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout,
    // errorComponent
    // Defining if component is suspensible. Default: true.
    // suspensible: false,
    delay,
    onError: !retry
      ? () => {}
      : (error, retry, fail, attempts) => {
          if (error.message.match(/fetch/) && attempts <= 3) {
            // retry on fetch errors, 3 max attempts
            retry()
          } else {
            // Note that retry/fail are like resolve/reject of a promise:
            // one of them must be called for the error handling to continue.
            fail()
          }
        },
  })
}
