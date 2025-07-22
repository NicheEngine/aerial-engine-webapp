declare module 'clipboard-hook' {
  export interface ClipboardOptions {
    target?: HTMLElement
  }
  export { useClipboardHook, clipboardText } from './index.ts'
}
