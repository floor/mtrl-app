// src/client/config.js
export const navigationConfig = {
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
