import {
  createElement
} from 'mtrl'

export const createSectionShowcase = (info) => [
  [createElement, { tag: 'section', class: 'mtrl-components__section mtrl-components__section' },
    [createElement, { class: 'mtrl-components__section-head' },
      [createElement, { id: 'title', tag: 'h2', class: 'mtrl-components__section-title', text: info.title }]
    ],
    [createElement, 'div', { id: 'body', class: 'mtrl-components__section-body' },
      [createElement, 'div', { id: 'showcase', class: 'mtrl-components__section-showcase' }],
      [createElement, 'div', { id: 'info', class: 'mtrl-components__section-info' }]
    ]
  ]
]

export const createComponentsSectionLayout = (info) => [
  [createElement, { tag: 'section', class: 'mtrl-components__section' },
    [createElement, { class: 'mtrl-components__section-head' },
      [createElement, { id: 'title', tag: 'h2', class: 'mtrl-components__section-title', text: info.title }],
      [createElement, { id: 'title', tag: 'div', class: 'mtrl-components__section-description', text: info.description }]
    ],
    [createElement, 'div', { id: 'body', class: 'mtrl-components__section-body' },
      [createElement, 'div', { id: 'showcase', class: `mtrl-components__section-showcase ${info.class}` }]
    ]
  ]
]

export const createComponentsSectionLayoutBox = (info) => [
  [createElement, { tag: 'section', class: 'mtrl-components__section' },
    [createElement, { class: `mtrl-components__section-head ${info.class}` },
      [createElement, { id: 'title', tag: 'h2', class: 'mtrl-components__section-title', text: info.title }],
      [createElement, { id: 'title', tag: 'div', class: 'mtrl-components__section-description', text: info.description }]
    ],
    [createElement, 'div', { id: 'body', class: 'mtrl-components__section-box' },
      [createElement, 'div', { id: 'showcase', class: 'mtrl-components__section-showcase' }]
    ]
  ]
]

export const createComponentsSectionLayoutInfo = (info) => [
  [createElement, { tag: 'section', class: 'mtrl-components__section mtrl-components__section' },
    [createElement, { class: 'mtrl-components__section-head' },
      [createElement, { id: 'title', tag: 'h2', class: 'mtrl-components__section-title', text: info.title }]
    ],
    [createElement, 'div', { id: 'body', class: 'mtrl-components__section-body' },
      [createElement, 'div', { id: 'showcase', class: 'mtrl-components__section-showcase' }],
      [createElement, 'div', { id: 'info', class: 'mtrl-components__section-info' }]
    ]
  ]
]
