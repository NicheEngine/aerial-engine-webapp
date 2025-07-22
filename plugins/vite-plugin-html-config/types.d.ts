// vite-plugin-html-config

declare module 'html-config-plugin' {
  export interface IHTMLTag {
    [key: string]: string | boolean
  }

  export type ScriptTag = Record<string, string | boolean> | string

  export interface HtmlConfigOptions {
    favicon?: string
    title?: string
    metas?: IHTMLTag[]
    links?: IHTMLTag[]
    style?: string
    headScripts?: ScriptTag[]
    scripts?: ScriptTag[]
    preHeadScripts?: ScriptTag[]
  }

  export interface HtmlConfigPluginOptions {
    build?: boolean
    pages?: {
      [key: string]: HtmlConfigOptions
    }
    index?: HtmlConfigOptions
  }

  export { createHtmlConfigPlugin } from './index.ts'
}
