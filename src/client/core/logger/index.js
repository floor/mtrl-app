// src/client/core/logger/index.js

const CONFIG = {
  debug: process.env.NODE_ENV !== 'production'
}

// Styling utilities
const styles = {
  info: 'color: #2196F3; font-weight: bold',
  warn: 'color: #FFC107; font-weight: bold',
  error: 'color: #F44336; font-weight: bold',
  debug: 'color: #9E9E9E; font-weight: bold',
  success: 'color: #4CAF50; font-weight: bold',
  namespace: 'color: #666; font-weight: normal'
}

// Timestamp formatter
const getTimestamp = () => {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${
    now.getMinutes().toString().padStart(2, '0')}:${
    now.getSeconds().toString().padStart(2, '0')}.${
    now.getMilliseconds().toString().padStart(3, '0')}`
}

// Base logging function
const logWithLevel = (namespace) => (level) => (...args) => {
  if (level === 'debug' && !CONFIG.debug) return

  const timestamp = getTimestamp()
  const prefix = `%c${timestamp}%c [${namespace}]`

  // Select the appropriate console method
  const consoleMethod = console[level] || console.log

  // Apply styling
  consoleMethod(
    prefix + '%c',
    styles[level],
    styles.namespace,
    `${styles[level]}`,
    ...args
  )

  // Return the logged values for potential chaining
  return args[0]
}

// Group logging utilities
const createGroup = (namespace) => (groupName, collapsed = false) => {
  const groupMethod = collapsed ? console.groupCollapsed : console.group
  groupMethod(`%c${groupName}`, styles.info)
  return {
    end: () => console.groupEnd(),
    log: (...args) => logWithLevel(namespace)('log')(...args)
  }
}

// Performance timing utility
const createTimer = (namespace) => (label) => {
  const start = performance.now()
  return {
    end: () => {
      const duration = performance.now() - start
      logWithLevel(namespace)('info')(`${label}: ${duration.toFixed(2)}ms`)
      return duration
    }
  }
}

/**
 * Creates a logger instance with the given namespace
 * @param {string} namespace - Logger namespace
 * @returns {Object} Logger instance
 */
export const createLogger = (namespace = 'App') => {
  const logger = {
    info: logWithLevel(namespace)('info'),
    warn: logWithLevel(namespace)('warn'),
    error: logWithLevel(namespace)('error'),
    debug: logWithLevel(namespace)('debug'),
    success: logWithLevel(namespace)('success'),
    group: createGroup(namespace),
    time: createTimer(namespace),

    // Create a new logger with a sub-namespace
    scope: (subNamespace) => createLogger(`${namespace}:${subNamespace}`),

    // Conditional logging
    when: (condition) => ({
      info: (...args) => condition && logger.info(...args),
      warn: (...args) => condition && logger.warn(...args),
      error: (...args) => condition && logger.error(...args),
      debug: (...args) => condition && logger.debug(...args),
      success: (...args) => condition && logger.success(...args)
    })
  }

  return logger
}

// Navigation-specific logging
export const createNavigationLogger = () => {
  const navLogger = createLogger('Navigation')

  // Return enhanced logger with both base and specialized methods
  return {
    // Include all base logger methods
    ...navLogger,

    // Specialized navigation logging methods
    railChange: (event) => {
      const group = navLogger.group('Rail Change')
      group.log('Event:', event)
      group.log('ID:', event.id)
      group.log('Current Item:', event.item)
      group.log('Previous Item:', event.previousItem)
      group.end()
    },

    drawerUpdate: (drawer, items) => {
      const group = navLogger.group('Drawer Update')
      group.log('Available Methods:', Object.keys(drawer))
      group.log('Items to Add:', items)
      group.log('Current State:', {
        hasElement: !!drawer.element,
        classList: drawer.element?.classList.toString()
      })
      group.end()
    },

    drawerToggle: (show, element) => {
      navLogger.debug('Drawer Visibility:', {
        show,
        currentClasses: element?.classList.toString()
      })
    }
  }
}

// Create and export default logger instance
const log = createLogger()
export default log

// Initialize global logger if needed
if (typeof window !== 'undefined') {
  window.log = log
}
