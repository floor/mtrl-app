// Converted section structure definitions

export const createSectionShowcase = (info) => {
  return {
    element: {
      options: {
        tag: 'section',
        className: 'components__section components__section'
      },
      children: {
        head: {
          options: {
            className: 'components__section-head'
          },
          children: {
            title: {
              options: {
                id: 'title',
                tag: 'h2',
                className: 'components__section-title',
                text: info.title
              }
            }
          }
        },
        body: {
          options: {
            id: 'body',
            className: 'components__section-body'
          },
          children: {
            showcase: {
              options: {
                id: 'showcase',
                className: 'components__section-showcase'
              }
            },
            info: {
              options: {
                id: 'info',
                className: 'components__section-info'
              }
            }
          }
        }
      }
    }
  }
}

export const createComponentsSectionLayout = (info) => {
  return {
    element: {
      options: {
        tag: 'section',
        className: 'components__section'
      },
      children: {
        head: {
          options: {
            className: 'components__section-head'
          },
          children: {
            title: {
              options: {
                id: 'title',
                tag: 'h2',
                className: 'components__section-title',
                text: info.title
              }
            },
            description: {
              options: {
                id: 'title',
                tag: 'div',
                className: 'components__section-description',
                text: info.description
              }
            }
          }
        },
        body: {
          options: {
            id: 'body',
            className: 'components__section-body'
          },
          children: {
            showcase: {
              options: {
                id: 'showcase',
                className: `components__section-showcase ${info.class}`
              }
            }
          }
        }
      }
    }
  }
}

export const createComponentsSectionLayoutBox = (info) => {
  return {
    element: {
      options: {
        tag: 'section',
        className: 'components__section'
      },
      children: {
        head: {
          options: {
            className: `components__section-head ${info.class}`
          },
          children: {
            title: {
              options: {
                id: 'title',
                tag: 'h2',
                className: 'components__section-title',
                text: info.title
              }
            },
            description: {
              options: {
                id: 'title',
                tag: 'div',
                className: 'components__section-description',
                text: info.description
              }
            }
          }
        },
        body: {
          options: {
            id: 'body',
            className: 'components__section-box'
          },
          children: {
            showcase: {
              options: {
                id: 'showcase',
                className: 'components__section-showcase'
              }
            }
          }
        }
      }
    }
  }
}

export const createComponentsSectionLayoutInfo = (info) => {
  return {
    element: {
      options: {
        tag: 'section',
        className: 'components__section components__section'
      },
      children: {
        head: {
          options: {
            className: 'components__section-head'
          },
          children: {
            title: {
              options: {
                id: 'title',
                tag: 'h2',
                className: 'components__section-title',
                text: info.title
              }
            }
          }
        },
        body: {
          options: {
            id: 'body',
            className: 'components__section-body'
          },
          children: {
            showcase: {
              options: {
                id: 'showcase',
                className: 'components__section-showcase'
              }
            },
            info: {
              options: {
                id: 'info',
                className: 'components__section-info'
              }
            }
          }
        }
      }
    }
  }
}
