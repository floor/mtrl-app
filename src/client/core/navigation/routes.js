// src/client/core/navigation/routes.js
import {
  createButtonsContent,
  createCheckboxesContent,
  createListsContent,
  createMenusContent,
  createSnackbarsContent,
  createSwitchesContent,
  createTextfieldsContent
} from '../../content'

export const initializeRoutes = (router, ui) => {
  if (!router || !ui) return

  // Register route handlers
  router.register('components/buttons', () => createButtonsContent(ui.content))
  router.register('components/checkboxes', () => createCheckboxesContent(ui.content))
  router.register('components/lists', () => createListsContent(ui.content))
  router.register('components/menus', () => createMenusContent(ui.content))
  router.register('components/snackbars', () => createSnackbarsContent(ui.content))
  router.register('components/switches', () => createSwitchesContent(ui.content))
  router.register('components/textfields', () => createTextfieldsContent(ui.content))

  // Add navigation hooks
  router.beforeEach((route) => {
    log.debug('Navigation started:', route)
    ui.content.innerHTML = ''
  })

  router.afterEach((route) => {
    log.debug('Navigation completed:', route)
  })
}
