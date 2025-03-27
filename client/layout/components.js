export const componentsLayout = (info) => [
  ['container', { id: 'container', class: 'components' },
    ['header', { id: 'head', class: 'components__header' },
      [{ tag: 'section', class: 'components__box info' },
        ['title', { tag: 'h1', class: 'components__title', text: 'test' }],
        ['decription', { tag: 'p', class: 'components__text', text: info.description }]
      ]
    ],
    ['body', { class: 'components__body' }],
    ['foot', { class: 'components__footer' }]
  ]
]
