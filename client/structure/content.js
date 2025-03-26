export const createContentStructure = (info) => {
  return {
    head: {
      options: { className: 'content__header' },
      children: {
        section: {
          options: { className: 'content__box content-info' },
          children: {
            title: {
              options: { text: info.title, className: 'content__title' }
            },
            description: {
              options: { text: info.description, className: 'content__text' }
            }
          }
        }
      }
    },
    body: {
      options: { id: 'body', className: 'content__body' }
    },
    foot: {
      options: { id: 'foot', className: 'content__footer' }
    }
  }
}
