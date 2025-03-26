// src/client/content/core/state.js

import {
  contentLayout
} from '../../layout'

import {
  createStructure,
  createElement,
  createButton,
  createTextfield
} from 'mtrl'

export const createStateContent = (container) => {
  const info = {
    title: 'State',
    description: 'A lightweight state management system for components and applications'
  }
  const layout = createStructure(contentLayout(info), container).component

  const ui = createStructure(createStateLayout(), layout.body).component

  initEmitter(ui)
  initStore(ui)
  initLifecycle(ui)
  initDisabled(ui)
  initComposingState(ui)
}

export const initEmitter = (ui) => {
  const container = ui.emitter

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
  container.appendChild(emitterExplanation)
  container.appendChild(emitterExample)
}

export const initStore = (ui) => {
  const container = ui.store

  // Create explanation for store
  const storeExplanation = createElement({
    tag: 'div',
    class: 'state-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'state-explanation__text',
    text: 'The Store provides centralized state management with support for derived state and middleware. It\'s a lightweight alternative to libraries like Redux.'
  })

  storeExplanation.appendChild(explanationText)

  // Create store example
  const storeExample = createElement({
    tag: 'div',
    class: 'state-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'state-example__title',
    text: 'Using the Store'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'state-example__code',
    text: `// Create a store with initial state
const store = createStore({
  count: 0,
  text: '',
  todos: []
});

// Subscribe to state changes
store.subscribe((newState, oldState) => {
  updateUI(newState);
});

// Update state
store.setState({ count: store.getState().count + 1 });

// Or use a function updater
store.setState(state => ({
  ...state,
  count: state.count + 1
}));

// Create derived state (computed values)
store.derive('completedTodos', state => 
  state.todos.filter(todo => todo.completed)
);`
  })

  // Create interactive demo for store
  const exampleDemo = createElement({
    tag: 'div',
    class: 'state-example__demo'
  })

  const counterDemo = createElement({
    tag: 'div',
    class: 'store-demo'
  })

  const counterDisplay = createElement({
    tag: 'div',
    class: 'store-counter__display',
    text: '0'
  })

  const counterControls = createElement({
    tag: 'div',
    class: 'store-counter__controls'
  })

  const decrementButton = createButton({
    text: '-',
    variant: 'outlined'
  })

  const incrementButton = createButton({
    text: '+',
    variant: 'outlined'
  })

  const resetButton = createButton({
    text: 'Reset',
    variant: 'tonal'
  })

  // Connect the buttons to update the counter
  let counter = 0

  decrementButton.on('click', () => {
    counter--
    counterDisplay.textContent = counter.toString()
    updateDerivedValues()
  })

  incrementButton.on('click', () => {
    counter++
    counterDisplay.textContent = counter.toString()
    updateDerivedValues()
  })

  resetButton.on('click', () => {
    counter = 0
    counterDisplay.textContent = '0'
    updateDerivedValues()
  })

  // Add derived values display
  const derivedValues = createElement({
    tag: 'div',
    class: 'store-derived'
  })

  const derivedTitle = createElement({
    tag: 'div',
    class: 'store-derived__title',
    text: 'Derived Values:'
  })

  const isPositive = createElement({
    tag: 'div',
    class: 'store-derived__value',
    html: '<strong>isPositive:</strong> <span class="derived-positive">true</span>'
  })

  const isEven = createElement({
    tag: 'div',
    class: 'store-derived__value',
    html: '<strong>isEven:</strong> <span class="derived-even">true</span>'
  })

  const squared = createElement({
    tag: 'div',
    class: 'store-derived__value',
    html: '<strong>squared:</strong> <span class="derived-squared">0</span>'
  })

  function updateDerivedValues () {
    const isPositiveValue = counter > 0
    const isEvenValue = counter % 2 === 0
    const squaredValue = counter * counter

    const positiveEl = isPositive.querySelector('.derived-positive')
    positiveEl.textContent = isPositiveValue.toString()
    positiveEl.className = `derived-positive ${isPositiveValue ? 'is-true' : 'is-false'}`

    const evenEl = isEven.querySelector('.derived-even')
    evenEl.textContent = isEvenValue.toString()
    evenEl.className = `derived-even ${isEvenValue ? 'is-true' : 'is-false'}`

    const squaredEl = squared.querySelector('.derived-squared')
    squaredEl.textContent = squaredValue.toString()
  }

  // Assemble all the elements
  counterControls.appendChild(decrementButton.element)
  counterControls.appendChild(counterDisplay)
  counterControls.appendChild(incrementButton.element)
  counterControls.appendChild(resetButton.element)

  derivedValues.appendChild(derivedTitle)
  derivedValues.appendChild(isPositive)
  derivedValues.appendChild(isEven)
  derivedValues.appendChild(squared)

  counterDemo.appendChild(counterControls)
  counterDemo.appendChild(derivedValues)
  exampleDemo.appendChild(counterDemo)

  storeExample.appendChild(exampleTitle)
  storeExample.appendChild(exampleCode)
  storeExample.appendChild(exampleDemo)

  container.appendChild(storeExplanation)
  container.appendChild(storeExample)
}

export const initLifecycle = (ui) => {
  const container = ui.lifecycle

  // Create explanation for lifecycle
  const lifecycleExplanation = createElement({
    tag: 'div',
    class: 'state-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'state-explanation__text',
    text: 'The Lifecycle manager helps track component lifecycle states and execute code at specific stages. It ensures proper resource management and cleanup.'
  })

  lifecycleExplanation.appendChild(explanationText)

  // Create lifecycle example
  const lifecycleExample = createElement({
    tag: 'div',
    class: 'state-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'state-example__title',
    text: 'Component Lifecycle'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'state-example__code',
    text: `// Create a lifecycle manager for a component
const lifecycle = createLifecycle(element, {
  events: eventManager,
  text: textManager
});

// Register mount callback
lifecycle.onMount(() => {
  console.log('Component mounted');
  fetchData();
});

// Register unmount callback
lifecycle.onUnmount(() => {
  console.log('Component unmounted');
  cancelPendingRequests();
});

// Mount the component
lifecycle.mount();

// Check if mounted
if (lifecycle.isMounted()) {
  // Do something only if mounted
}

// Unmount the component
lifecycle.unmount();

// Destroy the component and clean up all resources
lifecycle.destroy();`
  })

  // Create interactive demo for lifecycle
  const exampleDemo = createElement({
    tag: 'div',
    class: 'state-example__demo'
  })

  const lifecycleDemo = createElement({
    tag: 'div',
    class: 'lifecycle-demo'
  })

  const componentContainer = createElement({
    tag: 'div',
    class: 'lifecycle-component-container'
  })

  const mountButton = createButton({
    text: 'Mount Component',
    variant: 'filled'
  })

  const unmountButton = createButton({
    text: 'Unmount Component',
    variant: 'outlined',
    disabled: true
  })

  const componentElement = createElement({
    tag: 'div',
    class: 'lifecycle-component lifecycle-component--unmounted',
    html: '<div class="lifecycle-component__content">Component</div>'
  })

  const lifecycleLog = createElement({
    tag: 'div',
    class: 'lifecycle-log'
  })

  const logHeader = createElement({
    tag: 'div',
    class: 'lifecycle-log__header',
    text: 'Lifecycle Events:'
  })

  lifecycleLog.appendChild(logHeader)

  const logEntries = createElement({
    tag: 'div',
    class: 'lifecycle-log__entries'
  })

  lifecycleLog.appendChild(logEntries)

  // Add lifecycle functionality
  let isMounted = false

  function addLogEntry (text) {
    const timestamp = new Date().toLocaleTimeString()
    const entry = createElement({
      tag: 'div',
      class: 'lifecycle-log__entry',
      text: `${timestamp}: ${text}`
    })
    logEntries.appendChild(entry)

    // Keep only the last 5 entries
    if (logEntries.childNodes.length > 5) {
      logEntries.removeChild(logEntries.firstChild)
    }
  }

  mountButton.on('click', () => {
    if (!isMounted) {
      isMounted = true
      componentElement.classList.remove('lifecycle-component--unmounted')
      componentElement.classList.add('lifecycle-component--mounted')
      addLogEntry('Component mounted')
      addLogEntry('onMount callbacks executed')
      mountButton.disable()
      unmountButton.element.disabled = false

      // Add an interval to demonstrate ongoing activity
      const contentEl = componentElement.querySelector('.lifecycle-component__content')
      contentEl.innerHTML = '<div>Component</div><div class="lifecycle-pulse"></div>'
    }
  })

  unmountButton.on('click', () => {
    if (isMounted) {
      isMounted = false
      componentElement.classList.remove('lifecycle-component--mounted')
      componentElement.classList.add('lifecycle-component--unmounted')
      addLogEntry('Component unmounted')
      addLogEntry('onUnmount callbacks executed')
      unmountButton.disable()
      mountButton.element.disabled = false

      // Remove the interval element
      const contentEl = componentElement.querySelector('.lifecycle-component__content')
      contentEl.innerHTML = 'Component'
    }
  })

  componentContainer.appendChild(componentElement)
  lifecycleDemo.appendChild(mountButton.element)
  lifecycleDemo.appendChild(unmountButton.element)
  lifecycleDemo.appendChild(componentContainer)
  lifecycleDemo.appendChild(lifecycleLog)
  exampleDemo.appendChild(lifecycleDemo)

  lifecycleExample.appendChild(exampleTitle)
  lifecycleExample.appendChild(exampleCode)
  lifecycleExample.appendChild(exampleDemo)

  container.appendChild(lifecycleExplanation)
  container.appendChild(lifecycleExample)
}

export const initDisabled = (ui) => {
  const container = ui.disabled

  // Create explanation for disabled state
  const disabledExplanation = createElement({
    tag: 'div',
    class: 'state-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'state-explanation__text',
    text: 'The Disabled state manager provides a simple interface for toggling the disabled state of components. It ensures consistent disabled behavior across all components.'
  })

  disabledExplanation.appendChild(explanationText)

  // Create disabled example
  const disabledExample = createElement({
    tag: 'div',
    class: 'state-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'state-example__title',
    text: 'Disabled State Management'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'state-example__code',
    text: `// Create a disabled state controller for an element
const disabled = createDisabled(buttonElement);

// Disable the element
disabled.disable();

// Enable the element
disabled.enable();

// Toggle between enabled and disabled
disabled.toggle();

// Check if the element is disabled
if (disabled.isDisabled()) {
  // Do something based on disabled state
}`
  })

  // Create interactive demo for disabled state
  const exampleDemo = createElement({
    tag: 'div',
    class: 'state-example__demo'
  })

  const disabledDemo = createElement({
    tag: 'div',
    class: 'disabled-demo'
  })

  const demoControls = createElement({
    tag: 'div',
    class: 'disabled-controls'
  })

  const toggleButton = createButton({
    text: 'Toggle Disabled State',
    variant: 'filled'
  })

  const componentsContainer = createElement({
    tag: 'div',
    class: 'disabled-components'
  })

  // Create several components to demonstrate disabled state
  const demoButton = createButton({
    text: 'Button Component',
    variant: 'filled'
  })

  const demoOutlinedButton = createButton({
    text: 'Outlined Button',
    variant: 'outlined'
  })

  const demoTextField = createTextfield({
    label: 'Text Field',
    placeholder: 'Enter text here'
  })

  // Add toggle functionality
  toggleButton.on('click', () => {
    // Check if currently disabled
    const isDisabled = demoButton.element.disabled

    if (isDisabled) {
      // Enable all components
      demoButton.element.disabled = false
      demoOutlinedButton.element.disabled = false
      demoTextField.input.disabled = false

      // Update appearance
      demoButton.element.classList.remove('mtrl-button--disabled')
      demoOutlinedButton.element.classList.remove('mtrl-button--disabled')
      demoTextField.element.classList.remove('mtrl-textfield--disabled')
    } else {
      // Disable all components
      demoButton.element.disabled = true
      demoOutlinedButton.element.disabled = true
      demoTextField.input.disabled = true

      // Update appearance
      demoButton.element.classList.add('mtrl-button--disabled')
      demoOutlinedButton.element.classList.add('mtrl-button--disabled')
      demoTextField.element.classList.add('mtrl-textfield--disabled')
    }
  })

  // Assemble the demo
  demoControls.appendChild(toggleButton.element)
  componentsContainer.appendChild(demoButton.element)
  componentsContainer.appendChild(demoOutlinedButton.element)
  componentsContainer.appendChild(demoTextField.element)

  disabledDemo.appendChild(demoControls)
  disabledDemo.appendChild(componentsContainer)
  exampleDemo.appendChild(disabledDemo)

  disabledExample.appendChild(exampleTitle)
  disabledExample.appendChild(exampleCode)
  disabledExample.appendChild(exampleDemo)

  container.appendChild(disabledExplanation)
  container.appendChild(disabledExample)
}

export const initComposingState = (ui) => {
  const container = ui.composing

  // Create explanation for composing state managers
  const composingExplanation = createElement({
    tag: 'div',
    class: 'state-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'state-explanation__text',
    text: 'State managers can be composed to create complex behavior from simple building blocks. This approach follows functional composition principles and enhances reusability.'
  })

  composingExplanation.appendChild(explanationText)

  // Create example for composing state
  const composingExample = createElement({
    tag: 'div',
    class: 'state-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'state-example__title',
    text: 'Composing State Managers'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'state-example__code',
    text: `// Create a complete component with composed state managers
const createToggleButton = (config = {}) => {
  // Create the base element
  const element = createElement({
    tag: 'button',
    class: 'toggle-button',
    text: config.text || 'Toggle'
  });
  
  // Add state managers
  const events = createEventManager(element);
  const disabled = createDisabled(element);
  const lifecycle = createLifecycle(element, { events });
  
  // Create local state
  let isOn = config.initialState || false;
  
  // Add toggle functionality
  events.on('click', () => {
    if (!disabled.isDisabled()) {
      isOn = !isOn;
      updateState();
      events.emit('change', { isOn });
    }
  });
  
  function updateState() {
    element.classList.toggle('toggle-button--on', isOn);
  }
  
  // Initialize state
  updateState();
  
  // Define the component API
  return {
    element,
    events,
    disabled,
    lifecycle,
    isOn: () => isOn,
    setOn: (value) => {
      isOn = !!value;
      updateState();
      return this;
    },
    toggle: () => {
      isOn = !isOn;
      updateState();
      events.emit('change', { isOn });
      return this;
    }
  };
};`
  })

  // Create an interactive demo for composing state
  const exampleDemo = createElement({
    tag: 'div',
    class: 'state-example__demo'
  })

  const composingDemo = createElement({
    tag: 'div',
    class: 'composing-demo'
  })

  // Create a toggle button to demonstrate composition
  const toggleButton = createElement({
    tag: 'button',
    class: 'toggle-button',
    text: 'Toggle State'
  })

  const toggleStatus = createElement({
    tag: 'div',
    class: 'toggle-status',
    text: 'Current state: OFF'
  })

  const controlsContainer = createElement({
    tag: 'div',
    class: 'composing-controls'
  })

  const disableButton = createButton({
    text: 'Toggle Disabled',
    variant: 'outlined'
  })

  const resetButton = createButton({
    text: 'Reset State',
    variant: 'outlined'
  })

  const eventLog = createElement({
    tag: 'div',
    class: 'composing-log'
  })

  const logHeader = createElement({
    tag: 'div',
    class: 'composing-log__header',
    text: 'Events:'
  })

  const logEntries = createElement({
    tag: 'div',
    class: 'composing-log__entries'
  })

  eventLog.appendChild(logHeader)
  eventLog.appendChild(logEntries)

  // Implement toggle functionality
  let isOn = false
  let isDisabled = false

  function updateToggleState () {
    if (isOn) {
      toggleButton.classList.add('toggle-button--on')
      toggleStatus.textContent = 'Current state: ON'
    } else {
      toggleButton.classList.remove('toggle-button--on')
      toggleStatus.textContent = 'Current state: OFF'
    }
  }

  function updateDisabledState () {
    if (isDisabled) {
      toggleButton.classList.add('toggle-button--disabled')
      toggleButton.disabled = true
    } else {
      toggleButton.classList.remove('toggle-button--disabled')
      toggleButton.disabled = false
    }
  }

  function addLogEntry (text) {
    const timestamp = new Date().toLocaleTimeString()
    const entry = createElement({
      tag: 'div',
      class: 'composing-log__entry',
      text: `${timestamp}: ${text}`
    })
    logEntries.appendChild(entry)

    // Keep only the last 5 entries
    if (logEntries.childNodes.length > 5) {
      logEntries.removeChild(logEntries.firstChild)
    }
  }

  toggleButton.addEventListener('click', () => {
    if (!isDisabled) {
      isOn = !isOn
      updateToggleState()
      addLogEntry(`State changed to: ${isOn ? 'ON' : 'OFF'}`)
    }
  })

  disableButton.on('click', () => {
    isDisabled = !isDisabled
    updateDisabledState()
    addLogEntry(`Component ${isDisabled ? 'disabled' : 'enabled'}`)
  })

  resetButton.on('click', () => {
    isOn = false
    updateToggleState()
    addLogEntry('State reset to: OFF')
  })

  // Assemble the demo
  composingDemo.appendChild(toggleButton)
  composingDemo.appendChild(toggleStatus)

  controlsContainer.appendChild(disableButton.element)
  controlsContainer.appendChild(resetButton.element)

  composingDemo.appendChild(controlsContainer)
  composingDemo.appendChild(eventLog)

  exampleDemo.appendChild(composingDemo)

  composingExample.appendChild(exampleTitle)
  composingExample.appendChild(exampleCode)
  composingExample.appendChild(exampleDemo)

  container.appendChild(composingExplanation)
  container.appendChild(composingExample)
}

export const createStateLayout = () => [
  // Emitter Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Emitter' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'A lightweight event emitter for implementing the Observer pattern and enabling component communication.' }],
    [createElement, 'emitter', { id: 'emitter', class: 'emitter-container' }]
  ],

  // Store Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Store' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'A centralized state container with support for derived state and middleware.' }],
    [createElement, 'store', { id: 'store', class: 'store-container' }]
  ],

  // Lifecycle Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Lifecycle' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Manage component lifecycle states and ensure proper resource cleanup.' }],
    [createElement, 'lifecycle', { id: 'lifecycle', class: 'lifecycle-container' }]
  ],

  // Disabled Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Disabled' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'A utility for managing the disabled state of components.' }],
    [createElement, 'disabled', { id: 'disabled', class: 'disabled-container' }]
  ],

  // Composing State Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Composing State' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Compose multiple state managers to create complex behavior from simple building blocks.' }],
    [createElement, 'composing', { id: 'composing', class: 'composing-container' }]
  ],

  // Implementation Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Implementation' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Learn how to use the state system in your components.' }],
    [createElement, { tag: 'div', class: 'code-examples' },
      [createElement, { tag: 'h3', text: 'Creating Components with State' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `// Create a simple component with state management
const createCounter = (config = {}) => {
  // Create base element
  const element = createElement({
    tag: 'div',
    class: 'counter'
  });
  
  // Create display and controls
  const display = createElement({
    tag: 'div',
    class: 'counter-display',
    text: '0'
  });
  
  const incrementBtn = createElement({
    tag: 'button',
    class: 'counter-button',
    text: '+'
  });
  
  const decrementBtn = createElement({
    tag: 'button',
    class: 'counter-button',
    text: '-'
  });
  
  // Add elements to the DOM
  element.appendChild(display);
  element.appendChild(decrementBtn);
  element.appendChild(incrementBtn);
  
  // Create state managers
  const events = createEventManager(element);
  const disabled = createDisabled(element);
  const lifecycle = createLifecycle(element, { events });
  
  // Create local state
  let count = config.initialCount || 0;
  
  // Set up event handlers
  incrementBtn.addEventListener('click', () => {
    if (!disabled.isDisabled()) {
      count++;
      updateDisplay();
      events.emit('change', { count });
    }
  });
  
  decrementBtn.addEventListener('click', () => {
    if (!disabled.isDisabled()) {
      count--;
      updateDisplay();
      events.emit('change', { count });
    }
  });
  
  // Update display based on state
  function updateDisplay() {
    display.textContent = count.toString();
  }
  
  // Initialize the display
  updateDisplay();
  
  // Register lifecycle hooks
  lifecycle.onMount(() => {
    console.log('Counter mounted, initial count:', count);
  });
  
  lifecycle.onUnmount(() => {
    console.log('Counter unmounted, final count:', count);
  });
  
  // Return the public API
  return {
    element,
    events,
    disabled,
    lifecycle,
    getCount: () => count,
    setCount: (newCount) => {
      count = newCount;
      updateDisplay();
      return this;
    },
    increment: () => {
      if (!disabled.isDisabled()) {
        count++;
        updateDisplay();
        events.emit('change', { count });
      }
      return this;
    },
    decrement: () => {
      if (!disabled.isDisabled()) {
        count--;
        updateDisplay();
        events.emit('change', { count });
      }
      return this;
    },
    reset: () => {
      count = 0;
      updateDisplay();
      events.emit('change', { count });
      return this;
    }
  };
};`
      }],
      [createElement, { tag: 'h3', text: 'Using Middleware with Store' }],
      [createElement, {
        tag: 'pre', class: 'code-block', text: `// Create a logging middleware
const loggingMiddleware = (newState, oldState) => {
  console.log('State change:', { 
    old: oldState, 
    new: newState, 
    diff: Object.keys(newState).reduce((acc, key) => {
      if (newState[key] !== oldState[key]) {
        acc[key] = { from: oldState[key], to: newState[key] };
      }
      return acc;
    }, {})
  });
  return newState;
};

// Create a validation middleware
const validationMiddleware = (newState, oldState) => {
  // Ensure count never goes below zero
  if (newState.count < 0) {
    return { ...newState, count: 0 };
  }
  
  // Validate other properties as needed
  return newState;
};

// Create a store with middleware
const store = createStore(
  { count: 0, items: [], loading: false },
  { middleware: [validationMiddleware, loggingMiddleware] }
);

// Updates will now pass through both middleware functions
store.setState({ count: store.getState().count - 5 });
// The validation middleware will correct the count to 0
// The logging middleware will log the state change`
      }]
    ]
  ]
]
