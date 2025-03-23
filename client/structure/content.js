export const createContentStructure = (info) => {
  return {
    head: {
      options: { className: 'mtrl-content__header' },
      children: {
        section: {
          options: { className: 'mtrl-content__box info' },
          children: {
            title: {
              options: { text: info.title, className: 'mtrl-content__title' }
            },
            description: {
              options: { text: info.description, className: 'mtrl-content__text' }
            }
          }
        }
      }
    },
    body: {
      options: { id: 'body', className: 'mtrl-content__body' }
    },
    foot: {
      options: { id: 'foot', className: 'mtrl-content__footer' }
    }
  }
}
