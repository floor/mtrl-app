// src/client/content/components/cards/accessible.js

import {
  createComponentsSectionLayout
} from '../../../config'

import {
  createElement,
  createLayout
} from 'mtrl'

import { artworks } from './artwork-data'

import createCard, {
  createCardHeader,
  createCardContent,
  CARD_VARIANTS
} from 'mtrl/src/components/card'

/**
 * Initialize cards demonstrating accessibility features
 * Shows proper ARIA attributes and keyboard navigation
 *
 * @param {HTMLElement} container - The container element
 */
export const initAccessibleCards = (container) => {
  const title = 'Accessible Cards'
  const description = 'Cards with enhanced accessibility features and ARIA attributes'

  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create accessible card examples
  const accessibilityFeatures = [
    // { feature: 'Screen Reader Support', description: 'This card has proper ARIA attributes for screen readers' },
    { feature: 'Keyboard Navigation', description: 'This card can be navigated and activated with keyboard' },
    { feature: 'Focus Visibility', description: 'This card has enhanced focus indicators for visibility' }
  ]

  accessibilityFeatures.forEach((feature, index) => {
    const artwork = artworks[(index + 2) % artworks.length]

    // Create card with accessibility attributes
    const card = createCard({
      variant: index === 0
        ? CARD_VARIANTS.ELEVATED
        : index === 1
          ? CARD_VARIANTS.FILLED
          : CARD_VARIANTS.OUTLINED,
      interactive: true,
      clickable: index === 1, // Make the keyboard navigation card clickable
      aria: {
        role: index === 1 ? 'button' : 'region',
        label: feature.feature,
        describedby: `accessible-card-${index}`
      }
    })

    // For focus visibility card, add special class
    if (index === 2) {
      card.element.classList.add('a11y-focus-demo')
    }

    // Add keyboard event for keyboard navigation card
    if (index === 1) {
      card.element.addEventListener('click', () => {
        alert('Card activated through click or keyboard!')
      })
    }

    const header = createCardHeader({
      title: feature.feature,
      subtitle: artwork.title
    })

    const content = createCardContent({})

    // Add main description with ID for aria-describedby
    const mainDesc = document.createElement('p')
    mainDesc.id = `accessible-card-${index}`
    mainDesc.textContent = feature.description
    content.appendChild(mainDesc)

    // Add artwork description
    const artworkDesc = document.createElement('p')
    artworkDesc.textContent = artwork.description
    artworkDesc.style.marginTop = '8px'
    content.appendChild(artworkDesc)

    // Add specific accessibility notes for each type
    let accessibilityNote = ''
    if (index === 0) {
      accessibilityNote = 'This card uses aria-label and aria-describedby attributes to provide context for screen readers'
    } else if (index === 1) {
      accessibilityNote = 'Press Tab to focus, then Enter or Space to activate this card'
    } else {
      accessibilityNote = 'This card has an enhanced focus outline for better visibility when using keyboard navigation'
    }

    const noteElem = createElement({
      tag: 'p',
      style: 'margin-top: 12px; font-size: 0.875rem; color: var(--mtrl-sys-color-on-surface-variant)',
      text: accessibilityNote
    })
    content.appendChild(noteElem)

    card.setHeader(header)
    card.addContent(content)

    layout.showcase.appendChild(card.element)
  })
}
