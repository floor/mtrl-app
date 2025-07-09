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

import {
  createLayout,
  createList  // Fixed: Use createList as requested
} from '../../../../dist/mtrl-addons/index.mjs'

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
const debug = true

/**
 * Creates a user list using createList from mtrl-addons
 */
const createUserList = (parent) => {
  console.log('🚀 [LIST-EXAMPLE] Creating list component')

  // Create the list component using createList
  const list = createList({
    container: parent,
    
    scroll: {
      animation: false
    },
    
    collection: {
      limit: 20,
      strategy: 'page'
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

    className: 'mtrl-list-users',
    ariaLabel: 'User Directory',
    debug: true,

    adapter: {
      read: async (params) => {
        try {
          const page = params?.page || 1
          const limit = params?.limit || 20
          const url = `/api/users?page=${page}&limit=${limit}`
          console.log(`🌐 [LIST-EXAMPLE] Fetching: ${url}`)

          const response = await fetch(url)
          const data = await response.json()

          console.log('📦 [LIST-EXAMPLE] Raw API response:', data)
          console.log('📦 [LIST-EXAMPLE] API structure check:', {
            hasItems: 'items' in data,
            hasData: 'data' in data,
            itemsLength: data.items?.length || 0,
            dataLength: data.data?.length || 0,
            keysInResponse: Object.keys(data)
          })

          // Use the correct structure - API returns { items: [...], meta: {...} }
          const items = data.items || []
          const meta = data.meta || {}

          console.log(`📡 [LIST-EXAMPLE] Processed items: ${items.length} items`)
          console.log('📡 [LIST-EXAMPLE] First item:', items[0])
          console.log('📡 [LIST-EXAMPLE] Meta data:', meta)

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
          console.error('❌ [LIST-EXAMPLE] API Error:', error)
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
    }
  })

  console.log('🔄 [LIST-EXAMPLE] List component created:', list)

  return list
}

/**
 * Creates a debug panel for monitoring collection state using layout system
 */
const createDebugPanel = (parent) => {
  // Create debug panel using layout system
  const debugPanel = createLayout([
    { layout: { type: 'grid', column: 1, gap: 2 } },
    ['div', 'header', { tag: 'h4', textContent: '🔧 mtrl-addons List State', class: 'mtrl-addons-debug__header' }],
    ['div', 'state', { id: 'list-example-state', class: 'mtrl-addons-debug__state', textContent: 'Waiting for list...' }]
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
      console.log(`📊 [LIST-EXAMPLE] Render #${renderCount}`)
    },

    trackScroll: () => {
      scrollCount++
      console.log(`🔄 [LIST-EXAMPLE] Scroll #${scrollCount}`)
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
  const title = 'List Component (mtrl-addons)'
  const description = 'mtrl-addons list component - collection-powered, template-driven, auto-recycling'

  const layout = createLayout(
    createComponentSection({ title, description }),
    container
  ).component

  console.log('🚀 [LIST-EXAMPLE] Initializing list component showcase')

  // Create the list component
  const userList = createUserList(layout.showcase)
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
    { label: "2'000", value: 2000 },
    { label: "3'000", value: 3000 }
  ]

  // Create controls
  const info = createLayout([
    { layout: { type: 'grid', column: 1, gap: 4, dense: true, align: 'center' } },
    [createChips, 'pages', { scrollable: false, label: 'Scroll to' }],
    [createSlider, 'index', { label: 'Scroll to', min: 0, max: 1000000, page, step: 1, size: 'XS', variant: 'discrete' }],
    [{ layout: { type: 'row', column: 3, gap: 1 } },
      [createButton, 'prev', { icon: leftIcon, size: 'XS', variant: 'outlined' }],
      [createTextfield, 'page', { label: 'Page', density: 'compact', value: page, variant: 'outlined' }],
      [createButton, 'next', { icon: rightIcon, size: 'XS', variant: 'outlined' }]
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
      const stateElement = document.getElementById('list-example-state')
      if (!stateElement) return

      const allItems = userList.getItems()
      const visibleItems = userList.getVisibleItems()
      const isLoading = userList.isLoading()
      const hasNext = userList.hasNext()
      const selectedItems = userList.getSelectedIds()
      const performanceMetrics = performanceMonitor.getMetrics()

      const stateHtml = `
        <div class="mtrl-addons-debug__content">
          <div class="mtrl-addons-debug__section-title">📊 List State</div>
          <div class="mtrl-addons-debug__section">
            <strong>Total Items:</strong> ${allItems.length}<br>
            <strong>Visible Items:</strong> ${visibleItems.length}<br>
            <strong>Loading:</strong> ${isLoading}<br>
            <strong>Has Next:</strong> ${hasNext}<br>
            <strong>Selected:</strong> ${selectedItems.length}<br>
          </div>
          
          <div class="mtrl-addons-debug__section-title">🔧 System Info</div>
          <div class="mtrl-addons-debug__section">
            <strong>Engine:</strong> mtrl-addons List<br>
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
    userList.scrollToPage(page, 'start')  // Fixed: Use correct parameter count
    updateDebugPanel()
  })

  info.pages.on('change', async (p) => {
    const value = parseInt(p[0], 10)
    console.log('📄 [LIST-EXAMPLE] Pages chip selected:', value)

    performanceMonitor.trackScroll()
    userList.scrollToPage(value, 'start')  // Fixed: Use correct parameter count
    info.page.setValue(value)
    updateDebugPanel()
  })

  info.prev.on('click', async () => {
    let currentPage = info.page.getValue()
    console.log('⬅️ [LIST-EXAMPLE] Previous page:', currentPage)
    if (currentPage > 1) {
      currentPage--
      performanceMonitor.trackScroll()
      userList.scrollToPage(currentPage, 'start')  // Fixed: Use correct parameter count
      info.page.setValue(currentPage)
    }
  })

  info.next.on('click', async () => {
    console.log('➡️ [LIST-EXAMPLE] Next page:', page)

    page++
    userList.scrollToPage(page, 'start')  // Fixed: Use correct parameter count
    info.page.setValue(page)
  })

  info.animate.on('change', (e) => {
    animate = e.checked
    userList.setScrollAnimation(e.checked)
    console.log('🎬 [LIST-EXAMPLE] Animation toggled:', animate)
  })

  info.performance.on('click', () => {
    const metrics = performanceMonitor.getMetrics()
    console.log('📊 [LIST-EXAMPLE] Performance Metrics:', metrics)

    // Show metrics in a simple alert for now
    alert(`Performance Metrics:
    
Renders: ${metrics.renderCount}
Scrolls: ${metrics.scrollCount}
Total Time: ${metrics.totalTime}ms
Avg Render Time: ${metrics.avgRenderTime.toFixed(2)}ms`)
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

  // Initial debug panel update
  setTimeout(updateDebugPanel, 100)

  // Periodic debug panel updates
  const debugInterval = debug ? setInterval(updateDebugPanel, 1000) : null

  console.log('✅ [LIST-EXAMPLE] List component showcase initialized successfully')

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

// Initialize the component when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 [LIST-EXAMPLE] DOM loaded, initializing list component example')

  // Hide loading indicator
  const loadingElement = document.querySelector('.loading')
  if (loadingElement) {
    loadingElement.style.display = 'none'
  }

  try {
    // Create the full list component example using document.body
    const listComponent = createListExample(document.getElementById('content'))

    console.log('✅ [LIST-EXAMPLE] List component example initialized successfully')
    console.log('🎯 [LIST-EXAMPLE] Component:', listComponent)

    // Store globally for debugging
    window.listExample = listComponent
  } catch (error) {
    console.error('❌ [LIST-EXAMPLE] Failed to initialize list component example:', error)

    // Show error message
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: monospace;">
        <h2>❌ Error Loading List Component Example</h2>
        <p>Failed to initialize the mtrl-addons list component example.</p>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Please check the console for more details.</p>
      </div>
    `
  }
})
