/**
 * menu type
 */
export enum MenuStyleType {
  // left menu
  SIDEBAR = 'sidebar',
  MIX_SIDEBAR = 'mix-sidebar',
  // mixin menu
  MIX = 'mix',
  // top menu
  TOP_MENU = 'top-menu',
}

export type MenuMode = 'vertical' | 'vertical-right' | 'horizontal' | 'inline'

// menu mode
export enum MenuModeType {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  VERTICAL_RIGHT = 'vertical-right',
  INLINE = 'inline',
}

export enum MenuSplitType {
  NONE,
  TOP,
  LEFT,
}

// 折叠触发器位置
export enum TriggerType {
  // 不显示
  NONE = 'NONE',
  // 菜单底部
  FOOTER = 'FOOTER',
  // 头部
  HEADER = 'HEADER',
}

export enum TopMenuAlignType {
  CENTER = 'center',
  START = 'start',
  END = 'end',
}

export enum MixSidebarTriggerType {
  HOVER = 'hover',
  CLICK = 'click',
}
