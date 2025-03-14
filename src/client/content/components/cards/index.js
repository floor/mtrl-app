// src/client/content/components/cards/index.js

import { componentsLayout } from '../../../config'
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
import { initInteractiveCards } from './interactive'
import { initAccessibleCards } from './accessible'
// import { initHorizontalCards } from './horizontal'
import { initLoadingCard } from './loading'
import { initDynamicCard } from './dynamic'
import { initExpandableCards } from './expandable'
import { initSwipeableCard } from './swipeable'

/**
 * Main cards content creator
 *
 * Initializes all card types and features based on
 * Material Design 3 specifications
 *
 * @param {HTMLElement} container - The container element
 */
export const createCardsContent = (container) => {
  const info = {
    title: 'Cards',
    description: 'Display content and actions about a single subject'
  }

  // Initialize styles
  addCardStyles()

  const layout = createLayout(componentsLayout(info), container).component

  // Initialize all card sections
  initSimpleCards(layout.body)
  initActionCards(layout.body)
  initElevatedCards(layout.body)
  initFilledCards(layout.body)
  initOutlinedCards(layout.body)
  initMediaCards(layout.body)
  initInteractiveCards(layout.body)
  initAccessibleCards(layout.body)
  initLoadingCard(layout.body)
  initDynamicCard(layout.body)
  initExpandableCards(layout.body)
  initSwipeableCard(layout.body)
  // initHorizontalCards(layout.body)
}

export { artworks }
export default createCardsContent
