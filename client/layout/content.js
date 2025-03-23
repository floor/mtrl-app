import {
  createElement
} from 'mtrl'

export const contentLayout = (info) => [
  [createElement, 'header', { id: 'head', class: 'mtrl-content__header' },
    [createElement, { tag: 'section', class: 'mtrl-content__box info' },
      [createElement, 'h1', { id: 'title', class: 'mtrl-content__title', text: info.title }],
      [createElement, 'p', { id: 'decription', class: 'mtrl-content__text', text: info.description }]
    ]
  ],
  [createElement, { id: 'body', class: 'mtrl-content__body' }],
  [createElement, { id: 'foot', class: 'mtrl-content__footer' }]
]
