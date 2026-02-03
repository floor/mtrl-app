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
      itemSize: 84,
      overscan: 2
    },

    // Scrolling configuration
    scrolling: {
      orientation: 'vertical'
    },

    // Pagination configuration - switch to cursor strategy
    pagination: {
      strategy: 'cursor',
      limit: 10
    },

    // Collection configuration
    collection: {
      adapter: {
        read: async (params) => {
          try {
            const limit = params?.limit || 20

            // Log the incoming params to debug
            console.log('[Collection] Read called with params:', params)

            // Build URL based on cursor presence
            let url = '/api/users/cursor'
            const queryParams = new URLSearchParams()
            queryParams.append('limit', limit.toString())

            // Only add cursor if it exists and is not null
            if (params.cursor) {
              queryParams.append('cursor', params.cursor)
            }

            url = `${url}?${queryParams.toString()}`
            console.log('[Collection] Fetching from URL:', url)

            const response = await fetch(url)
            const data = await response.json()

            console.log('[Collection] Received response:', {
              itemCount: data.items?.length,
              meta: data.meta
            })

            // API returns { items: [], meta: { cursor, total, hasNext } }
            const items = data.items || []
            const meta = data.meta || {}

            return {
              items,
              meta: {
                total: meta.total,
                nextCursor: meta.cursor, // Map cursor to nextCursor for internal use
                hasNext: meta.hasNext,
                hasPrev: !!params.cursor
              }
            }
          } catch (error) {
            console.error('[Collection] Error loading data:', error)
            return {
              items: [],
              error: { message: error.message }
            }
          }
        }
      },
      // Add transform to handle the actual item structure
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
          id: user.id || user._id,
          name: user.name || 'Unknown User',
          email: user.email || '',
          role: user.role || 'User',
          avatar: user.avatar || (user.name ? user.name[0] : '?'),
          phone: user.phone || '',
          index: user.index,
          original: user
        }
      }
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
 * Main component creator - showcases the mtrl-addons list component
 */
const createListExampleComponent = (container) => {
  const title = 'VList Component Cursor Pagination Strategy (mtrl-addons)'
  const description = 'VList with cursor pagination provides infinite scrolling through large datasets using server-side cursors for efficient, sequential data loading.'

  const layout = createLayout(
    createComponentSection({ title, description }),
    container
  ).component

  console.log('🚀 [LIST-EXAMPLE] Initializing list component showcase')

  // Create the list component
  const userList = createUserList(layout.showcase)
  console.log('userList', userList)

  layout.info.innerHTML = `
<div class="cursor-pagination-description">
  <h3>VList Cursor Pagination Strategy</h3>
  <ul class="feature-list">
    <li>
      <strong>Cursor tokens</strong> - Each page returns an opaque cursor pointing to the next data segment
    </li>
    <li>
      <strong>Sequential navigation</strong> - Must load pages in order; can't jump directly to page 50 without loading 1-49
    </li>
    <li>
      <strong>Unknown totals</strong> - Perfect for real-time data where total count is expensive or constantly changing
    </li>
    <li>
      <strong>Stateless pagination</strong> - Server doesn't track client position; cursor contains all needed context
    </li>
    <li>
      <strong>Dynamic growth</strong> - Virtual scroll area expands with loaded content plus a buffer for smooth scrolling
    </li>
    <li>
      <strong>Progressive loading</strong> - Automatically fetches next page when approaching the end of loaded data
    </li>
    <li>
      <strong>Efficient for large datasets</strong> - No offset calculations; database can efficiently resume from cursor position
    </li>
  </ul>
</div>
  `

  return {
    layout,
    userList
  }
}
