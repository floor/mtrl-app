import {
  createElement,
  createLayout
} from 'mtrl'

import {
  sectionTitleDescriptionLayout
} from '../../../layout'

export const initFeatures = (container) => {
  const section = createLayout(sectionTitleDescriptionLayout({
    title: 'Component Features',
    description: 'Features are higher-order functions that enhance components with specific capabilities.',
    bodyClass: 'grid'
  }), container).component

  // Create explanation for features
  const featuresExplanation = createElement({
    tag: 'div',
    class: 'composition-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'composition-explanation__text',
    text: 'The mtrl library includes a set of feature functions that enhance components with specific capabilities. Each feature is a higher-order function that takes a component and returns an enhanced version of that component.'
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
    text: `// Feature functions in mtrl follow this pattern:
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
      description: 'Adds text rendering capabilities'
    },
    {
      name: 'withIcon',
      description: 'Adds icon support'
    },
    {
      name: 'withEvents',
      description: 'Adds event handling system'
    },
    {
      name: 'withDisabled',
      description: 'Adds disabled state management'
    },
    {
      name: 'withVariant',
      description: 'Adds style variant support'
    },
    {
      name: 'withSize',
      description: 'Adds size variation support'
    },
    {
      name: 'withRipple',
      description: 'Adds ripple effect on interaction'
    },
    {
      name: 'withLifecycle',
      description: 'Adds lifecycle management'
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

  section.body.appendChild(featuresExplanation)
  section.body.appendChild(featuresExample)
}
