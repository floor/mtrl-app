import {
  createElement as e
} from 'mtrl'

export const createSectionShowcase = (info) => [
  [e, { tag: 'section', class: 'mtrl-components__section mtrl-components__section' },
    [e, { class: 'mtrl-components__section-head' },
      [e, { id: 'title', tag: 'h2', class: 'mtrl-components__section-title', text: info.title }]
    ],
    [e, 'div', { id: 'body', class: 'mtrl-components__section-body' },
      [e, 'div', { id: 'showcase', class: 'mtrl-components__section-showcase' }],
      [e, 'div', { id: 'info', class: 'mtrl-components__section-info' }]
    ]
  ]
]

export const createComponentsSectionLayout = (info) => [
  [e, { tag: 'section', class: 'mtrl-components__section' },
    [e, { class: 'mtrl-components__section-head' },
      [e, { id: 'title', tag: 'h2', class: 'mtrl-components__section-title', text: info.title }],
      [e, { id: 'title', tag: 'div', class: 'mtrl-components__section-description', text: info.description }]
    ],
    [e, 'div', { id: 'body', class: 'mtrl-components__section-body' },
      [e, 'div', { id: 'showcase', class: `mtrl-components__section-showcase ${info.class}` }]
    ]
  ]
]

export const createComponentsSectionLayoutBox = (info) => [
  [e, { tag: 'section', class: 'mtrl-components__section' },
    [e, { class: `mtrl-components__section-head ${info.class}` },
      [e, { id: 'title', tag: 'h2', class: 'mtrl-components__section-title', text: info.title }],
      [e, { id: 'title', tag: 'div', class: 'mtrl-components__section-description', text: info.description }]
    ],
    [e, 'div', { id: 'body', class: 'mtrl-components__section-box' },
      [e, 'div', { id: 'showcase', class: 'mtrl-components__section-showcase' }]
    ]
  ]
]

export const createComponentsSectionLayoutInfo = (info) => [
  [e, { tag: 'section', class: 'mtrl-components__section mtrl-components__section' },
    [e, { class: 'mtrl-components__section-head' },
      [e, { id: 'title', tag: 'h2', class: 'mtrl-components__section-title', text: info.title }]
    ],
    [e, 'div', { id: 'body', class: 'mtrl-components__section-body' },
      [e, 'div', { id: 'showcase', class: 'mtrl-components__section-showcase' }],
      [e, 'div', { id: 'info', class: 'mtrl-components__section-info' }]
    ]
  ]
]
