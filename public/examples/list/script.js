// script.js - mtrl-addons Collection Component Example (Adapted)
// Complete implementation copied and adapted from collection-addons.js

// Import required modules from their correct paths
import {
  createButton,
  createChips,
  createSlider,
  createTextfield,
  createSwitch
} from '../../../../dist/mtrl/index.js'

import { rightIcon, leftIcon, mtrlIcon } from '../../../../client/icons/index.js'

import {
  createLayout,
  createCollection,
  createList
} from '../../../../dist/mtrl-addons/index.mjs'

// import { createComponentSection, createContentLayout } from '../../../../client/layout/index.js'

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
    ],
    [{ tag: 'section', className: 'content__footer-section content__footer-link' },
      [{ text: 'Links', className: 'content__footer-section__social' }],
      [{ tag: 'a', text: 'npm', className: 'content-link', href: 'https://www.npmjs.com/package/mtrl', target: '_blank' }],
      [{ tag: 'a', text: 'GitHub', className: 'content-link', href: 'https://github.com/floor/mtrl', target: '_blank' }],
      [{ tag: 'a', text: 'X', className: 'content-link', href: 'https://x.com/mtrllib', target: '_blank' }]
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

// Comment out the problematic import that requires SVG module imports
// import { createComponentsLayout } from '/client/layout/index.js' // and get the files from the client folder

console.log('🚀 [COLLECTION-ADDONS] Starting mtrl-addons collection component example')

// Debug flag
const debug = true

/**
 * Creates a user collection using the new mtrl-addons list component
 * This demonstrates the collection-powered list system
 */
const createUserList = (parent) => {
  console.log('parent', parent)
  console.log('🚀 [COLLECTION-ADDONS] Creating new list component (collection-powered)')

  // Quick API test to debug endpoint
  console.log('🧪 [COLLECTION-ADDONS] Testing API endpoint...')
  fetch('/api/users?page=1&limit=5').then(r => r.json()).then(data => {
    console.log('🧪 [COLLECTION-ADDONS] Direct API test result:', data)
    console.log('🧪 [COLLECTION-ADDONS] Has data array?', !!data.data, 'Length:', data.data?.length || 0)
    console.log('🧪 [COLLECTION-ADDONS] Has pagination?', !!data.pagination)
  }).catch(e => console.error('🧪 [COLLECTION-ADDONS] API test failed:', e))

  // Create the list component (powered by collection system)
  const list = createList({
    container: parent,
    scroll: {
      animation: false
    },
    adapter: {
      read: async (params) => {
        try {
          const page = params?.page || 1
          const pageSize = params?.pageSize || 20
          const url = `/api/users?page=${page}&limit=${pageSize}`
          console.log(`🌐 [COLLECTION-ADDONS] Fetching: ${url}`)

          const response = await fetch(url)
          const data = await response.json()

          console.log('📦 [COLLECTION-ADDONS] Raw API response:', data)
          console.log('📦 [COLLECTION-ADDONS] API structure check:', {
            hasItems: 'items' in data,
            hasData: 'data' in data,
            itemsLength: data.items?.length || 0,
            dataLength: data.data?.length || 0,
            keysInResponse: Object.keys(data)
          })

          // Check both possible structures
          const items = data.items || data.data || []

          console.log(`📡 [COLLECTION-ADDONS] Processed items: ${items.length} items`)
          console.log('📡 [COLLECTION-ADDONS] First item:', items[0])

          return {
            items,
            meta: {
              total: data.pagination?.total || data.meta?.total || undefined,
              page: data.pagination?.page || data.meta?.page || page,
              pageSize: data.pagination?.limit || data.meta?.limit || pageSize,
              hasNext: data.pagination?.hasNext || data.meta?.hasNext || undefined,
              hasPrev: data.pagination?.hasPrev || data.meta?.hasPrev || undefined
            }
          }
        } catch (error) {
          console.error('❌ [COLLECTION-ADDONS] API Error:', error)
          return {
            items: [],
            error: { message: error.message }
          }
        }
      }
    },

    transform: (user) => {
      if (!user || typeof user !== 'object') {
        return {
          id: 'error-' + Date.now() + Math.random(),
          name: 'Error: Invalid User',
          email: '',
          role: '',
          avatar: ''
        }
      }

      return {
        id: user.id || user._id || String(Math.random()),
        name: user.name || 'Unknown User',
        email: user.email || '',
        role: user.role || 'User',
        avatar: user.avatar || (user.name ? user.name[0] : '?'),
        original: user
      }
    },

    renderItem: {
      tag: 'div',
      className: 'mtrl-list-item user-item',
      attributes: { 'data-id': '{{id}}' },
      children: [
        {
          tag: 'div',
          className: 'user-avatar',
          textContent: '{{avatar}}'
        },
        {
          tag: 'div',
          className: 'user-details',
          children: [
            {
              tag: 'div',
              className: 'user-name',
              textContent: '{{name}}'
            },
            {
              tag: 'div',
              className: 'user-email',
              textContent: '{{email}}'
            },
            {
              tag: 'div',
              className: 'user-role',
              textContent: '{{role}}'
            }
          ]
        }
      ]
    },

    // List-specific configuration
    listStyle: {
      itemHeight: 'auto',
      gap: 2,
      padding: 8,
      hoverable: true,
      striped: true
    },

    selection: {
      enabled: true,
      multiple: true,
      clearable: true
    },

    performance: {
      recycleElements: true,
      bufferSize: 50,
      renderDebounce: 16
    },

    className: 'mtrl-collection-users',
    ariaLabel: 'User Directory',
    pageSize: 20,
    debug: true
  })

  // State tracking
  const isLoading = false

  // API methods that match current list interface
  const listAPI = {
    element: list.element,

    on: (event, callback) => {
      console.log(`📡 [COLLECTION-ADDONS] Event listener added: ${event}`)
      // Subscribe to list events and map to expected events
      list.subscribe((eventPayload) => {
        console.log('📡 [COLLECTION-ADDONS] Raw collection event:', eventPayload)

        // Map collection events to expected showcase events
        if (event === 'load') {
          // Handle both ITEMS_ADDED and LOADING_END events as 'load'
          if (eventPayload.type === 'items:added' || eventPayload.type === 'loading:end') {
            console.log(`📡 [COLLECTION-ADDONS] Mapping ${eventPayload.type} to load event:`, eventPayload.data)
            callback({
              items: eventPayload.data?.items || eventPayload.items,
              page: eventPayload.data?.page || eventPayload.page,
              hasMore: eventPayload.data?.hasMore || eventPayload.hasMore,
              type: 'load'
            })
          }
        } else if (event === 'error') {
          if (eventPayload.type === 'error:occurred') {
            console.log('📡 [COLLECTION-ADDONS] Mapping error event:', eventPayload.data)
            callback({ error: eventPayload.data?.error || eventPayload.error })
          }
        }
      })

      // Also subscribe to the raw event emitter for direct access
      try {
        if (list._collection && list._collection.emit) {
          // Subscribe to collection events directly
          list._collection.subscribe((data) => {
            console.log('📡 [COLLECTION-ADDONS] Direct collection event:', data)
            if (event === 'load' && data.items) {
              callback({ items: data.items, type: 'load' })
            }
          })
        }
      } catch (e) {
        console.log('📡 [COLLECTION-ADDONS] Could not subscribe to direct events:', e.message)
      }
    },

    loadNext: async () => {
      console.log('➡️ [COLLECTION-ADDONS] LoadNext called')
      const hasNext = list.hasNext()
      if (hasNext) {
        page++
        await list.scrollToPage(page)
      }
      return Promise.resolve({ hasNext, page })
    },

    getAllItems: () => {
      const items = list.getItems()
      console.log(`📊 [COLLECTION-ADDONS] GetAllItems called - ${items.length} items`)
      return items
    },

    getVisibleItems: () => {
      const items = list.getItems()
      console.log(`👁️ [COLLECTION-ADDONS] GetVisibleItems called - ${items.length} items`)
      return items // For now, all items are visible (virtual scrolling will change this)
    },

    isLoading: () => {
      return isLoading || list.isLoading()
    },

    hasNextPage: () => {
      return list.hasNext()
    },

    getSelectedItemIds: () => {
      return list.getSelectedIds()
    },

    // List-specific methods
    getMetrics: () => {
      return list.getMetrics()
    },

    getSelectedItems: () => {
      return list.getSelectedItems()
    },

    // Scroll animation control methods
    setScrollAnimation: (enabled) => {
      return list.setScrollAnimation(enabled)
    },

    getScrollAnimation: () => {
      return list.getScrollAnimation()
    },

    toggleScrollAnimation: () => {
      return list.toggleScrollAnimation()
    }
  }

  // Initial load
  console.log('🔄 [COLLECTION-ADDONS] Initial data load via list component')
  // Remove manual loading - let the collection system handle everything automatically
  // The collection will automatically load initial data and handle pagination

  console.log('!!! list', list)

  return list
}

/**
 * Creates a debug panel for monitoring collection state using layout system
 */
const createDebugPanel = (parent) => {
  // Create debug panel using layout system
  const debugPanel = createLayout([
    { layout: { type: 'grid', column: 1, gap: 2 } },
    ['div', 'header', { tag: 'h4', textContent: '🔧 mtrl-addons Collection State', class: 'mtrl-addons-debug__header' }],
    ['div', 'state', { id: 'collection-addons-state', class: 'mtrl-addons-debug__state', textContent: 'Waiting for collection implementation...' }]
  ], parent).component

  // Add debug panel class to container
  debugPanel.element.classList.add('mtrl-addons-debug')

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
      console.log(`📊 [COLLECTION-ADDONS] Render #${renderCount}`)
    },

    trackScroll: () => {
      scrollCount++
      console.log(`🔄 [COLLECTION-ADDONS] Scroll #${scrollCount}`)
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
const createCollectionAddonsComponent = (container) => {
  const title = 'List Component (Collection)'
  const description = 'mtrl-addons list component - built on collection system, template-driven, auto-recycling, multi-select'

  const layout = createLayout(
    createComponentSection({ title, description }),
    container
  ).component

  console.log('🚀 [COLLECTION-ADDONS] Initializing list component showcase')

  // Create the new list component (powered by collection system)
  const userList = createUserList(layout.showcase)
  const performanceMonitor = createPerformanceMonitor()

  // No global variables - use proper local references
  let animate = false
  let page = 1

  const pages = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '5', value: 5 },
    { label: '10', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: "1'000", value: 1000 },
    { label: "2'000", value: 2000 },
    { label: "3'000", value: 3000 }
  ]

  // Create controls (same as original list component)
  const info = createLayout([
    { layout: { type: 'grid', column: 1, gap: 4, dense: true, align: 'center' } },
    [createChips, 'pages', { scrollable: false, label: 'Scroll to' }],
    [createSlider, 'index', { label: 'Scroll to', min: 0, max: 1000000, page, step: 1, size: 'XS', variant: 'discrete' }],
    [{ layout: { type: 'row', column: 3, gap: 1 } },
      [createButton, 'prev', { icon: leftIcon, size: 'XS', variant: 'outlined' }],
      [createTextfield, 'page', { label: 'Page', density: 'compact', value: page, variant: 'outlined' }],
      [createButton, 'next', { icon: rightIcon, size: 'XS', variant: 'outlined' }]
    ],
    [{ layout: { type: 'row', column: 2, gap: 1 } },
      [createTextfield, 'itemId', { label: 'Item ID', density: 'compact', placeholder: 'e.g. user-123', variant: 'outlined' }],
      [createButton, 'scrollToItem', { label: 'Scroll to Item', size: 'XS', variant: 'outlined' }]
    ],
    [createSwitch, 'animate', { label: 'Animate scroll', checked: animate, class: 'switch--dense' }],
    [createButton, 'performance', { label: 'Show Performance Metrics', variant: 'outlined', size: 'XS' }]
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

  // Function to update debug panel
  const updateDebugPanel = () => {
    if (!debug || !debugPanel) return

    try {
      const stateElement = document.getElementById('collection-addons-state')
      if (!stateElement) return

      const allItems = userList.getAllItems()
      const visibleItems = userList.getVisibleItems()
      const isLoading = userList.isLoading()
      const hasNext = userList.hasNextPage()
      const selectedItems = userList.getSelectedItemIds()
      const listMetrics = userList.getMetrics ? userList.getMetrics() : {}
      const performanceMetrics = performanceMonitor.getMetrics()

      const stateHtml = `
        <div class="mtrl-addons-debug__content">
          <div class="mtrl-addons-debug__section-title">📊 Collection State</div>
          <div class="mtrl-addons-debug__section">
            <strong>Total Items:</strong> ${allItems.length}<br>
            <strong>Visible Items:</strong> ${visibleItems.length}<br>
            <strong>Loading:</strong> ${isLoading}<br>
            <strong>Has Next Page:</strong> ${hasNext}<br>
            <strong>Selected Items:</strong> ${selectedItems.length}<br>
          </div>
          
          <div class="mtrl-addons-debug__section-title">⚡ List Performance</div>
          <div class="mtrl-addons-debug__section">
            <strong>List Renders:</strong> ${listMetrics.renderCount || 0}<br>
            <strong>List Scrolls:</strong> ${listMetrics.scrollCount || 0}<br>
            <strong>Avg Render Time:</strong> ${(listMetrics.averageRenderTime || 0).toFixed(2)}ms<br>
            <strong>Avg Scroll Time:</strong> ${(listMetrics.averageScrollTime || 0).toFixed(2)}ms<br>
            <strong>Memory Usage:</strong> ${Math.round((listMetrics.memoryUsage || 0) / 1024 / 1024)}MB<br>
            <strong>Recycled Elements:</strong> ${listMetrics.recycledElements || 0}<br>
          </div>
          
          <div class="mtrl-addons-debug__section-title">🔧 System Info</div>
          <div class="mtrl-addons-debug__section">
            <strong>Engine:</strong> mtrl-addons List<br>
            <strong>Collection System:</strong> Built-in<br>
            <strong>Template Engine:</strong> Object (auto-recycling)<br>
            <strong>Selection:</strong> Multi-select enabled<br>
            <strong>Styling:</strong> Hoverable + Striped<br>
          </div>
          
          <div class="mtrl-addons-debug__section-title">📈 Showcase Metrics</div>
          <div class="mtrl-addons-debug__section">
            <strong>UI Renders:</strong> ${performanceMetrics.renderCount}<br>
            <strong>UI Scrolls:</strong> ${performanceMetrics.scrollCount}<br>
            <strong>Total Time:</strong> ${performanceMetrics.totalTime}ms<br>
            <strong>UI Avg Render:</strong> ${performanceMetrics.avgRenderTime.toFixed(2)}ms<br>
          </div>
        </div>
      `

      stateElement.innerHTML = stateHtml
    } catch (error) {
      console.error('❌ [COLLECTION-ADDONS] Error updating debug panel:', error)
    }
  }

  // Event handlers
  info.index.on('change', (event) => {
    console.log('🔄 [COLLECTION-ADDONS] Index change:', event.value, 'start', animate)
    performanceMonitor.trackScroll()
    userList.scrollToIndex(event.value, 'start', animate)
  })

  info.page.on('input', async (event) => {
    if (page === parseInt(event.value) || !event.value) return

    page = parseInt(event.value)
    console.log('📄 [COLLECTION-ADDONS] Page input:', page)

    performanceMonitor.trackScroll()
    await userList.scrollToPage(page, 'start', animate)
    updateDebugPanel()
  })

  info.pages.on('change', async (p) => {
    const value = parseInt(p[0], 10)
    console.log('📄 [COLLECTION-ADDONS] Pages chip selected:', value)

    performanceMonitor.trackScroll()
    await userList.scrollToPage(value, 'start', animate)
    info.page.setValue(value)
    updateDebugPanel()
  })

  info.prev.on('click', async () => {
    let currentPage = info.page.getValue()
    console.log('⬅️ [COLLECTION-ADDONS] Previous page:', currentPage)
    if (currentPage > 1) {
      currentPage--
      performanceMonitor.trackScroll()
      await userList.scrollToPage(currentPage, 'start', animate)
      info.page.setValue(currentPage)
    }
  })

  info.next.on('click', async () => {
    console.log('➡️ [COLLECTION-ADDONS] Next page:', page)

    page++
    await userList.scrollToPage(page, 'start', animate)
    info.page.setValue(page)
  })

  info.animate.on('change', (e) => {
    animate = e.checked
    userList.setScrollAnimation(e.checked)
    console.log('🎬 [COLLECTION-ADDONS] Animation toggled:', animate)
  })

  info.scrollToItem.on('click', () => {
    const itemId = info.itemId.getValue()
    if (itemId && itemId.trim()) {
      console.log('📍 [COLLECTION-ADDONS] ScrollToItem button clicked, item ID:', itemId)
      performanceMonitor.trackScroll()
      userList.scrollToItem(itemId.trim(), 'start', animate)
    } else {
      console.warn('📍 [COLLECTION-ADDONS] No item ID provided for scrollToItem')
      alert('Please enter an item ID first (e.g., if you see items like "User 123", try ID "123" or the actual ID from the API)')
    }
  })

  info.performance.on('click', () => {
    const metrics = performanceMonitor.getMetrics()
    console.log('📊 [COLLECTION-ADDONS] Performance Metrics:', metrics)

    // Show metrics in a simple alert for now
    alert(`Performance Metrics:
    
Renders: ${metrics.renderCount}
Scrolls: ${metrics.scrollCount}
Total Time: ${metrics.totalTime}ms
Avg Render Time: ${metrics.avgRenderTime.toFixed(2)}ms`)
  })

  // Event listeners for collection events
  userList.on('load', (event) => {
    console.log('📡 [COLLECTION-ADDONS] Collection loaded:', event)
    performanceMonitor.trackRender()
    updateDebugPanel()
  })

  userList.on('error', (event) => {
    console.error('❌ [COLLECTION-ADDONS] Collection error:', event.error)
  })

  // Initial debug panel update
  setTimeout(updateDebugPanel, 100)

  // Periodic debug panel updates
  const debugInterval = debug ? setInterval(updateDebugPanel, 1000) : null

  console.log('✅ [COLLECTION-ADDONS] List component showcase initialized successfully')

  return {
    layout,
    userList,
    performanceMonitor,
    cleanup: () => {
      if (debugInterval) {
        clearInterval(debugInterval)
      }
      console.log('🧹 [COLLECTION-ADDONS] List component cleanup completed')
    }
  }
}

const createListExample = (container, components) => {
  const info = {
    title: 'Lists',
    description: 'Lists are continuous, vertical indexes of text and images'
  }

  const layout = createLayout(
    createComponentsLayout(info),
    container
  ).component

  // createListComponent(layout.body)
  const collectionComponent = createCollectionAddonsComponent(layout.body)

  return {
    layout,
    collectionComponent
  }
}

// Initialize the component when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 [COLLECTION-ADDONS] DOM loaded, initializing collection component')

  // Hide loading indicator
  const loadingElement = document.querySelector('.loading')
  if (loadingElement) {
    loadingElement.style.display = 'none'
  }

  try {
    // Create the full collection component with all features using document.body
    const listComponent = createListExample(document.getElementById('content'))

    console.log('✅ [LIST-ADDONS] Collection component initialized successfully')
    console.log('🎯 [LIST-ADDONS] Component:', listComponent)

    // Store globally for debugging
    window.componentList = listComponent
  } catch (error) {
    console.error('❌ [LIST-ADDONS] Failed to initialize list component:', error)

    // Show error message
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: monospace;">
        <h2>❌ Error Loading List Component</h2>
        <p>Failed to initialize the mtrl-addons list component.</p>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Please check the console for more details.</p>
      </div>
    `
  }
})
