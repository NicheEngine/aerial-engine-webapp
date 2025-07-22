export enum SizeKey {
  DEFAULT = 'default',
  SMALL = 'small',
  LARGE = 'large',
}

export enum SizeValue {
  DEFAULT = 48,
  SMALL = 16,
  LARGE = 64,
}

export const SIZE_FITTER: Map<SizeKey, SizeValue> = (() => {
  const map = new Map<SizeKey, SizeValue>()
  map.set(SizeKey.DEFAULT, SizeValue.DEFAULT)
  map.set(SizeKey.SMALL, SizeValue.SMALL)
  map.set(SizeKey.LARGE, SizeValue.LARGE)
  return map
})()

export default SIZE_FITTER
