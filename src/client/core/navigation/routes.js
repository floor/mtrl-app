// src/client/core/navigation/routes.js
import {
  createEventsContent,
  createStateContent,
  createCompositionContent,
  createStylesContent,
  createColorsContent,
  createTypographyContent,
  createElevationContent,
  createLayoutContent,
  createButtonsContent,
  createCardsContent,
  createCheckboxesContent,
  createChipsContent,
  createListsContent,
  createNavigationsContent,
  createMenusContent,
  createSnackbarsContent,
  createSwitchesContent,
  createTextfieldsContent
} from '../../content'

export const initializeRoutes = (router, ui) => {
  if (!router || !ui) return

  // Register route handlers

  router.register('core/state', () => createStateContent(ui.content))
  router.register('core/events', () => createEventsContent(ui.content))
  router.register('core/composition', () => createCompositionContent(ui.content))
  router.register('styles/index', () => createStylesContent(ui.content))
  router.register('styles/index', () => createStylesContent(ui.content))
  router.register('styles/colors', () => createColorsContent(ui.content))
  router.register('styles/typography', () => createTypographyContent(ui.content))
  router.register('styles/elevation', () => createElevationContent(ui.content))
  router.register('styles/layout', () => createLayoutContent(ui.content))
  router.register('components/buttons', () => createButtonsContent(ui.content))
  router.register('components/cards', () => createCardsContent(ui.content))
  router.register('components/checkboxes', () => createCheckboxesContent(ui.content))
  router.register('components/chips', () => createChipsContent(ui.content))
  router.register('components/lists', () => createListsContent(ui.content))
  router.register('components/menus', () => createMenusContent(ui.content))
  router.register('components/navigations', () => createNavigationsContent(ui.content))
  router.register('components/snackbars', () => createSnackbarsContent(ui.content))
  router.register('components/switches', () => createSwitchesContent(ui.content))
  router.register('components/textfields', () => createTextfieldsContent(ui.content))
  // Add navigation hooks
  router.beforeEach((route) => {
    // log.debug('Navigation started:', route)
    ui.content.innerHTML = ''
  })

  router.afterEach((route) => {
    // log.debug('Navigation completed:', route)
  })
}
