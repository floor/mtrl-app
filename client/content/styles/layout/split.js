import {
  createContentSection
} from '../../../layout'

import {
  createLayout,
  createSlider,
  createSwitch
} from 'mtrl'

export const createSplitLayout = (container) => {
  console.log('createSplitLayout', container)
  const layout = createLayout(createContentSection({
    title: 'Split Layout',
    description: 'Two-pane layout with adjustable split ratios and resizable divider.',
    class: 'theme-colors'
  }), container).getAll()

  const splitLayout = createLayout([
    ['splitContainer', { class: 'layout-demo split-layout split-50-50' },
      ['leftPane', { class: 'layout-demo__pane layout-demo__pane--left', text: 'Left Pane' }],
      ['rightPane', { class: 'layout-demo__pane layout-demo__pane--right', text: 'Right Pane' }],
      ['resizeHandle', { class: 'layout-demo__resize-handle' }]
    ],
    ['controls', { class: 'layout-demo__controls' },
      [createSlider, 'sliderPercent', { class: 'layout-demo__pane layout-demo__pane--left', text: 'Left Pane' }],
      [createSwitch, { class: 'layout-demo__pane layout-demo__pane--right', label: 'Stack (Mobile)' }]
    ]
  ], layout.body)

  const { splitContainer, leftPane, rightPane, resizeHandle } = splitLayout.component

  // Default to 50/50 split
  splitContainer.classList.add('split-50-50')

  // Initialize resize functionality when the DOM is fully loaded
  console.log('Setting up resize handling for', {
    container: splitContainer,
    leftPane,
    rightPane,
    handle: resizeHandle
  })

  // Use the direct handler approach instead of addEventListener
  initResizeHandling(
    splitContainer,
    leftPane,
    rightPane,
    resizeHandle
  )
}

/**
 * Position the resize handle correctly between panes
 */
function updateHandlePosition (container, leftPane, handle) {
  if (!container || !leftPane || !handle) {
    console.warn('Missing elements for handle positioning')
    return
  }

  try {
    // For the 50/50 split, position at 50%
    if (container.classList.contains('split-50-50')) {
      handle.style.left = 'calc(50% - 12px)'
      return
    }

    // For the 30/70 split, position at 30%
    if (container.classList.contains('split-30-70')) {
      handle.style.left = 'calc(30% - 12px)'
      return
    }

    // For the 70/30 split, position at 70%
    if (container.classList.contains('split-70-30')) {
      handle.style.left = 'calc(70% - 12px)'
      return
    }

    // Otherwise, calculate based on the actual width of the left pane
    const containerRect = container.getBoundingClientRect()
    const leftRect = leftPane.getBoundingClientRect()

    // Calculate position as percentage of container width
    const position = (leftRect.width / containerRect.width) * 100
    handle.style.left = `calc(${position}% - 12px)`
  } catch (err) {
    console.warn('Error positioning resize handle:', err)
  }
}

/**
 * Sets up the resize handle functionality using direct event handlers
 */
function initResizeHandling (container, leftPane, rightPane, handle) {
  if (!container || !leftPane || !rightPane || !handle) {
    console.error('Missing required elements for resize handling')
    return
  }

  console.log('Initializing resize handling with direct handlers')

  // Variables to track resize state
  let isDragging = false

  // Use direct handler approach for more reliable event handling
  handle.onmousedown = function (e) {
    e.preventDefault()
    console.log('Resize handle: drag started')

    isDragging = true
    document.body.style.cursor = 'col-resize'
    container.classList.add('resizing')

    // Get initial mouse position and container dimensions
    const startX = e.clientX
    const containerWidth = container.offsetWidth
    const initialLeftWidth = leftPane.offsetWidth

    // Using direct document events for mousemove and mouseup
    document.onmousemove = function (e) {
      if (!isDragging) return

      const deltaX = e.clientX - startX

      // Convert to percentage (constrained between 10% and 90%)
      const newLeftWidthPercent = Math.max(
        10,
        Math.min(90, ((initialLeftWidth + deltaX) / containerWidth) * 100)
      )
      const newRightWidthPercent = 100 - newLeftWidthPercent

      // Update pane sizes
      leftPane.style.flex = `0 0 calc(${newLeftWidthPercent}% - 12px)`
      rightPane.style.flex = `0 0 calc(${newRightWidthPercent}% - 12px)`

      // Update handle position to match
      handle.style.left = `calc(${newLeftWidthPercent}% - 12px)`
    }

    // Handle mouse up - end dragging
    document.onmouseup = function () {
      console.log('Resize handle: drag ended')

      isDragging = false
      document.body.style.cursor = ''
      container.classList.remove('resizing')

      // Clean up event listeners
      document.onmousemove = null
      document.onmouseup = null
    }
  }

  // Add click handler to verify events are reaching the handle
  handle.onclick = function () {
    console.log('Resize handle clicked!')
  }

  // Update position on window resize
  window.onresize = function () {
    updateHandlePosition(container, leftPane, handle)
  }

  // Initial positioning
  updateHandlePosition(container, leftPane, handle)
}
