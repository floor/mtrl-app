// src/client/content/components/cards/actions.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createStructure
} from 'mtrl'

import { artworks, getPlaceholderUrl } from './artwork-data'
import createCard, {
  CARD_VARIANTS
} from 'mtrl/src/components/card'

// Cards with actions
export const initActionCards = (container) => {
  const title = 'Action Cards'
  const description = 'Cards with interactive buttons'

  const layout = createStructure(createComponentsSectionLayout({ title, description }), container).component

  // Create action cards with inline configuration
  artworks.slice(4, 6).forEach(artwork => {
    const card = createCard({
      variant: CARD_VARIANTS.ELEVATED,
      interactive: true,

      // Media configuration
      media: {
        src: getPlaceholderUrl(artwork),
        alt: `${artwork.title} by ${artwork.artist}`,
        aspectRatio: '16:9'
      },

      // Header configuration
      header: {
        title: artwork.title,
        subtitle: `${artwork.artist}, ${artwork.year}`
      },

      // Content configuration
      content: {
        text: artwork.description
      },

      // Button configuration
      buttons: [
        { text: 'Share', variant: 'text' },
        { text: 'View Details', variant: 'filled' }
      ]
    })

    layout.showcase.appendChild(card.element)
  })
}
