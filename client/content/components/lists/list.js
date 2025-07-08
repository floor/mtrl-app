// client/content/components/lists/list.js
import { createComponentSection } from '../../../layout'
import {
  createButton,
  createList,
  createChips,
  createSlider,
  createTextfield,
  createSwitch
  // createSnackbar
} from 'mtrl'

import { rightIcon, leftIcon } from '../../../icons'

import { createLayout } from 'mtrl-addons'
const strategy = ''
const debug = false

const createUserList = (parent) => {
  // Create the API-connected list
  const userList = createList({
    collection: 'users', // This should create a '/api/users' endpoint
    baseUrl: '/api', // Relative URL - automatically converted to full URL
    class: 'list--users',
    // itemHeight: 84,
    multiSelect: true,
    // pageSize: 20,
    scrollStrategy: 'scroll',
    parent,
    pagination: {
      strategy: 'offset' // Specify pagination strategy
      // limitSize: 20 // Items per page (default: 20)
    },

    // Configure adapter to properly handle the response
    adapter: {
      parseResponse: (response) => {
        // Safely extract data and pagination info with fallbacks
        const items = response?.data || []
        // const pagination = response?.pagination || {}

        return {
          items
          // meta: {
          //   cursor: pagination.hasNext ? String(pagination.page + 1) : null,
          //   hasNext: Boolean(pagination.hasNext)
          // }
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
    renderItem: (user, index, recycledElement) => {
      // console.log('Rendering user item:', user, 'at index:', index, recycledElement)

      if (recycledElement) {
        // Just update the content rather than creating new elements
        const avatar = recycledElement.querySelector('.user-avatar')
        const name = recycledElement.querySelector('.user-name')
        const email = recycledElement.querySelector('.user-email')
        const role = recycledElement.querySelector('.user-role')

        // Update text content (faster than innerHTML)
        avatar.textContent = user.avatar || user.headline?.charAt(0) || '?'
        name.textContent = `${user.headline}  (${user.id})` || 'Unknown'
        email.textContent = user.supportingText || ''
        role.textContent = user.meta || ''

        // Add element type for recycling system
        recycledElement.dataset.itemType = 'users'

        return recycledElement
      }

      const element = document.createElement('div')
      element.className = 'mtrl-list-item user-item'
      element.setAttribute('data-id', user.id)
      element.innerHTML = `
        <div class="user-avatar">${user.avatar || user.headline?.charAt(0) || '?'}</div>
        <div class="user-details">
          <div class="user-name">${user.headline || 'Unknown'} (${user.id})</div>
          <div class="user-email">${user.supportingText || ''}</div>
          <div class="user-role">${user.meta || ''}</div>
        </div>
      `
      return element
    }
  })

  return userList
}

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

export const createListComponent = (container) => {
  const title = 'List Component'
  const description = "with 100'000 entries and auto-detected height"
  const layout = createLayout(
    createComponentSection({ title, description }),
    container
  ).component

  const userList = createUserList(layout.showcase)

  // SELECTION DEBUGGING: Add detailed logging to track selection issues
  let renderHookCallCount = 0
  let clickEventCount = 0

  let animate = true

  // // Create a custom render hook to log selection application
  // const originalSetRenderHook = userList.list?.setRenderHook
  // if (originalSetRenderHook && typeof originalSetRenderHook === 'function') {
  //   // Wrap the render hook to add debugging
  //   const debugRenderHook = (originalHook) => (item, element) => {
  //     renderHookCallCount++
  //     // console.log(`🎨 RENDER HOOK #${renderHookCallCount}:`, {
  //     //   itemId: item.id,
  //     //   itemHeadline: item.headline,
  //     //   elementDataId: element.getAttribute('data-id'),
  //     //   hasSelectedClass: element.classList.contains(
  //     //     'mtrl-list-item--selected'
  //     //   ),
  //     //   isSelected: userList.isItemSelected
  //     //     ? userList.isItemSelected(item.id)
  //     //     : 'N/A',
  //     //   timestamp: new Date().toLocaleTimeString()
  //     // })

  //     // Call the original hook
  //     if (originalHook) {
  //       originalHook(item, element)
  //     }

  //     // Log after hook is applied
  //     // console.log(`🎨 RENDER HOOK AFTER #${renderHookCallCount}:`, {
  //     //   itemId: item.id,
  //     //   hasSelectedClass: element.classList.contains(
  //     //     'mtrl-list-item--selected'
  //     //   ),
  //     //   isSelected: userList.isItemSelected
  //     //     ? userList.isItemSelected(item.id)
  //     //     : 'N/A'
  //     // })
  //   }

  //   // Override setRenderHook to wrap any hooks that get set
  //   userList.list.setRenderHook = (hookFn) => {
  //     // console.log('🔧 SETTING RENDER HOOK:', typeof hookFn)
  //     originalSetRenderHook(debugRenderHook(hookFn))
  //   }
  // } else {
  //   //  console.warn('❌ setRenderHook not available on userList.list')
  // }

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

  const info = createLayout([
    { layout: { type: 'grid', column: 1, gap: 4, dense: true, align: 'center' } },
    [createChips, 'pages', { scrollable: false, label: 'Jump to page' }],
    [createSlider, 'index', { label: 'Jump to index', min: 0, max: 100000, page, step: 1, size: 'XS', variant: 'discrete' }],
    [
      { layout: { type: 'row', column: 3, gap: 1 } },
      [createButton, 'prev', { icon: leftIcon, size: 'XS', variant: 'outlined' }],
      [createTextfield, 'page', { label: 'Page', density: 'compact', value: page, variant: 'outlined' }],
      [createButton, 'next', { icon: rightIcon, size: 'XS', variant: 'outlined' }]
    ],
    [createSwitch, 'animate', { label: 'Animate scroll', checked: animate, class: 'switch--dense' }]
  ], layout.info).component

  // const debugPanel = createDebugPanel(layout.info)

  // Add pages chips
  pages.forEach(({ label, value }) => {
    info.pages.addChip({
      text: label.toLowerCase(),
      value,
      variant: 'filter',
      selectable: true,
      selected: label.toLowerCase() === page
    })
  })

  info.index.on('change', (event) => {
    console.log('change', event.value)
    userList.scrollToIndex(event.value, 'start', animate)
  })

  info.page.on('input', async (event) => {
    if (page === parseInt(event.value) || !event.value) return

    page = parseInt(event.value)

    console.log('page on input', page, event.value)

    await userList.scrollTo(page, 'start', animate)
    updateDebugPanel() // Update immediately after navigation
  })

  info.pages.on('change', async (p) => {
    const value = parseInt(p[0], 10)

    console.log('[LIST-SHOWCASE] ScrollTo', value)

    await userList.scrollTo(value, 'start', animate)
    info.page.setValue(value)
    updateDebugPanel() // Update immediately after navigation
  })

  // Function to update debug panel
  const updateDebugPanel = () => {
    return
    try {
      const stateElement = document.getElementById('collection-state')
      if (!stateElement) {
        console.warn('Debug panel element not found')
        return
      }

      const allItems = userList.getAllItems()
      const visibleItems = userList.getVisibleItems()
      const isLoading = userList.isLoading()
      const hasNext = userList.hasNextPage()

      const selectedItems = userList.getSelectedItemIds()
      const selectedInVisible = visibleItems.filter((item) =>
        selectedItems.includes(item.id)
      )

      const currentPage = userList

      // Get scroll position from the list container
      const scrollTop = userList.element.scrollTop || 0

      const stateHtml = `
        <div style="line-height: 1.5;">
          <strong>Total Items in State:</strong> ${allItems.length}<br>
          <strong>Visible Items:</strong> ${currentPage}<br>
          <strong>Visible Items:</strong> ${visibleItems.length}<br>
          <strong>Loading:</strong> ${isLoading}<br>
          <strong>Has Next Page:</strong> ${hasNext}<br>
          <strong>First Item ID:</strong> ${allItems[0]?.id || 'N/A'}<br>
          <strong>Last Item ID:</strong> ${allItems[allItems.length - 1]?.id || 'N/A'}<br>
          <strong>Visible Range:</strong> ${visibleItems[0]?.id || 'N/A'} - ${visibleItems[visibleItems.length - 1]?.id || 'N/A'}<br>
          <strong>First Visible Headline:</strong> ${visibleItems[0]?.headline || 'N/A'}<br>
          <strong style="color: #ff9800;">Scroll Position:</strong> ${scrollTop.toLocaleString()}px<br>
          <strong>DOM Children:</strong> ${userList.element.querySelectorAll('.mtrl-list-item').length}<br>
          <strong style="color: #e91e63;">Selected Total:</strong> ${selectedItems.length}<br>
          <strong style="color: #e91e63;">Selected IDs:</strong> ${selectedItems.join(', ') || 'None'}<br>
          <strong style="color: #e91e63;">Selected in Visible:</strong> ${selectedInVisible.length}<br>
          <strong style="color: #e91e63;">Selected DOM Elements:</strong> ${userList.element.querySelectorAll('.mtrl-list-item--selected').length}<br>
          <strong style="color: #2196f3;">Render Hook Calls:</strong> ${renderHookCallCount}<br>
          <strong style="color: #2196f3;">Click Events:</strong> ${clickEventCount}
        </div>
      `

      stateElement.innerHTML = stateHtml
    } catch (error) {
      console.error('Error updating debug panel:', error)
    }
  }

  // Update debug panel periodically
  // const debugInterval = setInterval(updateDebugPanel, 500)

  // Initial update after a short delay to ensure everything is mounted
  setTimeout(updateDebugPanel, 100)

  info.prev.on('click', async () => {
    let currentPage = info.page.getValue()
    console.log('prev', currentPage)
    if (currentPage > 1) {
      console.log('currentPage', currentPage)
      currentPage--
      userList.scrollTo(currentPage, 'start', animate)
      info.page.setValue(currentPage)
    }
  })

  info.next.on('click', async () => {
    let currentPage = info.page.getValue()
    const result = await userList.loadNext()
    console.log('currentPage', currentPage)
    if (result.hasNext) {
      currentPage++
      userList.scrollTo(currentPage, 'start', animate)
      // Update page number - estimate based on current state
      info.page.setValue(currentPage)
    }
  })

  info.animate.on('change', (e) => {
    animate = e.checked
  })

  // Event listeners
  userList.on('load', (event) => {
    // Update current page indicator if we have page info
    if (event.page) {
      info.page.setValue(event.page)
    }

    // Check if any items were added to the DOM
    const items = userList.element.querySelectorAll('.mtrl-list-item')
    // console.log('DOM items after load:', items.length)

    // Log heights of visible items
    Array.from(items).forEach((item) => {
      // console.log('Item height:', item.offsetHeight, item)
    })

    // Reset counters after page load to track new page activity

    renderHookCallCount = 0
    clickEventCount = 0
  })

  // Error handling
  userList.on('error', (event) => {
    console.error('List error:', event.error)
  })

  return {
    layout,
    userList,
    cleanup: () => {
      clearInterval(debugInterval)
    }
  }
}
