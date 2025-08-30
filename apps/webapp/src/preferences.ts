import { defineOverridesPreferences } from '@engine/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    authPageLayout: 'panel-right',
    layout: 'header-mixed-nav',
    enableCheckUpdates: false,
    enablePreferences: false,
  },
  header: {
    menuAlign: 'center',
  },
  shortcutKeys: {
    enable: false,
    globalLockScreen: false,
    globalLogout: false,
    globalSearch: false,
  },
  tabbar: {
    maxCount: 10,
  },
  sidebar: {
    collapsed: true,
    collapsedButton: false,
    expandOnHover: false,
    fixedButton: false,
    width: 200,
  },
  theme: {
    mode: 'light',
    radius: '0.75',
    builtinType: 'sky-blue',
    colorPrimary: 'hsl(231 98% 65%)',
  },
  transition: {
    name: 'fade',
  },
  widget: {
    globalSearch: false,
    languageToggle: false,
    themeToggle: false,
  },
});
