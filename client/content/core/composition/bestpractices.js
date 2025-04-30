import {
  createLayout
} from 'mtrl'

import {
  createContentLayout
} from '../../../layout'

export const initBestPractices = (container) => {
  const section = createLayout(createContentLayout({
    title: 'Best Practices',
    description: 'Follow these guidelines to get the most out of the composition pattern in your mtrl applications.',
    bodyClass: 'grid'
  }), container).component

  createLayout([{ tag: 'div', class: 'best-practices' },
    [{ tag: 'ul', class: 'best-practices-list' },
      [{ tag: 'li', html: '<strong>Keep features focused:</strong> Each feature function should do one thing well. This makes them more reusable across different components.' }],
      [{ tag: 'li', html: '<strong>Use meaningful names:</strong> Name your features with the "with" prefix to indicate that they enhance a component (e.g., withText, withIcon).' }],
      [{ tag: 'li', html: '<strong>Order matters:</strong> Some features depend on others. For example, withDisabled needs a DOM element, so withElement should come first.' }],
      [{ tag: 'li', html: '<strong>Avoid side effects:</strong> Feature functions should avoid changing global state or performing side effects outside the component.' }],
      [{ tag: 'li', html: '<strong>Return a new object:</strong> Always return a new object from your feature functions instead of mutating the input component.' }],
      [{ tag: 'li', html: '<strong>Use spread operator carefully:</strong> When using {...component}, make sure you don\'t accidentally override methods or properties from earlier features.' }],
      [{ tag: 'li', html: '<strong>Consider performance:</strong> Excessive composition can lead to deep object structures. Keep your component chains reasonably sized.' }]
    ]
  ], section.body)
}
