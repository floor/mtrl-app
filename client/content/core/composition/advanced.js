import {
  createElement,
  createLayout
} from 'mtrl'

import {
  sectionTitleDescriptionLayout
} from '../../../layout'

export const initAdvancedPatterns = (container) => {
  const section = createLayout(sectionTitleDescriptionLayout({
    title: 'Advanced Patterns',
    description: 'Explore advanced composition patterns for more complex scenarios.',
    bodyClass: 'grid'
  }), container).component

  // Create explanation for advanced patterns
  const advancedExplanation = createElement({
    tag: 'div',
    class: 'composition-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'composition-explanation__text',
    text: 'The mtrl library includes advanced composition patterns for more complex scenarios. These include conditional composition, component variants, and state composition.'
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

  section.body.appendChild(advancedExplanation)
  section.body.appendChild(advancedExample)
}
