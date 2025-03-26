// src/client/content/styles/index.js

import {
  createContentStructure
} from '../../structure'

import {
  createStructure,
  createButton,
  createCard
} from 'mtrl'

import { createAppRouter } from '../../core/router'

export const createStylesContent = (container) => {
  // log.info('createStylesContent', container)
  const info = {
    title: 'Styling System',
    description: 'A comprehensive design system for consistent, accessible, and beautiful interfaces'
  }
  const layout = createStructure(createContentStructure(info), container).component

  const ui = createStructure(createStylesStructure(), layout.body).component

  // Initialize the style card click handlers
  initStyleCardHandlers(ui)
}

const initStyleCardHandlers = (ui) => {
  // Get router from window.app if available or try to find it from other global objects
  let router = null

  router = createAppRouter()

  if (!router) {
    log.error('Router not found, adding manual navigation links')
    // Fallback to using href for navigation
    addManualNavigation(ui)
    return
  }

  // Add click handlers to each style card
  const styleCards = {
    colors: ui.colorsCard,
    typography: ui.typographyCard,
    elevation: ui.elevationCard,
    layout: ui.layoutCard
  }

  Object.entries(styleCards).forEach(([style, card]) => {
    if (card && card.querySelector) {
      const button = card.querySelector('.style-card__button')
      if (button) {
        button.addEventListener('click', () => {
          router.navigate('styles', style)
        })
      }
    }
  })
}

// Fallback function that adds normal navigation links when router is not available
const addManualNavigation = (ui) => {
  const stylePages = {
    colors: { name: 'Colors', path: '/styles/colors' },
    typography: { name: 'Typography', path: '/styles/typography' },
    elevation: { name: 'Elevation', path: '/styles/elevation' },
    layout: { name: 'Layout', path: '/styles/layout' }
  }

  Object.entries(stylePages).forEach(([key, info]) => {
    const cardId = `${key}Card`
    const card = ui[cardId]

    if (card && card.querySelector) {
      const buttonContainer = card.querySelector('.style-card__footer')
      if (buttonContainer) {
        // Clear existing button
        buttonContainer.innerHTML = ''

        // Create a link button instead
        const link = document.createElement('a')
        link.href = info.path
        link.className = 'mtrl-button mtrl-button--filled style-card__button'
        link.textContent = `Explore ${info.name}`

        buttonContainer.appendChild(link)
      }
    }
  })
}

export const createStylesStructure = () => {
  return {
    element: {
      children: {
        // Introduction Section
        introSection: {
          options: {
            tag: 'section',
            className: 'content__section'
          },
          children: {
            title: {
              options: {
                tag: 'h2',
                className: 'content__section-title',
                text: 'Design System Overview'
              }
            },
            description1: {
              options: {
                tag: 'p',
                className: 'content__description',
                text: 'The mtrl styling system provides a consistent foundation for building beautiful, functional interfaces. The system is based on Material Design principles but optimized for flexibility and performance.'
              }
            },
            description2: {
              options: {
                tag: 'p',
                className: 'content__description',
                text: 'Explore each subsystem to understand the building blocks of our design language.'
              }
            }
          }
        },

        // Style Categories Grid
        categoriesSection: {
          options: {
            tag: 'section',
            className: 'content__section style-categories'
          },
          children: {
            title: {
              options: {
                tag: 'h2',
                className: 'content__section-title',
                text: 'Style Categories'
              }
            },
            grid: {
              options: {
                tag: 'div',
                className: 'style-categories__grid'
              },
              children: {
                // Colors Card
                colorsCard: {
                  name: 'colorsCard',
                  creator: createCard,
                  options: {
                    className: 'style-card style-card--colors'
                  }
                },

                // Typography Card
                typographyCard: {
                  options: {
                    tag: 'typographyCard',
                    className: 'style-card style-card--typography'
                  },
                  children: {
                    icon: {
                      options: {
                        tag: 'div',
                        className: 'style-card__icon'
                      },
                      children: {
                        typographyIcon: {
                          options: {
                            tag: 'div',
                            className: 'style-card__typography-icon'
                          }
                        }
                      }
                    },
                    title: {
                      options: {
                        tag: 'h3',
                        className: 'style-card__title',
                        text: 'Typography'
                      }
                    },
                    description: {
                      options: {
                        tag: 'p',
                        className: 'style-card__description',
                        text: 'Type scales and styles designed for readability, hierarchy, and rhythm across all screen sizes.'
                      }
                    },
                    highlights: {
                      options: {
                        tag: 'ul',
                        className: 'style-card__highlights'
                      },
                      children: {
                        item1: {
                          options: {
                            tag: 'li',
                            text: 'Type scale'
                          }
                        },
                        item2: {
                          options: {
                            tag: 'li',
                            text: 'Font stacks'
                          }
                        },
                        item3: {
                          options: {
                            tag: 'li',
                            text: 'Semantic styles'
                          }
                        }
                      }
                    },
                    footer: {
                      options: {
                        tag: 'div',
                        className: 'style-card__footer'
                      },
                      children: {
                        button: {
                          creator: createButton,
                          options: {
                            text: 'Explore Typography',
                            variant: 'filled',
                            className: 'style-card__button'
                          }
                        }
                      }
                    }
                  }
                },

                // Elevation Card
                elevationCard: {
                  options: {
                    tag: 'elevationCard',
                    className: 'style-card style-card--elevation'
                  },
                  children: {
                    icon: {
                      options: {
                        tag: 'div',
                        className: 'style-card__icon'
                      },
                      children: {
                        elevationIcon: {
                          options: {
                            tag: 'div',
                            className: 'style-card__elevation-icon'
                          }
                        }
                      }
                    },
                    title: {
                      options: {
                        tag: 'h3',
                        className: 'style-card__title',
                        text: 'Elevation'
                      }
                    },
                    description: {
                      options: {
                        tag: 'p',
                        className: 'style-card__description',
                        text: 'Shadow and surface systems that create depth and hierarchy through visual layers.'
                      }
                    },
                    highlights: {
                      options: {
                        tag: 'ul',
                        className: 'style-card__highlights'
                      },
                      children: {
                        item1: {
                          options: {
                            tag: 'li',
                            text: 'Elevation levels'
                          }
                        },
                        item2: {
                          options: {
                            tag: 'li',
                            text: 'Shadow utilities'
                          }
                        },
                        item3: {
                          options: {
                            tag: 'li',
                            text: 'Surface states'
                          }
                        }
                      }
                    },
                    footer: {
                      options: {
                        tag: 'div',
                        className: 'style-card__footer'
                      },
                      children: {
                        button: {
                          creator: createButton,
                          options: {
                            text: 'Explore Elevation',
                            variant: 'filled',
                            className: 'style-card__button'
                          }
                        }
                      }
                    }
                  }
                },

                // Layout Card
                layoutCard: {
                  options: {
                    tag: 'layoutCard',
                    className: 'style-card style-card--layout'
                  },
                  children: {
                    icon: {
                      options: {
                        tag: 'div',
                        className: 'style-card__icon'
                      },
                      children: {
                        layoutIcon: {
                          options: {
                            tag: 'div',
                            className: 'style-card__layout-icon'
                          }
                        }
                      }
                    },
                    title: {
                      options: {
                        tag: 'h3',
                        className: 'style-card__title',
                        text: 'Layout'
                      }
                    },
                    description: {
                      options: {
                        tag: 'p',
                        className: 'style-card__description',
                        text: 'Responsive grid systems, spacing scales, and layout patterns for consistent interfaces.'
                      }
                    },
                    highlights: {
                      options: {
                        tag: 'ul',
                        className: 'style-card__highlights'
                      },
                      children: {
                        item1: {
                          options: {
                            tag: 'li',
                            text: 'Grid system'
                          }
                        },
                        item2: {
                          options: {
                            tag: 'li',
                            text: 'Spacing scale'
                          }
                        },
                        item3: {
                          options: {
                            tag: 'li',
                            text: 'Responsive patterns'
                          }
                        }
                      }
                    },
                    footer: {
                      options: {
                        tag: 'div',
                        className: 'style-card__footer'
                      },
                      children: {
                        button: {
                          creator: createButton,
                          options: {
                            text: 'Explore Layout',
                            variant: 'filled',
                            className: 'style-card__button'
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },

        // Using the Style System Section
        usageSection: {
          options: {
            tag: 'section',
            className: 'content__section'
          },
          children: {
            title: {
              options: {
                tag: 'h2',
                className: 'content__section-title',
                text: 'Using the Style System'
              }
            },
            guide: {
              options: {
                tag: 'div',
                className: 'usage-guide'
              },
              children: {
                step1: {
                  options: {
                    tag: 'div',
                    className: 'usage-guide__step'
                  },
                  children: {
                    title: {
                      options: {
                        tag: 'h3',
                        text: '1. Import Styles'
                      }
                    },
                    codeBlock: {
                      options: {
                        tag: 'pre',
                        className: 'code-block'
                      },
                      children: {
                        code: {
                          options: {
                            tag: 'code',
                            text: '@use "mtrl/src/styles/themes/baseline";\n@use "mtrl/src/styles/abstract/theme as t";'
                          }
                        }
                      }
                    }
                  }
                },
                step2: {
                  options: {
                    tag: 'div',
                    className: 'usage-guide__step'
                  },
                  children: {
                    title: {
                      options: {
                        tag: 'h3',
                        text: '2. Apply Colors'
                      }
                    },
                    codeBlock: {
                      options: {
                        tag: 'pre',
                        className: 'code-block'
                      },
                      children: {
                        code: {
                          options: {
                            tag: 'code',
                            text: '.my-element {\n  background-color: t.color("surface");\n  color: t.color("on-surface");\n}'
                          }
                        }
                      }
                    }
                  }
                },
                step3: {
                  options: {
                    tag: 'div',
                    className: 'usage-guide__step'
                  },
                  children: {
                    title: {
                      options: {
                        tag: 'h3',
                        text: '3. Use Typography'
                      }
                    },
                    codeBlock: {
                      options: {
                        tag: 'pre',
                        className: 'code-block'
                      },
                      children: {
                        code: {
                          options: {
                            tag: 'code',
                            text: '@include c.typography("headline-medium");\n@include c.typography("body-large");'
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
