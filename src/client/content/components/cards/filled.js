// src/client/content/components/cards/filled.js

import {
  createComponentsSectionLayout
} from '../../../config'

import {
  createElement,
  createLayout,
  createCard
} from 'mtrl'
import { artworks } from './artwork-data'

import {
  createCardHeader,
  createCardContent,
  createCardActions,
  CARD_VARIANTS
} from 'mtrl/src/components/card'

/**
 * Initialize filled cards with background color
 * Demonstrates MD3 filled card style with surface-container-highest
 *
 * @param {HTMLElement} container - The container element
 */
export const initFilledCards = (container) => {
  const title = 'Filled Cards'
  const description = 'Cards with filled background color using MD3 surface-container-highest'

  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create filled cards
  artworks.slice(7, 9).forEach(artwork => {
    const card = createCard({
      variant: CARD_VARIANTS.FILLED,
      interactive: true,
      aria: {
        label: `Filled card about ${artwork.title}`,
        role: 'region'
      }
    })

    const header = createCardHeader({
      title: artwork.title,
      subtitle: artwork.artist
    })

    const content = createCardContent({
      text: artwork.description
    })

    // Add a style tag
    const styleTag = createElement({
      tag: 'span',
      class: 'art-style-tag',
      text: artwork.style
    })

    // Create MD3 note
    const md3Note = createElement({
      tag: 'p',
      style: 'margin-top: 12px; font-size: 0.875rem; color: var(--mtrl-sys-color-on-surface-variant)',
      text: 'Filled cards in MD3 use surface-container-highest color with elevation level 0'
    })
    content.appendChild(md3Note)

    const actions = createCardActions({
      actions: [styleTag],
      align: 'start'
    })

    card.setHeader(header)
    card.addContent(content)
    card.setActions(actions)

    layout.showcase.appendChild(card.element)
  })
}
