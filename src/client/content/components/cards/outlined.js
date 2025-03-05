// src/client/content/components/cards/outlined.js

import { createCardSection, createCardGrid } from './helpers'
import { artworks } from './artwork-data'
import createCard, {
  createCardHeader,
  createCardContent,
  CARD_VARIANTS
} from 'mtrl/src/components/card'

// Outlined cards with border
export const initOutlinedCards = (container) => {
  const title = 'Outlined Cards'
  const description = 'Cards with outline border'

  const section = createCardSection(title, description)
  const grid = createCardGrid()

  // Create outlined cards
  artworks.slice(0, 3).forEach(artwork => {
    const card = createCard({
      variant: CARD_VARIANTS.OUTLINED,
      interactive: false
    })

    const header = createCardHeader({
      title: artwork.title,
      subtitle: `${artwork.artist}, ${artwork.style}`
    })

    const content = createCardContent({
      text: artwork.description
    })

    card.setHeader(header)
    card.addContent(content)

    grid.appendChild(card.element)
  })

  section.appendChild(grid)
  container.appendChild(section)
}
