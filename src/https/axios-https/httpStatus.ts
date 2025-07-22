import type { HttpErrorMode } from 'app-https'
import { useMessageHook } from 'message-hook'
import { useI18nHook } from 'i18n-hook'
import { useUserStore } from 'user-store'
import { PROJECT_SETTING } from 'app-settings'
import { SessionTimeoutType } from '@ems/appTypes'

const { createMessage, createErrorModal } = useMessageHook()
const error = createMessage.error!
const sessionTimeout = PROJECT_SETTING.sessionTimeoutType

export function httpStatus(
  status: number,
  message: string,
  errorMode: HttpErrorMode = 'message',
): void {
  const { t } = useI18nHook()
  const userStore = useUserStore()
  let statusMessage = ''

  switch (status) {
    case 400:
      statusMessage = `${message}`
      break
    // 401: Not logged in
    // Jump to the login page if not logged in, and carry the path of the current page
    // Return to the current page after successful login.
    // This step needs to be operated on the login page.
    case 401:
      userStore.setAccessToken(undefined)
      statusMessage = message || t('system.api.status_401')
      if (sessionTimeout === SessionTimeoutType.PAGE_COVERAGE) {
        userStore.setSessionTimeout(true)
      } else {
        userStore.asyncUserLogout(true)
      }
      break
    case 403:
      statusMessage = t('system.api.status_403')
      break
    // 404请求不存在
    case 404:
      statusMessage = t('system.api.status_404')
      break
    case 405:
      statusMessage = t('system.api.status_405')
      break
    case 408:
      statusMessage = t('system.api.status_408')
      break
    case 500:
      statusMessage = t('system.api.status_500')
      break
    case 501:
      statusMessage = t('system.api.status_501')
      break
    case 502:
      statusMessage = t('system.api.status_502')
      break
    case 503:
      statusMessage = t('system.api.status_503')
      break
    case 504:
      statusMessage = t('system.api.status_504')
      break
    case 505:
      statusMessage = t('system.api.status_505')
      break
    default:
  }

  if (statusMessage) {
    if (errorMode === 'modal') {
      createErrorModal({ title: t('system.api.errorTip'), content: statusMessage })
    } else if (errorMode === 'message') {
      error({ content: statusMessage, key: `global_error_message_status_${status}` }).then(() => {})
    }
  }
}

export default httpStatus
