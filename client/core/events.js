// src/client/core/events.js

export const createEventManager = () => {
  const cleanupFns = new Set()

  return {
    addCleanup: (fn) => {
      if (typeof fn === 'function') {
        cleanupFns.add(fn)
      }
    },
    cleanup: () => {
      cleanupFns.forEach(fn => {
        try {
          fn()
        } catch (error) {
          log.error('Error during cleanup:', error)
        }
      })
      cleanupFns.clear()
    }
  }
}

export const setupErrorBoundary = () => {
  window.onerror = (msg, source, lineNo, columnNo, error) => {
    log.error('Global error:', { msg, source, lineNo, columnNo, error })
    return false
  }

  window.onunhandledrejection = (event) => {
    log.error('Unhandled promise rejection:', event.reason)
  }
}
