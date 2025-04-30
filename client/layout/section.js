export const createComponentSection = (info) => [
  [{ tag: 'section', class: 'components__section' },
    [{ class: 'components__section-head' },
      ['title', { tag: 'h2', class: 'components__section-title', text: info.title }],
      ['description', { tag: 'div', class: 'components__section-description', text: info.description }]
    ],
    ['body', { class: 'components__section-body' },
      ['showcase', { class: `components__section-showcase ${info.class}` }],
      ['info', { id: 'info', class: 'components__section-info' }]
    ]
  ]
]

export const createContentSection = (info) => [{ tag: 'section', class: 'mtrl-content__section' },
  ['title', { tag: 'h2', class: 'mtrl-content__section-title', text: info.title }],
  ['description', { tag: 'p', class: 'mtrl-content__description', text: info.description }],
  ['body', { class: info.class }]
]
