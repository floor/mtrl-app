// src/client/content/components/cards/expandable.js

import {
  createComponentsSectionLayout
} from '../../../config'

import {
  createLayout,
  createElement
} from 'mtrl'

import { artworks } from './artwork-data'
import createCard, {
  createCardHeader,
  createCardContent,
  CARD_VARIANTS,
  withExpandable
} from 'mtrl/src/components/card'

/**
 * Initialize expandable cards
 * Demonstrates expandable content with proper accessibility
 *
 * @param {HTMLElement} container - The container element
 */
export const initExpandableCards = (container) => {
  const title = 'Expandable Cards'
  const description = 'Cards with expandable content sections'

  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create expandable cards with different initial states
  ;[
    { artwork: artworks[4], initialExpanded: false, title: 'Click to expand' },
    { artwork: artworks[5], initialExpanded: true, title: 'Initially expanded' }
  ].forEach((item, index) => {
    // Create base card
    const baseCard = createCard({
      variant: index === 0 ? CARD_VARIANTS.FILLED : CARD_VARIANTS.OUTLINED,
      aria: {
        label: `Expandable card about ${item.artwork.title}`,
        expanded: item.initialExpanded ? 'true' : 'false'
      }
    })

    // Create the expandable content
    const expandableContent = document.createElement('div')
    expandableContent.id = `expandable-content-${index}`

    // Add detailed content to expand
    const detailedInfo = document.createElement('div')
    detailedInfo.style.padding = '16px'
    detailedInfo.style.borderTop = '1px solid var(--mtrl-sys-color-outline-variant)'

    // Title for expanded section
    const expandedTitle = document.createElement('h4')
    expandedTitle.textContent = 'Detailed Information'
    expandedTitle.style.margin = '0 0 8px 0'
    expandedTitle.style.fontSize = '1rem'
    detailedInfo.appendChild(expandedTitle)

    // Add more details about the artwork
    const artworkDetails = document.createElement('p')
    artworkDetails.textContent = `"${item.artwork.title}" was created by ${item.artwork.artist} in ${item.artwork.year}. This ${item.artwork.style} masterpiece is known worldwide for its distinctive style and artistic influence.`
    detailedInfo.appendChild(artworkDetails)

    // Add style period info
    const styleInfo = document.createElement('p')
    styleInfo.textContent = `${item.artwork.style} was characterized by ${getStyleDescription(item.artwork.style)}.`
    styleInfo.style.marginTop = '8px'
    detailedInfo.appendChild(styleInfo)

    // Add accessibility note
    const a11yNote = document.createElement('p')
    a11yNote.textContent = 'This expandable section uses proper ARIA attributes for accessibility'
    a11yNote.style.marginTop = '8px'
    a11yNote.style.fontSize = '0.875rem'
    a11yNote.style.color = 'var(--mtrl-sys-color-on-surface-variant)'
    detailedInfo.appendChild(a11yNote)

    expandableContent.appendChild(detailedInfo)

    // Enhance card with expandable functionality
    const card = withExpandable({
      initialExpanded: item.initialExpanded,
      expandableContent
    })(baseCard)

    // Create header
    const header = createCardHeader({
      title: item.artwork.title,
      subtitle: item.artwork.artist
    })

    // Create main content
    const content = createCardContent({})

    // Add description
    const description = document.createElement('p')
    description.textContent = item.artwork.description
    content.appendChild(description)

    // Add expandable instruction
    const expandInstruction = createElement({
      tag: 'p',
      style: 'margin-top: 12px; font-size: 0.875rem; font-style: italic;',
      text: item.title
    })
    content.appendChild(expandInstruction)

    // Assemble card
    card.setHeader(header)
    card.addContent(content)

    // Add to grid
    layout.body.appendChild(card.element)
  })
}

// Helper function to get style descriptions
const getStyleDescription = (style) => {
  const descriptions = {
    Renaissance: 'realistic proportions, linear perspective, and the classical principles of Greek and Roman art',
    'Post-Impressionism': 'symbolic content, abstract forms, and bold colors',
    Surrealism: 'unexpected juxtapositions and dreamlike imagery',
    Cubism: 'breaking subjects down into geometric shapes viewed from multiple angles',
    Baroque: 'grandeur, dramatic effects, and emotional intensity',
    Expressionism: 'distortion, exaggeration, and fantasy to express emotional experience',
    'Art Nouveau/Symbolism': 'decorative and ornamental elements with symbolic meanings',
    Regionalism: 'realistic depictions of rural American scenes',
    'Ukiyo-e': 'woodblock prints depicting landscapes, tales from history, and scenes from everyday life'
  }

  return descriptions[style] || 'distinctive artistic elements and techniques'
}
