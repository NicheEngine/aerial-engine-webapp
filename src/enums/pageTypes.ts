export enum PageType {
  /**
   * basic login path
   */
  BASE_LOGIN = '/login',
  /**
   * basic home path
   * 首页路由指的是应用程序中的默认路由，当不输入其他任何路由时，
   * 会自动重定向到该路由下，并且该路由在Tab上是固定的，
   * 即使设置affix: false也不允许关闭
   */
  BASE_HOME = '/screen',
  /**
   * error page path
   */
  ERROR_PAGE = '/exception',
  /**
   * error log page path
   */
  ERROR_LOG_PAGE = '/error/list',
}
