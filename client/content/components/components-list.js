// Export as an array to match the expected format in createComponentsContent
export const componentsList = [
  {
    title: 'Actions',
    description: 'Components that help users take action or make choices',
    components: [
      {
        id: 'buttons',
        title: 'Buttons',
        description: 'Let users take action and make choices with a single tap.',
        features: ['Filled', 'Outlined', 'Text', 'Icon buttons', 'State handling'],
        examples: 'Use buttons as primary actions in forms, dialogs, and cards. Button states reflect interactions: enabled, disabled, hovered, focused, and pressed.',
        path: 'components/buttons/common'
      },
      {
        id: 'fab',
        title: 'Floating Action Buttons',
        description: 'Help people take primary actions with a prominent button that floats above the UI.',
        features: ['Standard', 'Mini', 'Extended', 'Position variants'],
        examples: 'Use FABs for the primary action in an application or screen.',
        path: 'components/buttons/fab'
      },
      {
        id: 'extended-fab',
        title: 'Extended FAB',
        description: 'Extended FABs are more prominent and provide clearer action guidance than standard FABs.',
        features: ['Standard', 'Contained', 'Toggle', 'With tooltip'],
        examples: 'Segmented buttons help people select options, switch views, or sort elements.',
        path: 'components/buttons/extended-fab'
      },
      {
        id: 'segmented-button',
        title: 'Segmented Button',
        description: 'Help people select options, switch views, or sort elements.',
        features: ['Multiple selection', 'Single selection', 'Icon variants'],
        examples: 'Use for related but mutually exclusive choices.',
        path: 'components/buttons/segmented-buttons'
      },

      {
        id: 'chips',
        title: 'Chips',
        description: 'Compact elements that represent an input, attribute, or action.',
        features: ['Input chips', 'Filter chips', 'Suggestion chips', 'Selection behavior'],
        examples: 'Chips are compact elements that represent an input, attribute, or action. They allow users to make selections, filter content, or trigger actions.',
        path: 'components/chips'
      }
    ]
  },

  {
    title: 'Communication',
    description: 'Components that provide feedback or display status information',
    components: [
      {
        id: 'badges',
        title: 'Badges',
        description: 'Show notifications, counts, or status information on navigation items and icons.',
        features: ['Numeric', 'Dot', 'Positioning', 'Color variants'],
        examples: 'Use badges to indicate counts of items or notify users of new activity.',
        path: 'components/badges'
      },
      {
        id: 'progress',
        title: 'Progress Indicators',
        description: 'Express an unspecified wait time or display the length of a process.',
        features: ['Linear', 'Circular', 'Determinate', 'Indeterminate'],
        path: 'components/progress'
      },
      {
        id: 'snackbars',
        title: 'Snackbars',
        description: 'Provide brief messages about app processes at the bottom of the screen.',
        features: ['Temporary messages', 'Action buttons', 'Position variants', 'Duration control'],
        path: 'components/snackbars'
      },
      {
        id: 'tooltips',
        title: 'Tooltips',
        description: 'Display brief labels or messages when users hover over, focus on, or tap an element.',
        features: ['Plain text', 'Rich content', 'Position variants', 'Trigger behavior'],
        examples: 'Use tooltips to explain the function of interface elements that may need clarification.'
      }
    ]
  },

  {
    title: 'Containment',
    description: 'Components that hold or organize content and other components',
    components: [
      // {
      //   id: 'bottom-sheets',
      //   title: 'Bottom Sheets',
      //   description: 'Show secondary content anchored to the bottom of the screen.',
      //   features: ['Modal', 'Persistent', 'Expandable', 'Draggable'],
      //   examples: 'Use bottom sheets for supplementary content or actions without leaving the current context.'
      // },
      {
        id: 'cards',
        title: 'Cards',
        description: 'Display content and actions about a single subject.',
        features: ['Elevated', 'Filled', 'Outlined', 'Actions', 'Media', 'Expandable'],
        examples: 'Cards are surfaces that display content and actions on a single topic. They should be easy to scan for relevant and actionable information.',
        path: 'components/cards'
      },
      // {
      //   id: 'carousel',
      //   title: 'Carousel',
      //   description: 'Display a collection of items that can be scrolled horizontally.',
      //   features: ['Multi-browse', 'Hero layout', 'Snap scrolling', 'Controls'],
      //   path: 'components/carousel'
      // },
      {
        id: 'dialogs',
        title: 'Dialogs',
        description: 'Provide important prompts in a user flow.',
        features: ['Alert', 'Simple', 'Confirmation', 'Full-screen'],
        examples: 'Use dialogs to request decisions, show critical information, or focus user attention.',
        path: 'components/dialogs'
      },
      // {
      //   id: 'divider',
      //   title: 'Divider',
      //   description: 'Thin lines that group content in lists or other containers.',
      //   features: ['Horizontal', 'Vertical', 'Inset', 'With text'],
      //   examples: 'Use dividers to create visual separation between content sections.'
      // },
      {
        id: 'lists',
        title: 'Lists',
        description: 'Continuous, vertical indexes of text and images.',
        features: ['Single select', 'Multi select', 'Sectioned lists', 'Rich content'],
        path: 'components/lists'
      }
      // {
      //   id: 'side-sheets',
      //   title: 'Side Sheets',
      //   description: 'Show secondary content anchored to the side of the screen.',
      //   features: ['Modal', 'Persistent', 'Responsive', 'Width variants'],
      //   examples: 'Use side sheets for supplementary information or controls related to the main content.'
      // }
    ]
  },

  {
    title: 'Navigation',
    description: 'Components that help users move between different views and sections',
    components: [
      // {
      //   id: 'bottom-app-bar',
      //   title: 'Bottom App Bar',
      //   description: 'Display navigation and key actions at the bottom of mobile and tablet screens.',
      //   features: ['FAB integration', 'Navigation menu', 'Action items', 'Scrolling behavior'],
      //   examples: 'Use in mobile apps to provide easy access to navigation and important actions.',
      //   path: 'components/app-bars/bottom'
      // },
      // {
      //   id: 'navigation-bar',
      //   title: 'Navigation Bar',
      //   description: 'Let people switch between UI views on smaller devices.',
      //   features: ['Bottom navigation', 'Icon labels', 'Badge indicators', 'Selection states'],
      //   examples: 'Use for main navigation destinations in mobile apps.',
      //   path: 'components/navigations'
      // },
      // {
      //   id: 'navigation-drawer',
      //   title: 'Navigation Drawer',
      //   description: 'Let people switch between UI views on larger devices.',
      //   features: ['Standard drawer', 'Modal drawer', 'Responsive', 'Multi-level'],
      //   examples: 'Use for comprehensive navigation structures on larger screens.',
      //   path: 'components/navigations'
      // },
      // {
      //   id: 'navigation-rail',
      //   title: 'Navigation Rail',
      //   description: 'Let people switch between UI views on mid-sized devices.',
      //   features: ['Icon and label', 'FAB integration', 'Extended rail', 'Responsive'],
      //   examples: 'Use for main navigation on tablet and medium-width screens.',
      //   path: 'components/navigations'
      // },
      // {
      //   id: 'search',
      //   title: 'Search',
      //   description: 'Let people enter a keyword or phrase to get relevant information.',
      //   features: ['Expandable', 'Persistent', 'Autocomplete', 'Voice input'],
      //   examples: 'Use to help users quickly find content within your application.',
      //   path: 'components/search'
      // },
      {
        id: 'tabs',
        title: 'Tabs',
        description: 'Organize content into separate views where only one view is visible at a time.',
        features: ['Horizontal tabs', 'Scrollable', 'Icon tabs', 'Secondary tabs'],
        path: 'components/tabs'
      },
      // {
      //   id: 'top-app-bar',
      //   title: 'Top App Bar',
      //   description: 'Display navigation, actions, and text at the top of a screen.',
      //   features: ['Regular', 'Prominent', 'Dense', 'Scrolling behavior'],
      //   examples: 'Use to identify the current screen and provide consistent navigation and actions.',
      //   path: 'components/app-bars/top'
      // },
      {
        id: 'menus',
        title: 'Menus',
        description: 'Display a list of choices on a temporary surface.',
        features: ['Dropdown', 'Context menu', 'Cascading', 'Keyboard navigation'],
        path: 'components/menus'
      }
    ]
  },

  {
    title: 'Selection',
    description: 'Components that let users make choices or selections',
    components: [
      {
        id: 'checkboxes',
        title: 'Checkboxes',
        description: 'Let users select one or more items from a list, or turn an item on or off.',
        features: ['Single state', 'Indeterminate state', 'Label placement', 'Validation'],
        examples: 'Use checkboxes when users need to select multiple options from a list or toggle a single option on or off.',
        path: 'components/checkboxes'
      },
      {
        id: 'chips',
        title: 'Chips',
        description: 'Help people enter information, make selections, filter content, or trigger actions.',
        features: ['Input chips', 'Filter chips', 'Suggestion chips', 'Selection behavior'],
        examples: 'Use chips for selections, filtering, or representing small pieces of information.',
        path: 'components/chips'
      },
      // {
      //   id: 'date-pickers',
      //   title: 'Date Pickers',
      //   description: 'Let people select a date, or a range of dates.',
      //   features: ['Calendar', 'Input field', 'Range selection', 'Time combination'],
      //   examples: 'Use date pickers when users need to enter dates in a standardized format.',
      //   path: 'components/datepickers'
      // },
      {
        id: 'radios',
        title: 'Radio Buttons',
        description: 'Allow users to select one option from a set.',
        features: ['Single selection', 'Grouping', 'Label placement', 'States'],
        path: 'components/radios'
      },
      {
        id: 'sliders',
        title: 'Sliders',
        description: 'Let users make selections from a range of values.',
        features: ['Continuous', 'Discrete', 'Range selection', 'Value display'],
        path: 'components/sliders'
      },
      {
        id: 'switches',
        title: 'Switches',
        description: 'Toggle the state of a single item on or off.',
        features: ['Binary control', 'Instant action', 'Label placement', 'State feedback'],
        path: 'components/switches'
      }
      // {
      //   id: 'time-pickers',
      //   title: 'Time Pickers',
      //   description: 'Help users select and set a specific time.',
      //   features: ['Clock view', 'Input field', '12/24 hour format', 'Input validation'],
      //   examples: 'Use time pickers when users need to enter time values in a standardized format.',
      //   path: 'components/timepickers'
      // }
    ]
  },

  {
    title: 'Text Inputs',
    description: 'Components that allow users to enter and edit text',
    components: [
      {
        id: 'textfields',
        title: 'Text Fields',
        description: 'Let users enter and edit text.',
        features: ['Single line', 'Multi-line', 'Filled', 'Outlined', 'Validation'],
        path: 'components/textfields'
      }
    ]
  },

  {
    title: 'Feedback',
    description: 'Components that provide system feedback to users',
    components: [
      // {
      //   id: 'alerts',
      //   title: 'Alerts',
      //   description: 'Provide important information that interrupts the user experience.',
      //   features: ['Success', 'Warning', 'Error', 'Info', 'Dismissible'],
      //   examples: 'Use alerts to notify users about important events or changes in the system state.'
      // },
      {
        id: 'dialogs',
        title: 'Dialogs',
        description: 'Interrupt the user flow to provide critical information or request a decision.',
        features: ['Alert dialogs', 'Confirmation dialogs', 'Form dialogs', 'Full-screen dialogs'],
        examples: 'Use dialogs sparingly for important interactions that require immediate attention.',
        path: 'components/dialogs'
      },
      {
        id: 'snackbars',
        title: 'Snackbars',
        description: 'Show brief, non-modal feedback about an operation.',
        features: ['Simple', 'With action', 'Auto-dismiss', 'Position variants'],
        examples: 'Use toasts for non-critical feedback that should not interrupt the user flow.'
      }
    ]
  }
]
