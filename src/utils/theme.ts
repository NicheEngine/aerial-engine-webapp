import { addClass, hasClass, removeClass } from '@uts/dom-util'
import { darkCssIsReady, loadDarkThemeCss } from 'vite-plugin-theme/es/client'

const documentElement = document.documentElement

export function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
  const targetElement = target || document.body
  let { className } = targetElement
  className = className.replace(clsName, '')
  targetElement.className = flag ? `${className} ${clsName} ` : className
}

export function setCssVar(prop: string, val: any, document = documentElement) {
  document.style.setProperty(prop, val)
}

export function updateGrayMode(gray: boolean) {
  toggleClass(gray, 'gray-mode', document.documentElement)
}

export function updateColorWeak(colorWeak: boolean) {
  toggleClass(colorWeak, 'color-weak', document.documentElement)
}

export async function updateDarkTheme(mode: string | null = 'light') {
  const htmlRoot = document.getElementById('htmlRoot')
  if (!htmlRoot) {
    return
  }
  const hasDarkClass = hasClass(htmlRoot, 'dark')
  if (mode === 'dark') {
    if (import.meta.env.PROD && !darkCssIsReady) {
      await loadDarkThemeCss()
    }
    htmlRoot.setAttribute('data-theme', 'dark')
    if (!hasDarkClass) {
      addClass(htmlRoot, 'dark')
    }
  } else {
    htmlRoot.setAttribute('data-theme', 'light')
    if (hasDarkClass) {
      removeClass(htmlRoot, 'dark')
    }
  }
}
