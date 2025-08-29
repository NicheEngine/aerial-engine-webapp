export type {
  AlertProps,
  BeforeCloseScope,
  IconType,
  PromptProps,
} from './alert';
export { useAlertContext } from './alert';
export { default as Alert } from './alert.vue';
export {
  engineAlert as alert,
  clearAllAlerts,
  engineConfirm as confirm,
  enginePrompt as prompt,
} from './AlertBuilder';
