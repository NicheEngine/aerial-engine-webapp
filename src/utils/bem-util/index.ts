import { PREFIX_CLS } from 'app-settings'
import type { BemMods } from 'bem-util'

function applyBem(name: string, bemMods?: BemMods): string {
  if (!bemMods) {
    return ''
  }
  if (typeof bemMods === 'string') {
    return ` ${name}--${bemMods}`
  }
  if (Array.isArray(bemMods)) {
    return bemMods.reduce<string>((result, item) => result + applyBem(name, item), '')
  }
  return Object.keys(bemMods).reduce(
    (result, key) => result + (bemMods[key] ? applyBem(name, key) : ''),
    '',
  )
}

/**
 * bem helper
 * // 'button'
 * b()
 * // 'button__text'
 * b('text')
 *  // 'button button--disabled'
 * b({ disabled })
 * // 'button__text button__text--disabled'
 * b('text', { disabled })
 * // 'button button--disabled button--primary'
 * b(['disabled', 'primary'])
 */
export function buildBem(name: string) {
  return (el?: BemMods, mods?: BemMods): BemMods => {
    if (el && typeof el !== 'string') {
      mods = el
      el = ''
    }
    el = el ? `${name}__${el}` : name
    return `${el}${applyBem(el, mods)}`
  }
}

export function createBem(name: string) {
  return [buildBem(`${PREFIX_CLS}-${name}`)]
}

export function createNamespace(name: string) {
  const prefixedName = `${PREFIX_CLS}-${name}`
  return [prefixedName, buildBem(prefixedName)] as const
}
