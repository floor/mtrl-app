// src/client/core/navigation/routes.js
import {
  createButtonsView,
  createCheckboxesView,
  createListsView,
  createSnackbarsView,
  createSwitchesView,
  createTextfieldsView

} from '../../views'
export const initializeRoutes = (router, ui) => {
  if (!router || !ui) return

  // Register route handlers
  router.register('components/buttons', () => createButtonsView(ui.main))
  router.register('components/checkboxes', () => createCheckboxesView(ui.main))
  router.register('components/lists', () => createListsView(ui.main))
  router.register('components/snackbars', () => createSnackbarsView(ui.main))
  router.register('components/switches', () => createSwitchesView(ui.main))
  router.register('components/textfields', () => createTextfieldsView(ui.main))

  // Add navigation hooks
  router.beforeEach((route) => {
    log.debug('Navigation started:', route)
    ui.main.innerHTML = ''
  })

  router.afterEach((route) => {
    log.debug('Navigation completed:', route)
  })
}
