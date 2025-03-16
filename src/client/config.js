// src/client/config.js

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
    { id: 'search', label: 'Search', path: '/components/search' },
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
