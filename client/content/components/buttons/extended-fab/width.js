// src/client/content/components/extended-fab/width-options.js
import { capitalize } from '../../../../core/utils'

import {
  createComponentSection
} from '../../../../layout'

import {
  createLayout,
  createExtendedFab
} from 'mtrl'

export const EXTENDED_FAB_WIDTH = {
  /** Fixed width based on content */
  FIXED: 'fixed',
  /** Fluid width that can adapt to container */
  FLUID: 'fluid'
}

// Icon for the Extended FABs
const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 5v14M5 12h14"/>
</svg>`

export const initWidthOptions = (container) => {
  const title = 'Extended FAB Width Options'
  const layout = createLayout(createComponentSection({
    title,
    description: 'Extended FABs can have fixed width (defined by content) or fluid width (defined by container).'
  }), container).component

  // Create a container to demonstrate width options
  const demoContainer = document.createElement('div')
  demoContainer.style.width = '100%'
  demoContainer.style.maxWidth = '400px'
  demoContainer.style.border = '1px dashed #ccc'
  demoContainer.style.padding = '20px'
  demoContainer.style.marginBottom = '20px'
  demoContainer.style.display = 'flex'
  demoContainer.style.flexDirection = 'column'
  demoContainer.style.gap = '20px'

  // Add label for the container
  const containerLabel = document.createElement('div')
  containerLabel.textContent = 'Container: 400px width'
  containerLabel.style.textAlign = 'center'
  containerLabel.style.marginBottom = '10px'
  demoContainer.appendChild(containerLabel)

  // Convert the enum to an array of strings
  const widthOptions = Object.values(EXTENDED_FAB_WIDTH)

  widthOptions.forEach(width => {
    const text = capitalize(width)
    const extendedFab = createExtendedFab({
      icon: addIcon,
      text: `${text} Width Example`,
      width: width.toLowerCase(),
      ariaLabel: `${text} width example`
    })

    extendedFab.on('click', () => log.info(`${width} width Extended FAB clicked`))

    demoContainer.appendChild(extendedFab.element)
  })

  // Create Extended FAB with longer text to demonstrate text handling
  const longTextFab = createExtendedFab({
    icon: addIcon,
    text: 'Extended FAB with longer text label',
    width: 'fixed',
    ariaLabel: 'Extended FAB with longer text'
  })

  demoContainer.appendChild(longTextFab.element)

  layout.showcase.appendChild(demoContainer)
}
