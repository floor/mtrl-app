// src/client/content/components/cards/interactive.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createElement
} from 'mtrl'

import { artworks, getPlaceholderUrl } from './artwork-data'
import fCard, {
  createCardHeader,
  createCardContent,
  createCardMedia,
  CARD_VARIANTS
} from 'mtrl/src/components/card'

/**
 * Initialize interactive cards with click behavior
 * Demonstrates interactive and clickable cards with proper state handling
 *
 * @param {HTMLElement} container - The container element
 */
export const initInteractiveCards = (container) => {
  const title = 'Interactive Cards'
  const description = 'Cards that respond to user interaction with hover effects and ripples'

  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  // Card interaction types to showcase
  const interactionTypes = [
    { interactive: true, clickable: false, label: 'Interactive (hover effects)' },
    { interactive: true, clickable: true, label: 'Clickable (with ripple)' }
    // { interactive: false, clickable: false, label: 'Non-interactive' }
  ]

  // Create interactive cards with different behavior
  interactionTypes.forEach((type, index) => {
    const artwork = artworks[(index + 5) % artworks.length]

    const card = fCard({
      variant: CARD_VARIANTS.ELEVATED,
      interactive: type.interactive,
      clickable: type.clickable,
      aria: {
        role: type.clickable ? 'button' : 'region',
        label: `${type.label} card showing ${artwork.title}`,
        describedby: `interactive-card-desc-${index}`
      }
    })

    // For clickable cards, add event listener
    if (type.clickable) {
      card.element.addEventListener('click', () => {
        alert(`Clicked on "${artwork.title}" card!`)
      })
    }

    // Create header
    const header = createCardHeader({
      title: artwork.title,
      subtitle: `${artwork.artist}, ${artwork.year}`
    })

    // Create media for clickable card to make it more engaging
    let media = null
    if (type.clickable) {
      media = createCardMedia({
        src: getPlaceholderUrl(artwork),
        alt: `${artwork.title} by ${artwork.artist}`,
        aspectRatio: '16:9'
      })
    }

    // Create content
    const content = createCardContent({})

    // Add description with ID for aria-describedby
    const descriptionElem = document.createElement('p')
    descriptionElem.id = `interactive-card-desc-${index}`
    descriptionElem.textContent = type.clickable
      ? `${artwork.description} Click this card to see an alert.`
      : artwork.description
    content.appendChild(descriptionElem)

    // Add interaction type tag
    const interactionTag = createElement({
      tag: 'span',
      class: 'art-style-tag',
      text: type.label,
      style: 'margin-top: 12px; display: inline-block;'
    })
    content.appendChild(interactionTag)

    // Add keyboard note for clickable card
    if (type.clickable) {
      const keyboardNote = createElement({
        tag: 'p',
        style: 'margin-top: 8px; font-size: 0.875rem; color: var(--mtrl-sys-color-on-surface-variant)',
        text: 'This card can be activated using Enter or Space key when focused'
      })
      content.appendChild(keyboardNote)
    }

    // Assemble card
    if (media) {
      card.addMedia(media)
    }
    card.setHeader(header)
    card.addContent(content)

    layout.showcase.appendChild(card.element)
  })
}
