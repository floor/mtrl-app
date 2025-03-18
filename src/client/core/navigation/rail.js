// src/client/core/navigation/rail.js
import { updateDrawerItems, toggleDrawer } from './drawer'

export const setupRailNavigation = (rail, nav, router, navigationConfig) => {
  if (!rail) return null

  // Store the current section to avoid redundant updates
  let currentSection = null

  // Click handler - We'll keep this for mobile and for actual navigation
  const railClickHandler = (event) => {
    const { id } = event

    // Navigate to section
    if (router) {
      router.navigate(id, '', { replace: true }) // Use replace to avoid duplicate history entries
    }

    // Update current section
    currentSection = id
  }

  // Mouseover handler - Show drawer but don't navigate
  const railMouseoverHandler = (event) => {
    const id = event.target.closest('[data-id]')?.getAttribute('data-id')
    if (!id) return // Only skip if no id found

    const items = navigationConfig[id] || []

    // Update drawer content without navigating
    if (nav) {
      if (items.length > 0) {
        const itemsWithSection = items.map(item => ({
          ...item,
          section: id
        }))
        updateDrawerItems(nav, itemsWithSection, router)
        toggleDrawer(nav, true)
      }
    }
  }

  // Mouseout handler - Optional: hide drawer when mouse leaves
  const railMouseoutHandler = (event) => {
    // Only hide drawer if the mouse is not moving to the drawer
    const relatedTarget = event.relatedTarget
    if (relatedTarget && (
      relatedTarget.closest('.mtrl-nav--drawer') ||
        relatedTarget.closest('.mtrl-nav--rail'))) {
      return // Don't hide if moving to drawer or still in rail
    }

    if (nav) {
      toggleDrawer(nav, false)
    }
  }

  // Setup event listeners
  rail.on('change', railClickHandler)

  // Add mouseover/mouseout to the rail element
  if (rail.element) {
    rail.element.addEventListener('mouseover', railMouseoverHandler)

    // Comment out the next line if you prefer to keep the drawer open
    // rail.element.addEventListener('mouseout', railMouseoutHandler);

    // Add mouseover to drawer to keep it open when hovered
    if (nav && nav.element) {
      nav.element.addEventListener('mouseover', () => {
        toggleDrawer(nav, true)
      })

      // Comment out the next line if you prefer to keep the drawer open
      // nav.element.addEventListener('mouseout', () => {
      //   toggleDrawer(nav, false);
      // });
    }
  }

  // Return cleanup function
  return () => {
    rail.off('change', railClickHandler)
    if (rail.element) {
      rail.element.removeEventListener('mouseover', railMouseoverHandler)
      rail.element.removeEventListener('mouseout', railMouseoutHandler)
    }
    if (nav && nav.element) {
      nav.element.removeEventListener('mouseover', () => {})
      nav.element.removeEventListener('mouseout', () => {})
    }
  }
}
