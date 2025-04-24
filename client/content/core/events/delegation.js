import {
  createLayout,
  createButton,
  createElement
} from 'mtrl'

export const initEventDelegation = (body) => {
  const layout = createLayout([createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Event Delegation' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Event delegation lets you handle events for multiple elements with a single listener, improving performance and working with dynamic elements.' }],
    [createElement, 'container', { id: 'eventDelegation', class: 'event-delegation-container' }]
  ], body)

  const container = layout.get('container')

  // Create explanation for event delegation
  const delegationExplanation = createElement({
    tag: 'div',
    class: 'event-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'event-explanation__text',
    text: 'Event delegation lets you handle events for multiple elements with a single listener. This improves performance and works with dynamically added elements.'
  })

  delegationExplanation.appendChild(explanationText)

  // Create event delegation example
  const delegationExample = createElement({
    tag: 'div',
    class: 'event-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'event-example__title',
    text: 'Using Event Delegation'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'event-example__code',
    text: `import { delegate } from 'mtrl/core/events';

// Handle clicks on any button within a container
events.on('click', delegate('button', (event, target) => {
  console.log(\`Button clicked: \${target.textContent}\`);
}));

// Delegation with dynamic elements
events.on('change', delegate('input[type="checkbox"]', (event, target) => {
  updateSelection(target.value, target.checked);
}));`
  })

  // Demo for event delegation
  const exampleDemo = createElement({
    tag: 'div',
    class: 'event-example__demo'
  })

  const delegationContainer = createElement({
    tag: 'div',
    class: 'delegation-container'
  })

  const delegationTitle = createElement({
    tag: 'div',
    class: 'delegation-title',
    text: 'Click any item in the list:'
  })

  const itemList = createElement({
    tag: 'ul',
    class: 'delegation-list'
  })

  // Create list items
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']

  items.forEach(itemText => {
    const item = createElement({
      tag: 'li',
      class: 'delegation-item',
      text: itemText
    })
    itemList.appendChild(item)
  })

  const addItemButton = createButton({
    text: 'Add New Item',
    variant: 'outlined'
  })

  const delegationLog = createElement({
    tag: 'div',
    class: 'delegation-log',
    html: '<div class="delegation-log__title">Log:</div><div class="delegation-log__content"></div>'
  })

  const delegationLogContent = delegationLog.querySelector('.delegation-log__content')

  // Set up event delegation demo
  itemList.addEventListener('click', (event) => {
    console.log('click')
    // Only handle clicks on list items
    if (event.target.matches('.delegation-item')) {
      const logEntry = createElement({
        tag: 'div',
        class: 'delegation-log__entry',
        text: `Clicked: ${event.target.textContent}`
      })
      delegationLogContent.appendChild(logEntry)

      if (delegationLogContent.childNodes.length > 4) {
        delegationLogContent.removeChild(delegationLogContent.firstChild)
      }
    }
  })

  // Add new item button functionality
  addItemButton.on('click', () => {
    const itemCount = itemList.children.length + 1
    const newItem = createElement({
      tag: 'li',
      class: 'delegation-item',
      text: `New Item ${itemCount}`
    })
    itemList.appendChild(newItem)
  })

  delegationContainer.appendChild(delegationTitle)
  delegationContainer.appendChild(itemList)
  delegationContainer.appendChild(addItemButton.element)
  exampleDemo.appendChild(delegationContainer)
  exampleDemo.appendChild(delegationLog)

  delegationExample.appendChild(exampleTitle)
  delegationExample.appendChild(exampleCode)
  delegationExample.appendChild(exampleDemo)

  container.appendChild(delegationExplanation)
  container.appendChild(delegationExample)
}
