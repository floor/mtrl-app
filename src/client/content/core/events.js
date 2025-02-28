// src/client/content/core/events.js

import {
  contentLayout
} from '../../config'

import {
  createLayout,
  createElement,
  createButton
} from 'mtrl'

export const createEventsContent = (container) => {
  const info = {
    title: 'Events',
    description: 'A standardized system for handling events across components'
  }
  const layout = createLayout(contentLayout(info), container).component

  const ui = createLayout(createEventsLayout(), layout.body).component

  initEventManager(ui)
  initEventBus(ui)
  initTouchGestures(ui)
  initEventDelegation(ui)
  initPerformanceUtils(ui)
}

export const initEventManager = (ui) => {
  const container = ui.eventManager

  // Create explanation and examples for event manager
  const managerExplanation = createElement({
    tag: 'div',
    class: 'event-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'event-explanation__text',
    text: 'The Event Manager provides a standardized way to handle DOM events and custom component events with built-in error handling and lifecycle management.'
  })

  managerExplanation.appendChild(explanationText)

  // Create event manager example
  const eventManagerExample = createElement({
    tag: 'div',
    class: 'event-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'event-example__title',
    text: 'Basic Usage'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'event-example__code',
    text: `// Create an event manager for a component
const events = createEventManager(buttonElement);

// Register DOM event listeners
events.on('click', (e) => console.log('Clicked!'));
events.on('mouseenter', (e) => showTooltip());
events.on('mouseleave', (e) => hideTooltip());

// Emit custom component events
events.emit('activate', { detail: 'Button activated' });

// Forward DOM events to component events
events.forward('click', 'activate');

// Automatically clean up when component is destroyed
component.lifecycle.destroy = () => {
  events.destroy();
};`
  })

  const exampleDemo = createElement({
    tag: 'div',
    class: 'event-example__demo'
  })

  const demoButton = createButton({
    text: 'Try Me',
    variant: 'filled'
  })

  const eventLog = createElement({
    tag: 'div',
    class: 'event-log',
    html: '<div class="event-log__title">Event Log:</div><div class="event-log__content"></div>'
  })

  const logContent = eventLog.querySelector('.event-log__content')

  // Add interaction to the demo button
  demoButton.on('click', () => {
    const logEntry = createElement({
      tag: 'div',
      class: 'event-log__entry',
      text: `Click event at ${new Date().toLocaleTimeString()}`
    })
    logContent.appendChild(logEntry)

    // Keep only the last 5 entries
    if (logContent.childNodes.length > 5) {
      logContent.removeChild(logContent.firstChild)
    }
  })

  demoButton.element.addEventListener('mouseenter', () => {
    const logEntry = createElement({
      tag: 'div',
      class: 'event-log__entry',
      text: `Mouse enter at ${new Date().toLocaleTimeString()}`
    })
    logContent.appendChild(logEntry)

    if (logContent.childNodes.length > 5) {
      logContent.removeChild(logContent.firstChild)
    }
  })

  demoButton.element.addEventListener('mouseleave', () => {
    const logEntry = createElement({
      tag: 'div',
      class: 'event-log__entry',
      text: `Mouse leave at ${new Date().toLocaleTimeString()}`
    })
    logContent.appendChild(logEntry)

    if (logContent.childNodes.length > 5) {
      logContent.removeChild(logContent.firstChild)
    }
  })

  exampleDemo.appendChild(demoButton.element)
  exampleDemo.appendChild(eventLog)

  eventManagerExample.appendChild(exampleTitle)
  eventManagerExample.appendChild(exampleCode)
  eventManagerExample.appendChild(exampleDemo)

  container.appendChild(managerExplanation)
  container.appendChild(eventManagerExample)
}

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

  const publishButton = createButton({
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

export const initTouchGestures = (ui) => {
  const container = ui.touchGestures

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

export const initEventDelegation = (ui) => {
  const container = ui.eventDelegation

  // Create explanation for event delegation
  const delegationExplanation = createElement({
    tag: 'div',
    class: 'event-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'event-explanation__text',
    text: 'Event delegation lets you handle events for multiple elements with a single listener. This improves performance and works with dynamically added elements.'
  })

  delegationExplanation.appendChild(explanationText)

  // Create event delegation example
  const delegationExample = createElement({
    tag: 'div',
    class: 'event-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'event-example__title',
    text: 'Using Event Delegation'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'event-example__code',
    text: `import { delegate } from 'mtrl/core/events';

// Handle clicks on any button within a container
events.on('click', delegate('button', (event, target) => {
  console.log(\`Button clicked: \${target.textContent}\`);
}));

// Delegation with dynamic elements
events.on('change', delegate('input[type="checkbox"]', (event, target) => {
  updateSelection(target.value, target.checked);
}));`
  })

  // Demo for event delegation
  const exampleDemo = createElement({
    tag: 'div',
    class: 'event-example__demo'
  })

  const delegationContainer = createElement({
    tag: 'div',
    class: 'delegation-container'
  })

  const delegationTitle = createElement({
    tag: 'div',
    class: 'delegation-title',
    text: 'Click any item in the list:'
  })

  const itemList = createElement({
    tag: 'ul',
    class: 'delegation-list'
  })

  // Create list items
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']

  items.forEach(itemText => {
    const item = createElement({
      tag: 'li',
      class: 'delegation-item',
      text: itemText
    })
    itemList.appendChild(item)
  })

  const addItemButton = createButton({
    text: 'Add New Item',
    variant: 'outlined'
  })

  const delegationLog = createElement({
    tag: 'div',
    class: 'delegation-log',
    html: '<div class="delegation-log__title">Log:</div><div class="delegation-log__content"></div>'
  })

  const delegationLogContent = delegationLog.querySelector('.delegation-log__content')

  // Set up event delegation demo
  itemList.addEventListener('click', (event) => {
    // Only handle clicks on list items
    if (event.target.matches('.delegation-item')) {
      const logEntry = createElement({
        tag: 'div',
        class: 'delegation-log__entry',
        text: `Clicked: ${event.target.textContent}`
      })
      delegationLogContent.appendChild(logEntry)

      if (delegationLogContent.childNodes.length > 4) {
        delegationLogContent.removeChild(delegationLogContent.firstChild)
      }
    }
  })

  // Add new item button functionality
  addItemButton.on('click', () => {
    const itemCount = itemList.children.length + 1
    const newItem = createElement({
      tag: 'li',
      class: 'delegation-item',
      text: `New Item ${itemCount}`
    })
    itemList.appendChild(newItem)
  })

  delegationContainer.appendChild(delegationTitle)
  delegationContainer.appendChild(itemList)
  delegationContainer.appendChild(addItemButton.element)
  exampleDemo.appendChild(delegationContainer)
  exampleDemo.appendChild(delegationLog)

  delegationExample.appendChild(exampleTitle)
  delegationExample.appendChild(exampleCode)
  delegationExample.appendChild(exampleDemo)

  container.appendChild(delegationExplanation)
  container.appendChild(delegationExample)
}

export const initPerformanceUtils = (ui) => {
  const container = ui.performanceUtils

  // Create explanation for performance utilities
  const perfExplanation = createElement({
    tag: 'div',
    class: 'event-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'event-explanation__text',
    text: 'Performance utilities like throttle and debounce help optimize event handlers that might fire rapidly, such as scroll, resize, or input events.'
  })

  perfExplanation.appendChild(explanationText)

  // Create performance utilities example
  const perfExample = createElement({
    tag: 'div',
    class: 'event-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'event-example__title',
    text: 'Throttle and Debounce'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'event-example__code',
    text: `import { throttle, debounce } from 'mtrl/core/events';

// Throttle: Limit execution to once per 100ms
events.on('scroll', throttle((e) => {
  updateScrollPosition(e.scrollY);
}, 100));

// Debounce: Only execute after 300ms of inactivity
events.on('input', debounce((e) => {
  searchProducts(e.target.value);
}, 300));`
  })

  // Demo for performance utilities
  const exampleDemo = createElement({
    tag: 'div',
    class: 'event-example__demo'
  })

  const perfDemo = createElement({
    tag: 'div',
    class: 'perf-demo'
  })

  const searchContainer = createElement({
    tag: 'div',
    class: 'search-container'
  })

  const searchLabel = createElement({
    tag: 'label',
    class: 'search-label',
    text: 'Type to search (debounced):'
  })

  const searchInput = createElement({
    tag: 'input',
    class: 'search-input',
    attributes: {
      type: 'text',
      placeholder: 'Type something...'
    }
  })

  const searchResults = createElement({
    tag: 'div',
    class: 'search-results',
    text: 'Results will appear after you stop typing...'
  })

  // Simulate debounced search
  let debounceTimeout
  searchInput.addEventListener('input', (e) => {
    searchResults.textContent = 'Waiting for you to stop typing...'

    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      const query = e.target.value.trim()
      if (query) {
        searchResults.textContent = `Searching for: "${query}"`
      } else {
        searchResults.textContent = 'Enter a search term'
      }
    }, 500) // 500ms debounce
  })

  searchContainer.appendChild(searchLabel)
  searchContainer.appendChild(searchInput)
  searchContainer.appendChild(searchResults)

  perfDemo.appendChild(searchContainer)
  exampleDemo.appendChild(perfDemo)

  perfExample.appendChild(exampleTitle)
  perfExample.appendChild(exampleCode)
  perfExample.appendChild(exampleDemo)

  container.appendChild(perfExplanation)
  container.appendChild(perfExample)
}

export const createEventsLayout = () => [
  // Event Manager Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Event Manager' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'The Event Manager provides a standardized way to handle DOM events and custom component events with built-in error handling and automatic cleanup.' }],
    [createElement, 'eventManager', { id: 'eventManager', class: 'event-manager-container' }]
  ],

  // Event Bus Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Event Bus' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'The Event Bus enables application-wide communication between components using a publish/subscribe pattern.' }],
    [createElement, 'eventBus', { id: 'eventBus', class: 'event-bus-container' }]
  ],

  // Touch Gestures Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Touch Gestures' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Built-in support for touch gestures makes it easy to create consistent interactions across devices.' }],
    [createElement, 'touchGestures', { id: 'touchGestures', class: 'touch-gestures-container' }]
  ],

  // Event Delegation Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Event Delegation' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Event delegation lets you handle events for multiple elements with a single listener, improving performance and working with dynamic elements.' }],
    [createElement, 'eventDelegation', { id: 'eventDelegation', class: 'event-delegation-container' }]
  ],

  // Performance Utilities Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Performance Utilities' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Performance utilities like throttle and debounce help optimize event handlers that might fire rapidly.' }],
    [createElement, 'performanceUtils', { id: 'performanceUtils', class: 'performance-utils-container' }]
  ],

  // Best Practices Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Best Practices' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Follow these guidelines to create maintainable and efficient event handling in your components.' }],
    [createElement, { tag: 'div', class: 'best-practices' },
      [createElement, { tag: 'ul', class: 'best-practices-list' },
        [createElement, { tag: 'li', text: 'Always clean up event listeners when components are destroyed to prevent memory leaks.' }],
        [createElement, { tag: 'li', text: 'Use event delegation for collections of similar elements.' }],
        [createElement, { tag: 'li', text: 'Apply throttle or debounce to expensive handlers for scrolling, resizing, or input events.' }],
        [createElement, { tag: 'li', text: 'Use event namespacing for better organization in complex components.' }],
        [createElement, { tag: 'li', text: 'Keep event handlers focused and lightweight - move complex logic to separate functions.' }]
      ]
    ]
  ],

  // Implementation Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Implementation' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Learn how to use the events system in your code.' }],
    [createElement, { tag: 'div', class: 'code-examples' },
      [createElement, { tag: 'h3', text: 'Component Implementation' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `// In a component's setup method
setup() {
  this.events = createEventManager(this.element);
  
  // Register DOM event handlers
  this.events.on('click', (e) => {
    if (!this.disabled) {
      this.events.emit('click', { originalEvent: e });
    }
  });
  
  // Add touch support
  this.events.on('tap', (e) => {
    if (!this.disabled) {
      this.events.emit('click', { originalEvent: e });
    }
  });
  
  // Clean up when component is destroyed
  this.lifecycle.onUnmount(() => {
    this.events.destroy();
  });
  
  return this;
}`
      }],
      [createElement, { tag: 'h3', text: 'Using with Event Bus' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `// Create a shared event bus
const themeEvents = createEventBus();

// In theme manager component
themeSelector.on('change', (e) => {
  const newTheme = e.target.value;
  themeEvents.emit('theme-changed', { theme: newTheme });
});

// In any other component
themeEvents.on('theme-changed', ({ theme }) => {
  updateThemeStyles(theme);
});`
      }]
    ]
  ]
]
