const appName = import.meta.env.VITE_APP_TITLE

export function info(message: string) {
  console.info(`[${appName} info]:${message}`)
}

export function warn(message: string) {
  console.warn(`[${appName} warn]:${message}`)
}

export function error(message: string) {
  console.error(`[${appName} error]:${message}`)
  throw new Error(`[${appName} error]:${message}`)
}
