// src/client/core/navigation/routes.js
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
  createDialogsContent,
  createListsContent,
  createNavigationsContent,
  createMenusContent,
  createProgressContent,
  createRadiosContent,
  createSlidersContent,
  createSnackbarsContent,
  createSwitchesContent,
  createTextfieldsContent,
  createTabsContent
} from '../../content'

export const initializeRoutes = (router, ui) => {
  if (!router || !ui) return

  // Register route handlers

  router.register('/', () => createHomeContent(ui.content))
  router.register('core/state', () => createStateContent(ui.content))
  router.register('core/events', () => createEventsContent(ui.content))
  router.register('core/composition', () => createCompositionContent(ui.content))
  router.register('styles', () => createStylesContent(ui.content))
  router.register('styles/colors', () => createColorsContent(ui.content))
  router.register('styles/typography', () => createTypographyContent(ui.content))
  router.register('styles/elevation', () => createElevationContent(ui.content))
  router.register('styles/layout', () => createLayoutContent(ui.content))
  router.register('components', () => createComponentsContent(ui.content))
  router.register('components/badges', () => createBadgesContent(ui.content))
  router.register('components/app-bars/bottom', () => createBottomAppBarsContent(ui.content))
  router.register('components/app-bars/top', () => createTopAppBarsContent(ui.content))
  router.register('components/buttons/common', () => createButtonsContent(ui.content))
  router.register('components/buttons/fab', () => createFabContent(ui.content))
  router.register('components/buttons/extended-fab', () => createExtendedFabContent(ui.content))
  router.register('components/buttons/segmented-buttons', () => createSegmentedButtonsContent(ui.content))
  router.register('components/cards', () => createCardsContent(ui.content))
  router.register('components/carousel', () => createCarouselContent(ui.content))
  router.register('components/checkboxes', () => createCheckboxesContent(ui.content))
  router.register('components/chips', () => createChipsContent(ui.content))
  router.register('components/dialogs', () => createDialogsContent(ui.content))
  router.register('components/lists', () => createListsContent(ui.content))
  router.register('components/menus', () => createMenusContent(ui.content))
  router.register('components/navigations', () => createNavigationsContent(ui.content))
  router.register('components/progress', () => createProgressContent(ui.content))
  router.register('components/radios', () => createRadiosContent(ui.content))
  router.register('components/sliders', () => createSlidersContent(ui.content))
  router.register('components/snackbars', () => createSnackbarsContent(ui.content))
  router.register('components/switches', () => createSwitchesContent(ui.content))
  router.register('components/textfields', () => createTextfieldsContent(ui.content))
  router.register('components/tabs', () => createTabsContent(ui.content))
  // Add navigation hooks
  router.beforeEach((route) => {
    // log.debug('Navigation started:', route)
    ui.content.innerHTML = ''
  })

  router.afterEach((route) => {
    // log.debug('Navigation completed:', route)
  })
}
