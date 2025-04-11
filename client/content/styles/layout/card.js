// src/examples/card.js
import { createContentSection } from '../../../layout'
import {
  applyLayoutClasses,
  cleanupLayoutClasses
} from 'mtrl/src/core/layout'
import { fLayout, fChips } from 'mtrl'

/**
 * Creates a card layout demo with different card layout options
 *
 * @param {HTMLElement} container - Container element to append to
 * @returns {Object} The created layout
 */
export const createCardLayout = (container) => {
  // Create the content section with title and description
  const sectionLayout = fLayout(createContentSection({
    title: 'Card Layout',
    description: 'Layout for displaying card-based content with different options for handling card heights.',
    class: 'theme-colors'
  }), container)

  const body = sectionLayout.get('body')

  // Create controls with fLayout and layout option
  const controlsLayout = fLayout([
    'controlsContainer', {
      tag: 'div',
      class: 'layout-demo__controls',
      // Use layout configuration option
      layout: {
        type: 'row',
        justify: 'center',
        align: 'center'
      }
    },
    [
      // Create chip set
      fChips, 'cardChipSet', {
        scrollable: false,
        multiSelect: false,
        class: 'card-chip-set',
        label: 'Select Card Layout',
        onChange: (values) => cardChangeHandler(values[0])
      }
    ]
  ], body)

  // Get chip set component
  const cardChipSet = controlsLayout.get('cardChipSet')

  // Create card container with fLayout and layout option
  const cardLayout = fLayout([
    'cardContainer', {
      tag: 'div',
      class: 'layout-demo card-layout',
      // Use layout configuration option
      layout: {
        type: 'grid',
        columns: 3,
        gap: 6
      }
    }
  ], body)

  // Get card container element
  const cardContainer = cardLayout.get('cardContainer')

  // Content for the sample cards
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
      title: 'Card 4',
      content: 'Fixed height card with some content'
    },
    {
      title: 'Card 5',
      content: 'This card has more content to demonstrate how the layout handles different content lengths across cards in the same container.'
    },
    {
      title: 'Card 6',
      content: 'Another card with different content length'
    }
  ]

  // Create cards using fLayout with layout options
  cardContents.forEach((cardData, index) => {
    const cardStructure = fLayout([
      `card${index}`, {
        tag: 'div',
        class: 'layout-demo__card',
        // Use layout configuration for stack layout
        layout: {
          type: 'stack',
          gap: 2
        }
      },
      [
        `header${index}`, {
          tag: 'div',
          class: 'layout-demo__card-header',
          text: cardData.title
        },
        `content${index}`, {
          tag: 'div',
          class: 'layout-demo__card-content',
          text: cardData.content
        }
      ]
    ], cardContainer)
  })

  // Define card layout options with configuration objects
  const cardOptions = [
    {
      text: 'Equal Height',
      value: 'equal-height',
      config: {
        type: 'grid',
        columns: 3,
        gap: 6
      }
    },
    {
      text: 'Auto Height',
      value: 'auto-height',
      config: {
        type: 'grid',
        columns: 3,
        gap: 6,
        autoHeight: true
      }
    }
  ]

  // Track current card layout
  let currentCardLayout = 'equal-height'

  /**
   * Handler for card layout changes with proper class cleanup
   * @param {string} layout - Layout option value
   */
  const cardChangeHandler = (layout) => {
    if (!layout || layout === currentCardLayout) return

    // Find the selected configuration
    const option = cardOptions.find(opt => opt.value === layout)
    if (!option) return

    // First clean up any existing layout classes
    cleanupLayoutClasses(cardContainer)

    // Then apply the new layout configuration
    applyLayoutClasses(cardContainer, option.config, false) // false = don't clean up again

    // Update current layout tracking
    currentCardLayout = layout

    // For debugging - log the container classes after change
    console.log('Card layout classes after change:', cardContainer.className)
  }

  // Add chips to the chip set
  cardOptions.forEach(option => {
    cardChipSet.addChip({
      text: option.text,
      value: option.value,
      variant: 'filter',
      selectable: true,
      selected: option.value === currentCardLayout
    })
  })

  return sectionLayout
}
