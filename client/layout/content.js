export const contentLayout = (info) => [
  ['head', { class: 'content__header' },
    [{ tag: 'section', class: 'content__box info' },
      ['title', { tag: 'h1', class: 'content__title', text: info.title }],
      ['decription', { tag: 'p', class: 'content__text', text: info.description }]
    ]
  ],
  ['body', { class: 'content__body' }],
  ['foot', { class: 'content__footer' }]
]
