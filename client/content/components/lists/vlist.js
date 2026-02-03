import { createComponentSection } from '../../../layout'
import {
  createButton,
  createIconButton,
  createChips,
  createSlider,
  createTextfield,
  createSwitch
} from 'mtrl'

import { rightIcon, leftIcon } from '../../../icons'

// Import the new collection system and VList component
import {
  createLayout,
  createVList
} from 'mtrl-addons'

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

  // Create the VList component (powered by collection system)
  const list = createVList({
    container: parent,
    className: 'list--users',
    ariaLabel: 'User Directory',
    debug: true,

    // Virtual scrolling configuration
    virtual: {
      itemSize: 84, // will be automatically calculated based on the first loaded range
      overscan: 2
    },

    // Scrolling configuration
    scrolling: {
      orientation: 'vertical'
    },

    // Pagination configuration
    pagination: {
      strategy: 'page',
      limit: 10 // Items per page
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
      // mode: 'multiple',
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
  // State tracking
  let page = 1

  // API methods that match current list interface
  const listAPI = {
    element: list.element,

    on: (event, callback) => {
      console.log(`📡 [COLLECTION-ADDONS] Event listener added: ${event}`)
      // VList uses standard event emitter pattern
      list.on(event, callback)
    },

    loadNext: async () => {
      console.log('➡️ [COLLECTION-ADDONS] LoadNext called')
      // VList doesn't have loadNext, use loadRange instead
      const currentPage = page
      page++
      await list.loadRange(page, 20, 'page')
      return Promise.resolve({ hasNext: true, page })
    },

    getAllItems: () => {
      const items = list.getItems()
      console.log(`📊 [COLLECTION-ADDONS] GetAllItems called - ${items.length} items`)
      return items
    },

    getVisibleItems: () => {
      // VList has getVisibleRange
      const range = list.getVisibleRange()
      const items = []
      for (let i = range.start; i <= range.end; i++) {
        const item = list.getItem(i)
        if (item) items.push(item)
      }
      console.log(`👁️ [COLLECTION-ADDONS] GetVisibleItems called - ${items.length} items`)
      return items
    },

    isLoading: () => {
      return list.isLoading()
    },

    hasNextPage: () => {
      // VList doesn't expose this directly
      return true
    },

    getSelectedItemIds: () => {
      return list.getSelectedIds()
    },

    // VList-specific methods
    getMetrics: () => {
      return list.getMetrics ? list.getMetrics() : {}
    },

    getSelectedItems: () => {
      return list.getSelectedItems()
    },

    // Scroll animation control methods
    setScrollAnimation: (enabled) => {
      // VList doesn't have this method
      console.log('📡 [COLLECTION-ADDONS] setScrollAnimation not available in VList')
    },

    getScrollAnimation: () => {
      // VList doesn't have this method
      return false
    },

    toggleScrollAnimation: () => {
      // VList doesn't have this method
      console.log('📡 [COLLECTION-ADDONS] toggleScrollAnimation not available in VList')
    }
  }

  // Initial load
  console.log('🔄 [COLLECTION-ADDONS] Initial data load via list component')
  // Remove manual loading - let the collection system handle everything automatically
  // The collection will automatically load initial data and handle pagination

  console.log('!!! list', list)

  // Add scrollToPage method for compatibility
  list.scrollToPage = async function (pageNum, alignment = 'start', animate = false) {
    console.log(`📄 [COLLECTION-ADDONS] scrollToPage(${pageNum}) called`)
    // Use loadRange with page strategy
    await this.loadRange(pageNum, 20, 'page', alignment)
  }

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
export const createVlistComponent = (container) => {
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
      [createIconButton, 'prev', { icon: leftIcon, size: 'XS', variant: 'outlined' }],
      [createTextfield, 'page', { label: 'Page', density: 'compact', value: page, variant: 'outlined' }],
      [createIconButton, 'next', { icon: rightIcon, size: 'XS', variant: 'outlined' }]
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
    let page = info.page.getValue()
    console.log('⬅️ [COLLECTION-ADDONS] Previous page:', page)
    if (page > 1) {
      page--
      performanceMonitor.trackScroll()
      await userList.scrollToPage(page, 'start', animate)
      info.page.setValue(page)
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
