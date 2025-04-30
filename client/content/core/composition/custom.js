import {
  createElement,
  createLayout,
  createButton
} from 'mtrl'

import {
  createContentLayout
} from '../../../layout'

export const initCustomComponent = (container) => {
  const section = createLayout(createContentLayout({
    title: 'Creating Custom Components',
    description: 'Learn how to create your own custom components using the composition pattern.',
    bodyClass: 'grid'
  }), container).component

  // Create explanation for custom components
  const customExplanation = createElement({
    tag: 'div',
    class: 'composition-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'composition-explanation__text',
    text: 'Creating custom components in mtrl is straightforward with the composition pattern. You can mix and match features to create components with exactly the behavior you need.'
  })

  customExplanation.appendChild(explanationText)

  // Create custom component example
  const customExample = createElement({
    tag: 'div',
    class: 'composition-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'composition-example__title',
    text: 'Creating a Custom Component'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'composition-example__code',
    text: `// Create a custom toggle component
export const createToggle = pipe(
  // Start with base functionality
  createBase,
  
  // Add DOM element
  withElement({
    tag: 'button',
    componentName: 'toggle',
    attrs: { type: 'button' }
  }),
  
  // Add event handling
  withEvents(),
  
  // Add text label
  withText,
  
  // Add track and thumb elements
  withTrack,
  
  // Add disabled state support
  withDisabled,
  
  // Add toggle state functionality
  (config) => (component) => {
    // Track toggle state
    let checked = config.checked || false;
    
    // Add checked state class if needed
    if (checked) {
      component.element.classList.add('mtrl-toggle--checked');
    }
    
    // Create click handler
    component.on('click', () => {
      if (component.disabled?.isDisabled()) return;
      
      checked = !checked;
      component.element.classList.toggle('mtrl-toggle--checked', checked);
      component.emit('change', { checked });
    });
    
    // Return enhanced component
    return {
      ...component,
      
      isChecked: () => checked,
      
      toggle: () => {
        if (component.disabled?.isDisabled()) return component;
        
        checked = !checked;
        component.element.classList.toggle('mtrl-toggle--checked', checked);
        component.emit('change', { checked });
        
        return component;
      },
      
      check: () => {
        if (!checked && !component.disabled?.isDisabled()) {
          checked = true;
          component.element.classList.add('mtrl-toggle--checked');
          component.emit('change', { checked });
        }
        
        return component;
      },
      
      uncheck: () => {
        if (checked && !component.disabled?.isDisabled()) {
          checked = false;
          component.element.classList.remove('mtrl-toggle--checked');
          component.emit('change', { checked });
        }
        
        return component;
      }
    };
  }
);

// Usage
const toggle = createToggle({
  text: 'Dark Mode',
  checked: false
});

// Listen for changes
toggle.on('change', ({ checked }) => {
  document.body.classList.toggle('dark-mode', checked);
});

// Add to DOM
document.body.appendChild(toggle.element);`
  })

  // Create interactive demo for custom component
  const exampleDemo = createElement({
    tag: 'div',
    class: 'composition-example__demo'
  })

  const demoTitle = createElement({
    tag: 'div',
    class: 'composition-demo__title',
    text: 'Demo: Toggle Component'
  })

  const toggleDemo = createElement({
    tag: 'div',
    class: 'toggle-demo'
  })

  // Create a simple toggle component for the demo
  const toggle = createElement({
    tag: 'button',
    class: 'custom-toggle',
    html: `
      <div class="mtrl-custom-toggle__track">
        <div class="mtrl-custom-toggle__thumb"></div>
      </div>
      <span class="mtrl-custom-toggle__text">Dark Mode</span>
    `
  })

  // Create control buttons
  const toggleControls = createElement({
    tag: 'div',
    class: 'toggle-controls'
  })

  const toggleButton = createButton({
    text: 'Toggle',
    variant: 'filled'
  })

  const checkButton = createButton({
    text: 'Check',
    variant: 'outlined'
  })

  const uncheckButton = createButton({
    text: 'Uncheck',
    variant: 'outlined'
  })

  const disableButton = createButton({
    text: 'Toggle Disabled',
    variant: 'outlined'
  })

  // Add toggle functionality
  let isChecked = false
  let isDisabled = false

  toggle.addEventListener('click', () => {
    if (!isDisabled) {
      isChecked = !isChecked
      toggle.classList.toggle('mtrl-custom-toggle--checked', isChecked)
    }
  })

  toggleButton.on('click', () => {
    if (!isDisabled) {
      isChecked = !isChecked
      toggle.classList.toggle('mtrl-custom-toggle--checked', isChecked)
    }
  })

  checkButton.on('click', () => {
    if (!isDisabled && !isChecked) {
      isChecked = true
      toggle.classList.add('mtrl-custom-toggle--checked')
    }
  })

  uncheckButton.on('click', () => {
    if (!isDisabled && isChecked) {
      isChecked = false
      toggle.classList.remove('mtrl-custom-toggle--checked')
    }
  })

  disableButton.on('click', () => {
    isDisabled = !isDisabled
    toggle.classList.toggle('mtrl-custom-toggle--disabled', isDisabled)
  })

  // Assemble the demo
  toggleControls.appendChild(toggleButton.element)
  toggleControls.appendChild(checkButton.element)
  toggleControls.appendChild(uncheckButton.element)
  toggleControls.appendChild(disableButton.element)

  toggleDemo.appendChild(toggle)
  toggleDemo.appendChild(toggleControls)

  exampleDemo.appendChild(demoTitle)
  exampleDemo.appendChild(toggleDemo)

  customExample.appendChild(exampleTitle)
  customExample.appendChild(exampleCode)
  customExample.appendChild(exampleDemo)

  section.body.appendChild(customExplanation)
  section.body.appendChild(customExample)
}
