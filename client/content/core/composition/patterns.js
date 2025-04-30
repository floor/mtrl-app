import {
  createElement,
  createLayout
} from 'mtrl'

import {
  createContentLayout
} from '../../../layout'

export const initCompositionPatterns = (container) => {
  const section = createLayout(createContentLayout({
    title: 'Composition Patterns',
    description: 'Learn how mtrl uses functional composition instead of inheritance to create flexible, reusable components.',
    bodyClass: 'grid'
  }), container).component

  // Create explanation for composition patterns
  const patternsExplanation = createElement({
    tag: 'div',
    class: 'composition-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'composition-explanation__text',
    text: 'The mtrl library uses functional composition to create components. This approach provides several advantages: more reusable code, simpler testing, and flexible component extension.'
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
    text: `// The composition pattern in mtrl:
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
  withEvents,           // Add event handling
  withElement,          // Add DOM element
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
  diagramContent.appendChild(arrow2)
  diagramContent.appendChild(withEventsBox)
  diagramContent.appendChild(arrow1)
  diagramContent.appendChild(withElementBox)
  diagramContent.appendChild(arrow3)
  diagramContent.appendChild(withFeaturesBox)
  diagramContent.appendChild(arrow4)
  diagramContent.appendChild(resultBox)

  exampleDiagram.appendChild(diagramTitle)
  exampleDiagram.appendChild(diagramContent)

  compositionExample.appendChild(exampleTitle)
  compositionExample.appendChild(exampleCode)
  compositionExample.appendChild(exampleDiagram)

  section.body.appendChild(patternsExplanation)
  section.body.appendChild(compositionExample)
}
