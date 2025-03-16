// src/client/content/components/extended-fab/interaction.js
import {
  createComponentsSectionLayout
} from '../../../../layout'

import {
  createLayout,
  createExtendedFab,
  createButton
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
  const title = 'Extended FAB Interaction'
  const layout = createLayout(createComponentsSectionLayout({
    title,
    description: 'Demonstrates interactive behaviors of the Extended FAB.'
  }), container).component

  // Create the main Extended FAB
  const extendedFab = createExtendedFab({
    icon: addIcon,
    text: 'Create',
    ariaLabel: 'Interactive Extended FAB demo'
  })

  // Create buttons to control the Extended FAB
  const buttonContainer = document.createElement('div')
  buttonContainer.style.marginBottom = '20px'
  buttonContainer.style.display = 'flex'
  buttonContainer.style.gap = '8px'
  buttonContainer.style.flexWrap = 'wrap'

  // Change icon button
  const changeIconBtn = createButton({
    text: 'Change Icon',
    variant: 'outlined'
  })

  // Toggle the icon between add, edit, and delete
  let currentIcon = 'add'
  changeIconBtn.on('click', () => {
    // Rotate between the three icons
    switch (currentIcon) {
      case 'add':
        extendedFab.setIcon(editIcon)
        currentIcon = 'edit'
        extendedFab.setText('Edit')
        break
      case 'edit':
        extendedFab.setIcon(deleteIcon)
        currentIcon = 'delete'
        extendedFab.setText('Delete')
        break
      default:
        extendedFab.setIcon(addIcon)
        currentIcon = 'add'
        extendedFab.setText('Create')
    }
    log.info(`Icon changed to ${currentIcon}`)
  })

  // Lower/Raise button
  const lowerBtn = createButton({
    text: 'Lower Extended FAB',
    variant: 'outlined'
  })

  let isLowered = false
  lowerBtn.on('click', () => {
    if (isLowered) {
      extendedFab.raise()
      lowerBtn.setText('Lower Extended FAB')
      isLowered = false
    } else {
      extendedFab.lower()
      lowerBtn.setText('Raise Extended FAB')
      isLowered = true
    }
  })

  // Change text button
  const changeTextBtn = createButton({
    text: 'Change Text',
    variant: 'outlined'
  })

  const textOptions = ['Create', 'Add Item', 'New Task', 'Compose']
  let currentTextIndex = 0

  changeTextBtn.on('click', () => {
    currentTextIndex = (currentTextIndex + 1) % textOptions.length
    extendedFab.setText(textOptions[currentTextIndex])
    log.info(`Text changed to ${textOptions[currentTextIndex]}`)
  })

  // Enable/Disable button
  const disableBtn = createButton({
    text: 'Disable Extended FAB',
    variant: 'outlined'
  })

  let isDisabled = false
  disableBtn.on('click', () => {
    if (isDisabled) {
      extendedFab.enable()
      disableBtn.setText('Disable Extended FAB')
      isDisabled = false
    } else {
      extendedFab.disable()
      disableBtn.setText('Enable Extended FAB')
      isDisabled = true
    }
  })

  // Collapse/Expand button
  const collapseBtn = createButton({
    text: 'Collapse Extended FAB',
    variant: 'outlined'
  })

  let isCollapsed = false
  collapseBtn.on('click', () => {
    if (isCollapsed) {
      extendedFab.expand()
      collapseBtn.setText('Collapse Extended FAB')
      isCollapsed = false
    } else {
      extendedFab.collapse()
      collapseBtn.setText('Expand Extended FAB')
      isCollapsed = true
    }
  })

  // Add event listener to Extended FAB
  extendedFab.on('click', () => {
    log.info('Extended FAB clicked!')
    // Demo the pressed effect
    extendedFab.lower()
    setTimeout(() => extendedFab.raise(), 200)
  })

  // Add all buttons to container
  buttonContainer.appendChild(changeIconBtn.element)
  buttonContainer.appendChild(changeTextBtn.element)
  buttonContainer.appendChild(lowerBtn.element)
  buttonContainer.appendChild(disableBtn.element)
  buttonContainer.appendChild(collapseBtn.element)

  // Add container and Extended FAB to showcase
  layout.showcase.appendChild(buttonContainer)
  layout.showcase.appendChild(extendedFab.element)
}
