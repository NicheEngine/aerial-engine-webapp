/**
 * copy to https://github.com/developit/mitt Expand clear method
 */
import type {
  Emitter,
  EventHandlerMap,
  EmitEventType,
  EmitHandler,
  EmitEventHandlers,
  WildCardEventHandlers,
} from 'mitt-util'

export function mitt(all?: EventHandlerMap): Emitter {
  all = all || new Map()

  return {
    /* A Map of event names to registered handler functions. */
    all,
    /**
     * Register an event handler for the given type.
     * @param {string|symbol} type Type of event to listen for, or `"*"` for all events
     * @param {Function} handler Function to call in response to given event
     * @memberOf mitt
     */
    on<T = any>(type: EmitEventType, handler: EmitHandler<T>) {
      const handlers = all?.get(type)
      const added = handlers && handlers.push(handler)
      if (!added) {
        all?.set(type, [handler])
      }
    },

    /* Remove an event handler for the given type. */
    off<T = any>(type: EmitEventType, handler: EmitHandler<T>) {
      const handlers = all?.get(type)
      if (handlers) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1)
      }
    },

    /**
     * Invoke all handlers for the given type. If present,
     * `"*"` handlers are invoked after type-matched handlers.
     * Note: Manually firing "*" handlers is not supported.
     */
    emit<T = any>(type: EmitEventType, evt: T) {
      ;((all?.get(type) || []) as EmitEventHandlers).slice().map((handler) => {
        handler(evt)
      })
      ;((all?.get('*') || []) as WildCardEventHandlers).slice().map((handler) => {
        handler(type, evt)
      })
    },

    clear() {
      this.all.clear()
    },
  }
}

export default mitt
