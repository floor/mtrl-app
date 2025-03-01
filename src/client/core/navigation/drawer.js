// src/client/core/navigation/drawer.js

let currentHandler = null // Keep track of current handler

export const updateDrawerItems = (drawer, items, router) => {
  if (!drawer) {
    log.error('Drawer not available for updating items')
    return
  }

  // log.drawerUpdate(drawer, items)

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

    // Add new items
    items.forEach(item => {
      drawer.addItem({
        id: item.id,
        label: item.label,
        data: {
          section: item.section,
          path: item.path
        }
      })
    })

    // Create and store new handler
    currentHandler = (event) => {
      const selectedItem = event.item
      if (!selectedItem) return

      // log.debug('Drawer item selected:', {
      //   id: selectedItem.config.id,
      //   section: selectedItem.config.data.section,
      //   path: selectedItem.config.data.path
      // })

      if (router) {
        const route = router.parsePath(selectedItem.config.data.path)
        router.navigate(route.section, route.subsection, { replace: true })
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
