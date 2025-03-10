// src/client/config.js

import {
  iconMtrl,
  iconComponents,
  iconGetstarted,
  iconStyles,
  iconCore,
  iconMore,
  iconDark
} from './icons'

import {
  createElement as e,
  createNavigation,
  createButton
} from 'mtrl'

export const layout = [
  [createNavigation, 'rail', {
    variant: 'rail',
    behavior: 'fixed',
    items: [
      { id: 'home', icon: iconMtrl, label: 'Home' },
      { id: 'getstarted', icon: iconGetstarted, label: 'Get Started' },
      { id: 'core', icon: iconCore, label: 'Core' },
      { id: 'styles', icon: iconStyles, label: 'Styles' },
      { id: 'components', icon: iconComponents, label: 'Components' }
    ]
  }],
  [createNavigation, 'nav', {
    variant: 'drawer',
    items: []
  }],
  [e, 'content', { class: 'mtrl-content' }],
  [createButton, 'moreMenu', { icon: iconMore, iconSize: 'medium', class: 'more-menu', variant: 'outlined' }],
  [createButton, 'toggleDarkmode', { icon: iconDark, iconSize: 'medium', class: 'toggle-darkmode', variant: 'outlined' }]
]

export const contentLayout = (info) => [
  [e, 'header', { id: 'head', class: 'mtrl-content__header' },
    [e, { tag: 'section', class: 'mtrl-content__box info' },
      [e, 'h1', { id: 'title', class: 'mtrl-content__title', text: info.title }],
      [e, 'p', { id: 'decription', class: 'mtrl-content__text', text: info.description }]
    ],
    [e, { tag: 'section', class: 'mtrl-content__box visual' }]
  ],
  [e, { id: 'body', class: 'mtrl-content__body' }],
  [e, { id: 'foot', class: 'mtrl-content__footer' }]
]

export const createComponentsSectionLayout = (info) => [
  [e, { tag: 'section', class: 'mtrl-content__section' },
    [e, { class: 'mtrl-content__section-head' },
      [e, { id: 'title', tag: 'h2', class: 'mtrl-content__section-title', text: info.title }],
      [e, { id: 'title', tag: 'div', class: 'mtrl-content__section-description', text: info.description }]
    ],
    [e, 'div', { id: 'body', class: 'mtrl-content__section-body' },
      [e, 'div', { id: 'showcase', class: 'mtrl-content__section-showcase' }]
    ]
  ]
]

export const createComponentsSectionLayoutInfo = (info) => [
  [e, { tag: 'section', class: 'mtrl-content__section mtrl-content__section' },
    [e, { class: 'mtrl-content__section-head' },
      [e, { id: 'title', tag: 'h2', class: 'mtrl-content__section-title', text: info.title }]
    ],
    [e, 'div', { id: 'body', class: 'mtrl-content__section-body' },
      [e, 'div', { id: 'showcase', class: 'mtrl-content__section-showcase' }],
      [e, 'div', { id: 'info', class: 'mtrl-content__section-info' }]
    ]
  ]
]

export const themesMenu = [
  { name: 'ocean', text: 'Ocean' },
  { name: 'forest', text: 'Forest' },
  { name: 'sunset', text: 'Sunset' },
  { name: 'spring', text: 'Spring' },
  { name: 'summer', text: 'Summer' },
  { name: 'autumn', text: 'Autumn' },
  { name: 'winter', text: 'Winter' }
]

export const navigation = {
  components: [
    { id: 'buttons', label: 'Buttons', path: '/components/buttons' },
    { id: 'cards', label: 'Cards', path: '/components/cards' },
    // { id: 'carousel', label: 'Carousel', path: '/components/carousel' },
    { id: 'checkboxes', label: 'Checkboxes', path: '/components/checkboxes' },
    { id: 'chips', label: 'Chips', path: '/components/chips' },
    { id: 'lists', label: 'Lists', path: '/components/lists' },
    { id: 'menus', label: 'Menus', path: '/components/menus' },
    // { id: 'navigations', label: 'Navigations', path: '/components/navigations' },
    { id: 'progress', label: 'Progress', path: '/components/progress' },
    { id: 'radios', label: 'Radio Buttons', path: '/components/radios' },
    { id: 'sliders', label: 'Sliders', path: '/components/sliders' },
    { id: 'snackbars', label: 'Snackbars', path: '/components/snackbars' },
    { id: 'switches', label: 'Switches', path: '/components/switches' },
    { id: 'tabs', label: 'Tabs', path: '/components/tabs' },
    { id: 'textfields', label: 'Textfields', path: '/components/textfields' }
  ],
  core: [
    { id: 'events', label: 'Events', path: '/core/events' },
    { id: 'state', label: 'State', path: '/core/state' },
    { id: 'composition', label: 'Composition', path: '/core/composition' }
  ],
  styles: [
    { id: 'colors', label: 'Colors', path: '/styles/colors' },
    { id: 'typography', label: 'Typography', path: '/styles/typography' },
    { id: 'elevation', label: 'Elevation', path: '/styles/elevation' },
    { id: 'layout', label: 'Layout', path: '/styles/layout' }
  ]
}
