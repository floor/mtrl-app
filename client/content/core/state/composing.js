import {
  createElement,
  createButton,
  createLayout
} from 'mtrl'

import {
  sectionTitleDescriptionLayout
} from '../../../layout'

export const initComposingState = (container) => {
  const section = createLayout(sectionTitleDescriptionLayout({
    title: 'Composing state',
    description: 'Compose multiple state managers to create complex behavior from simple building blocks.',
    bodyClass: 'grid'
  }), container).component

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

  section.body.appendChild(composingExplanation)
  section.body.appendChild(composingExample)
}
