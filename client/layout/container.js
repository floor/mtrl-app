export const container = (i) => [
  ['container', { class: `container ${i.class}` },
    ['head', { class: `container__head ${i.headClass}` }],
    ['body', { class: `container__body ${i.bodyClass}` }],
    ['foot', { class: `container__foot ${i.footClass}` }]
  ]
]

export const containerTitle = (i) => [
  ['container', { class: `container ${i.class}` },
    ['head', { class: `container__head ${i.headClass}` },
      ['title', { tag: 'h1', class: 'container__title', text: i.title }]
    ],
    ['body', { class: `container__body ${i.bodyClass}` }],
    ['foot', { class: `container__foot ${i.footClass}` }]
  ]
]

export const containerTitleDescrition = (i) => [
  ['container', { class: 'container' },
    ['head', { id: 'head', class: `container__head ${i.headClass}` },
      ['title', { tag: 'h1', class: 'container__title', text: i.title }],
      ['decription', { tag: 'p', class: 'container__text', text: i.description }]
    ],
    ['body', { class: `container__body ${i.bodyClass}` }],
    ['foot', { class: `container__foot ${i.footClass}` }]
  ]
]
