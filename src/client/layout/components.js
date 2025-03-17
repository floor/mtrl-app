import {
  createElement as e
} from 'mtrl'

export const componentsLayout = (info) => [
  [e, 'container', { id: 'container', class: 'mtrl-components' },
    [e, 'header', { id: 'head', class: 'mtrl-components__header' },
      [e, { tag: 'section', class: 'mtrl-components__box info' },
        [e, 'h1', { id: 'title', class: 'mtrl-components__title', text: info.title }],
        [e, 'p', { id: 'decription', class: 'mtrl-components__text', text: info.description }]
      ],
      [e, { tag: 'section', class: 'mtrl-components__box visual' }]
    ],
    [e, { id: 'navi', class: 'mtrl-components__navi' }],
    [e, { id: 'body', class: 'mtrl-components__body' }],
    [e, { id: 'foot', class: 'mtrl-components__footer' }]
  ]
]
