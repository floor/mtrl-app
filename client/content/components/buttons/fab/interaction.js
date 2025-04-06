// src/client/content/components/fab/interaction.js
import {
  createComponentsSectionLayout
} from '../../../../layout'

import {
  fLayout,
  fFab,
  fButton
} from 'mtrl'

// Icons for interaction demo
const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 5v14M5 12h14"/>
</svg>`

const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
</svg>`

const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 6h18"></path>
  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
</svg>`

export const initInteraction = (container) => {
  const title = 'FAB Interaction'
  const layout = fLayout(createComponentsSectionLayout({
    title,
    description: 'Demonstrates interactive behaviors of the FAB.'
  }), container).component

  // Create the main FAB
  const fab = fFab({
    icon: addIcon,
    ariaLabel: 'Interactive FAB demo'
  })

  // Create buttons to control the FAB
  const buttonContainer = document.createElement('div')
  buttonContainer.style.marginBottom = '20px'
  buttonContainer.style.display = 'flex'
  buttonContainer.style.gap = '8px'
  buttonContainer.style.flexWrap = 'wrap'

  // Change icon button
  const changeIconBtn = fButton({
    text: 'Change Icon',
    variant: 'outlined'
  })

  // Toggle the icon between add, edit, and delete
  let currentIcon = 'add'
  changeIconBtn.on('click', () => {
    // Rotate between the three icons
    switch (currentIcon) {
      case 'add':
        fab.setIcon(editIcon)
        currentIcon = 'edit'
        break
      case 'edit':
        fab.setIcon(deleteIcon)
        currentIcon = 'delete'
        break
      default:
        fab.setIcon(addIcon)
        currentIcon = 'add'
    }
    log.info(`Icon changed to ${currentIcon}`)
  })

  // Lower/Raise button
  const lowerBtn = fButton({
    text: 'Lower FAB',
    variant: 'outlined'
  })

  let isLowered = false
  lowerBtn.on('click', () => {
    if (isLowered) {
      fab.raise()
      lowerBtn.setText('Lower FAB')
      isLowered = false
    } else {
      fab.lower()
      lowerBtn.setText('Raise FAB')
      isLowered = true
    }
  })

  // Enable/Disable button
  const disableBtn = fButton({
    text: 'Disable FAB',
    variant: 'outlined'
  })

  let isDisabled = false
  disableBtn.on('click', () => {
    if (isDisabled) {
      fab.enable()
      disableBtn.setText('Disable FAB')
      isDisabled = false
    } else {
      fab.disable()
      disableBtn.setText('Enable FAB')
      isDisabled = true
    }
  })

  // Add event listener to FAB
  fab.on('click', () => {
    log.info('FAB clicked!')
    // Demo the pressed effect
    fab.lower()
    setTimeout(() => fab.raise(), 200)
  })

  // Add all buttons to container
  buttonContainer.appendChild(changeIconBtn.element)
  buttonContainer.appendChild(lowerBtn.element)
  buttonContainer.appendChild(disableBtn.element)

  // Add container and FAB to showcase
  layout.showcase.appendChild(buttonContainer)
  layout.showcase.appendChild(fab.element)
}
