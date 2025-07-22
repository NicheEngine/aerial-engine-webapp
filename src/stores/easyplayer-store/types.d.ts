declare module 'easyplayer-store' {
  import type { Function } from '@/types'
  import type { DefineStoreOptionsBase } from 'pinia'

  export interface EasyplayerOptions {
    alt: string | '无信号'
    aspect: string | '16:9'
    autoplay: boolean | true
    currentTime: number | 0
    decodeType: string | 'auto'
    debug: boolean | false
    hiddenRightMenu: boolean | false
    easyStretch: boolean | false
    isH265: boolean | false
    live: boolean | true
    loop: boolean | false
    muted: boolean | true
    playerStyle: string
    poster: string
    reconnection: boolean | false
    restartTime: number | 21600
    resolution: string | 'yh' | 'fhd' | 'hd' | 'sd'
    resolutionDefault: string | 'hd'
    showEnterprise: boolean | true
    iceServers: string[]
    videoUrl: string
    videoTitle: string
    watermark: [object, string]
    isTransCoding: boolean | false
    hasAudio: boolean | true
    recordMaxFileSize: number | 200
    progress: boolean | true
    remoteHost: string
    recordFileName: string
  }

  export interface EasyplayerCallbacks {
    snapshot: (blob: any) => object
    recording: (data: any) => object
    play: (event: any) => object
    pause: (event: any) => object
    error: () => object
    ended: () => object
    timeupdate: (currentTime: any) => object
  }

  export interface EasyplayerMethods {
    handlePoster: Function
    getH265SnapData: Function
    getCurrentTime: Function
    snapshot: Function
    seek: Function
    switchRecording: Function
    changeStretch: Function
    exitFullscreen: Function
    fullscreen: Function
    switchVideo: Function
    switchAudio: Function
    handlerVideOption: Function
    initEasyplayer: Function
    debounce: Function
    setRestartPlay: Function
    _autoPlay: Function
    initWebRTCEasyplayer: Function
    play: Function
    replay: Function
    restartEasyplayer: Function
    easyEasyplayerPushMsg: Function
    easyEasyplayerCleanMsg: Function
    loadWasmKit: Function
    changeStream: Function
    isIPhone: Function
    destroyEasyplayer: Function
  }

  export interface ContextValue {
    instance: object | null | undefined
    options: EasyplayerOptions | null | undefined
    callbacks: EasyplayerCallbacks | null | undefined
  }

  export type EasyplayerContext = record<string, ContextValue>

  export interface EasyplayerStore extends DefineStoreOptionsBase {
    context: EasyplayerContext
    setInstance: (instance: object, contextKey: string) => void
    getInstance: (contextKey: string) => object
    setOptions: (options: EasyplayerOptions, contextKey: string) => void
    getOptions: (contextKey: string) => EasyplayerOptions
    setCallbacks: (callbacks: EasyplayerCallbacks, contextKey: string) => void
    getCallbacks: (contextKey: string) => EasyplayerCallbacks
  }

  export { easyplayerStore, useEasyplayerStore } from './index.ts'
}
