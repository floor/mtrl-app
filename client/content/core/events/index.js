// src/client/content/core/events.js

import {
  contentLayout
} from '../../../layout'

import {
  createLayout,
  createElement
} from 'mtrl'

import { initEventManager } from './manager'
import { initEventBus } from './bus'
import { initTouchGestures } from './gestures'
import { initEventDelegation } from './delegation'
import { initPerformanceUtils } from './performance'

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
