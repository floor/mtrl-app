// src/client/core/navigation/rail.js
import { updateDrawerItems, toggleDrawer } from './drawer'

export const setupRailNavigation = (rail, nav, router, navigationConfig) => {
  if (!rail) return null

  const railHandler = (event) => {
    const { id } = event

    const items = navigationConfig[id] || []

    // Update drawer
    if (nav) {
      if (items.length > 0) {
        const itemsWithSection = items.map(item => ({
          ...item,
          section: id
        }))
        updateDrawerItems(nav, itemsWithSection, router)
        toggleDrawer(nav, true)
      } else {
        updateDrawerItems(nav, [], router)
        toggleDrawer(nav, false)
      }
    }

    // Navigate to section
    if (router) {
      router.navigate(id, '', { replace: true }) // Use replace to avoid duplicate history entries
    }
  }

  rail.on('change', railHandler)
  return () => rail.off('change', railHandler)
}
