// src/client/content/components/cards/media.js

import { createCardSection, createCardGrid } from './helpers'
import { artworks, getPlaceholderUrl } from './artwork-data'
import createCard, {
  createCardHeader,
  createCardContent,
  createCardMedia,
  CARD_VARIANTS
} from 'mtrl/src/components/card'

// Cards with media
export const initMediaCards = (container) => {
  const title = 'Media Cards'
  const description = 'Cards with images and content'

  const section = createCardSection(title, description)
  const grid = createCardGrid()

  // Create media cards
  artworks.slice(0, 3).forEach(artwork => {
    const card = createCard({
      variant: CARD_VARIANTS.ELEVATED,
      interactive: true
    })

    // Create media (use placeholder if actual image not available)
    const media = createCardMedia({
      src: getPlaceholderUrl(artwork),
      alt: `${artwork.title} by ${artwork.artist}`,
      aspectRatio: '16:9'
    })

    const header = createCardHeader({
      title: artwork.title,
      subtitle: `${artwork.artist}, ${artwork.year}`
    })

    const content = createCardContent({
      text: artwork.description
    })

    card.addMedia(media)
    card.setHeader(header)
    card.addContent(content)

    grid.appendChild(card.element)
  })

  section.appendChild(grid)
  container.appendChild(section)
}
