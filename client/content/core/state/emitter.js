import {
  createElement,
  createButton,
  createLayout
} from 'mtrl'

import {
  createContentLayout
} from '../../../layout'

export const initEmitter = (container) => {
  const section = createLayout(createContentLayout({
    title: 'Emitter',
    description: 'A lightweight event emitter for implementing the Observer pattern and enabling component communication.',
    bodyClass: 'grid'
  }), container).component

  // Create explanation and examples for emitter
  const emitterExplanation = createElement({
    tag: 'div',
    class: 'state-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'state-explanation__text',
    text: 'The Emitter provides a simple yet powerful event system for implementing the Observer pattern. It enables components to communicate through publish/subscribe events.'
  })

  emitterExplanation.appendChild(explanationText)

  // Create emitter example
  const emitterExample = createElement({
    tag: 'div',
    class: 'state-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'state-example__title',
    text: 'Basic Usage'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'state-example__code',
    text: `// Create an emitter
const emitter = createEmitter();

// Subscribe to events
const unsubscribe = emitter.on('change', (data) => {
  console.log('Changed:', data);
});

// Emit events
emitter.emit('change', { value: 42 });

// Unsubscribe when no longer needed
unsubscribe();

// Clear all subscriptions
emitter.clear();`
  })

  // Create an interactive demo
  const exampleDemo = createElement({
    tag: 'div',
    class: 'state-example__demo'
  })

  const demoContainer = createElement({
    tag: 'div',
    class: 'emitter-demo'
  })

  const publishers = createElement({
    tag: 'div',
    class: 'emitter-publishers'
  })

  const publishersTitle = createElement({
    tag: 'div',
    class: 'emitter-section-title',
    text: 'Publishers'
  })

  publishers.appendChild(publishersTitle)

  // Add a few publisher buttons that emit different events
  const events = [
    { name: 'update', color: 'primary' },
    { name: 'error', color: 'error' },
    { name: 'success', color: 'tertiary' }
  ]

  events.forEach(event => {
    const button = createButton({
      text: `Emit "${event.name}"`,
      variant: 'filled',
      class: `emitter-button emitter-${event.color}`
    })

    button.on('click', () => {
      const timestamp = new Date().toLocaleTimeString()
      const logEntry = createElement({
        tag: 'div',
        class: `emitter-log__entry emitter-log__entry--${event.name}`,
        text: `${timestamp}: "${event.name}" event emitted`
      })
      logContainer.appendChild(logEntry)

      // Keep only the last 5 entries
      if (logContainer.childNodes.length > 5) {
        logContainer.removeChild(logContainer.firstChild)
      }
    })

    publishers.appendChild(button.element)
  })

  // Create subscribers section
  const subscribers = createElement({
    tag: 'div',
    class: 'emitter-subscribers'
  })

  const subscribersTitle = createElement({
    tag: 'div',
    class: 'emitter-section-title',
    text: 'Subscribers'
  })

  subscribers.appendChild(subscribersTitle)

  const logContainer = createElement({
    tag: 'div',
    class: 'emitter-log'
  })

  const logHeader = createElement({
    tag: 'div',
    class: 'emitter-log__header',
    text: 'Event log:'
  })

  logContainer.appendChild(logHeader)

  subscribers.appendChild(logContainer)

  // Add the sections to the demo container
  demoContainer.appendChild(publishers)
  demoContainer.appendChild(subscribers)
  exampleDemo.appendChild(demoContainer)

  // Add all sections to the example
  emitterExample.appendChild(exampleTitle)
  emitterExample.appendChild(exampleCode)
  emitterExample.appendChild(exampleDemo)

  // Add everything to the container
  section.body.appendChild(emitterExplanation)
  section.body.appendChild(emitterExample)
}
