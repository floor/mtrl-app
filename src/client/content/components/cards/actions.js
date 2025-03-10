// src/client/content/components/cards/actions.js

import {
  createComponentsSectionLayout
} from '../../../config'

import {
  createLayout,
  createButton
} from 'mtrl'

import { artworks, getPlaceholderUrl } from './artwork-data'
import createCard, {
  createCardHeader,
  createCardContent,
  createCardMedia,
  createCardActions,
  CARD_VARIANTS
} from 'mtrl/src/components/card'

// Cards with actions
export const initActionCards = (container) => {
  const title = 'Action Cards'
  const description = 'Cards with interactive buttons'

  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create action cards
  artworks.slice(3, 6).forEach(artwork => {
    const card = createCard({
      variant: CARD_VARIANTS.ELEVATED,
      interactive: true
    })

    // Create media
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

    // Create action buttons
    const viewButton = createButton({
      text: 'View Details',
      variant: 'filled'
    }).element

    const shareButton = createButton({
      text: 'Share',
      variant: 'text'
    }).element

    const actions = createCardActions({
      actions: [shareButton, viewButton],
      align: 'end'
    })

    card.addMedia(media)
    card.setHeader(header)
    card.addContent(content)
    card.setActions(actions)

    layout.body.appendChild(card.element)
  })
}
