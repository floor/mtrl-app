// client/core/content-navigation.js
import { navigationLayout } from '../config'

/**
 * Creates a sequential content map from the navigation layout
 */
function createSequentialContentMap () {
  const contentSequence = []

  // Get ordered sections
  const orderedSections = Object.keys(navigationLayout)

  // Process each section
  orderedSections.forEach(sectionKey => {
    const section = navigationLayout[sectionKey]

    // Add section landing page
    contentSequence.push({
      key: sectionKey,
      path: sectionKey,
      title: section.title || sectionKey,
      type: 'section'
    })

    // Process items in this section
    if (section.items && Array.isArray(section.items)) {
      section.items.forEach(item => {
        if (item.path) {
          // Handle direct paths vs relative paths
          const itemPath = item.path.startsWith('/')
            ? item.path.substring(1) // Remove leading slash
            : `${sectionKey}/${item.path}`

          contentSequence.push({
            key: itemPath,
            path: itemPath,
            title: item.title || item.label || item.path,
            parentSection: sectionKey,
            type: 'item'
          })
        }

        // Process subitems
        if (item.items && Array.isArray(item.items)) {
          item.items.forEach(subItem => {
            if (subItem.path) {
              // Handle direct paths vs relative paths
              const subItemPath = subItem.path.startsWith('/')
                ? subItem.path.substring(1) // Remove leading slash
                : item.path
                  ? `${sectionKey}/${item.path}/${subItem.path}`
                  : `${sectionKey}/${subItem.path}`

              contentSequence.push({
                key: subItemPath,
                path: subItemPath,
                title: subItem.title || subItem.label || subItem.path,
                parentSection: sectionKey,
                parentItem: item.path,
                type: 'subitem'
              })
            }
          })
        }
      })
    }
  })

  return contentSequence
}

// Create the content sequence once
const contentSequence = createSequentialContentMap()

/**
 * Get adjacent content items (previous and next) for a given path
 * @param {string} currentPath - The current content path
 * @returns {Object} - Contains previous and next content items
 */
export function getAdjacentContent (currentPath) {
  // Normalize path (remove leading slash if exists)
  const normalizedPath = currentPath.startsWith('/')
    ? currentPath.substring(1)
    : currentPath

  // Find current item index in the sequence
  const currentIndex = contentSequence.findIndex(item => item.path === normalizedPath)

  // If not found, return empty result
  if (currentIndex === -1) {
    return { previous: null, next: null }
  }

  // Get previous item (if not first)
  const previous = currentIndex > 0 ? contentSequence[currentIndex - 1] : null

  // Get next item (if not last)
  const next = currentIndex < contentSequence.length - 1 ? contentSequence[currentIndex + 1] : null

  return { previous, next }
}

export default { getAdjacentContent, contentSequence }
