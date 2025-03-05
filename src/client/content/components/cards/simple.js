// src/client/content/components/cards/simple.js

import { createCardSection, createCardGrid } from './helpers'
import { artworks } from './artwork-data'
import createCard, {
  createCardHeader,
  createCardContent,
  CARD_VARIANTS
} from 'mtrl/src/components/card'

// Simple cards with minimal content
export const initSimpleCards = (container) => {
  const title = 'Simple Cards'
  const description = 'Basic cards with title and text content'

  const section = createCardSection(title, description)
  const grid = createCardGrid()

  // Create simple cards using the first three artworks
  artworks.slice(0, 3).forEach(artwork => {
    const card = createCard({
      variant: CARD_VARIANTS.ELEVATED
    })

    const header = createCardHeader({
      title: artwork.title,
      subtitle: artwork.artist
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
