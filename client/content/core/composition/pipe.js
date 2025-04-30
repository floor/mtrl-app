import {
  createElement,
  createLayout
} from 'mtrl'

import {
  createContentLayout
} from '../../../layout'

export const initPipeFunction = (container) => {
  const section = createLayout(createContentLayout({
    title: 'Pipe Function',
    description: 'The pipe function is the core utility that enables functional composition in mtrl.',
    bodyClass: 'grid'
  }), container).component

  // Create explanation for pipe function
  const pipeExplanation = createElement({
    tag: 'div',
    class: 'composition-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'composition-explanation__text',
    text: 'The pipe function is the core utility for composing components in mtrl. It takes a series of functions and returns a new function that passes its argument through each function in the series, from left to right.'
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

  section.body.appendChild(pipeExplanation)
  section.body.appendChild(pipeExample)
}
