// src/client/content/components/cards/dynamic.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createButton,
  createElement,
  createCard,
  createCardHeader,
  createCardContent,
  createCardMedia,
  createCardActions,
  CARD_VARIANTS
} from 'mtrl'

import { artworks, getPlaceholderUrl } from './artwork-data'

// Dynamic cards with content that changes over time
export const initDynamicCard = (container) => {
  const title = 'Dynamic Cards'
  const description = 'Cards with content that updates dynamically'

  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create dynamic card
  const artwork = artworks[2] // The Persistence of Memory

  // Create the main card component
  const card = createCard({
    variant: CARD_VARIANTS.ELEVATED
  })

  // Create initial content
  const initialHeader = createCardHeader({
    title: 'Dynamic Content Card',
    subtitle: 'This card will update in 3 seconds'
  })

  const initialContent = createCardContent({
    text: 'The content of this card will be dynamically updated after a delay. Watch as the card transforms to display information about a famous painting.'
  })

  // Add initial content
  card.setHeader(initialHeader)
  card.addContent(initialContent)

  // After 3 seconds, update the card
  setTimeout(() => {
    // Create new media
    const media = createCardMedia({
      src: getPlaceholderUrl(artwork),
      alt: `${artwork.title} by ${artwork.artist}`,
      aspectRatio: '16:9'
    })

    // Create new header
    const newHeader = createCardHeader({
      title: artwork.title,
      subtitle: `${artwork.artist}, ${artwork.year}`
    })

    // Create new content
    const newContent = createCardContent({
      text: artwork.description
    })

    // Create style tag
    const styleTag = createElement({
      tag: 'span',
      class: 'art-style-tag',
      text: artwork.style
    })

    // Create view button
    const viewButton = createButton({
      text: 'View Details',
      variant: 'filled'
    }).element

    const actions = createCardActions({
      actions: [styleTag, viewButton],
      align: 'space-between'
    })

    // Update the card
    card.element.innerHTML = '' // Clear content
    card.addMedia(media)
    card.setHeader(newHeader)
    card.addContent(newContent)
    card.setActions(actions)

    // Add a visual indication that the card was updated
    card.element.style.animation = 'pulse 1s'
    setTimeout(() => {
      card.element.style.animation = ''
    }, 1000)
  }, 3000)

  // Create a second dynamic card that cycles through artworks
  const cycleCard = createCard({
    variant: CARD_VARIANTS.OUTLINED
  })

  // Current artwork index
  let currentIndex = 3

  // Function to update card with new artwork
  const updateCycleCard = () => {
    const currentArtwork = artworks[currentIndex]

    // Create media
    const media = createCardMedia({
      src: getPlaceholderUrl(currentArtwork),
      alt: `${currentArtwork.title} by ${currentArtwork.artist}`,
      aspectRatio: '16:9'
    })

    // Create header
    const header = createCardHeader({
      title: currentArtwork.title,
      subtitle: `${currentArtwork.artist}, ${currentArtwork.year}`
    })

    // Create content
    const content = createCardContent({
      text: currentArtwork.description
    })

    // Create style tag
    const styleTag = createElement({
      tag: 'span',
      class: 'art-style-tag',
      text: currentArtwork.style
    })

    // Create cycle button
    const cycleButton = createButton({
      text: 'Next Artwork',
      variant: 'text',
      onclick: () => {
        // Update index
        currentIndex = (currentIndex + 1) % artworks.length
        // Update card
        updateCycleCard()
      }
    }).element

    const actions = createCardActions({
      actions: [styleTag, cycleButton],
      align: 'space-between'
    })

    // Update the card
    cycleCard.element.innerHTML = '' // Clear content
    cycleCard.addMedia(media)
    cycleCard.setHeader(header)
    cycleCard.addContent(content)
    cycleCard.setActions(actions)
  }

  // Initialize with first artwork
  updateCycleCard()

  // Add cards to the grid
  layout.showcase.appendChild(card.element)
  layout.showcase.appendChild(cycleCard.element)
}
