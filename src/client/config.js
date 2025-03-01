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
  createElement,
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
  [createElement, 'content', { class: 'mtrl-content' }],
  [createButton, 'moreMenu', { icon: iconMore, iconSize: 'medium', class: 'more-menu', variant: 'outlined' }],
  [createButton, 'toggleDarkmode', { icon: iconDark, iconSize: 'medium', class: 'toggle-darkmode', variant: 'outlined' }]
]

export const contentLayout = (info) => [
  [createElement, 'header', { id: 'head', class: 'mtrl-content__header' },
    [createElement, { tag: 'section', class: 'mtrl-content__box info' },
      [createElement, 'h1', { id: 'title', class: 'mtrl-content__title', text: info.title }],
      [createElement, 'p', { id: 'decription', class: 'mtrl-content__text', text: info.description }]
    ],
    [createElement, { tag: 'section', class: 'mtrl-content__box visual' }]
  ],
  [createElement, { id: 'body', class: 'mtrl-content__body' }],
  [createElement, { id: 'foot', class: 'mtrl-content__footer' }]
]

export const createComponentsSectionLayout = (info) => [
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { class: 'mtrl-content__section-head' },
      [createElement, { id: 'title', tag: 'h2', class: 'mtrl-content__section-title', text: info.title }]
    ],
    [createElement, 'div', { id: 'body', class: 'mtrl-content__section-body' }]
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
    { id: 'checkboxes', label: 'Checkboxes', path: '/components/checkboxes' },
    { id: 'chips', label: 'Chips', path: '/components/chips' },
    { id: 'menus', label: 'Menus', path: '/components/menus' },
    { id: 'navigations', label: 'Navigations', path: '/components/navigations' },
    { id: 'snackbars', label: 'Snackbars', path: '/components/snackbars' },
    { id: 'switches', label: 'Switches', path: '/components/switches' },
    { id: 'textfields', label: 'Textfields', path: '/components/textfields' },
    { id: 'lists', label: 'Lists', path: '/components/lists' }
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
