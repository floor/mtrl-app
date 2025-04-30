// Navigation structure for the new Navigation System

import {
  mtrlIcon,
  componentsIcon,
  getStartedIcon,
  stylesIcon,
  codeIcon
} from './icons'

export const sitemap = {
  // Home section
  home: {
    label: 'Home',
    icon: mtrlIcon,
    description: 'Welcome to mtrl - a lightweight, efficient UI framework for modern web applications.'
  },

  getstarted: {
    id: 'get-started',
    path: '/get-started',
    label: 'Get Started',
    icon: getStartedIcon,
    description: 'Start building with mtrl - installation guides, quick tutorials, and setup instructions.'
  },

  // Core section
  core: {
    label: 'Core',
    icon: codeIcon,
    path: '/core',
    description: 'The core concepts and functionality of the mtrl framework that power its lightweight, efficient approach.',
    items: [
      {
        id: 'composition-main',
        label: 'Composition',
        description: 'Component composition in mtrl allows building complex UIs from simple building blocks.',
        // path: '/core/composition',
        items: [
          {
            id: 'composition',
            label: 'Overview',
            path: '/core/composition',
            description: 'An introduction to mtrl\'s composition system that enables flexible, reusable components.'
          },
          {
            id: 'features',
            label: 'Features',
            path: '/core/composition/features',
            description: 'Explore the key features of mtrl\'s composition system, including nesting, props, and slots.'
          }
        ]
      },
      {
        id: 'events',
        label: 'Events',
        path: '/core/events',
        description: 'mtrl\'s lightweight event system for handling user interactions and component communication.'
      },
      {
        id: 'state',
        label: 'State',
        path: '/core/state',
        description: 'Manage component and application state efficiently with mtrl\'s simple yet powerful state management.'
      },
      {
        id: 'collection-main',
        label: 'Collection',
        description: 'Tools and utilities for working with collections of data in mtrl applications.',
        //  path: '/core/collection',
        items: [
          {
            id: 'collection',
            label: 'Overview',
            path: '/core/collection',
            description: 'An overview of mtrl\'s collection utilities for efficient data handling.'
          },
          {
            id: 'route',
            label: 'Route Adapter',
            path: '/core/collection/route',
            description: 'Connect collections to routes for automatic data loading and synchronization.'
          },
          {
            id: 'list-manager',
            label: 'List Manager',
            path: '/core/collection/list-manager',
            description: 'Efficiently manage and render large lists with pagination, filtering, and sorting.'
          }
        ]
      },
      {
        id: 'layout',
        label: 'Layout',
        path: '/core/layout',
        description: 'Create flexible, responsive layouts with mtrl\'s layout utilities and components.'
      },
      {
        id: 'gestures',
        label: 'Gestures',
        path: '/core/gestures',
        description: 'Add touch gestures and interactions to your application with mtrl\'s gesture system.'
      }
    ]
  },

  // Styles section
  styles: {
    label: 'Styles',
    icon: stylesIcon,
    path: '/styles',
    description: 'Customize the look and feel of your mtrl application with powerful styling options.',
    items: [
      {
        id: 'colors',
        label: 'Colors',
        path: '/styles/colors',
        description: 'Work with mtrl\'s color system to create consistent, accessible, and beautiful interfaces.'
      },
      {
        id: 'typography',
        label: 'Typography',
        path: '/styles/typography',
        description: 'Typography guidelines and utilities to establish clear visual hierarchy and readability.'
      },
      {
        id: 'elevation',
        label: 'Elevation',
        path: '/styles/elevation',
        description: 'Use shadows and elevation to create depth and hierarchy in your interfaces.'
      }
    ]
  },

  // Components section
  components: {
    label: 'Components',
    icon: componentsIcon,
    path: '/components',
    description: 'Explore mtrl\'s comprehensive library of UI components for building modern web applications.',
    items: [
      {
        id: 'appbars',
        label: 'App bars',
        description: 'App bars provide structure and navigation for your application.',
        items: [
          {
            id: 'bottomappbars',
            label: 'Bottom app bar',
            path: '/components/app-bars/bottom',
            description: 'Bottom app bars provide navigation and actions at the bottom of the screen.'
          },
          {
            id: 'topappbars',
            label: 'Top app bar',
            path: '/components/app-bars/top',
            description: 'Top app bars provide branding, navigation, search, and actions at the top of the screen.'
          }
        ]
      },
      {
        id: 'badges',
        label: 'Badges',
        path: '/components/badges',
        description: 'Badges display small notification markers or counts on UI elements.'
      },
      {
        id: 'buttons',
        label: 'Buttons',
        description: 'Buttons allow users to take actions and make choices with a single tap.',
        items: [
          {
            id: 'common',
            label: 'Common',
            path: '/components/buttons/common',
            description: 'Standard buttons for common actions in your interface.'
          },
          {
            id: 'fab',
            label: 'FAB',
            path: '/components/buttons/fab',
            description: 'Floating Action Buttons represent the primary action in an application.'
          },
          {
            id: 'extended-fab',
            label: 'Extended FAB',
            path: '/components/buttons/extended-fab',
            description: 'Extended Floating Action Buttons include both an icon and a text label.'
          },
          {
            id: 'segmented-buttons',
            label: 'Segmented Buttons',
            path: '/components/buttons/segmented-buttons',
            description: 'Segmented buttons allow users to select one option from a group of related choices.'
          }
        ]
      },
      {
        id: 'cards',
        label: 'Cards',
        path: '/components/cards',
        description: 'Cards contain content and actions about a single subject.'
      },
      {
        id: 'caoursel',
        label: 'Carousel',
        path: '/components/carousel',
        description: 'Carousels display multiple content items in a navigable sequence.'
      },
      {
        id: 'checkboxes',
        label: 'Checkboxes',
        path: '/components/checkboxes',
        description: 'Checkboxes allow users to select multiple items from a set or turn an option on/off.'
      },
      {
        id: 'chips',
        label: 'Chips',
        path: '/components/chips',
        description: 'Chips represent small pieces of information, attributes, or actions.'
      },
      {
        id: 'datetimepicker',
        label: 'Date & time pickers',
        description: 'Date and time pickers allow users to select specific dates and times.',
        items: [
          {
            id: 'datepicker',
            label: 'Date pickers',
            path: '/components/datepickers',
            description: 'Date pickers allow users to select a specific date from a calendar interface.'
          },
          {
            id: 'timepicker',
            label: 'Time pickers',
            path: '/components/timepickers',
            description: 'Time pickers allow users to select a specific time using a clock interface.'
          }
        ]
      },
      {
        id: 'dialogs',
        label: 'Dialogs',
        path: '/components/dialogs',
        description: 'Dialogs inform users about critical information, require decisions, or involve complex tasks.'
      },
      {
        id: 'lists',
        label: 'Lists',
        path: '/components/lists',
        description: 'Lists present multiple line items in a vertical arrangement as a single continuous element.'
      },
      {
        id: 'menus',
        label: 'Menus',
        path: '/components/menus',
        description: 'Menus display a list of choices on temporary surfaces.'
      },
      {
        id: 'progress',
        label: 'Progress',
        path: '/components/progress',
        description: 'Progress indicators express an unspecified wait time or display the length of a process.'
      },
      {
        id: 'radios',
        label: 'Radio Buttons',
        path: '/components/radios',
        description: 'Radio buttons allow users to select one option from a set of mutually exclusive choices.'
      },
      {
        id: 'search',
        label: 'Search',
        path: '/components/search',
        description: 'Search components allow users to quickly find specific content within an application.'
      },
      {
        id: 'selects',
        label: 'Selects',
        path: '/components/selects',
        description: 'Select components allow users to choose one value from a set of options.'
      },
      {
        id: 'sliders',
        label: 'Sliders',
        path: '/components/sliders',
        description: 'Sliders allow users to make selections from a range of values by moving a handle.'
      },
      {
        id: 'snackbars',
        label: 'Snackbars',
        path: '/components/snackbars',
        description: 'Snackbars provide brief feedback about an operation through a message at the bottom of the screen.'
      },
      {
        id: 'switches',
        label: 'Switches',
        path: '/components/switches',
        description: 'Switches toggle the state of a single setting on or off.'
      },
      {
        id: 'tabs',
        label: 'Tabs',
        path: '/components/tabs',
        description: 'Tabs organize content across different screens, data sets, and other interactions.'
      },
      {
        id: 'textfields',
        label: 'Textfields',
        path: '/components/textfields',
        description: 'Text fields allow users to enter and edit text in your application.'
      }
    ]
  }
}
