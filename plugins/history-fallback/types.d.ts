// @types/connect-history-api-fallback
declare module 'history-fallback' {
  export interface HistoryOptions {
    readonly disableDotRule?: true | undefined
    htmlAcceptHeaders?: string[] | undefined
    readonly index?: string | undefined
    readonly logger?: typeof console.log | undefined
    rewrites?: Rewrite[] | undefined
    readonly verbose?: boolean | undefined
  }

  export interface HistoryContext {
    readonly match: RegExpMatchArray | null | undefined
    readonly parsedUrl: URL
    readonly request: core.Request
  }

  export type HistoryRewriteTo = (context: HistoryContext) => string

  export interface HistoryRewrite {
    readonly from: RegExp
    readonly to: string | RegExp | HistoryRewriteTo
  }
  export { historyFallback } from './index.ts'
}
