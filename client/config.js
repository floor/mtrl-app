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
  createButton
} from 'mtrl'

export const appLayout = [
  ['content', { tag: 'div', className: 'content' }],
  [createButton, 'moreMenu', { icon: iconMore, class: 'more-menu', variant: 'outlined', ariaLabel: 'Themes' }],
  [createButton, 'toggleDarkmode', { icon: iconDark, class: 'toggle-darkmode', variant: 'outlined', ariaLabel: 'Darkmode' }]
]

// Navigation structure for the new Navigation System
export const navigationLayout = {
  // Home section
  home: {
    label: 'Home',
    icon: iconMtrl
    // items: [
    //   { id: 'overview', label: 'Overview', path: '/home' }, // Path to home root
    //   { id: 'about', label: 'About', path: '/home/about' }
    // ]
  },

  // Get Started section
  getstarted: {
    label: 'Get Started',
    icon: iconGetstarted
    // items: [
    //   { id: 'installation', label: 'Installation', path: '/getstarted' }, // Path to getstarted root
    //   { id: 'usage', label: 'Usage', path: '/getstarted/usage' },
    //   { id: 'examples', label: 'Examples', path: '/getstarted/examples' }
    // ]
  },

  // Core section
  core: {
    label: 'Core',
    icon: iconCore,
    items: [
      { id: 'events', label: 'Events', path: '/core/events' },
      { id: 'state', label: 'State', path: '/core/state' },
      { id: 'composition', label: 'Composition', path: '/core/composition' }
    ]
  },

  // Styles section
  styles: {
    label: 'Styles',
    icon: iconStyles,
    items: [
      { id: 'colors', label: 'Colors', path: '/styles/colors' },
      { id: 'typography', label: 'Typography', path: '/styles/typography' },
      { id: 'elevation', label: 'Elevation', path: '/styles/elevation' }
    ]
  },

  // Components section
  components: {
    label: 'Components',
    icon: iconComponents,
    items: [
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
          { id: 'extended-fab', label: 'Extended FAB', path: '/components/buttons/extended-fab' }
        ]
      },
      { id: 'cards', label: 'Cards', path: '/components/cards' },
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
      { id: 'progress', label: 'Progress', path: '/components/progress' },
      { id: 'radios', label: 'Radio Buttons', path: '/components/radios' },
      { id: 'search', label: 'Search', path: '/components/search' },
      { id: 'sliders', label: 'Sliders', path: '/components/sliders' },
      { id: 'snackbars', label: 'Snackbars', path: '/components/snackbars' },
      { id: 'switches', label: 'Switches', path: '/components/switches' },
      { id: 'tabs', label: 'Tabs', path: '/components/tabs' },
      { id: 'textfields', label: 'Textfields', path: '/components/textfields' }
    ]
  }
}

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
