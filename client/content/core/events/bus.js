import {
  fLayout,
  createElement,
  fButton
} from 'mtrl'

export const initEventBus = (ui) => {
  const container = ui.eventBus

  // Create explanation and examples for event bus
  const busExplanation = createElement({
    tag: 'div',
    class: 'event-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'event-explanation__text',
    text: 'The Event Bus enables application-wide communication between components using a publish/subscribe pattern. It\'s ideal for coordinating unrelated components or broadcasting global events.'
  })

  busExplanation.appendChild(explanationText)

  // Create event bus example
  const eventBusExample = createElement({
    tag: 'div',
    class: 'event-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'event-example__title',
    text: 'Using the Event Bus'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'event-example__code',
    text: `// Create or access a shared event bus
const bus = createEventBus();

// Subscribe to events
const unsubscribe = bus.on('theme-changed', (theme) => {
  applyTheme(theme);
});

// Publish events
bus.emit('theme-changed', 'dark');

// Unsubscribe when no longer needed
unsubscribe();`
  })

  // Demo for event bus
  const exampleDemo = createElement({
    tag: 'div',
    class: 'event-example__demo'
  })

  const demoContainer = createElement({
    tag: 'div',
    class: 'event-bus-demo'
  })

  const demoSender = createElement({
    tag: 'div',
    class: 'event-bus-sender'
  })

  const senderTitle = createElement({
    tag: 'div',
    class: 'event-bus-title',
    text: 'Component A (Publisher)'
  })

  const publishButton = fButton({
    text: 'Send Message',
    variant: 'filled'
  })

  const demoReceiver = createElement({
    tag: 'div',
    class: 'event-bus-receiver'
  })

  const receiverTitle = createElement({
    tag: 'div',
    class: 'event-bus-title',
    text: 'Component B (Subscriber)'
  })

  const receiverContent = createElement({
    tag: 'div',
    class: 'event-bus-content',
    text: 'Waiting for messages...'
  })

  // Connect the demo components
  publishButton.on('click', () => {
    const messages = [
      'Hello from Component A!',
      'Event bus message received',
      'Communication successful',
      'Message sent at ' + new Date().toLocaleTimeString()
    ]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    receiverContent.textContent = randomMessage
  })

  demoSender.appendChild(senderTitle)
  demoSender.appendChild(publishButton.element)
  demoReceiver.appendChild(receiverTitle)
  demoReceiver.appendChild(receiverContent)
  demoContainer.appendChild(demoSender)
  demoContainer.appendChild(demoReceiver)
  exampleDemo.appendChild(demoContainer)

  eventBusExample.appendChild(exampleTitle)
  eventBusExample.appendChild(exampleCode)
  eventBusExample.appendChild(exampleDemo)

  container.appendChild(busExplanation)
  container.appendChild(eventBusExample)
}
