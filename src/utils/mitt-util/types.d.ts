declare module 'mitt-util' {
  export type EmitEventType = string | symbol

  /* An event handler can take an optional event argument and should not return a value */
  export type EmitHandler<T = any> = (event?: T) => void
  export type WildcardHandler = (type: EmitEventType, event?: any) => void

  /* An array of all currently registered event handlers for a type */
  export type EmitEventHandlers = Array<EmitHandler>
  export type WildCardEventHandlers = Array<WildcardHandler>

  /* A map of event types and their corresponding event handlers. */
  export type EventHandlerMap = Map<EmitEventType, EventHandlers | WildCardEventHandlers>

  export interface Emitter {
    all: EventHandlerMap
    on<T = any>(type: EmitEventType, handler: EmitHandler<T>): void
    on(type: '*', handler: WildcardHandler): void

    off<T = any>(type: EmitEventType, handler: EmitHandler<T>): void
    off(type: '*', handler: WildcardHandler): void

    emit<T = any>(type: EmitEventType, event?: T): void
    emit(type: '*', event?: any): void
    clear(): void
  }

  export { mitt } from './index.ts'
}
