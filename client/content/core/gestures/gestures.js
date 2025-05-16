import {
  createLayout,
  createElement,
  createGestureManager
} from 'mtrl'

import createGestureCard from './gesture-card'

const GESTURE_TYPES = {
  TAP: 'tap',
  SWIPE: 'swipe',
  SWIPE_LEFT: 'swipeleft',
  SWIPE_RIGHT: 'swiperight',
  SWIPE_UP: 'swipeup',
  SWIPE_DOWN: 'swipedown',
  PINCH: 'pinch',
  ROTATE: 'rotate',
  LONG_PRESS: 'longpress',
  PAN: 'pan'
}

export const initGestures = (body) => {
  const layout = createLayout([createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Touch Gestures' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Built-in gesture recognition makes it easy to create consistent interactions across devices.' }],
    [createElement, 'container', { id: 'touchGestures', class: 'touch-gestures-container' }]
  ], body)

  const container = layout.get('container')

  // Create touch gestures example
  const touchExample = createElement({
    tag: 'div',
    class: 'gesture-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'gesture-example__title',
    text: 'Gesture Recognition System'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'gesture-example__code',
    text: `import { withGesture, pipe, createBase } from 'mtrl';

// Add gesture recognition to any component
const component = pipe(
  createBase,
  withElement({ ... }),
  withGesture({
    swipeThreshold: 30,
    longPressTime: 500,
    
    // Initial gesture handlers
    gestureHandlers: {
      'tap': (e) => console.log('Tapped!', e.count),
      'swipeleft': (e) => navigateForward(),
      'swiperight': (e) => navigateBack(),
      'longpress': (e) => showContextMenu()
    }
  })
)(config);

// Or use the gesture manager directly
const gestures = createGestureManager(element);
gestures.on('swipe', handleSwipe);
gestures.on('pinch', handlePinch);`
  })

  // Demo section with tabs
  const demoSection = createElement({
    tag: 'div',
    class: 'gesture-demo-section'
  })

  const demoTabs = createElement({
    tag: 'div',
    class: 'gesture-demo-tabs'
  })

  const demoContainers = createElement({
    tag: 'div',
    class: 'gesture-demo-containers'
  })

  // Create tabs
  const tabSimple = createElement({
    tag: 'button',
    class: 'gesture-tab active',
    text: 'Simple Demo',
    attributes: {
      'data-tab': 'simple'
    }
  })

  const tabCard = createElement({
    tag: 'button',
    class: 'gesture-tab',
    text: 'Interactive Card',
    attributes: {
      'data-tab': 'card'
    }
  })

  demoTabs.appendChild(tabSimple)
  demoTabs.appendChild(tabCard)

  // Simple gesture demo
  const simpleDemo = createElement({
    tag: 'div',
    class: 'gesture-demo gesture-demo-simple active',
    attributes: {
      'data-demo': 'simple'
    }
  })

  const simpleDemoTitle = createElement({
    tag: 'h4',
    class: 'gesture-demo-title',
    text: 'Try Some Gestures'
  })

  const gestureArea = createElement({
    tag: 'div',
    class: 'gesture-area',
    text: 'Touch or click here to try different gestures'
  })

  const gestureLog = createElement({
    tag: 'div',
    class: 'gesture-log'
  })

  const gestureLogTitle = createElement({
    tag: 'div',
    class: 'gesture-log-title',
    text: 'Gesture Events:'
  })

  const gestureLogContent = createElement({
    tag: 'div',
    class: 'gesture-log-content'
  })

  const clearLogButton = createElement({
    tag: 'button',
    class: 'gesture-clear-button',
    text: 'Clear Log'
  })

  // Set up gesture recognition
  const gestureManager = createGestureManager(gestureArea)

  // Add log entry
  const addLogEntry = (text, type = '') => {
    const entry = createElement({
      tag: 'div',
      class: `gesture-log-entry ${type}`,
      text: `${new Date().toLocaleTimeString()} - ${text}`
    })

    gestureLogContent.appendChild(entry)

    // Auto-scroll to bottom
    gestureLogContent.scrollTop = gestureLogContent.scrollHeight

    // Limit entries
    if (gestureLogContent.childNodes.length > 15) {
      gestureLogContent.removeChild(gestureLogContent.firstChild)
    }
  }

  // Set up gesture handlers
  gestureManager.on('tap', (e) => {
    addLogEntry(`Tap detected (count: ${e.count})`, 'tap')
    pulseEffect(gestureArea, 'tap')
  })

  gestureManager.on('swipe', (e) => {
    addLogEntry(`Swipe ${e.direction} detected (distance: ${Math.round(e.distance)}px)`, 'swipe')
    pulseEffect(gestureArea, `swipe-${e.direction}`)
  })

  gestureManager.on('longpress', (e) => {
    addLogEntry('Long press detected', 'longpress')
    pulseEffect(gestureArea, 'longpress')
  })

  gestureManager.on('pan', (e) => {
    // Only log occasional pan events to avoid flooding
    if (Math.random() < 0.05) {
      addLogEntry(`Pan detected (delta: ${Math.round(e.deltaX)}, ${Math.round(e.deltaY)})`, 'pan')
    }
  })

  if (gestureManager.isSupported('pinch')) {
    gestureManager.on('pinch', (e) => {
      addLogEntry(`Pinch detected (scale: ${e.scale.toFixed(2)})`, 'pinch')
    })
  }

  if (gestureManager.isSupported('rotate')) {
    gestureManager.on('rotate', (e) => {
      addLogEntry(`Rotate detected (${Math.round(e.rotation)}°)`, 'rotate')
    })
  }

  // Add visual feedback for gesture detection
  const pulseEffect = (element, type) => {
    element.classList.add(`pulse-${type}`)
    setTimeout(() => {
      element.classList.remove(`pulse-${type}`)
    }, 500)
  }

  // Clear log button
  clearLogButton.addEventListener('click', () => {
    gestureLogContent.innerHTML = ''
    addLogEntry('Log cleared', 'system')
  })

  // Assemble simple demo
  gestureLog.appendChild(gestureLogTitle)
  gestureLog.appendChild(gestureLogContent)
  gestureLog.appendChild(clearLogButton)

  simpleDemo.appendChild(simpleDemoTitle)
  simpleDemo.appendChild(gestureArea)
  simpleDemo.appendChild(gestureLog)

  // Card demo using the gesture component
  const cardDemo = createElement({
    tag: 'div',
    class: 'gesture-demo gesture-demo-card',
    attributes: {
      'data-demo': 'card'
    }
  })

  const cardDemoTitle = createElement({
    tag: 'h4',
    class: 'gesture-demo-title',
    text: 'Interactive Card Component'
  })

  const cardDemoDescription = createElement({
    tag: 'p',
    class: 'gesture-demo-description',
    text: 'This card demonstrates the gesture system integrated with components. Try these gestures:'
  })

  const gestureList = createElement({
    tag: 'ul',
    class: 'gesture-list'
  })

  const gestures = [
    'Tap to flip the card',
    'Double tap to zoom in/out',
    'Swipe left/right to dismiss',
    'Pan to tilt in 3D',
    'Pinch to resize (touch devices)'
  ]

  gestures.forEach(gesture => {
    const item = createElement({
      tag: 'li',
      text: gesture
    })
    gestureList.appendChild(item)
  })

  const cardContainer = createElement({
    tag: 'div',
    class: 'card-container'
  })

  // Create card log
  const cardLog = createElement({
    tag: 'div',
    class: 'card-log'
  })

  const cardLogTitle = createElement({
    tag: 'div',
    class: 'card-log-title',
    text: 'Card Events:'
  })

  const cardLogContent = createElement({
    tag: 'div',
    class: 'card-log-content'
  })

  const newCardButton = createElement({
    tag: 'button',
    class: 'new-card-button',
    text: 'Create New Card'
  })

  // Add log entry for card
  const addCardLogEntry = (text, type = '') => {
    const entry = createElement({
      tag: 'div',
      class: `card-log-entry ${type}`,
      text: `${new Date().toLocaleTimeString()} - ${text}`
    })

    cardLogContent.appendChild(entry)
    cardLogContent.scrollTop = cardLogContent.scrollHeight

    // Limit entries
    if (cardLogContent.childNodes.length > 10) {
      cardLogContent.removeChild(cardLogContent.firstChild)
    }
  }

  // Create a card
  const createCard = () => {
    // Clear previous card
    cardContainer.innerHTML = ''

    // Create new card
    const card = createGestureCard({
      title: 'Gesture Demo Card',
      content: 'This card demonstrates the gesture system integrated with components.',
      imageUrl: 'https://via.placeholder.com/300x180?text=Interactive+Card'
    })

    // Log card events
    card.on('flip', (e) => {
      addCardLogEntry(`Card flipped ${e.isFlipped ? 'to back' : 'to front'}`, 'flip')
    })

    card.on('zoom', (e) => {
      addCardLogEntry(`Card ${e.isZoomed ? 'zoomed in' : 'zoomed out'}`, 'zoom')
    })

    card.on('dismiss', (e) => {
      addCardLogEntry(`Card dismissed to the ${e.direction}`, 'dismiss')

      // Create a new card after a delay
      setTimeout(() => {
        createCard()
      }, 1000)
    })

    // Add to container
    cardContainer.appendChild(card.element)

    // Log creation
    addCardLogEntry('New card created', 'system')
  }

  // New card button
  newCardButton.addEventListener('click', createCard)

  // Assemble card demo
  cardLog.appendChild(cardLogTitle)
  cardLog.appendChild(cardLogContent)

  cardDemo.appendChild(cardDemoTitle)
  cardDemo.appendChild(cardDemoDescription)
  cardDemo.appendChild(gestureList)
  cardDemo.appendChild(cardContainer)
  cardDemo.appendChild(cardLog)
  cardDemo.appendChild(newCardButton)

  // Create initial card
  setTimeout(createCard, 100)

  // Add tabs and demos to containers
  demoContainers.appendChild(simpleDemo)
  demoContainers.appendChild(cardDemo)
  demoSection.appendChild(demoTabs)
  demoSection.appendChild(demoContainers)

  // Tab switching logic
  const tabs = [tabSimple, tabCard]
  const demos = [simpleDemo, cardDemo]

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab')

      // Update active tab
      tabs.forEach(t => t.classList.toggle('active', t === tab))

      // Update active demo
      demos.forEach(demo => {
        demo.classList.toggle('active', demo.getAttribute('data-demo') === targetTab)
      })
    })
  })

  // Add demos to main container
  touchExample.appendChild(demoSection)

  container.appendChild(touchExample)

  // Log initial system messages
  addLogEntry('Gesture recognition ready', 'system')
  addLogEntry(`Supported gestures: ${Object.keys(GESTURE_TYPES).join(', ')}`, 'system')
}
