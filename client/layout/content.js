import { mtrlIcon } from '../icons'

export const contentLayout = (info) => [
  ['head', { class: 'content__header' },
    [{ tag: 'section', class: 'content__box content-info' },
      ['title', { tag: 'h1', class: 'content__title', text: info.title }],
      ['decription', { tag: 'p', class: 'content__description', text: info.description }]
    ]
  ],
  ['body', { class: 'content__body' }],
  ['foot', { class: 'content__footer' },
    [{ tag: 'section', className: 'content__footer-section' },
      [{ html: mtrlIcon, className: 'content-logo' }],
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

export const createContentSection = (info) => [{ tag: 'section', class: 'mtrl-content__section' },
  ['title', { tag: 'h2', class: 'mtrl-content__section-title', text: info.title }],
  ['description', { tag: 'p', class: 'mtrl-content__description', text: info.description }],
  ['body', { class: info.class }]
]

export const createContentLayout = (info) => {
  return {
    head: {
      options: { className: 'content__header' },
      children: {
        section: {
          options: { tag: 'section', className: 'content__box content-info' },
          children: {
            title: { options: { tag: 'h1', className: 'content__title', text: info.title } },
            description: { options: { tag: 'p', id: 'decription', className: 'content__description', text: info.description } }
          }
        }
      }
    },
    body: { options: { className: 'content__body' } },
    foot: {
      options: { className: 'content__footer' },
      children: {
        section1: {
          options: { tag: 'section', className: 'content__footer-section' },
          children: {
            mtrl: { options: { html: mtrlIcon, className: 'content-logo' } },
            description: { options: { tag: 'p', id: 'decription', className: 'components__description', text: 'mtrl is a lightweight, composable TypeScript/JavaScript component library inspired by Material Design principles. Built with zero dependencies, MTRL provides a robust foundation for creating modern web interfaces with an emphasis on performance, type safety, and accessibility.' } }
          }
        },
        section2: {
          options: { tag: 'section', className: 'content__footer-section content__footer-link' },
          children: {
            social: { options: { text: 'Links', className: 'content__footer-section__social' } },
            npm: { options: { tag: 'a', text: 'npm', className: 'content-link', href: 'https://www.npmjs.com/package/mtrl', target: '_blank' } },
            github: { options: { tag: 'a', text: 'GitHub', className: 'content-link', href: 'https://github.com/floor/mtrl', target: '_blank' } },
            x: { options: { tag: 'a', text: 'X', className: 'content-link', href: 'https://x.com/mtrllib', target: '_blank' } }
          }
        }
      }
    }
  }
}
