import {
  createElement,
  createButton,
  createLayout
} from 'mtrl'

import {
  createContentSection
} from '../../../layout'

export const initLifecycle = (container) => {
  const section = createLayout(createContentSection({
    title: 'Composing state',
    description: 'Compose multiple state managers to create complex behavior from simple building blocks.',
    bodyClass: 'grid'
  }), container).component

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

  section.body.appendChild(lifecycleExplanation)
  section.body.appendChild(lifecycleExample)
}
