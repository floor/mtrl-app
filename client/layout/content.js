import { iconMtrl } from '../icons'

export const contentLayout = (info) => [
  ['head', { class: 'content__header' },
    [{ tag: 'section', class: 'content__box content-info' },
      ['title', { tag: 'h1', class: 'content__title', text: info.title }],
      ['decription', { tag: 'p', class: 'content__description', text: info.description }]
    ]
  ],
  ['body', { class: 'content__body' }],
  ['foot', { class: 'content__footer' }]
]

export const createContentLayout = (info) => {
  return {
    container: {
      options: { className: 'components' },
      children: {
        head: {
          options: { className: 'components__header' },
          children: {
            section: {
              options: { tag: 'section', className: 'components__box info' },
              children: {
                title: { options: { tag: 'h1', className: 'components__title', text: info.title } },
                description: { options: { tag: 'p', id: 'decription', className: 'components__description', text: info.description } }
              }
            }
          }
        },
        body: { options: { className: 'components__body' } },
        foot: {
          options: { className: 'components__footer' },
          children: {
            section: {
              options: { tag: 'section', className: 'content__footer-section' },
              children: {
                mtrl: { options: { html: iconMtrl, className: 'components__title', text: info.title } },
                description: { options: { tag: 'p', id: 'decription', className: 'components__description' } }
              }
            }
          }
        }
      }
    }
  }
}
