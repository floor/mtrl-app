import {
  createElement,
  createButton,
  createLayout
} from 'mtrl'

import {
  sectionTitleDescriptionLayout
} from '../../../layout'

export const initStore = (container) => {
  const section = createLayout(sectionTitleDescriptionLayout({
    title: 'Store',
    description: 'A centralized state container with support for derived state and middleware.',
    bodyClass: 'grid'
  }), container).component

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

  section.body.appendChild(storeExplanation)
  section.body.appendChild(storeExample)
}
