import {
  createContentSection
} from '../../../layout'

import {
  createLayout,
  createButton,
  createElement
} from 'mtrl'

export const createCardLayout = (container) => {
  const layout = createLayout(createContentSection({
    title: 'Card Layout',
    description: 'Layout for displaying card-based content with different options for handling card heights.',
    class: 'theme-colors'
  }), container).getAll()

  const cardContainer = createElement({
    class: 'layout-demo card-layout'
  })

  // Create 3 cards with different content
  const cardContents = [
    {
      title: 'Card 1',
      content: 'Fixed height card with some content'
    },
    {
      title: 'Card 2',
      content: 'This card has more content to demonstrate how the layout handles different content lengths across cards in the same container.'
    },
    {
      title: 'Card 3',
      content: 'Another card with different content length'
    }
  ]

  cardContents.forEach(cardData => {
    const card = createElement({
      tag: 'div',
      class: 'layout-demo__card'
    })

    const cardHeader = createElement({
      tag: 'div',
      class: 'layout-demo__card-header',
      text: cardData.title
    })

    const cardContent = createElement({
      tag: 'div',
      class: 'layout-demo__card-content',
      text: cardData.content
    })

    card.appendChild(cardHeader)
    card.appendChild(cardContent)
    cardContainer.appendChild(card)
  })

  // Create buttons to toggle different card layouts
  const controls = createElement({
    tag: 'div',
    class: 'layout-demo__controls'
  })

  const cardOptions = [
    { text: 'Equal Height', class: 'equal-height' },
    { text: 'Auto Height', class: 'auto-height' },
    { text: 'Masonry', class: 'masonry' }
  ]

  cardOptions.forEach(option => {
    const button = createButton({
      text: option.text,
      variant: 'outlined'
    })

    button.on('click', () => {
      // Remove existing card layout classes
      cardContainer.classList.remove('equal-height', 'auto-height', 'masonry')
      // Add the selected card layout class
      cardContainer.classList.add(option.class)
    })

    controls.appendChild(button.element)
  })

  // Default to equal height
  cardContainer.classList.add('equal-height')

  layout.body.appendChild(cardContainer)
  layout.body.appendChild(controls)
}
