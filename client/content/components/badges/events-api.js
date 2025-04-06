// src/client/content/components/badges/events-api.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fBadge,
  fButton
} from 'mtrl'

import {
  BADGE_COLORS,
  BADGE_VARIANTS
} from 'mtrl/src/components/badge'

export const initEventsAPI = (container) => {
  const title = 'Badge API Demo'
  const subtitle = 'Try out the badge API methods'
  const layout = fLayout(createComponentsSectionLayout({ title, subtitle }), container).component

  // Create a container for the badge and controls
  const demoContainer = document.createElement('div')
  demoContainer.style.display = 'flex'
  demoContainer.style.flexDirection = 'column'
  demoContainer.style.gap = '24px'
  demoContainer.style.marginBottom = '20px'

  // Create a section for the badge display
  const badgeDisplay = document.createElement('div')
  badgeDisplay.style.display = 'flex'
  badgeDisplay.style.alignItems = 'center'
  badgeDisplay.style.justifyContent = 'center'
  badgeDisplay.style.height = '100px'

  // Create the badge
  const badge = fBadge({
    variant: BADGE_VARIANTS.LARGE,
    label: '42',
    color: BADGE_COLORS.PRIMARY,
    standalone: true
  })

  badge.element.style.position = 'relative'
  badge.element.style.transform = 'scale(2)'

  badgeDisplay.appendChild(badge.element)

  // Create controls
  const controlsContainer = document.createElement('div')
  controlsContainer.style.display = 'flex'
  controlsContainer.style.flexWrap = 'wrap'
  controlsContainer.style.gap = '16px'

  // Label controls
  const labelControls = document.createElement('div')
  labelControls.style.display = 'flex'
  labelControls.style.flexDirection = 'column'
  labelControls.style.gap = '8px'

  const labelHeading = document.createElement('span')
  labelHeading.textContent = 'Label:'
  labelHeading.style.fontWeight = 'bold'

  const labelInput = document.createElement('input')
  labelInput.type = 'text'
  labelInput.value = '42'
  labelInput.style.padding = '8px'
  labelInput.style.width = '80px'

  labelInput.addEventListener('input', () => {
    badge.setLabel(labelInput.value)
  })

  labelControls.appendChild(labelHeading)
  labelControls.appendChild(labelInput)

  // Variant controls
  const variantControls = document.createElement('div')
  variantControls.style.display = 'flex'
  variantControls.style.flexDirection = 'column'
  variantControls.style.gap = '8px'

  const variantHeading = document.createElement('span')
  variantHeading.textContent = 'Variant:'
  variantHeading.style.fontWeight = 'bold'

  const variantSelect = document.createElement('select')
  variantSelect.style.padding = '8px'

  Object.entries(BADGE_VARIANTS).forEach(([key, value]) => {
    const option = document.createElement('option')
    option.value = value
    option.textContent = key
    variantSelect.appendChild(option)
  })

  variantSelect.addEventListener('change', () => {
    badge.setVariant(variantSelect.value)
  })

  variantControls.appendChild(variantHeading)
  variantControls.appendChild(variantSelect)

  // Color controls
  const colorControls = document.createElement('div')
  colorControls.style.display = 'flex'
  colorControls.style.flexDirection = 'column'
  colorControls.style.gap = '8px'

  const colorHeading = document.createElement('span')
  colorHeading.textContent = 'Color:'
  colorHeading.style.fontWeight = 'bold'

  const colorSelect = document.createElement('select')
  colorSelect.style.padding = '8px'

  Object.entries(BADGE_COLORS).forEach(([key, value]) => {
    const option = document.createElement('option')
    option.value = value
    option.textContent = key
    if (value === BADGE_COLORS.PRIMARY) {
      option.selected = true
    }
    colorSelect.appendChild(option)
  })

  colorSelect.addEventListener('change', () => {
    badge.setColor(colorSelect.value)
  })

  colorControls.appendChild(colorHeading)
  colorControls.appendChild(colorSelect)

  // Max value controls
  const maxControls = document.createElement('div')
  maxControls.style.display = 'flex'
  maxControls.style.flexDirection = 'column'
  maxControls.style.gap = '8px'

  const maxHeading = document.createElement('span')
  maxHeading.textContent = 'Max value:'
  maxHeading.style.fontWeight = 'bold'

  const maxInput = document.createElement('input')
  maxInput.type = 'number'
  maxInput.value = '99'
  maxInput.style.padding = '8px'
  maxInput.style.width = '80px'

  const setMaxButton = fButton({
    text: 'Set Max',
    variant: 'outlined'
  })

  setMaxButton.on('click', () => {
    badge.setMax(parseInt(maxInput.value, 10))
  })

  maxControls.appendChild(maxHeading)
  maxControls.appendChild(maxInput)
  maxControls.appendChild(setMaxButton.element)

  // Visibility controls
  const visibilityControls = document.createElement('div')
  visibilityControls.style.display = 'flex'
  visibilityControls.style.flexDirection = 'column'
  visibilityControls.style.gap = '8px'

  const visibilityHeading = document.createElement('span')
  visibilityHeading.textContent = 'Visibility:'
  visibilityHeading.style.fontWeight = 'bold'

  const visibilityButtons = document.createElement('div')
  visibilityButtons.style.display = 'flex'
  visibilityButtons.style.gap = '8px'

  const showButton = fButton({
    text: 'Show',
    variant: 'outlined'
  })

  showButton.on('click', () => {
    badge.show()
  })

  const hideButton = fButton({
    text: 'Hide',
    variant: 'outlined'
  })

  hideButton.on('click', () => {
    badge.hide()
  })

  const toggleButton = fButton({
    text: 'Toggle',
    variant: 'outlined'
  })

  toggleButton.on('click', () => {
    badge.toggle()
  })

  visibilityButtons.appendChild(showButton.element)
  visibilityButtons.appendChild(hideButton.element)
  visibilityButtons.appendChild(toggleButton.element)

  visibilityControls.appendChild(visibilityHeading)
  visibilityControls.appendChild(visibilityButtons)

  // Add all controls to the container
  controlsContainer.appendChild(labelControls)
  controlsContainer.appendChild(variantControls)
  controlsContainer.appendChild(colorControls)
  controlsContainer.appendChild(maxControls)
  controlsContainer.appendChild(visibilityControls)

  // Add everything to the main container
  demoContainer.appendChild(badgeDisplay)
  demoContainer.appendChild(controlsContainer)

  layout.body.appendChild(demoContainer)
}
