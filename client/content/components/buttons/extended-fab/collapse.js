// src/client/content/components/extended-fab/collapse.js
import {
  createComponentsSectionLayout
} from '../../../../layout'

import {
  createLayout
} from 'mtrl'

import {
  createExtendedFab
} from 'mtrl/src/components/extended-fab'

// Icon for the Extended FABs
const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 5v14M5 12h14"/>
</svg>`

export const initCollapse = (container) => {
  const title = 'Extended FAB Collapse on Scroll'
  const layout = createLayout(createComponentsSectionLayout({
    title,
    description: 'Extended FABs can automatically collapse to a standard FAB when scrolling down and expand when scrolling up. This provides persistent access to the action while minimizing screen space usage.',
    class: 'noflex'
  }), container).component

  // Create a demo container with scrollable content
  const demoContainer = document.createElement('div')
  demoContainer.style.position = 'relative'
  demoContainer.style.height = '300px'
  demoContainer.style.border = '1px dashed #ccc'
  demoContainer.style.marginBottom = '20px'
  demoContainer.style.overflow = 'auto'

  // Create scrollable content
  const scrollContent = document.createElement('div')
  scrollContent.style.height = '800px'
  scrollContent.style.padding = '20px'
  scrollContent.innerHTML = `
    <h3>Scroll to see the Extended FAB collapse</h3>
    <p>This is a demonstration of the Extended FAB with <code>collapseOnScroll: true</code>.</p>
    <p>Scroll down to see the FAB collapse into a standard FAB.</p>
    <p>Scroll back up to see it expand again.</p>
    <p>This behavior is useful in long scrolling views to save space while still providing access to the primary action.</p>
    <div style="height: 400px; margin: 20px 0; display: flex; align-items: center; justify-content: center;">
      Scrollable Content
    </div>
    <p>When you scroll to the bottom, the Extended FAB should be expanded again.</p>
  `

  demoContainer.appendChild(scrollContent)

  // Create Extended FAB with collapse on scroll
  const collapsibleFab = createExtendedFab({
    icon: addIcon,
    text: 'Create',
    ariaLabel: 'Collapsible Extended FAB',
    collapseOnScroll: true
  })

  // Position the Extended FAB in the bottom right corner of the container
  collapsibleFab.element.style.position = 'sticky'
  collapsibleFab.element.style.bottom = '16px'
  collapsibleFab.element.style.right = '16px'
  collapsibleFab.element.style.float = 'right'
  collapsibleFab.element.style.marginTop = '680px' // Position at bottom of scrollable content

  collapsibleFab.on('click', () => {
    log.info('Collapsible Extended FAB clicked')
  })

  // Listen for collapse/expand events
  demoContainer.addEventListener('scroll', () => {
    log.info('Scrolling detected')
  })

  scrollContent.appendChild(collapsibleFab.element)

  // Add description and info
  const description = document.createElement('div')
  description.innerHTML = `
    <p>This demo shows how an Extended FAB collapses when scrolling down and expands when scrolling up.</p>
    <p>In a real application, the Extended FAB would be fixed to the viewport.</p>
  `

  layout.showcase.appendChild(description)
  layout.showcase.appendChild(demoContainer)

  // Add a section for programmatic collapse/expand
  const programmaticTitle = document.createElement('h3')
  programmaticTitle.textContent = 'Programmatic Collapse/Expand'
  layout.showcase.appendChild(programmaticTitle)

  const programmaticDescription = document.createElement('p')
  programmaticDescription.textContent = 'Extended FABs can also be collapsed and expanded programmatically:'
  layout.showcase.appendChild(programmaticDescription)

  // Create a controllable Extended FAB
  const controllableFab = createExtendedFab({
    icon: addIcon,
    text: 'Create',
    ariaLabel: 'Programmable Extended FAB'
  })

  // Create controls
  const controlContainer = document.createElement('div')
  controlContainer.style.display = 'flex'
  controlContainer.style.gap = '8px'
  controlContainer.style.marginBottom = '16px'

  const collapseButton = document.createElement('button')
  collapseButton.textContent = 'Collapse'
  collapseButton.addEventListener('click', () => {
    controllableFab.collapse()
  })

  const expandButton = document.createElement('button')
  expandButton.textContent = 'Expand'
  expandButton.addEventListener('click', () => {
    controllableFab.expand()
  })

  controlContainer.appendChild(collapseButton)
  controlContainer.appendChild(expandButton)

  // Add controls and FAB to showcase
  layout.showcase.appendChild(controlContainer)
  layout.showcase.appendChild(controllableFab.element)

  // Add some spacing
  layout.showcase.appendChild(document.createElement('br'))
  layout.showcase.appendChild(document.createElement('br'))
}
