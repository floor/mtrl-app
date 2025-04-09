import { iconMtrl } from '../icons'

export const componentsLayout = (info) => [
  ['head', { class: 'content__header' },
    [{ tag: 'section', class: 'content__box content-info' },
      ['title', { tag: 'h1', class: 'content__title', text: info.title }],
      ['decription', { tag: 'p', class: 'content__description', text: info.description }]
    ]
  ],
  ['body', { class: 'content__body' }],
  ['foot', { class: 'content__footer' },
    [{ tag: 'section', className: 'content__footer-section' },
      [{ html: iconMtrl, className: 'content-logo' }],
      [{ tag: 'p', id: 'decription', className: 'components__description', text: 'mtrl is a lightweight, composable TypeScript/JavaScript component library inspired by Material Design principles. Built with zero dependencies, MTRL provides a robust foundation for creating modern web interfaces with an emphasis on performance, type safety, and accessibility.' }]
    ],
    [{ tag: 'section', className: 'content__footer-section content__footer-link' },
      [{ text: 'Links', className: 'content__footer-section__social' }],
      [{ tag: 'a', text: 'npm', className: 'content-link', href: 'https://www.npmjs.com/package/mtrl', target: '_blank' }],
      [{ tag: 'a', text: 'GitHub', className: 'content-link', href: 'https://github.com/floor/mtrl', target: '_blank' }],
      [{ tag: 'a', text: 'X', className: 'content-link', href: 'https://x.com/mtrllib', target: '_blank' }]
    ]
  ]
]
