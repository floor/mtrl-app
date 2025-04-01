import { iconMtrl } from '../icons'

export const createComponentsStructure = (info) => {
  return {
    container: {
      options: { className: 'components' },
      children: {
        head: {
          options: { className: 'components__header' },
          children: {
            section: {
              options: { tag: 'section', className: 'components__box components-info' },
              children: {
                title: { options: { tag: 'h1', id: 'title', className: 'components__title', text: info.title } },
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
