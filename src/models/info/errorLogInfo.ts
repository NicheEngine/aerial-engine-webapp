import type { ErrorType } from '@ems/exceptionTypes.ts'

export interface ErrorLogInfo {
  // Type of error
  type: ErrorType
  // Error file
  file: string
  // Error name
  name?: string
  // Error message
  message: string
  // Error stack
  stack?: string
  // Error detail
  detail: string
  // Error url
  url: string
  // Error time
  time?: string
}
