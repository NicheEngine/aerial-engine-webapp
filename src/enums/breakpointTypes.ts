export enum SizeType {
  XS = 'XS',
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL',
  XXL = 'XXL',
}

export enum ScreenType {
  XS = 480,
  SM = 576,
  MD = 768,
  LG = 992,
  XL = 1200,
  XXL = 1600,
}

export const SCREEN_FITTER = new Map<SizeType, number>()

SCREEN_FITTER.set(SizeType.XS, ScreenType.XS)
SCREEN_FITTER.set(SizeType.SM, ScreenType.SM)
SCREEN_FITTER.set(SizeType.MD, ScreenType.MD)
SCREEN_FITTER.set(SizeType.LG, ScreenType.LG)
SCREEN_FITTER.set(SizeType.XL, ScreenType.XL)
SCREEN_FITTER.set(SizeType.XXL, ScreenType.XXL)

export default SCREEN_FITTER
