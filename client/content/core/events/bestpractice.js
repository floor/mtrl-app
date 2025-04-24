import {
  createLayout,
  createElement
} from 'mtrl'

export const initBestPractice = (body) => {
  createLayout([createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Best Practices' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Follow these guidelines to create maintainable and efficient event handling in your components.' }],
    [createElement, { tag: 'div', class: 'best-practices' },
      [createElement, { tag: 'ul', class: 'best-practices-list' },
        [createElement, { tag: 'li', text: 'Always clean up event listeners when components are destroyed to prevent memory leaks.' }],
        [createElement, { tag: 'li', text: 'Use event delegation for collections of similar elements.' }],
        [createElement, { tag: 'li', text: 'Apply throttle or debounce to expensive handlers for scrolling, resizing, or input events.' }],
        [createElement, { tag: 'li', text: 'Use event namespacing for better organization in complex components.' }],
        [createElement, { tag: 'li', text: 'Keep event handlers focused and lightweight - move complex logic to separate functions.' }]
      ]
    ]
  ], body)
}
