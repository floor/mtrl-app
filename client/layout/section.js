export const sectionLayout = (i) => [
  ['section', { class: `content__section ${i.class}` },
    ['head', { class: `section__head ${i.headClass}` }],
    ['body', { class: `section__body ${i.bodyClass}` }],
    ['foot', { class: `section__foot ${i.footClass}` }]
  ]
]

export const sectionTitleLayout = (i) => [
  ['section', { class: `content__section ${i.class}` },
    ['head', { class: `section__head ${i.headClass}` },
      ['title', { tag: 'h2', class: 'section__title', text: i.title }]
    ],
    ['body', { class: `section__body ${i.bodyClass}` }],
    ['foot', { class: `section__foot ${i.footClass}` }]
  ]
]

export const sectionTitleDescriptionLayout = (i) => [
  ['section', { class: 'content__section ${i.class}' },
    ['head', { id: 'head', class: `content__section__head ${i.headClass}` },
      ['title', { tag: 'h2', class: 'section__title', text: i.title }],
      ['decription', { tag: 'p', class: 'section__text', text: i.description }]
    ],
    ['body', { class: `section__body ${i.bodyClass}` }],
    ['foot', { class: `section__foot ${i.footClass}` }]
  ]
]

export const createSectionShowcase = (info) => [
  [{ tag: 'section', class: 'components__section components__section' },
    [{ class: 'components__section-head' },
      ['title', { tag: 'h2', class: 'components__section-title', text: info.title }]
    ],
    ['body', { id: 'body', class: 'components__section-body' },
      ['showcase', { id: 'showcase', class: 'components__section-showcase' }],
      ['info', { id: 'info', class: 'components__section-info' }]
    ]
  ]
]

export const createComponentsSectionLayout = (info) => [
  [{ tag: 'section', class: 'components__section' },
    [{ class: 'components__section-head' },
      ['title', { tag: 'h2', class: 'components__section-title', text: info.title }],
      ['description', { tag: 'div', class: 'components__section-description', text: info.description }]
    ],
    ['body', { class: 'components__section-body' },
      ['showcase', { class: `components__section-showcase ${info.class}` }]
    ]
  ]
]

export const createComponentsSectionLayoutBox = (info) => [
  [{ tag: 'section', class: 'components__section' },
    [{ class: `components__section-head ${info.class}` },
      ['title', { tag: 'h2', class: 'components__section-title', text: info.title }],
      ['description', { tag: 'div', class: 'components__section-description', text: info.description }]
    ],
    ['body', { class: 'components__section-box' },
      ['showcase', { class: 'components__section-showcase' }]
    ]
  ]
]

export const createComponentsSectionLayoutInfo = (info) => [
  [{ tag: 'section', class: 'components__section components__section' },
    [{ class: 'components__section-head' },
      ['title', { id: 'title', tag: 'h2', class: 'components__section-title', text: info.title }]
    ],
    ['body', { class: 'components__section-body' },
      ['showcase', { class: 'components__section-showcase' }],
      ['info', { class: 'components__section-info' }]
    ]
  ]
]
