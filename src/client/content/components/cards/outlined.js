// src/client/content/components/cards/outlined.js

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
 * Initialize outlined cards with border
 * Demonstrates MD3 outlined card style with proper border
 *
 * @param {HTMLElement} container - The container element
 */
export const initOutlinedCards = (container) => {
  const title = 'Outlined Cards'
  const description = 'Cards with outline border using MD3 outline color token'

  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create outlined cards
  artworks.slice(0, 3).forEach((artwork, index) => {
    const card = createCard({
      variant: CARD_VARIANTS.OUTLINED,
      interactive: index === 1, // Make the middle card interactive
      aria: {
        label: `Outlined card about ${artwork.title}`,
        role: 'region'
      }
    })

    const header = createCardHeader({
      title: artwork.title,
      subtitle: `${artwork.artist}, ${artwork.style}`
    })

    const content = createCardContent({})

    // Create main description
    const description = document.createElement('p')
    description.textContent = artwork.description
    content.appendChild(description)

    // Create MD3 note
    if (index === 0) {
      const md3Note = createElement({
        tag: 'p',
        style: 'margin-top: 12px; font-size: 0.875rem; color: var(--mtrl-sys-color-on-surface-variant)',
        text: 'Outlined cards in MD3 use a 1px border with the outline color token'
      })
      content.appendChild(md3Note)
    }

    // For the interactive outlined card
    if (index === 1) {
      const interactiveNote = createElement({
        tag: 'p',
        style: 'margin-top: 12px; font-size: 0.875rem; color: var(--mtrl-sys-color-on-surface-variant)',
        text: 'This outlined card is interactive - try hovering to see the state layer effect'
      })
      content.appendChild(interactiveNote)
    }

    card.setHeader(header)
    card.addContent(content)

    layout.body.appendChild(card.element)
  })
}
