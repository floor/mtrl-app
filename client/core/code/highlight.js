// src/client/core/utils/code-highlighter.js

/**
 * Utility for code highlighting in the mtrl application
 * Uses Prism.js for syntax highlighting
 */

import Prism from 'prismjs'

// Import just the languages you need
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-jsx'

/**
 * Highlights code blocks within a container element
 * @param {HTMLElement} container - Container element (defaults to document.body)
 * @param {Object} options - Configuration options
 * @returns {number} Number of code blocks highlighted
 */
export function highlightCodeBlocks (container = document.body, options = {}) {
  if (!container) return 0

  const defaults = {
    delay: 50, // Small delay to ensure DOM is ready
    selector: 'pre code[class*="language-"], pre.mtrl-event-example__code code, pre code.mtrl-language-javascript', // Include MTRL-specific selectors
    debug: true // Whether to log debug info
  }

  const config = { ...defaults, ...options }

  // If an immediate highlight is requested (delay = 0), do it now
  if (config.delay === 0) {
    return performHighlight(container, config)
  }

  // Otherwise use a slight delay to ensure the DOM is ready
  return new Promise(resolve => {
    setTimeout(() => {
      const count = performHighlight(container, config)
      resolve(count)
    }, config.delay)
  })
}

/**
 * Actually performs the highlighting operation
 * @private
 */
function performHighlight (container, config) {
  // Find all code blocks in the container
  const codeBlocks = container.querySelectorAll(config.selector)

  if (codeBlocks.length > 0) {
    // Process each code block
    codeBlocks.forEach(block => {
      // Extract language from class name
      let language = 'javascript' // Default to JavaScript

      // Check if the block or its parent has a language class
      const classNames = block.className || ''
      const parentClassNames = block.parentElement ? block.parentElement.className || '' : ''

      // Try to find language in code element class
      if (classNames.includes('language-')) {
        const match = classNames.match(/language-([a-z]+)/)
        if (match && match[1] && match[1] !== 'none') {
          language = match[1]
        }
      }
      // If language wasn't found or is 'none', check if there's mtrl-language-*
      else if (classNames.includes('mtrl-language-')) {
        const match = classNames.match(/mtrl-language-([a-z]+)/)
        if (match && match[1] && match[1] !== 'none') {
          language = match[1]
        }
      }
      // Check parent element for language class if not found in code element
      else if (parentClassNames.includes('language-')) {
        const match = parentClassNames.match(/language-([a-z]+)/)
        if (match && match[1] && match[1] !== 'none') {
          language = match[1]
        }
      }

      // Skip highlighting if we couldn't determine a language
      if (language === 'none') {
        if (config.debug) {
          console.log('Skipping code block with language "none"')
        }
        return
      }

      // Make sure the code element has the proper language class
      if (!block.classList.contains(`language-${language}`)) {
        // Remove any existing language classes
        block.className = block.className
          .split(' ')
          .filter(cls => !cls.startsWith('language-'))
          .join(' ')

        // Add the correct language class
        block.classList.add(`language-${language}`)
      }

      // Now highlight the element
      try {
        Prism.highlightElement(block)

        if (config.debug) {
          console.log(`Highlighted ${language} code block`)
        }
      } catch (err) {
        console.error('Error highlighting code block:', err)
      }
    })

    if (config.debug) {
      console.log(`Processed ${codeBlocks.length} code blocks`)
    }
  } else if (config.debug) {
    console.log('No code blocks found to highlight')

    // Log what selectors we're looking for and what's in the container
    console.log('Selector:', config.selector)
    console.log('Container:', container)

    // Try to find any pre or code elements
    const pre = container.querySelectorAll('pre')
    const code = container.querySelectorAll('code')

    if (pre.length) {
      console.log(`Found ${pre.length} pre elements:`)
      pre.forEach((el, i) => console.log(`Pre ${i}:`, el.outerHTML.slice(0, 100) + '...'))
    }

    if (code.length) {
      console.log(`Found ${code.length} code elements:`)
      code.forEach((el, i) => console.log(`Code ${i}:`, el.outerHTML.slice(0, 100) + '...'))
    }
  }

  return codeBlocks.length
}

/**
 * Force update language class of code blocks
 * @param {HTMLElement} container - Container to process
 */
export function fixCodeBlockLanguages (container = document.body) {
  if (!container) return

  // Find code blocks that might need language fixing
  const codeBlocks = container.querySelectorAll('pre.mtrl-event-example__code code, code.mtrl-language-javascript')

  codeBlocks.forEach(block => {
    // Find the language from class names
    let language = 'javascript' // Default

    if (block.className.includes('mtrl-language-')) {
      const match = block.className.match(/mtrl-language-([a-z]+)/)
      if (match && match[1] && match[1] !== 'none') {
        language = match[1]
      }
    }

    // Make sure it has the proper Prism language class
    if (!block.classList.contains(`language-${language}`)) {
      block.classList.add(`language-${language}`)

      // If parent is a pre without language class, add it there too
      if (block.parentElement &&
          block.parentElement.tagName === 'PRE' &&
          !block.parentElement.className.includes(`language-${language}`)) {
        block.parentElement.classList.add(`language-${language}`)
      }
    }
  })
}

/**
 * Registers code highlighting to run after route transitions
 * @param {Object} router - The application router
 */
export function registerWithRouter (router) {
  if (!router || !router.afterEach) return

  router.afterEach((route, prevRoute) => {
    // Wait for content to render before highlighting
    setTimeout(() => {
      // Find the content container
      const contentContainer = document.querySelector('.mtrl-content') ||
                               document.querySelector('.content') ||
                               document.getElementById('content')

      if (contentContainer) {
        // First fix language classes for MTRL-specific code blocks
        fixCodeBlockLanguages(contentContainer)

        // Then highlight all code blocks
        highlightCodeBlocks(contentContainer, {
          delay: 0,
          debug: true
        })
      }
    }, 100)
  })
}

/**
 * Makes code highlighting available globally in the window object
 */
export function exposeGlobally () {
  if (typeof window !== 'undefined') {
    // Expose Prism globally so components can access it directly if needed
    window.Prism = Prism

    // Add a helper method for components to trigger highlighting
    window.highlightCode = (container, options) => {
      // First fix language classes
      fixCodeBlockLanguages(container)

      // Then highlight
      return highlightCodeBlocks(container, options)
    }
  }
}

// Create a singleton with common configuration
const codeHighlighter = {
  highlight: highlightCodeBlocks,
  fixLanguages: fixCodeBlockLanguages,
  registerWithRouter,
  exposeGlobally
}

export default codeHighlighter
