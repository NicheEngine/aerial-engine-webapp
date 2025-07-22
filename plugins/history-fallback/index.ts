// connect-history-api-fallback

import { Connect } from 'vite'
import { URL } from 'node:url'
import * as http from 'node:http'
import type { HistoryOptions, HistoryRewrite, HistoryRewriteTo } from 'history-fallback'

export function historyFallback(options: HistoryOptions): Connect.HandleFunction {
  options = options || ({} as HistoryOptions)
  const logger = getLogger(options)

  return function (
    req: Connect.IncomingMessage,
    res: http.ServerResponse,
    next: Connect.NextFunction,
  ) {
    const headers = req.headers
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      logger('Not rewriting', req.method, req.url, 'because the method is not GET or HEAD.')
      return next ? next() : () => {}
    } else if (!headers) {
      logger(
        'Not rewriting',
        req.method,
        req.url,
        'because the client did not send an HTTP accept header.',
      )
      return next ? next() : () => {}
    } else if (headers?.accept?.indexOf('application/json') === 0) {
      logger('Not rewriting', req.method, req.url, 'because the client prefers JSON.')
      return next ? next() : () => {}
    } else if (!acceptsHtml(headers?.accept, options)) {
      logger('Not rewriting', req.method, req.url, 'because the client does not accept HTML.')
      return next ? next() : () => {}
    }
    if (!req?.url && !req?.originalUrl) {
      logger(
        'Not rewriting',
        req.method,
        req.url,
        'because the client url of originalUrl is empty.',
      )
      return next ? next() : () => {}
    }
    const baseUrl: string = req.url ?? req.originalUrl ?? '/'
    const parsedUrl: URL = new URL(baseUrl, import.meta.url)
    let rewriteTarget
    options.rewrites = options.rewrites || []
    for (let i = 0; i < options.rewrites.length; i++) {
      const rewrite: HistoryRewrite = options.rewrites[i]
      const match: RegExpMatchArray | null | undefined = parsedUrl?.pathname?.match(rewrite.from)
      if (match !== null) {
        rewriteTarget = evaluateRewriteRule(parsedUrl, match, rewrite.to, req)
        if (rewriteTarget.charAt(0) !== '/') {
          logger(
            'We recommend using an absolute path for the rewrite target.',
            'Received a non-absolute rewrite target',
            rewriteTarget,
            'for URL',
            req.url,
          )
        }

        logger('Rewriting', req.method, req.url, 'to', rewriteTarget)
        req.url = rewriteTarget
        return next ? next() : () => {}
      }
    }
    const pathname: string | null | undefined = parsedUrl?.pathname
    if (
      pathname &&
      pathname?.lastIndexOf('.') > pathname?.lastIndexOf('/') &&
      options.disableDotRule !== true
    ) {
      logger('Not rewriting', req.method, req.url, 'because the path includes a dot (.) character.')
      return next ? next() : () => {}
    }

    rewriteTarget = options.index || '/index.html'
    logger('Rewriting', req.method, req.url, 'to', rewriteTarget)
    req.url = rewriteTarget
    next ? next() : () => {}
  }
}

function evaluateRewriteRule(
  parsedUrl: URL,
  match: RegExpMatchArray | null | undefined,
  rule: string | RegExp | HistoryRewriteTo,
  req: Connect.IncomingMessage,
) {
  if (typeof rule === 'string') {
    return rule
  } else if (typeof rule !== 'function') {
    throw new Error('Rewrite rule can only be of type string or function.')
  }

  return rule({
    parsedUrl: parsedUrl,
    match: match,
    request: req,
  })
}

function acceptsHtml(header: string | undefined, options: HistoryOptions) {
  options.htmlAcceptHeaders = options.htmlAcceptHeaders || ['text/html', '*/*']
  for (let i = 0; i < options.htmlAcceptHeaders.length; i++) {
    if (header?.indexOf(options.htmlAcceptHeaders[i]) !== -1) {
      return true
    }
  }
  return false
}

function getLogger(options: HistoryOptions) {
  if (options && options.logger) {
    return options.logger
  } else if (options && options.verbose) {
    return console.log.bind(console)
  }
  return function () {}
}
