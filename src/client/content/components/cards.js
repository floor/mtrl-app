// src/client/content/components/cards.js

import {
  contentLayout,
  createComponentsSectionLayout
} from '../../config'

import {
  createLayout,
  createButton
} from 'mtrl'

import createCard, {
  createCardHeader,
  createCardContent,
  createCardMedia,
  createCardActions,
  CARD_VARIANTS
} from 'mtrl/src/components/card'

export const createCardsContent = (container) => {
  const info = {
    title: 'Cards',
    description: 'Display content and actions about a single subject'
  }

  container.classList.add('components')

  const layout = createLayout(contentLayout(info), container).component

  initSimpleCard(layout.body)
  initMediaCard(layout.body)
  initOutlinedCard(layout.body)
  initDynamicCard(layout.body)
  initLoadingCard(layout.body)
  initCustomCard(layout.body)
}

export const initSimpleCard = (container) => {
  const title = 'Simple Card'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create the main card component
  const card = createCard({
    variant: CARD_VARIANTS.ELEVATED,
    interactive: true
  })

  // Create and add card content
  const content = createCardContent({
    text: 'This is a simple card with just text content.'
  })

  card.addContent(content)

  layout.body.appendChild(card.element.cloneNode(true))
  layout.body.appendChild(card.element.cloneNode(true))
  layout.body.appendChild(card.element)
}

export const initMediaCard = (container) => {
  const title = 'Media Card'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create the main card component
  const card = createCard({
    variant: CARD_VARIANTS.FILLED,
    clickable: true
  })

  // Create card media
  const media = createCardMedia({
    src: '/public/img/pictures/FzLKYa_WYAMBy0w.jpg',
    alt: 'Example image',
    aspectRatio: '16:9'
  })

  // Create card header
  const header = createCardHeader({
    title: 'Media Card',
    subtitle: 'With image and actions'
  })

  // Create card content
  const content = createCardContent({
    text: 'This card includes media, a header, and action buttons.'
  })

  // Create action buttons
  const primaryButton = createButton({
    text: 'Share',
    variant: 'text'
  }).element

  const secondaryButton = createButton({
    text: 'Explore',
    variant: 'filled'
  }).element

  // Create actions container
  const actions = createCardActions({
    actions: [primaryButton, secondaryButton],
    align: 'end'
  })

  // Assemble the card
  card.addMedia(media)
  card.setHeader(header)
  card.addContent(content)
  card.setActions(actions)

  layout.body.appendChild(card.element)
}

export const initOutlinedCard = (container) => {
  const title = 'Outlined Card'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create the main card component
  const card = createCard({
    variant: CARD_VARIANTS.OUTLINED,
    fullWidth: true
  })

  // Create avatar element
  const avatar = document.createElement('div')
  avatar.innerHTML = '<img src="https://example.com/avatar.jpg" alt="User avatar">'

  // Create card header with avatar
  const header = createCardHeader({
    title: 'John Doe',
    subtitle: 'Posted 2 hours ago',
    avatar
  })

  // Create card content
  const content = createCardContent({
    text: 'This is an outlined card with an avatar in the header section and full width layout.'
  })

  // Assemble the card
  card.setHeader(header)
  card.addContent(content)

  layout.body.appendChild(card.element)
}

export const initDynamicCard = (container) => {
  const title = 'Dynamic Card'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create the main card component
  const card = createCard({
    variant: CARD_VARIANTS.ELEVATED
  })

  // Create initial content
  const content = createCardContent({
    text: 'This content will be updated after 3 seconds.'
  })

  // Add initial content
  card.addContent(content)

  // After 3 seconds, update the card
  setTimeout(() => {
    // Create new content
    const newContent = createCardContent({
      text: 'The content has been updated!'
    })

    // Remove old content and add new content
    content.remove()
    card.addContent(newContent)

    // Also add new media
    const media = createCardMedia({
      src: '/public/img/pictures/GBf16D7aUAApCLt.jpg',
      aspectRatio: '4:3'
    })

    card.addMedia(media)
  }, 3000)

  layout.body.appendChild(card.element)
}

export const initLoadingCard = async (container) => {
  const title = 'Loading Card'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Import the withLoading enhancer
  const { withLoading } = await import('mtrl/src/components/card/features.js')

  // Create the card with initial loading state
  const baseCard = createCard({
    variant: CARD_VARIANTS.FILLED
  })

  // Enhance the card with loading functionality
  const card = withLoading({
    initialState: true
  })(baseCard)

  // Create content that will be shown when loading completes
  const content = createCardContent({
    text: 'Content loaded successfully!'
  })

  // Simulate loading completion after 2 seconds
  setTimeout(() => {
    card.loading.setLoading(false)
    card.addContent(content)
  }, 2000)

  layout.body.appendChild(card.element)
}

export const initCustomCard = async (container) => {
  const title = 'Custom Card'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const card = createCard({
    variant: CARD_VARIANTS.ELEVATED,
    class: 'custom-card-theme'
  })

  // Add custom header with icon
  const header = createCardHeader({
    title: 'Custom Card',
    subtitle: 'With custom styling',
    action: '<span class="material-icons">favorite</span>'
  })

  // Add content
  const content = createCardContent({
    html: '<p>This card uses custom styling applied through an additional CSS class.</p>'
  })

  // Assemble the card
  card.setHeader(header)
  card.addContent(content)

  // Add inline styles for demonstration
  card.element.style.setProperty('--custom-card-color', '#6200ee')

  layout.body.appendChild(card.element)
}
