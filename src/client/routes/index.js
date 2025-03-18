// src/client/routes/index.js

import {
  createHomeContent,
  createEventsContent,
  createStateContent,
  createCompositionContent,
  createStylesContent,
  createColorsContent,
  createTypographyContent,
  createElevationContent,
  createLayoutContent,
  createComponentsContent,
  createBottomAppBarsContent,
  createTopAppBarsContent,
  createBadgesContent,
  createButtonsContent,
  createFabContent,
  createExtendedFabContent,
  createSegmentedButtonsContent,
  createCardsContent,
  createCarouselContent,
  createCheckboxesContent,
  createChipsContent,
  createDatePickersContent,
  createDialogsContent,
  createListsContent,
  createNavigationsContent,
  createMenusContent,
  createProgressContent,
  createRadiosContent,
  createSearchContent,
  createSlidersContent,
  createSnackbarsContent,
  createSwitchesContent,
  createTextfieldsContent,
  createTimePickersContent,
  createTabsContent
} from '../content'

/**
 * Application routes configuration
 * Maps route paths to handlers and metadata
 */
export const routes = {
  home: {
    title: 'Mtrl - Home',
    handler: (route, ui) => createHomeContent(ui.content)
  },
  'core/state': {
    title: 'Mtrl - State Management',
    handler: (route, ui) => createStateContent(ui.content)
  },
  'core/events': {
    title: 'Mtrl - Events',
    handler: (route, ui) => createEventsContent(ui.content)
  },
  'core/composition': {
    title: 'Mtrl - Composition',
    handler: (route, ui) => createCompositionContent(ui.content)
  },
  styles: {
    title: 'Mtrl - Styles',
    handler: (route, ui) => createStylesContent(ui.content)
  },
  'styles/colors': {
    title: 'Mtrl - Colors',
    handler: (route, ui) => createColorsContent(ui.content)
  },
  'styles/typography': {
    title: 'Mtrl - Typography',
    handler: (route, ui) => createTypographyContent(ui.content)
  },
  'styles/elevation': {
    title: 'Mtrl - Elevation',
    handler: (route, ui) => createElevationContent(ui.content)
  },
  'styles/layout': {
    title: 'Mtrl - Layout',
    handler: (route, ui) => createLayoutContent(ui.content)
  },
  components: {
    title: 'Mtrl - Components',
    handler: (route, ui) => createComponentsContent(ui.content)
  },
  'components/badges': {
    title: 'Mtrl - Badges',
    handler: (route, ui) => createBadgesContent(ui.content)
  },
  'components/app-bars/bottom': {
    title: 'Mtrl - Bottom App Bars',
    handler: (route, ui) => createBottomAppBarsContent(ui.content)
  },
  'components/app-bars/top': {
    title: 'Mtrl - Top App Bars',
    handler: (route, ui) => createTopAppBarsContent(ui.content)
  },
  'components/buttons/common': {
    title: 'Mtrl - Buttons',
    handler: (route, ui) => createButtonsContent(ui.content)
  },
  'components/buttons/fab': {
    title: 'Mtrl - FAB',
    handler: (route, ui) => createFabContent(ui.content)
  },
  'components/buttons/extended-fab': {
    title: 'Mtrl - Extended FAB',
    handler: (route, ui) => createExtendedFabContent(ui.content)
  },
  'components/buttons/segmented-buttons': {
    title: 'Mtrl - Segmented Buttons',
    handler: (route, ui) => createSegmentedButtonsContent(ui.content)
  },
  'components/cards': {
    title: 'Mtrl - Cards',
    handler: (route, ui) => createCardsContent(ui.content)
  },
  'components/carousel': {
    title: 'Mtrl - Carousel',
    handler: (route, ui) => createCarouselContent(ui.content)
  },
  'components/checkboxes': {
    title: 'Mtrl - Checkboxes',
    handler: (route, ui) => createCheckboxesContent(ui.content)
  },
  'components/chips': {
    title: 'Mtrl - Chips',
    handler: (route, ui) => createChipsContent(ui.content)
  },
  'components/datepickers': {
    title: 'Mtrl - Date Pickers',
    handler: (route, ui) => createDatePickersContent(ui.content)
  },
  'components/dialogs': {
    title: 'Mtrl - Dialogs',
    handler: (route, ui) => createDialogsContent(ui.content)
  },
  'components/lists': {
    title: 'Mtrl - Lists',
    handler: (route, ui) => createListsContent(ui.content)
  },
  'components/menus': {
    title: 'Mtrl - Menus',
    handler: (route, ui) => createMenusContent(ui.content)
  },
  'components/navigations': {
    title: 'Mtrl - Navigations',
    handler: (route, ui) => createNavigationsContent(ui.content)
  },
  'components/progress': {
    title: 'Mtrl - Progress',
    handler: (route, ui) => createProgressContent(ui.content)
  },
  'components/radios': {
    title: 'Mtrl - Radio Buttons',
    handler: (route, ui) => createRadiosContent(ui.content)
  },
  'components/search': {
    title: 'Mtrl - Search',
    handler: (route, ui) => createSearchContent(ui.content)
  },
  'components/sliders': {
    title: 'Mtrl - Sliders',
    handler: (route, ui) => createSlidersContent(ui.content)
  },
  'components/snackbars': {
    title: 'Mtrl - Snackbars',
    handler: (route, ui) => createSnackbarsContent(ui.content)
  },
  'components/switches': {
    title: 'Mtrl - Switches',
    handler: (route, ui) => createSwitchesContent(ui.content)
  },
  'components/textfields': {
    title: 'Mtrl - Text Fields',
    handler: (route, ui) => createTextfieldsContent(ui.content)
  },
  'components/timepickers': {
    title: 'Mtrl - Time Pickers',
    handler: (route, ui) => createTimePickersContent(ui.content)
  },
  'components/tabs': {
    title: 'Mtrl - Tabs',
    handler: (route, ui) => createTabsContent(ui.content)
  }
}

// Define a 404 route handler for not found routes
export const notFoundHandler = (route, ui) => {
  if (ui?.content) {
    ui.content.innerHTML = `
      <div class="not-found">
        <h1>Page Not Found</h1>
        <p>The requested page "${route.path}" does not exist.</p>
        <a href="/" class="mtrl-button mtrl-button--filled">Go to Home</a>
      </div>
    `
  }
  document.title = 'Mtrl - Page Not Found'
  return true
}

export default routes
