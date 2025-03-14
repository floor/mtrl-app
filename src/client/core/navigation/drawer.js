// src/client/core/navigation/drawer.js

let currentHandler = null // Keep track of current handler

export const updateDrawerItems = (drawer, items, router) => {
  if (!drawer) {
    log.error('Drawer not available for updating items')
    return
  }

  try {
    // Remove existing handler if any
    if (currentHandler) {
      drawer.off('change', currentHandler)
      currentHandler = null
    }

    // Clear all existing items
    const currentItems = drawer.getAllItems()
    currentItems.forEach(item => {
      drawer.removeItem(item.config.id)
    })

    // Add new items with support for nested structure
    items.forEach(item => {
      const itemConfig = {
        id: item.id,
        label: item.label,
        data: {
          section: item.section,
          path: item.path
        }
      }

      // If item has nested items, include them in the config
      if (item.items && item.items.length > 0) {
        // Transform nested items
        itemConfig.items = item.items.map(nestedItem => ({
          id: nestedItem.id,
          label: nestedItem.label,
          data: {
            section: item.section,
            path: nestedItem.path
          }
        }))
      }

      drawer.addItem(itemConfig)
    })

    // Create and store new handler
    currentHandler = (event) => {
      const selectedItem = event.item
      if (!selectedItem || !selectedItem.config) return

      // Get the item data
      const itemConfig = selectedItem.config

      if (router) {
        // Always navigate to the path, even for parent items with children
        const path = itemConfig.data.path

        if (path) {
          // Use the router's parsePath to extract section and subsection
          const route = router.parsePath(path)

          console.log('Navigating to:', {
            path,
            section: route.section,
            subsection: route.subsection
          })

          // Navigate using the parsed route info
          router.navigate(route.section, route.subsection, { replace: true })
        } else {
          log.error('No path found in selected item', selectedItem)
        }
      } else {
        log.error('Router not initialized')
      }
    }

    // Attach new handler
    drawer.on('change', currentHandler)
  } catch (error) {
    log.error('Error updating drawer items:', error)
  }
}

export const cleanupDrawer = (drawer) => {
  if (currentHandler) {
    drawer.off('change', currentHandler)
    currentHandler = null
  }
}

export const toggleDrawer = (drawer, show) => {
  if (!drawer?.element) {
    log.error('Drawer element not found')
    return
  }

  // log.drawerToggle(show, drawer.element)

  const className = 'mtrl-nav--hidden'
  if (show) {
    drawer.element.classList.remove(className)
    drawer.element.setAttribute('aria-hidden', 'false')
  } else {
    drawer.element.classList.add(className)
    drawer.element.setAttribute('aria-hidden', 'true')
  }
}
