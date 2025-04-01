import { iconMtrl } from '../icons'

export const createHomeLayout = (info) => {
  return {
    head: {
      options: { className: 'content__header' },
      children: {
        section: {
          options: { className: 'content__box content-info' },
          children: {
            mtrl: { options: { html: iconMtrl, className: 'content-logo' } },
            description: {
              options: { text: info.description, className: 'content__description' }
            }
          }
        }
      }
    },
    body: {
      options: { className: 'content__body' }
    },
    foot: {
      options: { className: 'content__footer' },
      children: {
        section1: {
          options: { tag: 'section', className: 'content__footer-section' },
          children: {
            mtrl: { options: { html: iconMtrl, className: 'content-logo' } },
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
