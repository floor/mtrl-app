// src/client/content/components/cards/media.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createElement,
  createStructure,
  createButton
} from 'mtrl'

import { artworks, getImageUrl } from './artwork-data'
import createCard, {
  createCardHeader,
  createCardContent,
  createCardMedia,
  createCardActions,
  CARD_VARIANTS
} from 'mtrl/src/components/card'

/**
 * Initialize cards with media content
 * Demonstrates proper media handling with aspect ratios and accessibility
 *
 * @param {HTMLElement} container - The container element
 */
export const initMediaCards = (container) => {
  const title = 'Media Cards'
  const description = 'Cards with images and different aspect ratios'

  const layout = createStructure(createComponentsSectionLayout({ title, description }), container).component

  // Select artworks that work well with different aspect ratios
  const artworksByRatio = [
    { artwork: artworks[7], ratio: '16:9' }, // The Kiss - works well in 16:9
    { artwork: artworks[8], ratio: '4:3' } // American Gothic - works well in 4:3
    // { artwork: artworks[6], ratio: '1:1' } // Girl with a Pearl Earring - works well in 1:1
  ]

  // Create media cards with different aspect ratios
  artworksByRatio.forEach(({ artwork, ratio }, index) => {
    const card = createCard({
      variant: CARD_VARIANTS.ELEVATED,
      interactive: true,
      aria: {
        label: `Card showing ${artwork.title}`,
        describedby: `media-card-desc-${index}`
      }
    })

    // Create media with proper alt text and aspect ratio
    const media = createCardMedia({
      src: getImageUrl(artwork),
      alt: `${artwork.title} by ${artwork.artist}`, // Meaningful alt text
      aspectRatio: ratio,
      contain: ratio === '1:1' // Use contain for square ratio to prevent cropping faces
    })

    const header = createCardHeader({
      title: artwork.title,
      subtitle: `${artwork.artist}, ${artwork.year}`
    })

    const content = createCardContent({})

    // Create description with ID for aria-describedby
    const descriptionElem = document.createElement('p')
    descriptionElem.id = `media-card-desc-${index}`
    descriptionElem.textContent = artwork.description
    content.appendChild(descriptionElem)

    // Add aspect ratio note
    const aspectRatioTag = createElement({
      tag: 'span',
      class: 'art-style-tag',
      text: `Aspect ratio: ${ratio}`,
      style: 'margin-top: 12px; display: inline-block;'
    })
    content.appendChild(aspectRatioTag)

    card.addMedia(media)
    card.setHeader(header)
    card.addContent(content)

    layout.showcase.appendChild(card.element)
  })
}

/**
 * Initialize cards with action buttons
 * Demonstrates different action alignments and accessibility
 *
 * @param {HTMLElement} container - The container element
 */
export const initActionCards = (container) => {
  const title = 'Action Cards'
  const description = 'Cards with interactive buttons and different action alignments'

  const layout = createStructure(createComponentsSectionLayout({ title, description }), container).component

  // Different action alignments to showcase
  const alignments = [
    { align: 'end', name: 'End aligned' },
    { align: 'space-between', name: 'Space between' },
    { align: 'center', name: 'Center aligned' }
  ]

  // Select artworks that work well in landscape format
  const landscapeArtworks = [artworks[1], artworks[3], artworks[9]] // Starry Night, Guernica, Great Wave

  // Create action cards
  landscapeArtworks.forEach((artwork, index) => {
    const alignment = alignments[index]

    const card = createCard({
      variant: CARD_VARIANTS.ELEVATED,
      interactive: false, // Not interactive since buttons are the interactive elements
      aria: {
        label: `Card with ${alignment.name} actions`,
        role: 'region'
      }
    })

    // Create media
    const media = createCardMedia({
      src: getImageUrl(artwork),
      alt: `${artwork.title} by ${artwork.artist}`,
      aspectRatio: '16:9'
    })

    const header = createCardHeader({
      title: artwork.title,
      subtitle: `${artwork.artist}, ${artwork.year}`
    })

    const content = createCardContent({})

    // Add description
    const description = document.createElement('p')
    description.textContent = artwork.description
    content.appendChild(description)

    // Add alignment note
    const alignmentNote = createElement({
      tag: 'p',
      style: 'margin-top: 8px; font-size: 0.875rem; color: var(--mtrl-sys-color-on-surface-variant)',
      text: `This card demonstrates ${alignment.name} actions`
    })
    content.appendChild(alignmentNote)

    // Create action buttons
    const viewButton = createButton({
      text: 'View Details',
      variant: 'filled',
      ariaLabel: `View details about ${artwork.title}`
    }).element

    const shareButton = createButton({
      text: 'Share',
      variant: 'text',
      ariaLabel: `Share ${artwork.title}`
    }).element

    // Create style tag for space-between layout
    let styleTag = null
    if (alignment.align === 'space-between') {
      styleTag = createElement({
        tag: 'span',
        class: 'art-style-tag',
        text: artwork.style
      })
    }

    // Create actions with proper alignment
    const actions = createCardActions({
      actions: styleTag ? [styleTag, viewButton] : [shareButton, viewButton],
      align: alignment.align
    })

    card.addMedia(media)
    card.setHeader(header)
    card.addContent(content)
    card.setActions(actions)

    layout.showcase.appendChild(card.element)
  })
}
