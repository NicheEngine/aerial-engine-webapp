import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { StoreDefinition, Store } from 'pinia'
import type {
  CesiumContext,
  CesiumOptions,
  CesiumScene,
  CesiumStore,
  CesiumViewer,
} from 'cesium-store'
import store from '@/stores'

const storeId: string = 'cesium'

const storeOptions = (): CesiumStore => {
  const context: CesiumContext = reactive({
    options: null,
    viewer: null,
    scene: null,
  })

  function setOptions(options: CesiumOptions): void {
    context.options = options
  }

  function setViewer(viewer: CesiumViewer): void {
    context.viewer = viewer
  }

  function setScene(scene: CesiumScene): void {
    context.scene = scene
  }

  return {
    persist: false,
    context,
    setOptions,
    setViewer,
    setScene,
  } as CesiumStore
}

const cesiumStore: StoreDefinition<
  string,
  Pick<CesiumStore, never>,
  Pick<CesiumStore, never>,
  Pick<CesiumStore, keyof CesiumStore>
> = defineStore(storeId, storeOptions)

export function useCesiumStore(): Store<
  string,
  Pick<CesiumStore, never>,
  Pick<CesiumStore, never>,
  Pick<CesiumStore, keyof CesiumStore>
> {
  return cesiumStore(store)
}

export default cesiumStore
