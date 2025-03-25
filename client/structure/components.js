export const createComponentsStructure = (info) => {
  return {
    element: {
      name: 'container',
      options: {
        id: 'container',
        className: 'components'
      },
      children: {
        head: {
          options: {
            id: 'head',
            className: 'components__header'
          },
          children: {
            section: {

              options: {
                tag: 'section',
                className: 'components__box info'
              },
              children: {
                title: {

                  options: {
                    tag: 'h1',
                    id: 'title',
                    className: 'components__title',
                    text: info.title
                  }
                },
                description: {

                  options: {
                    tag: 'p',
                    id: 'decription',
                    className: 'components__text',
                    text: info.description
                  }
                }
              }
            }
            // NOTE: The commented section has been removed:
            // visual: {
            //   options: {
            //     tag: 'section',
            //     className: 'components__box visual'
            //   }
            // }
          }
        },
        // navi: {
        //   options: {
        //     id: 'navi',
        //     className: 'components__navi'
        //   }
        // },
        body: {
          options: {
            id: 'body',
            className: 'components__body'
          }
        },
        foot: {
          options: {
            id: 'foot',
            className: 'components__footer'
          }
        }
      }
    }
  }
}
