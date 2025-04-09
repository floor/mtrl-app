// src/client/lists.js

import {
  createElement,
  fList,
  fButton
} from 'mtrl'

import { createListManager, transforms } from 'mtrl/src/core/collection/list-manager'

// const STAR_ICON = `
// <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//   <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
// </svg>`

const HEADPHONE_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
</svg>`

const createNavigation = (container, { hasNext, hasPrev, onNext, onPrev, loading }) => {
  const wrapper = createElement({
    tag: 'div',
    className: 'mtrl-content__navigation'
  })

  const prevButton = fButton({
    text: '← Previous',
    variant: 'outlined',
    disabled: !hasPrev || loading,
    onclick: onPrev
  })
  wrapper.appendChild(prevButton.element)

  const loadingSpan = createElement({
    tag: 'span',
    className: 'mtrl-content__loading',
    text: loading ? 'Loading...' : ''
  })
  wrapper.appendChild(loadingSpan)

  const nextButton = fButton({
    text: 'Next →',
    variant: 'outlined',
    disabled: !hasNext || loading,
    onclick: onNext
  })
  wrapper.appendChild(nextButton.element)

  container.appendChild(wrapper)
  return wrapper
}

export const createListsLayout = (components) => {
  return [
    [createElement, { class: 'mtrl-content__container' },
      // Header
      [createElement, 'header', { class: 'mtrl-content__header' },
        [createElement, 'h1', { class: 'mtrl-content__title', content: 'Radio Lists' }]
      ],

      // Tracks Section
      [createElement, 'section', { class: 'mtrl-content__section' },
        [createElement, 'h2', { class: 'mtrl-content__section-title', content: 'Latest Tracks' }],
        [createElement, 'div', {
          class: 'mtrl-content__grid',
          onCreate: async (el) => {
            const trackList = fList({
              type: 'single',
              layout: 'vertical'
            })

            el.appendChild(trackList.element)
            let navEl = null

            // Create track manager with transform
            const manager = createListManager('track', {
              transform: item => ({
                ...transforms.track(item),
                leading: HEADPHONE_ICON
              })
            })

            // Create loader with navigation update callback
            const loader = manager.createPageLoader(trackList, {
              onLoad: (response) => {
                const {
                  loading = false,
                  hasNext = false,
                  hasPrev = false,
                  items = []
                } = response || {}

                // Update navigation
                if (navEl) {
                  navEl.remove()
                }
                navEl = createNavigation(el, {
                  loading,
                  hasNext,
                  hasPrev,
                  onNext: loader.loadNext,
                  onPrev: loader.loadPrev
                })

                // Create event log if it doesn't exist
                const ensureEventLog = () => {
                  let log = document.getElementById('eventLog')
                  if (!log) {
                    log = createElement({
                      tag: 'div',
                      id: 'eventLog',
                      className: 'mtrl-content__event-log'
                    })
                    el.appendChild(log)
                  }
                  return log
                }

                // Log event
                const log = ensureEventLog()
                const entry = createElement({
                  tag: 'div',
                  className: 'mtrl-content__event-log-entry',
                  text: `${new Date().toLocaleTimeString()}: ${items.length ? `Loaded ${items.length} tracks` : 'No tracks to load'}`
                })
                console.insertBefore(entry, console.firstChild)
              }
            })

            // Initial load
            await loader.load()

            // Add visual feedback during loading
            trackList.element.addEventListener('mouseenter', () => {
              if (loader.loading) {
                trackList.element.style.opacity = '0.7'
              }
            })

            trackList.element.addEventListener('mouseleave', () => {
              trackList.element.style.opacity = '1'
            })
          }
        }]
      ],

      // Event Log
      [createElement, {
        tag: 'section',
        className: 'mtrl-content__section',
        children: [
          createElement({
            tag: 'h2',
            className: 'mtrl-content__section-title',
            text: 'Event Log'
          }),
          createElement({
            tag: 'div',
            id: 'eventLog',
            className: 'mtrl-content__event-log'
          })
        ]
      }]
    ]
  ]
}

// Add styles
const style = document.createElement('style')
style.textContent = `
  .mtrl-content__navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    padding: 1rem;
  }
  
  .mtrl-content__loading {
    font-size: 0.875rem;
    color: #666;
  }

  .mtrl-content__grid {
    position: relative;
  }

  .mtrl-list-item {
    transition: opacity 0.2s ease;
  }
`
document.head.appendChild(style)
