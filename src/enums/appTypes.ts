export const SIDE_BAR_MINI_WIDTH = 48
export const SIDE_BAR_SHOW_TIT_MINI_WIDTH = 80

// content width type enum
export enum ContentWidthType {
  /* auto width  */
  FULL = 'full',
  /* fixed width */
  FIXED = 'fixed',
}

// theme mode enum
export enum ThemeModeType {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum SettingButtonType {
  AUTO = 'auto',
  HEADER = 'header',
  FIXED = 'fixed',
}

export enum SessionTimeoutType {
  ROUTE_JUMP,
  PAGE_COVERAGE,
}

/* 权限模式 */
export enum PurviewType {
  /* ROLE 角色权限 */
  ROLE = 'ROLE',
  /* SERVER 后端服务器配置 */
  SERVER = 'SERVER',
  /* route 路由映射 */
  ROUTE = 'ROUTE',
}

/* Route switching animation 路由切换动画 */
export enum RouterTransitionType {
  ZOOM_FADE = 'zoom-fade',
  ZOOM_OUT = 'zoom-out',
  FADE_SIDE = 'fade-slide',
  FADE = 'fade',
  FADE_BOTTOM = 'fade-bottom',
  FADE_SCALE = 'fade-scale',
}
