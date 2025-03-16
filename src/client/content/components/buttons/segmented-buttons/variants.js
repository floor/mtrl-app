// src/client/content/components/segmented-buttons/variants.js
import {
  createComponentsSectionLayout
} from '../../../../layout'

import {
  createLayout
} from 'mtrl'

import {
  createSegmentedButton,
  SelectionMode
} from 'mtrl/src/components/segmented-button'

export const initVariants = (container) => {
  const title = 'Segmented Button Basic Examples'
  const layout = createLayout(createComponentsSectionLayout({
    title,
    description: 'Segmented buttons help people select options, switch views, or sort elements. They can be used with text labels, icons, or both.',
    class: 'noflex'
  }), container).component

  // Text-only segmented button
  const textOnlyTitle = document.createElement('h3')
  textOnlyTitle.textContent = 'Text Labels'
  layout.showcase.appendChild(textOnlyTitle)

  const textDescription = document.createElement('p')
  textDescription.textContent = 'Segmented buttons with text labels provide clear options for selection.'
  layout.showcase.appendChild(textDescription)

  const textSegmentedButton = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { text: 'Day', value: 'day', selected: true },
      { text: 'Week', value: 'week' },
      { text: 'Month', value: 'month' }
    ]
  })

  textSegmentedButton.on('change', (event) => {
    log.info(`Text segmented button changed: ${event.value[0]}`)
  })

  const textButtonContainer = document.createElement('div')
  textButtonContainer.style.marginBottom = '32px'
  textButtonContainer.appendChild(textSegmentedButton.element)
  layout.showcase.appendChild(textButtonContainer)

  // Text segmented button with more options
  const textManySegments = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { text: 'Hourly', value: 'hourly' },
      { text: 'Daily', value: 'daily', selected: true },
      { text: 'Weekly', value: 'weekly' },
      { text: 'Monthly', value: 'monthly' },
      { text: 'Yearly', value: 'yearly' }
    ]
  })

  const textManyContainer = document.createElement('div')
  textManyContainer.style.marginBottom = '32px'
  textManyContainer.appendChild(textManySegments.element)
  layout.showcase.appendChild(textManyContainer)

  // Add note about max segments
  const note = document.createElement('p')
  note.innerHTML = '<strong>Note:</strong> Segmented buttons should contain between 2 and 5 segments. For more options, consider using chips or another component.'
  note.style.marginBottom = '32px'
  layout.showcase.appendChild(note)

  // Two-segment example
  const twoSegmentsTitle = document.createElement('h3')
  twoSegmentsTitle.textContent = 'Two Segments'
  layout.showcase.appendChild(twoSegmentsTitle)

  const twoSegmentsButton = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { text: 'Restaurants', value: 'restaurants', selected: true },
      { text: 'Bars', value: 'bars' }
    ]
  })

  const twoSegmentsContainer = document.createElement('div')
  twoSegmentsContainer.style.marginBottom = '32px'
  twoSegmentsContainer.appendChild(twoSegmentsButton.element)
  layout.showcase.appendChild(twoSegmentsContainer)

  // Multi-select price range example
  const multiSelectTitle = document.createElement('h3')
  multiSelectTitle.textContent = 'Price Range Filter (Multi-Select)'
  layout.showcase.appendChild(multiSelectTitle)

  const multiSelectDescription = document.createElement('p')
  multiSelectDescription.textContent = 'A multi-select segmented button lets users select multiple options simultaneously.'
  layout.showcase.appendChild(multiSelectDescription)

  const priceRangeButton = createSegmentedButton({
    mode: SelectionMode.MULTI,
    segments: [
      { text: '$', value: 'low' },
      { text: '$$', value: 'medium' },
      { text: '$$$', value: 'high' },
      { text: '$$$$', value: 'very-high' }
    ]
  })

  priceRangeButton.on('change', (event) => {
    log.info(`Price ranges selected: ${event.value.join(', ')}`)
  })

  const priceRangeContainer = document.createElement('div')
  priceRangeContainer.style.marginBottom = '32px'
  priceRangeContainer.appendChild(priceRangeButton.element)
  layout.showcase.appendChild(priceRangeContainer)

  // Long labels
  const longLabelsTitle = document.createElement('h3')
  longLabelsTitle.textContent = 'Long Label Handling'
  layout.showcase.appendChild(longLabelsTitle)

  const longLabelsDescription = document.createElement('p')
  longLabelsDescription.textContent = 'Segmented buttons should have concise labels. When longer text is necessary, it should be kept as short as possible.'
  layout.showcase.appendChild(longLabelsDescription)

  const longLabelButton = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { text: 'Short', value: 'short', selected: true },
      { text: 'Medium Label', value: 'medium' },
      { text: 'Longer Text Label', value: 'long' }
    ]
  })

  const longLabelContainer = document.createElement('div')
  longLabelContainer.style.marginBottom = '32px'
  longLabelContainer.appendChild(longLabelButton.element)
  layout.showcase.appendChild(longLabelContainer)

  // Container width demo
  const containerTitle = document.createElement('h3')
  containerTitle.textContent = 'Container Width'
  layout.showcase.appendChild(containerTitle)

  const containerDescription = document.createElement('p')
  containerDescription.textContent = 'Segmented buttons adapt to their container width, distributing space evenly among segments.'
  layout.showcase.appendChild(containerDescription)

  // Create a narrow container
  const narrowContainer = document.createElement('div')
  narrowContainer.style.width = '250px'
  narrowContainer.style.marginBottom = '16px'
  narrowContainer.style.border = '1px dashed #ccc'
  narrowContainer.style.padding = '16px'

  const narrowLabel = document.createElement('p')
  narrowLabel.textContent = 'Narrow Container (250px)'
  narrowLabel.style.marginTop = '0'
  narrowContainer.appendChild(narrowLabel)

  const narrowButton = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { text: 'One', value: '1', selected: true },
      { text: 'Two', value: '2' },
      { text: 'Three', value: '3' }
    ]
  })

  narrowContainer.appendChild(narrowButton.element)
  layout.showcase.appendChild(narrowContainer)

  // Create a wide container
  const wideContainer = document.createElement('div')
  wideContainer.style.width = '600px'
  wideContainer.style.marginBottom = '32px'
  wideContainer.style.border = '1px dashed #ccc'
  wideContainer.style.padding = '16px'

  const wideLabel = document.createElement('p')
  wideLabel.textContent = 'Wide Container (600px)'
  wideLabel.style.marginTop = '0'
  wideContainer.appendChild(wideLabel)

  const wideButton = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { text: 'One', value: '1', selected: true },
      { text: 'Two', value: '2' },
      { text: 'Three', value: '3' }
    ]
  })

  wideContainer.appendChild(wideButton.element)
  layout.showcase.appendChild(wideContainer)

  // Add notes about proper placement
  const placementNote = document.createElement('p')
  placementNote.innerHTML = '<strong>Best Practice:</strong> On larger screens, segmented buttons should have a maximum width rather than spanning the entire container. This ensures each segment has an appropriate clickable area.'
  layout.showcase.appendChild(placementNote)
}
