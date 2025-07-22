/**
 * Configure and register global directives
 */
import type { App } from 'vue'
import { setupPurviewDirective } from './purview.ts'
import { setupLoadingDirective } from './loading.ts'

export function setupGlobDirectives(app: App) {
  setupPurviewDirective(app)
  setupLoadingDirective(app)
}
