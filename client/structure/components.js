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
                title: {
                  options: { tag: 'h1', id: 'title', className: 'components__title', text: info.title }
                },
                description: {
                  options: { tag: 'p', id: 'decription', className: 'components__text', text: info.description }
                }
              }
            }
          }
        },
        body: {
          options: { className: 'components__body' }
        },
        foot: {
          options: { className: 'components__footer' }
        }
      }
    }
  }
}
