// vite-plugin-html-page

declare module 'html-page-plugin' {
  import type { HtmlTagDescriptor, ResolvedConfig } from 'vite'
  import type { Options as EJSOptions } from 'ejs'
  import type { Options as MinifyOptions } from 'html-minifier-terser'

  export interface InjectOptions {
    // Data injected into the html template
    data?: Recordable
    tags?: HtmlTagDescriptor[]
    // ejs options configuration
    ejs?: EJSOptions
  }

  export interface HtmlPageOptions {
    default?: boolean
    key: string
    filename: string
    template: string
    entry?: string
    inject?: InjectOptions
  }

  export interface HtmlPageConfig {
    injectOptions: InjectOptions
    viteConfig: ResolvedConfig
    viteEnv: Recordable
    entry?: string
    verbose?: boolean
  }

  export interface HtmlPagePluginOptions {
    pages?: HtmlPageOptions[]
    minify?: MinifyOptions | boolean
    key?: string
    entry?: string
    filename?: string
    template?: string
    inject?: InjectOptions
    verbose?: boolean
  }

  export { createPagePlugin } from './page.ts'
  export { createMinifyHtmlPlugin } from './minify.ts'
  export { createHtmlPagePlugin } from './index.ts'
}
