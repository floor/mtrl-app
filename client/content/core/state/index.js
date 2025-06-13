// src/client/content/core/state.js

import {
  createContentLayout
} from '../../../layout'

import {
  createLayout
} from 'mtrl'

import { initStore } from './store'
import { initLifecycle } from './lifecycle'
import { initDisabled } from './disabled'
import { initComposingState } from './composing'

export const createStateContent = (container) => {
  const info = {
    title: 'State',
    description: 'A lightweight state management system for components and applications'
  }
  const layout = createLayout(createContentLayout(info), container).component

  initStore(layout.body)
  initLifecycle(layout.body)
  initDisabled(layout.body)
  initComposingState(layout.body)
}

// export const createStateLayout = () => [
//   // Emitter Section
//   [{ tag: 'section', class: 'mtrl-content__section' },
//     [{ tag: 'h2', class: 'mtrl-content__section-title', text: 'Emitter' }],
//     [{ tag: 'p', class: 'mtrl-content__description', text: 'A lightweight event emitter for implementing the Observer pattern and enabling component communication.' }],
//     ['emitter', { id: 'emitter', class: 'emitter-container' }]
//   ],

//   // Store Section
//   [{ tag: 'section', class: 'mtrl-content__section' },
//     [{ tag: 'h2', class: 'mtrl-content__section-title', text: 'Store' }],
//     [{ tag: 'p', class: 'mtrl-content__description', text: 'A centralized state container with support for derived state and middleware.' }],
//     ['store', { id: 'store', class: 'store-container' }]
//   ],

//   // Lifecycle Section
//   [{ tag: 'section', class: 'mtrl-content__section' },
//     [{ tag: 'h2', class: 'mtrl-content__section-title', text: 'Lifecycle' }],
//     [{ tag: 'p', class: 'mtrl-content__description', text: 'Manage component lifecycle states and ensure proper resource cleanup.' }],
//     ['lifecycle', { id: 'lifecycle', class: 'lifecycle-container' }]
//   ],

//   // Disabled Section
//   [{ tag: 'section', class: 'mtrl-content__section' },
//     [{ tag: 'h2', class: 'mtrl-content__section-title', text: 'Disabled' }],
//     [{ tag: 'p', class: 'mtrl-content__description', text: 'A utility for managing the disabled state of components.' }],
//     ['disabled', { id: 'disabled', class: 'disabled-container' }]
//   ],

//   // Composing State Section
//   [{ tag: 'section', class: 'mtrl-content__section' },
//     [{ tag: 'h2', class: 'mtrl-content__section-title', text: 'Composing State' }],
//     [{ tag: 'p', class: 'mtrl-content__description', text: 'Compose multiple state managers to create complex behavior from simple building blocks.' }],
//     ['composing', { id: 'composing', class: 'composing-container' }]
//   ],

//   // Implementation Section
//   [{ tag: 'section', class: 'mtrl-content__section' },
//     [{ tag: 'h2', class: 'mtrl-content__section-title', text: 'Implementation' }],
//     [{ tag: 'p', class: 'mtrl-content__description', text: 'Learn how to use the state system in your components.' }],
//     [{ tag: 'div', class: 'code-examples' },
//       [{ tag: 'h3', text: 'Creating Components with State' }],
//       [{
//         tag: 'pre', class: 'code-block', text: `// Create a simple component with state management
// const createCounter = (config = {}) => {
//   // Create base element
//   const element = createElement({
//     tag: 'div',
//     class: 'counter'
//   });

//   // Create display and controls
//   const display = createElement({
//     tag: 'div',
//     class: 'counter-display',
//     text: '0'
//   });

//   const incrementBtn = createElement({
//     tag: 'button',
//     class: 'counter-button',
//     text: '+'
//   });

//   const decrementBtn = createElement({
//     tag: 'button',
//     class: 'counter-button',
//     text: '-'
//   });

//   // Add elements to the DOM
//   element.appendChild(display);
//   element.appendChild(decrementBtn);
//   element.appendChild(incrementBtn);

//   // Create state managers
//   const events = createEventManager(element);
//   const disabled = createDisabled(element);
//   const lifecycle = createLifecycle(element, { events });

//   // Create local state
//   let count = config.initialCount || 0;

//   // Set up event handlers
//   incrementBtn.addEventListener('click', () => {
//     if (!disabled.isDisabled()) {
//       count++;
//       updateDisplay();
//       events.emit('change', { count });
//     }
//   });

//   decrementBtn.addEventListener('click', () => {
//     if (!disabled.isDisabled()) {
//       count--;
//       updateDisplay();
//       events.emit('change', { count });
//     }
//   });

//   // Update display based on state
//   function updateDisplay() {
//     display.textContent = count.toString();
//   }

//   // Initialize the display
//   updateDisplay();

//   // Register lifecycle hooks
//   lifecycle.onMount(() => {
//     console.log('Counter mounted, initial count:', count);
//   });

//   lifecycle.onUnmount(() => {
//     console.log('Counter unmounted, final count:', count);
//   });

//   // Return the public API
//   return {
//     element,
//     events,
//     disabled,
//     lifecycle,
//     getCount: () => count,
//     setCount: (newCount) => {
//       count = newCount;
//       updateDisplay();
//       return this;
//     },
//     increment: () => {
//       if (!disabled.isDisabled()) {
//         count++;
//         updateDisplay();
//         events.emit('change', { count });
//       }
//       return this;
//     },
//     decrement: () => {
//       if (!disabled.isDisabled()) {
//         count--;
//         updateDisplay();
//         events.emit('change', { count });
//       }
//       return this;
//     },
//     reset: () => {
//       count = 0;
//       updateDisplay();
//       events.emit('change', { count });
//       return this;
//     }
//   };
// };`
//       }],
//       [{ tag: 'h3', text: 'Using Middleware with Store' }],
//       [{
//         tag: 'pre', class: 'code-block', text: `// Create a logging middleware
// const loggingMiddleware = (newState, oldState) => {
//   console.log('State change:', {
//     old: oldState,
//     new: newState,
//     diff: Object.keys(newState).reduce((acc, key) => {
//       if (newState[key] !== oldState[key]) {
//         acc[key] = { from: oldState[key], to: newState[key] };
//       }
//       return acc;
//     }, {})
//   });
//   return newState;
// };

// // Create a validation middleware
// const validationMiddleware = (newState, oldState) => {
//   // Ensure count never goes below zero
//   if (newState.count < 0) {
//     return { ...newState, count: 0 };
//   }

//   // Validate other properties as needed
//   return newState;
// };

// // Create a store with middleware
// const store = createStore(
//   { count: 0, items: [], loading: false },
//   { middleware: [validationMiddleware, loggingMiddleware] }
// );

// // Updates will now pass through both middleware functions
// store.setState({ count: store.getState().count - 5 });
// // The validation middleware will correct the count to 0
// // The logging middleware will log the state change`
//       }]
//     ]
//   ]
// ]
