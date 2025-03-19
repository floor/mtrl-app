import {
  createElement as e
} from 'mtrl'

export const contentLayout = (info) => [
  [e, 'header', { id: 'head', class: 'mtrl-content__header' },
    [e, { tag: 'section', class: 'mtrl-content__box info' },
      [e, 'h1', { id: 'title', class: 'mtrl-content__title', text: info.title }],
      [e, 'p', { id: 'decription', class: 'mtrl-content__text', text: info.description }]
    ],
    [e, { tag: 'section', class: 'mtrl-content__box visual' }]
  ],
  [e, { id: 'body', class: 'mtrl-content__body' }],
  [e, { id: 'foot', class: 'mtrl-content__footer' }]
]
