import type { ProjectSetting } from 'app-settings'
import { MenuModeType, MenuStyleType, MixSidebarTriggerType, TriggerType } from '@ems/menuTypes'
import { CacheType } from '@ems/cacheTypes'
import {
  ContentWidthType,
  PurviewType,
  RouterTransitionType,
  SessionTimeoutType,
  SettingButtonType,
  ThemeModeType,
} from '@ems/appTypes.ts'
import { HEADER_PRESET_BG_COLOR_LIST, SIDE_BAR_BG_COLOR_LIST } from 'app-settings'

// ! You need to clear the browser cache after the change
// ! 改动后需要清空浏览器缓存
const PROJECT_SETTING: ProjectSetting = {
  // Whether to show the configuration button
  // 是否显示SettingButton
  showSettingButton: true,

  // Whether to show the theme switch button
  // 是否显示主题切换按钮
  showDarkModeToggle: true,

  // `Settings` button position
  // 设置按钮位置 可选项
  // SettingButtonPositionType.AUTO: 自动选择
  // SettingButtonPositionType.HEADER: 位于头部
  // SettingButtonPositionType.FIXED: 固定在右侧
  settingButtonPosition: SettingButtonType.AUTO,

  // purview mode
  // 权限模式,默认前端角色权限模式
  // ROUTE: 前端模式（菜单由路由生成，默认）
  // ROLE：前端模式（菜单路由分开）
  // SERVER：后端路由返回
  purviewType: PurviewType.ROUTE,

  // purview-related cache is stored in sessionStorage or localStorage
  // 权限缓存存放位置。默认存放于localStorage
  purviewCacheType: CacheType.LOCAL,

  // Session timeout processing
  // 会话超时处理方案
  // SessionTimeoutType.ROUTE_JUMP: 路由跳转到登录页
  // SessionTimeoutType.PAGE_COVERAGE: 生成登录弹窗，覆盖当前页面
  sessionTimeoutType: SessionTimeoutType.ROUTE_JUMP,

  // color
  // 项目主题色
  themeColor: import.meta.env.VITE_APP_PRIMARY_COLOR ?? '#0960bd',

  // Website gray mode, open for possible mourning dates
  // 网站灰色模式，用于可能悼念的日期开启
  grayMode: false,

  // Color Weakness Mode
  // 色弱模式
  colorWeak: false,

  // Whether to cancel the menu, the top, the multi-tab page display, for possible embedded in other systems
  // 是否取消菜单,顶部,多标签页显示, 用于可能内嵌在别的系统内
  fullContent: false,

  // content mode
  // 主题内容宽度
  contentMode: ContentWidthType.FULL,

  // Whether to display the logo
  // 是否显示logo
  showLogo: true,

  // Whether to show footer
  // 是否显示底部信息 copyright
  showFooter: true,

  // Header configuration
  // 头部配置
  headerSetting: {
    // header bg color
    // 背景色
    bgColor: HEADER_PRESET_BG_COLOR_LIST[0],
    // Fixed at the top
    // 固定头部
    fixed: true,
    // Whether to show top
    // 是否显示顶部
    show: true,
    // theme
    // 主题
    theme: import.meta.env.VITE_APP_THEME_MODE ?? ThemeModeType.LIGHT,
    // Whether to enable the lock screen function
    // 开启锁屏功能
    useLockPage: true,
    // Whether to show the full screen button
    // 显示全屏按钮
    showFullScreen: true,
    // Whether to show the document button
    // 显示文档按钮 默认 false
    showDoc: false,
    // Whether to show the notification button
    // 显示消息中心按钮
    showNotice: true,
    // Whether to display the menu search
    // 显示菜单搜索按钮 默认 false
    showSearch: false,
  },

  // Menu configuration
  // 菜单配置
  menuSetting: {
    // sidebar menu bg color
    // 背景色
    bgColor: SIDE_BAR_BG_COLOR_LIST[0],
    //  Whether to fix the left menu
    // 是否固定住菜单
    fixed: true,
    // Menu collapse
    // 菜单折叠
    collapsed: false,
    // When sider hide because of the responsive layout
    // 当侧隐藏，因为响应式布局
    siderHidden: false,
    // Whether to display the menu name when folding the menu
    // 折叠菜单时候是否显示菜单名
    collapsedShowTitle: false,
    // Whether it can be dragged
    // Only limited to the opening of the left menu, the mouse has a drag bar on the right side of the menu
    // 是否可拖拽
    canDrag: false,
    // Whether to show no dom
    // 是否显示
    show: true,
    // Whether to show dom
    hidden: false,
    // Menu width
    // 菜单宽度
    menuWidth: 210,
    // Menu mode
    // 菜单模式
    mode: MenuModeType.INLINE,
    // Menu type
    // 菜单类型
    type: MenuStyleType.SIDEBAR,
    // Menu theme
    // 菜单主题
    theme: import.meta.env.VITE_APP_MENU_THEME ?? ThemeModeType.DARK,
    // Split menu
    // 分割菜单
    split: false,
    // Top menu layout
    // 顶部菜单布局
    topMenuAlign: 'center',
    // Fold trigger position
    // 折叠触发器的位置
    trigger: TriggerType.HEADER,
    // Turn on accordion mode, only show a menu
    // 手风琴模式，只展示一个菜单
    accordion: true,
    // Switch page to close menu
    // 在路由切换的时候关闭左侧混合菜单展开菜单
    closeMixSidebarOnChange: false,
    // Module opening method ‘click’ |'hover'
    // 左侧混合菜单模块切换触发方式
    mixSideTrigger: MixSidebarTriggerType.CLICK,
    // Fixed expanded menu
    // 是否固定左侧混合菜单
    mixSideFixed: false,
  },

  // Multi-label
  // 多标签
  multiTabsSetting: {
    // 刷新后是否保留已经打开的标签页
    cache: false,
    // Turn on
    // 开启
    show: true,
    // Is it possible to drag and drop sorting tabs
    // 是否可以拖拽
    canDrag: true,
    // Turn on quick actions
    // 开启快速操作
    showQuick: true,
    // Whether to show the refresh button
    // 是否显示刷新那妞
    showRedo: true,
    // Whether to show the collapse button
    // 是否显示折叠按钮
    showFold: true,
  },

  // Transition Setting
  // 动画配置
  transitionSetting: {
    //  Whether to open the page switching animation
    // The disabled state will also disable pageLoading
    //  是否开启切换动画
    enable: true,

    // Route basic switching animation
    // 动画名
    basicTransition: RouterTransitionType.FADE_SIDE,

    // Whether to open page switching loading
    // Only open when enable=true
    // 是否打开页面切换loading
    openPageLoading: true,

    // Whether to open the top progress bar
    //是否打开页面切换顶部进度条
    openNProgress: false,
  },

  // Whether to enable KeepAlive cache is best to close during development, otherwise the cache needs to be cleared every time
  // **是否开启KeepAlive缓存 生产环境开启
  // 开发时候最好关闭,不然每次都需要清除缓存
  openKeepAlive: false,

  // Automatic screen lock time, 0 does not lock the screen. Unit minute default 0
  // 自动锁屏时间，为0不锁屏。 单位分钟 默认1个小时
  lockedTime: 0,

  // Whether to show breadcrumbs
  // 显示面包屑
  showBreadCrumb: true,

  // Whether to show the breadcrumb icon
  // 显示面包屑图标
  showBreadCrumbIcon: false,

  // Use error-handler-plugin
  // 是否使用全局错误捕获
  useErrorHandle: true,

  // Whether to open back to top
  // 是否开启回到顶部
  useOpenBackTop: true,

  //  Is it possible to embed iframe pages
  //  是否可以嵌入iframe页面
  canEmbedIFramePage: true,

  // Whether to delete unclosed messages and notify when switching the interface
  // 切换界面的时候是否删除未关闭的message及notify
  closeMessageOnSwitch: true,

  // Whether to cancel the http request that has been sent but not responded when switching the interface.
  // If it is enabled, I want to overwrite a single interface. Can be set in a separate interface
  // 切换界面的时候是否取消已经发送但是未响应的http请求。
  // 如果开启,想对单独接口覆盖。可以在单独接口设置
  removeAllHttpPending: false,
}

export default PROJECT_SETTING
