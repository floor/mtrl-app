// src/client/content/components/segmented-button/icons.js
import {
  createComponentSection
} from '../../../../layout'

import {
  createLayout
} from 'mtrl'

import {
  createSegmentedButton,
  SelectionMode
} from 'mtrl/src/components/segmented-button'

// Icons for different use cases
const icons = {
  // Transport icons
  car: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"></path>
    <circle cx="6.5" cy="16.5" r="2.5"></circle>
    <circle cx="16.5" cy="16.5" r="2.5"></circle>
  </svg>`,

  transit: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="3" width="16" height="16" rx="2"></rect>
    <path d="M4 11h16"></path>
    <path d="M12 3v16"></path>
  </svg>`,

  walk: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M13 4v16"></path>
    <path d="M19 4v10"></path>
    <path d="M7 4v6"></path>
    <path d="M19 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v0"></path>
  </svg>`,

  // View icons
  list: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>`,

  grid: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>`,

  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>`,

  // Time period icons
  day: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>`,

  week: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <path d="M9 16H15"></path>
  </svg>`,

  month: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <path d="M8 14h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 18h.01"></path>
    <path d="M12 18h.01"></path>
    <path d="M16 18h.01"></path>
  </svg>`
}

export const initIconsOptions = (container) => {
  const title = 'Icons and Labels'
  const layout = createLayout(createComponentSection({
    title,
    description: 'Segmented buttons can display icons, text labels, or both. Icons enhance visual recognition and complement text labels.',
    class: 'noflex'
  }), container).component

  // Icon-only section
  const iconOnlyTitle = document.createElement('h3')
  iconOnlyTitle.textContent = 'Icon-Only Segmented Buttons'
  layout.showcase.appendChild(iconOnlyTitle)

  const iconOnlyDescription = document.createElement('p')
  iconOnlyDescription.textContent = 'When using icons without text, make sure the icons clearly communicate their meaning. Icon-only segmented buttons are useful for saving space in constrained layouts.'
  layout.showcase.appendChild(iconOnlyDescription)

  // Result display panel
  const iconOnlyResult = document.createElement('div')
  iconOnlyResult.className = 'result-panel'
  iconOnlyResult.style.padding = '12px'
  iconOnlyResult.style.backgroundColor = 'var(--mtrl-sys-color-surface-container-highest)'
  iconOnlyResult.style.borderRadius = '4px'
  iconOnlyResult.style.marginBottom = '20px'
  iconOnlyResult.textContent = 'Selected transport: car'
  layout.showcase.appendChild(iconOnlyResult)

  // Icon-only example
  const transportButton = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { icon: icons.car, value: 'car', selected: true },
      { icon: icons.transit, value: 'transit' },
      { icon: icons.walk, value: 'walk' }
    ]
  })

  transportButton.on('change', (event) => {
    iconOnlyResult.textContent = `Selected transport: ${event.value[0]}`
    log.info(`Transport changed to: ${event.value[0]}`)
  })

  const transportContainer = document.createElement('div')
  transportContainer.style.marginBottom = '32px'
  transportContainer.appendChild(transportButton.element)
  layout.showcase.appendChild(transportContainer)

  // View toggle example
  const viewToggle = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { icon: icons.list, value: 'list', selected: true },
      { icon: icons.grid, value: 'grid' },
      { icon: icons.calendar, value: 'calendar' }
    ]
  })

  const viewToggleContainer = document.createElement('div')
  viewToggleContainer.style.marginBottom = '32px'
  viewToggleContainer.appendChild(viewToggle.element)
  layout.showcase.appendChild(viewToggleContainer)

  // Icon + Text section
  const iconTextTitle = document.createElement('h3')
  iconTextTitle.textContent = 'Icon + Text Segmented Buttons'
  layout.showcase.appendChild(iconTextTitle)

  const iconTextDescription = document.createElement('p')
  iconTextDescription.textContent = 'Combining icons with text provides the best clarity. When a segment is selected, the icon is replaced with a checkmark while maintaining the text label.'
  layout.showcase.appendChild(iconTextDescription)

  // Result display panel
  const iconTextResult = document.createElement('div')
  iconTextResult.className = 'result-panel'
  iconTextResult.style.padding = '12px'
  iconTextResult.style.backgroundColor = 'var(--mtrl-sys-color-surface-container-highest)'
  iconTextResult.style.borderRadius = '4px'
  iconTextResult.style.marginBottom = '20px'
  iconTextResult.textContent = 'Selected period: day'
  layout.showcase.appendChild(iconTextResult)

  // Icon + Text example
  const timePeriodButton = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { text: 'Day', icon: icons.day, value: 'day', selected: true },
      { text: 'Week', icon: icons.week, value: 'week' },
      { text: 'Month', icon: icons.month, value: 'month' }
    ]
  })

  timePeriodButton.on('change', (event) => {
    iconTextResult.textContent = `Selected period: ${event.value[0]}`
    log.info(`Time period changed to: ${event.value[0]}`)
  })

  const timePeriodContainer = document.createElement('div')
  timePeriodContainer.style.marginBottom = '32px'
  timePeriodContainer.appendChild(timePeriodButton.element)
  layout.showcase.appendChild(timePeriodContainer)

  // Checkmark behavior note
  const checkmarkNote = document.createElement('div')
  checkmarkNote.style.display = 'flex'
  checkmarkNote.style.alignItems = 'center'
  checkmarkNote.style.backgroundColor = 'var(--mtrl-sys-color-surface-container)'
  checkmarkNote.style.padding = '16px'
  checkmarkNote.style.borderRadius = '4px'
  checkmarkNote.style.marginBottom = '32px'

  const infoIcon = document.createElement('span')
  infoIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>`
  infoIcon.style.marginRight = '12px'
  checkmarkNote.appendChild(infoIcon)

  const infoText = document.createElement('p')
  infoText.innerHTML = '<strong>Note:</strong> In segments with both text and icons, the icon is replaced by a checkmark when selected. In icon-only segments, the icon itself remains visible alongside the checkmark to maintain context.'
  infoText.style.margin = '0'
  checkmarkNote.appendChild(infoText)

  layout.showcase.appendChild(checkmarkNote)

  // Best practices section
  const bestPracticesTitle = document.createElement('h3')
  bestPracticesTitle.textContent = 'Icon Best Practices'
  layout.showcase.appendChild(bestPracticesTitle)

  const bestPracticesList = document.createElement('ul')
  bestPracticesList.innerHTML = `
    <li>Use consistent icon style throughout your segmented buttons</li>
    <li>Ensure icon sizes are uniform (recommended 18x18px)</li>
    <li>Choose icons with clear visual meaning that users can easily recognize</li>
    <li>Avoid using icon-only segmented buttons when the meaning isn't immediately obvious</li>
    <li>Keep all segments in a segmented button consistent - use all text, all icons, or all text+icon combinations</li>
  `
  layout.showcase.appendChild(bestPracticesList)

  // Do and Don't examples
  const examplesContainer = document.createElement('div')
  examplesContainer.style.display = 'flex'
  examplesContainer.style.gap = '20px'
  examplesContainer.style.marginTop = '20px'

  // Do example
  const doExample = document.createElement('div')
  doExample.style.flex = '1'

  const doTitle = document.createElement('div')
  doTitle.innerHTML = '<span style="color: #4CAF50; font-weight: bold;">✓ Do</span>'
  doExample.appendChild(doTitle)

  const doContent = document.createElement('div')
  doContent.style.padding = '16px'
  doContent.style.backgroundColor = 'var(--mtrl-sys-color-surface-container)'
  doContent.style.borderRadius = '4px'
  doContent.style.marginTop = '8px'

  // Create a good example (all icons with text)
  const goodExample = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { text: 'List', icon: icons.list, value: 'list', selected: true },
      { text: 'Grid', icon: icons.grid, value: 'grid' }
    ]
  })

  doContent.appendChild(goodExample.element)
  doExample.appendChild(doContent)

  const doText = document.createElement('p')
  doText.textContent = 'Use consistent format (all segments have both icon and text)'
  doExample.appendChild(doText)

  // Don't example
  const dontExample = document.createElement('div')
  dontExample.style.flex = '1'

  const dontTitle = document.createElement('div')
  dontTitle.innerHTML = '<span style="color: #F44336; font-weight: bold;">✗ Don\'t</span>'
  dontExample.appendChild(dontTitle)

  const dontContent = document.createElement('div')
  dontContent.style.padding = '16px'
  dontContent.style.backgroundColor = 'var(--mtrl-sys-color-surface-container)'
  dontContent.style.borderRadius = '4px'
  dontContent.style.marginTop = '8px'

  // Create a bad example (mixed icon-only and text)
  const badExample = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { icon: icons.list, value: 'list', selected: true },
      { text: 'Grid', value: 'grid' }
    ]
  })

  dontContent.appendChild(badExample.element)
  dontExample.appendChild(dontContent)

  const dontText = document.createElement('p')
  dontText.textContent = 'Mix icon-only segments with text-only segments'
  dontExample.appendChild(dontText)

  examplesContainer.appendChild(doExample)
  examplesContainer.appendChild(dontExample)
  layout.showcase.appendChild(examplesContainer)
}
