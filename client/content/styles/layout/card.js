import {
  createContentSection
} from '../../../layout'

import {
  fLayout,
  fChips,
  createElement,
  addClass, removeClass
} from 'mtrl'

export const createCardLayout = (container) => {
  const layout = fLayout(createContentSection({
    title: 'Card Layout',
    description: 'Layout for displaying card-based content with different options for handling card heights.',
    class: 'theme-colors'
  }), container).getAll()

  // Create layout with containers for controls and card demo
  const mainLayout = fLayout([
    ['controlsContainer', { class: 'layout-demo__controls' },
      [fChips, 'cardChipSet', {
        scrollable: false,
        multiSelect: false,
        class: 'card-chip-set',
        label: 'Select Card Layout',
        onChange: (values) => {
          cardChangeHandler(values[0])
        }
      }]
    ]
  ], layout.body)

  // Extract chip set component
  const { cardChipSet } = mainLayout.component

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
    },
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
    },
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

  // Define card layout options using the new layout system classes
  const cardOptions = [
    { text: 'Equal Height', value: 'layout--grid' },
    { text: 'Auto Height', value: 'layout--grid layout--grid-auto-height' },
    { text: 'Masonry', value: 'layout--masonry' }
  ]

  // Current card layout tracking
  let currentCardLayout = 'layout--grid'

  const cardChangeHandler = (layout) => {
    if (!layout) return

    // Prevent update if card layout hasn't changed
    if (layout !== currentCardLayout) {
      // Remove existing card layout classes
      removeClass(cardContainer, 'layout--grid layout--grid-align-start layout--masonry layout--grid-auto-height')
      // Add the selected card layout class
      addClass(cardContainer, layout)
      // Update current card layout
      currentCardLayout = layout
    }
  }

  // Add chips to chip set
  cardOptions.forEach(option => {
    cardChipSet.addChip({
      text: option.text,
      value: option.value,
      variant: 'filter',
      selectable: true,
      selected: option.value === currentCardLayout
    })
  })

  // Set default grid gap for cards
  addClass(cardContainer, 'layout--grid-gap-6')

  // Default to equal height grid
  addClass(cardContainer, 'layout--grid')

  // Add the card container after the controls (controls are already in the layout)
  layout.body.appendChild(cardContainer)
}
