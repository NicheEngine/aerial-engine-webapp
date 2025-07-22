declare module 'message-hook' {
  import { ConfigProps, NotificationArgsProps } from 'ant-design-vue/lib/notification'
  import type { ModalFunc, ModalFuncProps } from 'ant-design-vue/lib/modal/Modal'
  export interface NotifyApi {
    info(config: NotificationArgsProps): void
    success(config: NotificationArgsProps): void
    error(config: NotificationArgsProps): void
    warn(config: NotificationArgsProps): void
    warning(config: NotificationArgsProps): void
    open(args: NotificationArgsProps): void
    close(key: string): void
    config(options: ConfigProps): void
    destroy(): void
  }

  export declare type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  export declare type IconType = 'success' | 'info' | 'error' | 'warning'
  export interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
    iconType: 'warning' | 'success' | 'error' | 'info'
  }
  export type ModalOptionsPartial = Partial<ModalOptionsEx> & Pick<ModalOptionsEx, 'content'>

  export interface ConfirmOptions {
    info: ModalFunc
    success: ModalFunc
    error: ModalFunc
    warn: ModalFunc
    warning: ModalFunc
  }

  export { useMessageHook } from './index.tsx'
}
