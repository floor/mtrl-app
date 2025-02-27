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
      // { id: 'getstarted', icon: iconGetstarted, label: 'Get Started' },
      // { id: 'core', icon: iconCore, label: 'Core' },
      // { id: 'styles', icon: iconStyles, label: 'Styles' },
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

export const navigation = {
  components: [
    { id: 'buttons', label: 'Buttons', path: '/components/buttons' },
    { id: 'checkboxes', label: 'Checkboxes', path: '/components/checkboxes' },
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
