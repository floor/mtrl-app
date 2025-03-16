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

export const componentsLayout = (info) => [
  [e, 'container', { id: 'container', class: 'mtrl-components' },
    [e, 'header', { id: 'head', class: 'mtrl-components__header' },
      [e, { tag: 'section', class: 'mtrl-components__box info' },
        [e, 'h1', { id: 'title', class: 'mtrl-components__title', text: info.title }],
        [e, 'p', { id: 'decription', class: 'mtrl-components__text', text: info.description }]
      ],
      [e, { tag: 'section', class: 'mtrl-components__box visual' }]
    ],
    [e, { id: 'body', class: 'mtrl-components__body' }],
    [e, { id: 'foot', class: 'mtrl-components__footer' }]
  ]
]

export const createComponentsSectionLayout = (info) => [
  [e, { tag: 'section', class: 'mtrl-components__section' },
    [e, { class: 'mtrl-components__section-head' },
      [e, { id: 'title', tag: 'h2', class: 'mtrl-components__section-title', text: info.title }],
      [e, { id: 'title', tag: 'div', class: 'mtrl-components__section-description', text: info.description }]
    ],
    [e, 'div', { id: 'body', class: 'mtrl-components__section-body' },
      [e, 'div', { id: 'showcase', class: `mtrl-components__section-showcase ${info.class}` }]
    ]
  ]
]

export const createComponentsSectionLayoutBox = (info) => [
  [e, { tag: 'section', class: 'mtrl-components__section' },
    [e, { class: `mtrl-components__section-head ${info.class}` },
      [e, { id: 'title', tag: 'h2', class: 'mtrl-components__section-title', text: info.title }],
      [e, { id: 'title', tag: 'div', class: 'mtrl-components__section-description', text: info.description }]
    ],
    [e, 'div', { id: 'body', class: 'mtrl-components__section-box' },
      [e, 'div', { id: 'showcase', class: 'mtrl-components__section-showcase' }]
    ]
  ]
]

export const createComponentsSectionLayoutInfo = (info) => [
  [e, { tag: 'section', class: 'mtrl-components__section mtrl-components__section' },
    [e, { class: 'mtrl-components__section-head' },
      [e, { id: 'title', tag: 'h2', class: 'mtrl-components__section-title', text: info.title }]
    ],
    [e, 'div', { id: 'body', class: 'mtrl-components__section-body' },
      [e, 'div', { id: 'showcase', class: 'mtrl-components__section-showcase' }],
      [e, 'div', { id: 'info', class: 'mtrl-components__section-info' }]
    ]
  ]
]

// export const themesMenu = [
//   {
//     name: 'colors',
//     text: 'Color',
//     items: [

//       { name: 'bluekhaki', text: 'Blue Khaki' },
//       { name: 'brownbeige', text: 'Brown Beige' },
//       { name: 'tealcaramel', text: 'Teal Caramel' },
//       { name: 'greenbeige', text: 'Green Beige' },
//       { name: 'sageivory', text: 'Sage Ivory' },
//       { name: 'browngreen', text: 'Brown Green' }
//     ]
//   },
//   {
//     name: 'seasons',
//     text: 'Seasons',
//     items: [
//       { name: 'spring', text: 'Spring' },
//       { name: 'summer', text: 'Summer' },
//       { name: 'autumn', text: 'Autumn' },
//       { name: 'winter', text: 'Winter' }
//     ]

//   },
//   { name: 'ocean', text: 'Ocean' },
//   { name: 'forest', text: 'Forest' },
//   { name: 'sunset', text: 'Sunset' }
// ]

export const themesMenu = [
  { name: 'material', text: 'Material' },
  { name: 'spring', text: 'Spring' },
  { name: 'summer', text: 'Summer' },
  { name: 'autumn', text: 'Autumn' },
  { name: 'winter', text: 'Winter' },
  { name: 'ocean', text: 'Ocean' },
  { name: 'forest', text: 'Forest' },
  { name: 'sunset', text: 'Sunset' },
  { name: 'bluekhaki', text: 'Blue Khaki' },
  { name: 'brownbeige', text: 'Brown Beige' },
  { name: 'tealcaramel', text: 'Teal Caramel' }
]

export const navigation = {
  components: [

    {
      id: 'appbars',
      label: 'App bars',
      items: [
        { id: 'bottomappbars', label: 'Bottom app bar', path: '/components/app-bars/bottom' },
        { id: 'topappbars', label: 'Top app bar', path: '/components/app-bars/top' }
      ]
    },
    { id: 'badges', label: 'Badges', path: '/components/badges' },
    {
      id: 'buttons',
      label: 'Buttons',
      items: [
        { id: 'common', label: 'Common', path: '/components/buttons/common' },
        { id: 'fab', label: 'FAB', path: '/components/buttons/fab' },
        { id: 'extended-fab', label: 'Extended FAB', path: '/components/buttons/extended-fab' },
        { id: 'segmented-buttons', label: 'Segemented Buttons', path: '/components/buttons/segmented-buttons' }
      ]
    },
    { id: 'cards', label: 'Cards', path: '/components/cards' },
    // { id: 'carousel', label: 'Carousel', path: '/components/carousel' },
    { id: 'checkboxes', label: 'Checkboxes', path: '/components/checkboxes' },
    { id: 'chips', label: 'Chips', path: '/components/chips' },

    {
      id: 'datetimepicker',
      label: 'Date & time pickers',
      items: [
        { id: 'datepicker', label: 'Date pickers', path: '/components/datepickers' },
        { id: 'timepicker', label: 'Time pickers', path: '/components/timepickers' }
      ]
    },

    { id: 'dialogs', label: 'Dialogs', path: '/components/dialogs' },
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
