// script-updated.js - Updated example using the new route adapter
// Shows how to use createCollection with createRouteAdapter

// Import required modules
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
  createVList,
  createCollection,
  createRouteAdapter
} from '../../../../dist/mtrl-addons/index.mjs'

// Initialize the component when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 [LIST-EXAMPLE] DOM loaded, initializing with new route adapter')
  
  const listComponent = createListExample(document.getElementById('content'))
  window.listExample = listComponent
})

const createListExample = (container) => {
  const info = {
    title: 'VList with Route Adapter',
    description: 'Virtual list using the new collection system with route adapter'
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

// Layout functions (same as before)
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
      [{ tag: 'p', id: 'decription', className: 'components__description', text: 'mtrl-addons with new collection system' }]
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

/**
 * Creates a user list using the new collection system
 */
const createUserList = (parent) => {
  console.log('🚀 [LIST-EXAMPLE] Creating list with new route adapter')

  // Step 1: Create route adapter
  const routeAdapter = createRouteAdapter({
    base: '/api',
    endpoints: { list: '/users' },
    pagination: { 
      strategy: 'page',
      limitSize: 20 
    },
    cache: true, // Enable caching
    onError: (error) => {
      console.error('❌ [Route Adapter] Error:', error)
    }
  })

  // Step 2: Create collection with route adapter
  const collection = createCollection({
    adapter: routeAdapter,
    pageSize: 20,
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
    }
  })

  // Step 3: Create VList with the collection
  const list = createVList({
    parent,
    
    // Pass the collection instead of adapter
    collection,

    scroll: {
      animation: false,
      measureItems: false
    },

    scrollbar: {
      enabled: true
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

    class: 'mtrl-list--users',
    ariaLabel: 'User Directory',
    debug: true,

    // Template for rendering items
    renderItem: {
      tag: 'div',
      className: 'list-item user-item',
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
              textContent: '{{name}} ({{index}})'
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

  // Step 4: Subscribe to collection events
  collection.on('items:added', (event) => {
    console.log('📦 [Collection] Items added:', event.items.length)
  })

  collection.on('loading:start', () => {
    console.log('⏳ [Collection] Loading started')
  })

  collection.on('loading:complete', () => {
    console.log('✅ [Collection] Loading complete')
  })

  collection.on('error', (event) => {
    console.error('❌ [Collection] Error:', event.error)
  })

  return { list, collection, adapter: routeAdapter }
}

/**
 * Main component creator
 */
const createListExampleComponent = (container) => {
  const title = 'VList with New Collection System'
  const description = 'Using createCollection with createRouteAdapter for modern data management'

  const layout = createLayout(
    createComponentSection({ title, description }),
    container
  ).component

  // Create the list component
  const { list: userList, collection, adapter } = createUserList(layout.showcase)

  // Create controls (same as before)
  let animate = false
  let page = 1

  const pages = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '5', value: 5 },
    { label: '10', value: 10 }
  ]

  const info = createLayout([
    { layout: { type: 'grid', column: 1, gap: 4, dense: true, align: 'center' } },
    [createChips, 'pages', { scrollable: false, label: 'Go to Page' }],
    [createSlider, 'index', { label: 'Scroll to Index', min: 0, max: 1000, value: 0, step: 1, size: 'XS', variant: 'discrete' }],
    [{ layout: { type: 'row', column: 3, gap: 1 } },
      [createButton, 'prev', { icon: leftIcon, size: 'XS', variant: 'outlined' }],
      [createTextfield, 'page', { label: 'Page', density: 'compact', value: page, variant: 'outlined' }],
      [createButton, 'next', { icon: rightIcon, size: 'XS', variant: 'outlined' }]
    ],
    [createSwitch, 'animate', { label: 'Animate scroll', checked: animate, class: 'switch--dense' }],
    [createButton, 'refresh', { text: 'Refresh Data', size: 'S', variant: 'filled' }],
    [createButton, 'clear', { text: 'Clear Cache', size: 'S', variant: 'outlined' }]
  ], layout.info).component

  // Add pages chips
  pages.forEach(({ label, value }) => {
    info.pages.addChip({
      text: label,
      value,
      variant: 'filter',
      selectable: true,
      selected: value === page
    })
  })

  // Event handlers using the collection
  info.pages.on('change', async (selected) => {
    const value = parseInt(selected[0], 10)
    console.log('📄 [LIST-EXAMPLE] Loading page:', value)
    
    // Use collection's loadPage method
    await collection.loadPage(value)
    info.page.setValue(value)
    page = value
  })

  info.page.on('input', async (event) => {
    const newPage = parseInt(event.value)
    if (!newPage || newPage === page) return
    
    console.log('📄 [LIST-EXAMPLE] Loading page via input:', newPage)
    await collection.loadPage(newPage)
    page = newPage
  })

  info.prev.on('click', async () => {
    if (page > 1) {
      page--
      console.log('⬅️ [LIST-EXAMPLE] Previous page:', page)
      await collection.loadPage(page)
      info.page.setValue(page)
    }
  })

  info.next.on('click', async () => {
    page++
    console.log('➡️ [LIST-EXAMPLE] Next page:', page)
    await collection.loadPage(page)
    info.page.setValue(page)
  })

  info.index.on('change', (event) => {
    console.log('🔄 [LIST-EXAMPLE] Scroll to index:', event.value)
    userList.scrollToIndex(event.value, 'start')
  })

  info.animate.on('change', (e) => {
    animate = e.checked
    userList.setScrollAnimation(e.checked)
    console.log('🎬 [LIST-EXAMPLE] Animation toggled:', animate)
  })

  info.refresh.on('click', async () => {
    console.log('🔄 [LIST-EXAMPLE] Refreshing data')
    await collection.refresh()
  })

  info.clear.on('click', () => {
    console.log('🧹 [LIST-EXAMPLE] Clearing cache and disconnecting')
    // Disconnect adapter to clear cache
    if (adapter.disconnect) {
      adapter.disconnect()
    }
  })

  // Initial load
  console.log('🚀 [LIST-EXAMPLE] Initial load')
  collection.loadPage(1)

  return {
    layout,
    userList,
    collection,
    adapter,
    cleanup: () => {
      console.log('🧹 [LIST-EXAMPLE] Cleanup')
      collection.destroy()
      if (adapter.disconnect) {
        adapter.disconnect()
      }
    }
  }
} 