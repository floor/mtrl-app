// client/content/components/lists/users.js
import {
  createComponentsSectionLayout
} from '../../../layout'
import {
  createLayout,
  createList
} from 'mtrl'

export const initCursorList = (container) => {
  const title = 'API Users List'
  const description = '1\'000\'000 entries and virtualization with cursor pagination strategy'
  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component
  console.log('Creating users list...')

  // Create the API-connected list
  const userList = createList({
    collection: 'users/cursor', // This should create a '/api/users' endpoint
    baseUrl: '/api', // Using relative URL - our fixed adapter will handle this properly
    class: 'list--users',
    dynamicItemSize: true,
    // itemHeight: 84,
    pageSize: 10,
    scrollStrategy: 'hybrid',
    pagination: {
      strategy: 'cursor', // Specify cursor strategy
      cursorParamName: 'cursor', // Parameter name for cursor (default)
      limitParamName: 'limit', // Parameter name for limit (default)
      defaultPageSize: 25 // Items per page (default: 20)
    },

    // Configure adapter to properly handle the response
    adapter: {
      parseResponse: (response) => {
        // Safely extract data and pagination info with fallbacks
        const items = response?.data || []
        const pagination = response?.pagination || {}

        return {
          items,
          meta: {
            cursor: pagination.hasNext ? String(pagination.page + 1) : null,
            hasNext: Boolean(pagination.hasNext)
          }
        }
      }
    },

    // Transform function for individual items - this gets called for each item
    transform: (user) => {
      // Make sure we have a valid user object
      if (!user || typeof user !== 'object') {
        console.error('Invalid user object received in transform:', user)
        return {
          id: 'error-' + Date.now() + Math.random(),
          headline: 'Error: Invalid User',
          supportingText: '',
          meta: ''
        }
      }

      // console.log('Transforming individual user:', user)

      // Transform an individual user into the required format
      return {
        id: user.id || user._id || String(Math.random()),
        headline: user.name || 'Unknown User',
        supportingText: user.email || '',
        meta: user.role || '',
        avatar: user.avatar || '',
        // Keep original data accessible
        original: user
      }
    },

    // Render function to display each item
    renderItem: (user, index) => {
      // console.log('Rendering user item:', user, 'at index:', index)
      const element = document.createElement('div')
      element.className = 'mtrl-list-item user-item'
      element.setAttribute('data-id', user.id)
      element.innerHTML = `
        <div class="user-avatar">${user.avatar || user.headline?.charAt(0) || '?'}</div>
        <div class="user-details">
          <div class="user-name">${user.headline || 'Unknown'}</div>
          <div class="user-email">${user.supportingText || ''}</div>
          <div class="user-role">${user.meta || ''}</div>
        </div>
      `
      return element
    }
  })

  // Event listeners
  userList.on('load', (event) => {
    console.log('List loaded:', event)

    // Check if any items were added to the DOM
    const items = userList.element.querySelectorAll('.mtrl-list-item')
    console.log('DOM items after load:', items.length)

    // Log heights of visible items
    Array.from(items).forEach((item) => {
      console.log('Item height:', item.offsetHeight, item)
    })
  })

  userList.on('select', (event) => {
    console.log('Selected user:', event.item)
  })

  // Error handling
  userList.on('error', (event) => {
    console.error('List error:', event.error)
  })

  layout.showcase.appendChild(userList.element)
  console.log('User list appended to layout')

  return {
    layout,
    userList
  }
}
