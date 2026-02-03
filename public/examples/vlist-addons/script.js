// script.js - mtrl-addons Collection Component Example (Adapted)
// Complete implementation using createList from mtrl-addons

// Import required modules from their correct paths
import {
  createButton,
  createChips,
  createSlider,
  createTextfield,
  createSwitch
} from '../../../../dist/mtrl/index.js'

import { rightIcon, leftIcon, mtrlIcon } from '../../../../client/icons/index.js'

// import { createComponentsLayout, createComponentSection } from '../../../../client/layout/index.js'

import {
  createLayout,
  createVList
} from '../../../../dist/mtrl-addons/index.mjs'

// Initialize the component when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 [LIST-EXAMPLE] DOM loaded, initializing list component example')
  console.log('📄 [LAYOUT]', createComponentsLayout)

  // Create the full list component example using document.body
  const listComponent = createListExample(document.getElementById('content'))

  window.listExample = listComponent
})

const createListExample = (container, components) => {
  const info = {
    title: 'Lists',
    description: 'Lists are continuous, vertical indexes of text and images'
  }

  const layout = createLayout(
    createComponentsLayout(info),
    container
  ).component

  const listComponent = createListExampleComponent(layout.body)

  return {
    layout,
    listComponent
  }
}

export const createComponentsLayout = (info) => [
  ['head', { class: 'content__header' },
    [{ tag: 'section', class: 'content__box content-info' },
      ['title', { tag: 'h1', class: 'content__title', text: info.title }],
      ['decription', { tag: 'p', class: 'content__description', text: info.description }]
    ]
  ],
  ['body', { class: 'content__body' }],
  ['foot', { class: 'content__footer' },
    [{ tag: 'section', className: 'content__footer-section' },
      [{ html: mtrlIcon, className: 'content-logo' }],
      [{ tag: 'p', id: 'decription', className: 'components__description', text: 'mtrl is a lightweight, composable TypeScript/JavaScript component library inspired by Material Design principles. Built with zero dependencies, MTRL provides a robust foundation for creating modern web interfaces with an emphasis on performance, type safety, and accessibility.' }]
    ]
  ]
]

const createComponentSection = (info) => [
  [{ tag: 'section', class: 'components__section' },
    [{ class: 'components__section-head' },
      ['title', { tag: 'h2', class: 'components__section-title', text: info.title }],
      ['description', { tag: 'div', class: 'components__section-description', text: info.description }]
    ],
    ['body', { class: 'components__section-body' },
      ['showcase', { class: `components__section-showcase ${info.class}` }],
      ['info', { id: 'info', class: 'components__section-info' }]
    ]
  ]
]

console.log('🚀 [LIST-EXAMPLE] Starting mtrl-addons list component example')

// Debug flag
const debug = false

/**
 * Creates a user list using createList from mtrl-addons
 */
const createUserList = (parent) => {
  console.log('🚀 [LIST-EXAMPLE] Creating list component')

  // Create the list component using createVList with modern feature-oriented structure
  const list = createVList({
    container: parent,
    className: 'list--users',
    ariaLabel: 'User Directory',
    debug: true,

    // Virtual scrolling configuration
    virtual: {
      // itemSize: 100, // will be automatically calculated based on the first loaded range
      overscan: 2
    },

    // Scrolling configuration
    scrolling: {
      orientation: 'vertical'
    },

    // Pagination configuration
    pagination: {
      strategy: 'page',
      limit: 20 // Items per page
    },

    // Collection configuration
    collection: {
      adapter: {
        read: async (params) => {
          try {
            const page = params?.page || 1
            const limit = params?.limit || 20
            const url = `/api/users?page=${page}&limit=${limit}`

            const response = await fetch(url)
            const data = await response.json()

            // Use the correct structure - API returns { items: [...], meta: {...} }
            const items = data.items || []
            const meta = data.meta || {}

            return {
              items,
              meta: {
                total: meta.total || undefined,
                page: meta.page || page,
                limit: meta.limit || limit,
                hasNext: meta.hasNext || false,
                hasPrev: meta.hasPrev || false
              }
            }
          } catch (error) {
            // Return error without logging (handled by collection)
            return {
              items: [],
              error: { message: error.message }
            }
          }
        }
      }
      // transform: (user) => {
      //   if (!user || typeof user !== 'object') {
      //     return {
      //       id: 'error-' + Date.now() + Math.random(),
      //       name: 'Error: Invalid User',
      //       email: '',
      //       role: '',
      //       avatar: ''
      //     }
      //   }

      //   return {
      //     id: user.id || user._id || String(Math.random()),
      //     name: user.name || 'Unknown User',
      //     email: user.email || '',
      //     role: user.role || 'User',
      //     avatar: user.avatar || (user.name ? user.name[0] : '?'),
      //     original: user
      //   }
      // }
    },

    // Placeholder configuration
    placeholders: {
      enabled: true
    },

    // Selection configuration
    selection: {
      enabled: true,
      mode: 'multiple',
      onSelectionChange: (selectedItems, selectedIndices) => {
        console.log('📌 [LIST-EXAMPLE] Selection changed:', {
          count: selectedItems.length,
          indices: selectedIndices
        })
      }
    },

    // Performance settings
    performance: {
      maxConcurrentRequests: 1,
      debounceDelay: 16,
      throttleDelay: 100
    },

    // Using layout system template with array schema (BEM naming)
    template: (user, index) => [
      { attributes: { 'data-id': user.id } },
      [{ class: 'viewport-item__avatar', text: user.avatar }],
      ['userDetails', { class: 'viewport-item__details' },
        [{ class: 'viewport-item__headline', text: `${user.name} (${index})` }],
        [{ class: 'viewport-item__text', text: user.email }],
        [{ class: 'viewport-item__meta', text: user.role }]
      ]
    ]
  })

  return list
}

/**
 * Creates a debug panel for monitoring collection state using layout system
 */
const createDebugPanel = (parent) => {
  // Create debug panel to show collection state
  const debugPanel = document.createElement('div')
  debugPanel.className = 'debug-panel'
  debugPanel.style.cssText = `
    margin-top: 48px;
    padding: 15px;
    border-radius: 10px;
    font-family: monospace;
    font-size: 10px;
    width: 100%;
    background-color: rgba(0,0,0,.1)
  `

  debugPanel.innerHTML = `
    <h4 style="margin: 0 0 10px 0; font-family: sans-serif;">Collection State</h4>
    <div id="collection-state">Loading...</div>
  `

  parent.appendChild(debugPanel)
  return debugPanel
}

/**
 * Performance monitoring utilities
 */
const createPerformanceMonitor = () => {
  let renderCount = 0
  let scrollCount = 0
  let startTime = performance.now()

  return {
    trackRender: () => {
      renderCount++
    },

    trackScroll: () => {
      scrollCount++
    },

    getMetrics: () => {
      const totalTime = performance.now() - startTime
      return {
        renderCount,
        scrollCount,
        totalTime: Math.round(totalTime),
        avgRenderTime: renderCount > 0 ? totalTime / renderCount : 0
      }
    },

    reset: () => {
      renderCount = 0
      scrollCount = 0
      startTime = performance.now()
    }
  }
}

/**
 * Main component creator - showcases the mtrl-addons list component
 */
const createListExampleComponent = (container) => {
  const title = 'VList Component (mtrl-addons)'
  const description = 'mtrl-addons virtual list component - collection-powered, template-driven, auto-recycling'

  const layout = createLayout(
    createComponentSection({ title, description }),
    container
  ).component

  console.log('🚀 [LIST-EXAMPLE] Initializing list component showcase')

  // Create the list component
  const userList = createUserList(layout.showcase)
  console.log('userList', userList)
  const performanceMonitor = createPerformanceMonitor()

  let animate = false
  let page = 1

  const pages = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: "1'000", value: 1000 },
    { label: "10'000", value: 10000 },
    { label: "50'000", value: 50000 }
  ]

  const indexes = [
    { label: '64236', value: 64236 },
    { label: '262153', value: 262153 },
    { label: '999999', value: 999999 }
  ]

  // Create controls
  const info = createLayout([
    { layout: { type: 'grid', column: 1, gap: 4, dense: true, align: 'center' } },
    [createChips, 'pages', { scrollable: false, label: 'Scroll to' }],
    [createChips, 'indexes', { scrollable: false, label: 'Scroll to Index' }],
    [createSlider, 'index', { label: 'Scroll to', min: 0, max: 1000000, page, step: 1, size: 'XS', variant: 'discrete' }],
    [{ layout: { type: 'row', column: 3, gap: 1 } },
      [createButton, 'prev', { icon: leftIcon, size: 'XS', variant: 'outlined' }],
      [createTextfield, 'page', { label: 'Page', density: 'compact', value: page, variant: 'outlined' }],
      [createButton, 'next', { icon: rightIcon, size: 'XS', variant: 'outlined' }]
    ],
    [createSwitch, 'animate', { label: 'Animate scroll', checked: animate, class: 'switch--dense' }]
  ], layout.info).component

  // Add debug panel
  const debugPanel = debug ? createDebugPanel(layout.info) : null

  // Add pages chips
  pages.forEach(({ label, value }) => {
    info.pages.addChip({
      text: label.toLowerCase(),
      value,
      variant: 'filter',
      selectable: true,
      selected: label.toLowerCase() === page.toString()
    })
  })

  // Add pages chips
  indexes.forEach(({ label, value }) => {
    info.indexes.addChip({
      text: label.toLowerCase(),
      value,
      variant: 'filter',
      selectable: true,
      selected: label.toLowerCase() === page.toString()
    })
  })

  // Function to update debug panel
  const updateDebugPanel = () => {
    if (!debug || !debugPanel) return

    try {
      const stateElement = document.getElementById('collection-state')
      if (!stateElement) {
        console.warn('Debug panel element not found')
        return
      }

      const allItems = userList.getItems ? userList.getItems() : []
      const selectedItems = userList.getSelectedItems ? userList.getSelectedItems() : []
      const selectedIndices = userList.getSelectedIndices ? userList.getSelectedIndices() : []
      const performanceMetrics = performanceMonitor.getMetrics()

      const stateHtml = `
        <div class="mtrl-addons-debug__content">
          <div class="mtrl-addons-debug__section-title">📊 List State</div>
          <div class="mtrl-addons-debug__section">
            <strong>Total Items:</strong> ${allItems.length}<br>
            <strong>Selected Items:</strong> ${selectedItems.length}<br>
            <strong>Selected Indices:</strong> ${selectedIndices.slice(0, 5).join(', ')}${selectedIndices.length > 5 ? '...' : ''}<br>
          </div>

          <div class="mtrl-addons-debug__section-title">🔧 System Info</div>
          <div class="mtrl-addons-debug__section">
            <strong>Engine:</strong> mtrl-addons VList<br>
            <strong>Collection System:</strong> Built-in<br>
            <strong>Template Engine:</strong> Object-based<br>
            <strong>Selection:</strong> Multi-select enabled<br>
          </div>

          <div class="mtrl-addons-debug__section-title">📈 Performance Metrics</div>
          <div class="mtrl-addons-debug__section">
            <strong>UI Renders:</strong> ${performanceMetrics.renderCount}<br>
            <strong>UI Scrolls:</strong> ${performanceMetrics.scrollCount}<br>
            <strong>Total Time:</strong> ${performanceMetrics.totalTime}ms<br>
            <strong>Avg Render:</strong> ${performanceMetrics.avgRenderTime.toFixed(2)}ms<br>
          </div>

          <div class="mtrl-addons-debug__section-title">✅ Selected Items</div>
          <div class="mtrl-addons-debug__section" style="max-height: 100px; overflow-y: auto;">
            ${selectedItems.length > 0
? selectedItems.slice(0, 10).map(item =>
              `<div style="font-size: 11px;">${item.name} (${item.email})</div>`
            ).join('') + (selectedItems.length > 10 ? '<div>...</div>' : '')
: 'None'}
          </div>
        </div>
      `

      stateElement.innerHTML = stateHtml
    } catch (error) {
      console.error('❌ [LIST-EXAMPLE] Error updating debug panel:', error)
    }
  }

  // Event handlers - Fixed to use correct parameters
  info.index.on('change', (event) => {
    console.log('🔄 [LIST-EXAMPLE] Index change:', event.value)
    performanceMonitor.trackScroll()
    userList.scrollToIndex(event.value, 'start')
  })

  info.page.on('input', async (event) => {
    if (page === parseInt(event.value) || !event.value) return

    page = parseInt(event.value)
    console.log('📄 [LIST-EXAMPLE] Page input:', page)

    performanceMonitor.trackScroll()
    userList.scrollToPage(page, 'start') // New scrollToPage API
    updateDebugPanel()
  })

  info.pages.on('change', (p) => {
    const value = parseInt(p[0], 10)
    console.log('📄 [LIST-EXAMPLE] Pages chip selected:', value)

    performanceMonitor.trackScroll()

    // First load the page data
    userList.scrollToPage(value, 'start') // New scrollToPage API
    info.page.setValue(value)

    // // Then scroll to the first item of the selected page after data is loaded
    // const firstItemIndex = (value - 1) * 20
    // setTimeout(() => {
    //   userList.scrollToIndex?.(firstItemIndex, 'start')
    // }, 50)

    updateDebugPanel()
  })

  info.indexes.on('change', async (p) => {
    const value = parseInt(p[0], 10)
    console.log('📄 [LIST-EXAMPLE] Indexes chip selected:', value)

    performanceMonitor.trackScroll()

    userList.scrollToIndex(value, 'start')

    updateDebugPanel()
  })

  info.prev.on('click', async () => {
    let currentPage = info.page.getValue()
    console.log('⬅️ [LIST-EXAMPLE] Previous page:', currentPage)
    if (currentPage > 1) {
      currentPage--
      performanceMonitor.trackScroll()
      userList.scrollToPage(currentPage, 'start') // New scrollToPage API
      info.page.setValue(currentPage)
    }
  })

  info.next.on('click', async () => {
    console.log('➡️ [LIST-EXAMPLE] Next page:', page)

    page++
    userList.scrollToPage(page, 'start') // New scrollToPage API
    info.page.setValue(page)
  })

  info.animate.on('change', (e) => {
    animate = e.checked
    userList.setScrollAnimation(e.checked)
    console.log('🎬 [LIST-EXAMPLE] Animation toggled:', animate)
  })

  // Event listeners for collection events
  userList.on('load', (event) => {
    console.log('📡 [LIST-EXAMPLE] Collection loaded:', event)
    performanceMonitor.trackRender()
    updateDebugPanel()
  })

  userList.on('error', (event) => {
    console.error('❌ [LIST-EXAMPLE] Collection error:', event.error)
  })

  // Listen for failed ranges
  userList.on('range:failed', (event) => {
    console.warn(`⚠️ [LIST-EXAMPLE] Range ${event.rangeId} failed (attempt ${event.attempts})`)
  })

  // Initial debug panel update
  setTimeout(updateDebugPanel, 100)

  // Periodic debug panel updates
  const debugInterval = debug ? setInterval(updateDebugPanel, 1000) : null

  return {
    layout,
    userList,
    performanceMonitor,
    cleanup: () => {
      if (debugInterval) {
        clearInterval(debugInterval)
      }
      console.log('🧹 [LIST-EXAMPLE] List component cleanup completed')
    }
  }
}
