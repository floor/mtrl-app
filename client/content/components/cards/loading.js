// src/client/content/components/cards/loading.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  createElement
} from 'mtrl'

import { artworks, getPlaceholderUrl } from './artwork-data'
import fCard, {
  createCardHeader,
  createCardContent,
  createCardMedia,
  createCardActions,
  CARD_VARIANTS
} from 'mtrl/src/components/card'

// Import the withLoading enhancer
import { withLoading } from 'mtrl/src/components/card/features'

// Loading card with placeholder content
export const initLoadingCard = async (container) => {
  const title = 'Loading Cards'
  const description = 'Cards with loading state and placeholder content'

  const layout = fLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create two cards - one loading, one showing loaded content
  const artwork = artworks[1] // The Starry Night

  // Card 1: Always in loading state
  const baseCard1 = fCard({
    variant: CARD_VARIANTS.FILLED
  })

  // Enhance the card with loading functionality
  const loadingCard = withLoading({
    initialState: true
  })(baseCard1)

  // Create placeholder elements for the loading card
  const header = createCardHeader({
    title: 'Loading Artwork...',
    subtitle: 'Please wait'
  })

  // Create placeholder content with loading animation
  const placeholderContent = createElement({
    tag: 'div',
    class: 'card-loading-content'
  })

  // Create title placeholder
  const titlePlaceholder = createElement({
    tag: 'div',
    class: 'card-loading-placeholder',
    style: 'height: 24px; width: 70%; margin-bottom: 8px;'
  })

  // Create text placeholders
  for (let i = 0; i < 3; i++) {
    const textPlaceholder = createElement({
      tag: 'div',
      class: 'card-loading-placeholder',
      style: `height: 16px; width: ${Math.floor(Math.random() * 30) + 60}%; margin-bottom: 8px;`
    })
    placeholderContent.appendChild(textPlaceholder)
  }

  // Assemble the loading card
  loadingCard.setHeader(header)
  loadingCard.element.appendChild(placeholderContent)

  // Card 2: Will transition from loading to loaded
  const baseCard2 = fCard({
    variant: CARD_VARIANTS.ELEVATED
  })

  // Enhance with loading functionality
  const transitionCard = withLoading({
    initialState: true
  })(baseCard2)

  // Create initial header
  const loadingHeader = createCardHeader({
    title: 'Loading...',
    subtitle: 'Fetching artwork data'
  })

  transitionCard.setHeader(loadingHeader)

  // Simulate loading completion after 3 seconds
  setTimeout(() => {
    // Create loaded content
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

    // Style tag for the loaded card
    const styleTag = createElement({
      tag: 'span',
      class: 'art-style-tag',
      text: artwork.style
    })

    const actions = createCardActions({
      actions: [styleTag],
      align: 'start'
    })

    // Update the card content
    transitionCard.loading.setLoading(false)
    transitionCard.addMedia(media)
    transitionCard.setHeader(header)
    transitionCard.addContent(content)
    transitionCard.setActions(actions)
  }, 3000)

  // Add both cards to the grid
  layout.showcase.appendChild(loadingCard.element)
  layout.showcase.appendChild(transitionCard.element)
}
