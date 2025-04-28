// src/client/config.js

import {
  mtrlIcon,
  componentsIcon,
  getStartedIcon,
  stylesIcon,
  codeIcon,
  themesIcon,
  darkIcon
} from './icons'

import {
  createButton
} from 'mtrl'

export const appLayout = [
  ['content', { tag: 'div', className: 'content' }],
  [createButton, 'moreMenu', { icon: themesIcon, class: 'more-menu', variant: 'outlined', ariaLabel: 'Themes' }],
  [createButton, 'toggleDarkmode', { icon: darkIcon, class: 'toggle-darkmode', variant: 'outlined', ariaLabel: 'Darkmode' }]
]

// Navigation structure for the new Navigation System
export const navigationLayout = {
  // Home section
  home: {
    label: 'Home',
    icon: mtrlIcon
    // items: [
    //   { id: 'overview', label: 'Overview', path: '/home' }, // Path to home root
    //   { id: 'about', label: 'About', path: '/home/about' }
    // ]
  },

  // Get Started section
  // getstarted: {
  //   label: 'Get Started',
  //   icon: getStartedIcon
  //   // items: [
  //   //   { id: 'installation', label: 'Installation', path: '/getstarted' }, // Path to getstarted root
  //   //   { id: 'usage', label: 'Usage', path: '/getstarted/usage' },
  //   //   { id: 'examples', label: 'Examples', path: '/getstarted/examples' }
  //   // ]
  // },

  // Core section
  core: {
    label: 'Core',
    icon: codeIcon,
    items: [
      {
        id: 'composition-main',
        label: 'Composition',
        // path: '/core/composition',
        items: [
          { id: 'composition', label: 'Overview', path: '/core/composition' },
          { id: 'features', label: 'Features', path: '/core/composition/features' }
        ]
      },
      { id: 'events', label: 'Events', path: '/core/events' },
      { id: 'state', label: 'State', path: '/core/state' },
      {
        id: 'collection-main',
        label: 'Collection',
        //  path: '/core/collection',
        items: [
          { id: 'collection', label: 'Overview', path: '/core/collection' },
          { id: 'route', label: 'Route Adapter', path: '/core/collection/route' },
          { id: 'list-manager', label: 'List Manager', path: '/core/collection/list-manager' }
        ]
      },
      { id: 'gestures', label: 'Gestures', path: '/core/gestures' }

      // { id: 'layout', label: 'Layout', path: '/core/layout' }
    ]
  },

  // Styles section
  styles: {
    label: 'Styles',
    icon: stylesIcon,
    items: [
      { id: 'colors', label: 'Colors', path: '/styles/colors' },
      { id: 'typography', label: 'Typography', path: '/styles/typography' },
      { id: 'elevation', label: 'Elevation', path: '/styles/elevation' },
      { id: 'layout', label: 'Layout', path: '/styles/layout' }
    ]
  },

  // Components section
  components: {
    label: 'Components',
    icon: componentsIcon,
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
          { id: 'extended-fab', label: 'Extended FAB', path: '/components/buttons/extended-fab' },
          { id: 'segmented-buttons', label: 'Segmented Buttons', path: '/components/buttons/segmented-buttons' }
        ]
      },
      { id: 'cards', label: 'Cards', path: '/components/cards' },
      { id: 'caoursel', label: 'Carousel', path: '/components/carousel' },
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
      { id: 'selects', label: 'Selects', path: '/components/selects' },
      { id: 'sliders', label: 'Sliders', path: '/components/sliders' },
      { id: 'snackbars', label: 'Snackbars', path: '/components/snackbars' },
      { id: 'switches', label: 'Switches', path: '/components/switches' },
      { id: 'tabs', label: 'Tabs', path: '/components/tabs' },
      { id: 'textfields', label: 'Textfields', path: '/components/textfields' }
    ]
  }
}

export const themesMenu = [
  { id: 'ocean', text: 'Ocean' },
  { id: 'forest', text: 'Forest' },
  { id: 'spring', text: 'Spring' },
  { id: 'summer', text: 'Summer' },
  { id: 'autumn', text: 'Autumn' },
  { id: 'winter', text: 'Winter' },
  { id: 'material', text: 'Material' }
  // { name: 'bluekhaki', text: 'Blue Khaki' },
  // { name: 'brownbeige', text: 'Brown Beige' },
  // { name: 'tealcaramel', text: 'Teal Caramel' }
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
