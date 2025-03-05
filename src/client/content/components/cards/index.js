// src/client/content/components/cards/index.js

import { contentLayout } from '../../../config'
import { createLayout } from 'mtrl'
import { addCardStyles } from './styles'
import { artworks } from './artwork-data'

// Import individual card sections
import { initSimpleCards } from './simple'
import { initElevatedCards } from './elevated'
import { initFilledCards } from './filled'
import { initOutlinedCards } from './outlined'
import { initMediaCards } from './media'
import { initActionCards } from './actions'
import { initHorizontalCards } from './horizontal'
import { initLoadingCard } from './loading'
import { initDynamicCard } from './dynamic'

// Main cards content creator
export const createCardsContent = (container) => {
  const info = {
    title: 'Cards',
    description: 'Display content and actions about a single subject'
  }

  container.classList.add('components')

  // Initialize styles
  addCardStyles()

  const layout = createLayout(contentLayout(info), container).component

  // Initialize all card sections
  initSimpleCards(layout.body)
  initElevatedCards(layout.body)
  initFilledCards(layout.body)
  initOutlinedCards(layout.body)
  initMediaCards(layout.body)
  initActionCards(layout.body)
  initLoadingCard(layout.body)
  initDynamicCard(layout.body)
  initHorizontalCards(layout.body)
}

export { artworks }
export default createCardsContent
