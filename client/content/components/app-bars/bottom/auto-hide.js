// src/client/content/components/app-bars/bottom/auto-hide.js
import {
  createComponentSection
} from '../../../../layout'

import {
  addIcon,
  favoriteIcon,
  searchIcon,
  shareIcon
} from '../../../../icons'

import {
  createLayout, createElement,
  createBottomAppBar, createButton, createFab,
  FAB_VARIANTS
} from 'mtrl'

export const initAutoHideBottomAppBar = (container) => {
  const title = 'Auto-Hide on Scroll'
  const description = 'Auto-Hide on Scroll'

  const layout = createLayout(createComponentSection({
    title,
    description
  }), container).component

  // create showcase layout

  const showcase = createLayout([{},
    [createElement, 'componentContainer', {
      style: {
        position: 'relative',
        height: '500px',
        width: '320px',
        border: '1px solid var(--mtrl-sys-color-outline-variant)',
        borderRadius: '8px',
        background: 'var(--mtrl-sys-color-surface-bright)',
        overflow: 'hidden'
      }
    },
    [createElement, 'statusIndicator', {
      style: {
        display: 'none', // as it does not work properly yet
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'var(--mtrl-sys-color-surface-container-high)',
        border: '1px solid var(--mtrl-sys-color-outline-variant)',
        padding: '8px 12px',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '16px',
        boxShadow: 'var(--mtrl-sys-elevation-level1)',
        zIndex: '1'
      }
    }],
    [createElement, 'scrollContainer', {
      style: {
        height: '100%',
        overflowY: 'auto',
        padding: '16px'
      }
    }],
    [createBottomAppBar, 'bottomBar', {
      autoHide: true,
      transitionDuration: 300,
      onVisibilityChange: (visible) => {
        // Update status indicator
        const statusText = statusIndicator.querySelector('.status-text')
        statusText.textContent = visible ? 'Visible' : 'Hidden'
        statusText.style.color = visible
          ? 'var(--mtrl-sys-color-primary)'
          : 'var(--mtrl-sys-color-error)'
      }
    }]
    ]
  ], layout.showcase).component

  const { bottomBar, componentContainer, scrollContainer, statusIndicator } = showcase

  statusIndicator.innerHTML = 'Status: <span class="status-text">Visible</span>'

  // Add scrollable content
  const scrollContent = document.createElement('div')
  scrollContent.innerHTML = `
    <h3 style="margin-bottom: 16px;">Scroll down to see auto-hide behavior</h3>
    <p style="margin-bottom: 12px;">When you scroll down, the bottom app bar will hide automatically.</p>
    <p style="margin-bottom: 12px;">When you scroll back up, it will reappear.</p>
    <p style="margin-bottom: 12px;">This behavior optimizes screen space for content while keeping actions accessible when needed.</p>
    ${Array(20).fill('<p style="margin-bottom: 12px;">Scroll content...</p>').join('')}
    <p style="margin-bottom: 12px;">You've reached the bottom! Try scrolling back up.</p>
  `
  scrollContainer.appendChild(scrollContent)

  // Create action buttons
  const searchButton = createButton({
    icon: searchIcon,
    variant: 'icon',
    ariaLabel: 'Search'
  })

  const favoriteButton = createButton({
    icon: favoriteIcon,
    variant: 'icon',
    ariaLabel: 'Favorite'
  })

  const shareButton = createButton({
    icon: shareIcon,
    variant: 'icon',
    ariaLabel: 'Share'
  })

  // Create a FAB using the dedicated FAB component
  const fab = createFab({
    icon: addIcon,
    ariaLabel: 'Add new item',
    variant: FAB_VARIANTS.PRIMARY
  })

  // Add actions and FAB to the bottom bar
  bottomBar.addAction(searchButton.element)
  bottomBar.addAction(favoriteButton.element)
  bottomBar.addAction(shareButton.element)
  bottomBar.addFab(fab.element)

  // Add the bar to the demo container
  componentContainer.appendChild(bottomBar.element)

  // Initialize lifecycle
  bottomBar.lifecycle.mount()

  // Create a mock scroll event handler for the demo
  // This allows the bottom bar to respond to scrolling inside the container
  scrollContainer.addEventListener('scroll', () => {
    // Keep track of scroll position
    if (!scrollContainer._lastScrollTop) {
      scrollContainer._lastScrollTop = 0
    }

    const currentScrollTop = scrollContainer.scrollTop

    // Determine if scrolling down or up
    if (currentScrollTop > scrollContainer._lastScrollTop + 10) {
      // Scrolling down - hide
      bottomBar.hide()
    } else if (currentScrollTop < scrollContainer._lastScrollTop - 10) {
      // Scrolling up - show
      bottomBar.show()
    }

    // Save current position
    scrollContainer._lastScrollTop = currentScrollTop
  })

  // createInfo layout
  createLayout([
    [createElement,
      [createElement, { tag: 'p', text: 'This example demonstrates the auto-hide behavior of the bottom app bar during scrolling:' }],
      [createElement, { tag: 'ul' },
        [createElement, { tag: 'li', text: 'Scrolling <strong>down</strong> hides the bottom app bar to maximize content area.' }],
        [createElement, { tag: 'li', text: 'Scrolling <strong>up</strong> reveals the bottom app bar again.' }],
        [createElement, { tag: 'li', text: 'The transition between states is animated for a smooth user experience.' }]
      ],
      [createElement, { tag: 'p', text: 'This pattern is useful for content-heavy applications where maximizing screen space is important.' }]
    ]
  ], layout.info)
}
