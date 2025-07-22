declare module 'outside-directive' {
  export type OutsideHandler = <T extends MouseEvent>(mouseup: T, mousedown: T) => void

  export type OutsideFlushCache = Map<
    HTMLElement,
    {
      handler: OutsideHandler
      binding: (...args: unknown[]) => unknown
    }
  >

  export { outsideDirective } from './index.ts'
}
