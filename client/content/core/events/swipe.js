import {
  createLayout,
  createElement
} from 'mtrl'

export const initSwipe = (body) => {
  const layout = createLayout([createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Touch Gestures' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Built-in support for touch gestures makes it easy to create consistent interactions across devices.' }],
    [createElement, 'container', { id: 'touchGestures', class: 'touch-gestures-container' }]
  ], body)

  const container = layout.get('container')

  // Create explanation for touch gestures
  const touchExplanation = createElement({
    tag: 'div',
    class: 'event-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'event-explanation__text',
    text: 'The events system includes first-class support for touch interactions, making it easy to handle gestures like taps and swipes consistently across devices.'
  })

  touchExplanation.appendChild(explanationText)

  // Create touch gestures example
  const touchExample = createElement({
    tag: 'div',
    class: 'event-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'event-example__title',
    text: 'Touch Gesture Support'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'event-example__code',
    text: `// Touch events are automatically registered if supported
events.on('tap', (e) => console.log('Tapped!'));
events.on('swipe', (e) => console.log(\`Swiped \${e.direction}\`));
events.on('swipeleft', (e) => navigateForward());
events.on('swiperight', (e) => navigateBack());

// Touch events work alongside traditional mouse events
events.on('click', handleInteraction);  // Works with both clicks and taps`
  })

  // Demo for touch gestures
  const exampleDemo = createElement({
    tag: 'div',
    class: 'event-example__demo'
  })

  const gestureArea = createElement({
    tag: 'div',
    class: 'gesture-area',
    text: 'Touch or click here'
  })

  const gestureLog = createElement({
    tag: 'div',
    class: 'gesture-log',
    html: '<div class="gesture-log__title">Gesture Log:</div><div class="gesture-log__content"></div>'
  })

  const gestureLogContent = gestureLog.querySelector('.gesture-log__content')

  // Simulate gesture handling
  gestureArea.addEventListener('mousedown', () => {
    const logEntry = createElement({
      tag: 'div',
      class: 'gesture-log__entry',
      text: 'Tap/click detected'
    })
    gestureLogContent.appendChild(logEntry)

    if (gestureLogContent.childNodes.length > 4) {
      gestureLogContent.removeChild(gestureLogContent.firstChild)
    }
  })

  let startX, startY

  gestureArea.addEventListener('mousedown', (e) => {
    startX = e.clientX
    startY = e.clientY
  })

  gestureArea.addEventListener('mouseup', (e) => {
    if (!startX) return

    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    if (Math.abs(deltaX) > 30) {
      const direction = deltaX > 0 ? 'right' : 'left'
      const logEntry = createElement({
        tag: 'div',
        class: 'gesture-log__entry',
        text: `Swipe ${direction} detected`
      })
      gestureLogContent.appendChild(logEntry)

      if (gestureLogContent.childNodes.length > 4) {
        gestureLogContent.removeChild(gestureLogContent.firstChild)
      }
    }

    startX = null
    startY = null
  })

  exampleDemo.appendChild(gestureArea)
  exampleDemo.appendChild(gestureLog)

  touchExample.appendChild(exampleTitle)
  touchExample.appendChild(exampleCode)
  touchExample.appendChild(exampleDemo)

  container.appendChild(touchExplanation)
  container.appendChild(touchExample)
}
