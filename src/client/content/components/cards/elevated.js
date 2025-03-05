// src/client/content/components/cards/elevated.js

import { createCardSection, createCardGrid } from './helpers'
import { artworks } from './artwork-data'
import createCard, {
  createCardHeader,
  createCardContent,
  CARD_VARIANTS
} from 'mtrl/src/components/card'

// Elevated cards with shadow effect
export const initElevatedCards = (container) => {
  const title = 'Elevated Cards'
  const description = 'Cards with shadow elevation effect'

  const section = createCardSection(title, description)
  const grid = createCardGrid();

  // Create elevated cards with increasing elevation levels
  [1, 2, 3].forEach((level, index) => {
    const artwork = artworks[index + 3] // Use different artworks

    const card = createCard({
      variant: CARD_VARIANTS.ELEVATED,
      interactive: true
    })

    // Set custom elevation level
    card.element.style.setProperty('--card-elevation', level)

    const header = createCardHeader({
      title: artwork.title,
      subtitle: `${artwork.artist}, ${artwork.year}`
    })

    const content = createCardContent({
      text: `${artwork.description} (Elevation level: ${level})`
    })

    card.setHeader(header)
    card.addContent(content)

    grid.appendChild(card.element)
  })

  section.appendChild(grid)
  container.appendChild(section)
}
