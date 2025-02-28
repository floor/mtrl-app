// src/client/content/core/composition.js

import {
  contentLayout
} from '../../config'

import {
  createLayout,
  createElement,
  createButton
} from 'mtrl'

export const createCompositionContent = (container) => {
  const info = {
    title: 'Composition',
    description: 'Build complex components through function composition and feature mixing'
  }
  const layout = createLayout(contentLayout(info), container).component

  const ui = createLayout(createCompositionLayout(), layout.body).component

  initCompositionPatterns(ui)
  initPipeFunction(ui)
  initFeatures(ui)
  initCustomComponent(ui)
  initAdvancedPatterns(ui)
}

export const initCompositionPatterns = (ui) => {
  const container = ui.patterns

  // Create explanation for composition patterns
  const patternsExplanation = createElement({
    tag: 'div',
    class: 'composition-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'composition-explanation__text',
    text: 'The MTRL library uses functional composition to create components. This approach provides several advantages: more reusable code, simpler testing, and flexible component extension.'
  })

  patternsExplanation.appendChild(explanationText)

  // Create basic composition example
  const compositionExample = createElement({
    tag: 'div',
    class: 'composition-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'composition-example__title',
    text: 'Basic Composition Pattern'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'composition-example__code',
    text: `// The composition pattern in MTRL:
// 1. Create base component
// 2. Apply enhancers/mixins using pipe or compose
// 3. Pass configuration to the resulting function

// Instead of inheritance:
class Button extends Component {
  constructor(props) {
    super(props);
    // ...
  }
  // ...
}

// Use function composition:
const createButton = pipe(
  createBase,           // Start with core functionality
  withElement,          // Add DOM element
  withEvents,           // Add event handling
  withText,             // Add text capabilities
  withIcon,             // Add icon capabilities
  withVariant,          // Add variant styles
  withDisabled,         // Add disabled state
  withRipple            // Add ripple effect
);

// Usage:
const button = createButton({
  text: 'Click Me',
  variant: 'filled',
  icon: svgIcon
});`
  })

  // Create a visual diagram of composition
  const exampleDiagram = createElement({
    tag: 'div',
    class: 'composition-diagram'
  })

  const diagramTitle = createElement({
    tag: 'div',
    class: 'composition-diagram__title',
    text: 'Function Composition Flow'
  })

  const diagramContent = createElement({
    tag: 'div',
    class: 'composition-diagram__content'
  })

  // Create the diagram boxes
  const createBaseBox = createElement({
    tag: 'div',
    class: 'composition-box composition-box--base',
    html: '<div class="composition-box__label">createBase</div><div class="composition-box__description">Core functionality</div>'
  })

  const withElementBox = createElement({
    tag: 'div',
    class: 'composition-box',
    html: '<div class="composition-box__label">withElement</div><div class="composition-box__description">Adds DOM element</div>'
  })

  const withEventsBox = createElement({
    tag: 'div',
    class: 'composition-box',
    html: '<div class="composition-box__label">withEvents</div><div class="composition-box__description">Adds event handling</div>'
  })

  const withFeaturesBox = createElement({
    tag: 'div',
    class: 'composition-box composition-box--features',
    html: '<div class="composition-box__label">withFeatures...</div><div class="composition-box__description">Adds text, icon, etc.</div>'
  })

  const resultBox = createElement({
    tag: 'div',
    class: 'composition-box composition-box--result',
    html: '<div class="composition-box__label">Result</div><div class="composition-box__description">Complete component</div>'
  })

  // Create arrows between boxes
  const arrow1 = createElement({
    tag: 'div',
    class: 'composition-arrow',
    html: '→'
  })

  const arrow2 = createElement({
    tag: 'div',
    class: 'composition-arrow',
    html: '→'
  })

  const arrow3 = createElement({
    tag: 'div',
    class: 'composition-arrow',
    html: '→'
  })

  const arrow4 = createElement({
    tag: 'div',
    class: 'composition-arrow',
    html: '→'
  })

  // Assemble the diagram
  diagramContent.appendChild(createBaseBox)
  diagramContent.appendChild(arrow1)
  diagramContent.appendChild(withElementBox)
  diagramContent.appendChild(arrow2)
  diagramContent.appendChild(withEventsBox)
  diagramContent.appendChild(arrow3)
  diagramContent.appendChild(withFeaturesBox)
  diagramContent.appendChild(arrow4)
  diagramContent.appendChild(resultBox)

  exampleDiagram.appendChild(diagramTitle)
  exampleDiagram.appendChild(diagramContent)

  compositionExample.appendChild(exampleTitle)
  compositionExample.appendChild(exampleCode)
  compositionExample.appendChild(exampleDiagram)

  container.appendChild(patternsExplanation)
  container.appendChild(compositionExample)
}

export const initPipeFunction = (ui) => {
  const container = ui.pipe

  // Create explanation for pipe function
  const pipeExplanation = createElement({
    tag: 'div',
    class: 'composition-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'composition-explanation__text',
    text: 'The pipe function is the core utility for composing components in MTRL. It takes a series of functions and returns a new function that passes its argument through each function in the series, from left to right.'
  })

  pipeExplanation.appendChild(explanationText)

  // Create pipe function example
  const pipeExample = createElement({
    tag: 'div',
    class: 'composition-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'composition-example__title',
    text: 'The Pipe Function'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'composition-example__code',
    text: `// pipe implementation
export const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

// How pipe works:
const add10 = (x) => x + 10;
const multiply2 = (x) => x * 2;
const subtract5 = (x) => x - 5;

// Create a new function that applies these in sequence
const calculate = pipe(
  add10,      // First: add 10
  multiply2,  // Then: multiply by 2
  subtract5   // Finally: subtract 5
);

// Using the composed function:
calculate(5);  // Result: ((5 + 10) * 2) - 5 = 25

// This is equivalent to:
subtract5(multiply2(add10(5)));`
  })

  // Create an interactive demo for pipe
  const exampleDemo = createElement({
    tag: 'div',
    class: 'composition-example__demo'
  })

  const demoTitle = createElement({
    tag: 'div',
    class: 'composition-demo__title',
    text: 'Interactive Pipe Demo'
  })

  const pipeDemo = createElement({
    tag: 'div',
    class: 'pipe-demo'
  })

  const inputContainer = createElement({
    tag: 'div',
    class: 'pipe-input-container'
  })

  const inputLabel = createElement({
    tag: 'div',
    class: 'pipe-input-label',
    text: 'Input Value:'
  })

  const inputNumber = createElement({
    tag: 'input',
    class: 'pipe-input-number',
    attributes: {
      type: 'number',
      value: '5'
    }
  })

  const pipeSteps = createElement({
    tag: 'div',
    class: 'pipe-steps'
  })

  const step1 = createElement({
    tag: 'div',
    class: 'pipe-step',
    html: '<div class="pipe-step__label">Step 1: add10</div><div class="pipe-step__result">15</div>'
  })

  const step2 = createElement({
    tag: 'div',
    class: 'pipe-step',
    html: '<div class="pipe-step__label">Step 2: multiply2</div><div class="pipe-step__result">30</div>'
  })

  const step3 = createElement({
    tag: 'div',
    class: 'pipe-step',
    html: '<div class="pipe-step__label">Step 3: subtract5</div><div class="pipe-step__result">25</div>'
  })

  const resultContainer = createElement({
    tag: 'div',
    class: 'pipe-result-container'
  })

  const resultLabel = createElement({
    tag: 'div',
    class: 'pipe-result-label',
    text: 'Final Result:'
  })

  const resultValue = createElement({
    tag: 'div',
    class: 'pipe-result-value',
    text: '25'
  })

  // Make the demo interactive
  inputNumber.addEventListener('input', (e) => {
    const inputVal = parseInt(e.target.value) || 0
    const step1Val = inputVal + 10
    const step2Val = step1Val * 2
    const step3Val = step2Val - 5

    step1.querySelector('.pipe-step__result').textContent = step1Val
    step2.querySelector('.pipe-step__result').textContent = step2Val
    step3.querySelector('.pipe-step__result').textContent = step3Val
    resultValue.textContent = step3Val
  })

  // Assemble the demo
  inputContainer.appendChild(inputLabel)
  inputContainer.appendChild(inputNumber)

  pipeSteps.appendChild(step1)
  pipeSteps.appendChild(step2)
  pipeSteps.appendChild(step3)

  resultContainer.appendChild(resultLabel)
  resultContainer.appendChild(resultValue)

  pipeDemo.appendChild(inputContainer)
  pipeDemo.appendChild(pipeSteps)
  pipeDemo.appendChild(resultContainer)

  exampleDemo.appendChild(demoTitle)
  exampleDemo.appendChild(pipeDemo)

  pipeExample.appendChild(exampleTitle)
  pipeExample.appendChild(exampleCode)
  pipeExample.appendChild(exampleDemo)

  container.appendChild(pipeExplanation)
  container.appendChild(pipeExample)
}

export const initFeatures = (ui) => {
  const container = ui.features

  // Create explanation for features
  const featuresExplanation = createElement({
    tag: 'div',
    class: 'composition-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'composition-explanation__text',
    text: 'The MTRL library includes a set of feature functions that enhance components with specific capabilities. Each feature is a higher-order function that takes a component and returns an enhanced version of that component.'
  })

  featuresExplanation.appendChild(explanationText)

  // Create features example
  const featuresExample = createElement({
    tag: 'div',
    class: 'composition-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'composition-example__title',
    text: 'Common Features'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'composition-example__code',
    text: `// Feature functions in MTRL follow this pattern:
// (config) => (component) => enhancedComponent

// Text feature adds text capabilities
export const withText = (config) => (component) => {
  const text = createText(component.element, {
    prefix: config.prefix,
    type: config.componentName
  });

  if (config.text) {
    text.setText(config.text);
  }

  return {
    ...component,
    text
  };
};

// Events feature adds event handling
export const withEvents = () => (component) => {
  const emitter = createEmitter();

  return {
    ...component,
    on (event, handler) {
      emitter.on(event, handler);
      return this;
    },
    off (event, handler) {
      emitter.off(event, handler);
      return this;
    },
    emit (event, data) {
      emitter.emit(event, data);
      return this;
    }
  };
};

// Disabled feature adds disabled state management
export const withDisabled = (config) => (component) => {
  const disabledClass = \`\${component.getClass(component.componentName)}--disabled\`;
  
  // Initialize disabled state if configured
  if (config.disabled) {
    requestAnimationFrame(() => {
      component.element.classList.add(disabledClass);
      component.element.disabled = true;
    });
  }

  return {
    ...component,
    disabled: {
      enable() {
        component.element.classList.remove(disabledClass);
        component.element.disabled = false;
        return this;
      },
      disable() {
        component.element.classList.add(disabledClass);
        component.element.disabled = true;
        return this;
      },
      toggle() {
        if (this.isDisabled()) {
          this.enable();
        } else {
          this.disable();
        }
        return this;
      },
      isDisabled() {
        return component.element.disabled === true;
      }
    }
  };
};`
  })

  // Create a feature visualization
  const featureVisualization = createElement({
    tag: 'div',
    class: 'feature-visualization'
  })

  const visualizationTitle = createElement({
    tag: 'div',
    class: 'feature-visualization__title',
    text: 'Common Features'
  })

  const featureGrid = createElement({
    tag: 'div',
    class: 'feature-grid'
  })

  // Create feature cards
  const features = [
    {
      name: 'withText',
      description: 'Adds text rendering capabilities',
      icon: '📝'
    },
    {
      name: 'withIcon',
      description: 'Adds icon support',
      icon: '🖼️'
    },
    {
      name: 'withEvents',
      description: 'Adds event handling system',
      icon: '🔔'
    },
    {
      name: 'withDisabled',
      description: 'Adds disabled state management',
      icon: '🚫'
    },
    {
      name: 'withVariant',
      description: 'Adds style variant support',
      icon: '🎨'
    },
    {
      name: 'withSize',
      description: 'Adds size variation support',
      icon: '📏'
    },
    {
      name: 'withRipple',
      description: 'Adds ripple effect on interaction',
      icon: '💧'
    },
    {
      name: 'withLifecycle',
      description: 'Adds lifecycle management',
      icon: '⏱️'
    }
  ]

  features.forEach(feature => {
    const card = createElement({
      tag: 'div',
      class: 'feature-card'
    })

    const icon = createElement({
      tag: 'div',
      class: 'feature-card__icon',
      text: feature.icon
    })

    const name = createElement({
      tag: 'div',
      class: 'feature-card__name',
      text: feature.name
    })

    const description = createElement({
      tag: 'div',
      class: 'feature-card__description',
      text: feature.description
    })

    card.appendChild(icon)
    card.appendChild(name)
    card.appendChild(description)
    featureGrid.appendChild(card)
  })

  featureVisualization.appendChild(visualizationTitle)
  featureVisualization.appendChild(featureGrid)

  featuresExample.appendChild(exampleTitle)
  featuresExample.appendChild(exampleCode)
  featuresExample.appendChild(featureVisualization)

  container.appendChild(featuresExplanation)
  container.appendChild(featuresExample)
}

export const initCustomComponent = (ui) => {
  const container = ui.custom

  // Create explanation for custom components
  const customExplanation = createElement({
    tag: 'div',
    class: 'composition-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'composition-explanation__text',
    text: 'Creating custom components in MTRL is straightforward with the composition pattern. You can mix and match features to create components with exactly the behavior you need.'
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
      <div class="custom-toggle__track">
        <div class="custom-toggle__thumb"></div>
      </div>
      <span class="custom-toggle__text">Dark Mode</span>
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
      toggle.classList.toggle('custom-toggle--checked', isChecked)
    }
  })

  toggleButton.on('click', () => {
    if (!isDisabled) {
      isChecked = !isChecked
      toggle.classList.toggle('custom-toggle--checked', isChecked)
    }
  })

  checkButton.on('click', () => {
    if (!isDisabled && !isChecked) {
      isChecked = true
      toggle.classList.add('custom-toggle--checked')
    }
  })

  uncheckButton.on('click', () => {
    if (!isDisabled && isChecked) {
      isChecked = false
      toggle.classList.remove('custom-toggle--checked')
    }
  })

  disableButton.on('click', () => {
    isDisabled = !isDisabled
    toggle.classList.toggle('custom-toggle--disabled', isDisabled)
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

  container.appendChild(customExplanation)
  container.appendChild(customExample)
}

export const initAdvancedPatterns = (ui) => {
  const container = ui.advanced

  // Create explanation for advanced patterns
  const advancedExplanation = createElement({
    tag: 'div',
    class: 'composition-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'composition-explanation__text',
    text: 'The MTRL library includes advanced composition patterns for more complex scenarios. These include conditional composition, component variants, and state composition.'
  })

  advancedExplanation.appendChild(explanationText)

  // Create advanced patterns example
  const advancedExample = createElement({
    tag: 'div',
    class: 'composition-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'composition-example__title',
    text: 'Advanced Composition Patterns'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'composition-example__code',
    text: `// Conditional composition with the 'when' utility
export const when = (predicate, transformer) => (obj, context) =>
  predicate(obj, context) ? transformer(obj, context) : obj;

// Using conditional composition:
const createResponsiveButton = pipe(
  createBase,
  withElement({ tag: 'button', componentName: 'button' }),
  withText,
  
  // Conditionally add icon based on config
  when(
    config => config.icon,
    withIcon
  ),
  
  // Conditionally add ripple effect based on config
  when(
    config => config.ripple !== false,
    withRipple
  )
);

// Component variants with specialized defaults
export const createIconButton = (config) => createButton({
  ...config,
  variant: config.variant || 'icon',
  text: null  // Icon buttons have no text by default
});

export const createFab = (config) => createButton({
  ...config,
  variant: 'fab',
  size: config.size || 'large',
  ripple: true  // FABs always have ripple
});

// State composition for complex behavior
const withFormValidation = (config) => (component) => {
  // Get input element from component
  const { input } = component;
  if (!input) return component;
  
  // Add validation state
  let validationMessage = '';
  let isValid = true;
  
  // Setup validation functions
  const validators = {
    required: (value) => value.trim() !== '' || 'This field is required',
    email: (value) => /^\\S+@\\S+\\.\\S+$/.test(value) || 'Invalid email format',
    minLength: (value) => value.length >= config.minLength || 
      \`Must be at least \${config.minLength} characters\`
  };
  
  // Add methods to component
  return {
    ...component,
    validate() {
      const value = input.value;
      
      // Run all configured validators
      if (config.required) {
        const result = validators.required(value);
        if (result !== true) {
          isValid = false;
          validationMessage = result;
          this.setError(validationMessage);
          return false;
        }
      }
      
      if (config.type === 'email') {
        const result = validators.email(value);
        if (result !== true) {
          isValid = false;
          validationMessage = result;
          this.setError(validationMessage);
          return false;
        }
      }
      
      if (config.minLength) {
        const result = validators.minLength(value);
        if (result !== true) {
          isValid = false;
          validationMessage = result;
          this.setError(validationMessage);
          return false;
        }
      }
      
      // All validations passed
      isValid = true;
      validationMessage = '';
      this.clearError();
      return true;
    },
    
    setError(message) {
      validationMessage = message;
      isValid = false;
      component.element.classList.add('mtrl-textfield--error');
      // Update error message element if exists
      // ...
      return this;
    },
    
    clearError() {
      validationMessage = '';
      isValid = true;
      component.element.classList.remove('mtrl-textfield--error');
      // Clear error message element if exists
      // ...
      return this;
    },
    
    isValid() {
      return isValid;
    },
    
    getValidationMessage() {
      return validationMessage;
    }
  };
};`
  })

  advancedExample.appendChild(exampleTitle)
  advancedExample.appendChild(exampleCode)

  container.appendChild(advancedExplanation)
  container.appendChild(advancedExample)
}

export const createCompositionLayout = () => [
  // Composition Patterns Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Composition Patterns' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Learn how MTRL uses functional composition instead of inheritance to create flexible, reusable components.' }],
    [createElement, 'patterns', { id: 'patterns', class: 'patterns-container' }]
  ],

  // Pipe Function Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Pipe Function' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'The pipe function is the core utility that enables functional composition in MTRL.' }],
    [createElement, 'pipe', { id: 'pipe', class: 'pipe-container' }]
  ],

  // Features Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Component Features' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Features are higher-order functions that enhance components with specific capabilities.' }],
    [createElement, 'features', { id: 'features', class: 'features-container' }]
  ],

  // Custom Component Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Creating Custom Components' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Learn how to create your own custom components using the composition pattern.' }],
    [createElement, 'custom', { id: 'custom', class: 'custom-container' }]
  ],

  // Advanced Patterns Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Advanced Patterns' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Explore advanced composition patterns for more complex scenarios.' }],
    [createElement, 'advanced', { id: 'advanced', class: 'advanced-container' }]
  ],

  // Best Practices Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Best Practices' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Follow these guidelines to get the most out of the composition pattern in your MTRL applications.' }],
    [createElement, { tag: 'div', class: 'best-practices' },
      [createElement, { tag: 'ul', class: 'best-practices-list' },
        [createElement, { tag: 'li', html: '<strong>Keep features focused:</strong> Each feature function should do one thing well. This makes them more reusable across different components.' }],
        [createElement, { tag: 'li', html: '<strong>Use meaningful names:</strong> Name your features with the "with" prefix to indicate that they enhance a component (e.g., withText, withIcon).' }],
        [createElement, { tag: 'li', html: '<strong>Order matters:</strong> Some features depend on others. For example, withDisabled needs a DOM element, so withElement should come first.' }],
        [createElement, { tag: 'li', html: '<strong>Avoid side effects:</strong> Feature functions should avoid changing global state or performing side effects outside the component.' }],
        [createElement, { tag: 'li', html: '<strong>Return a new object:</strong> Always return a new object from your feature functions instead of mutating the input component.' }],
        [createElement, { tag: 'li', html: '<strong>Use spread operator carefully:</strong> When using {...component}, make sure you don\'t accidentally override methods or properties from earlier features.' }],
        [createElement, { tag: 'li', html: '<strong>Consider performance:</strong> Excessive composition can lead to deep object structures. Keep your component chains reasonably sized.' }]
      ]
    ]
  ]
]
