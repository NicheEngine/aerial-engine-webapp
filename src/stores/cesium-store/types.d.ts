declare module 'cesium-store' {
  import type { Function } from '@/types'
  import type { Viewer, Scene } from 'cesium'
  import type { DefineStoreOptionsBase } from 'pinia'

  export type CesiumOptions = CesiumViewer.ConstructorOptions

  export type CesiumViewer = Viewer

  export type CesiumScene = Scene

  export interface CesiumContext {
    options: CesiumOptions | null | undefined
    viewer: CesiumViewer | null | undefined
    scene: CesiumScene | null | undefined
  }

  export interface CesiumStore extends DefineStoreOptionsBase {
    context: CesiumContext
    setScene: Function
    setOptions: Function
    setViewer: Function
  }

  export { cesiumStore, useCesiumStore } from './index.ts'
}
