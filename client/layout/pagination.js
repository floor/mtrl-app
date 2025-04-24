// client/core/content-pagination.js
import { createLayout, createElement } from 'mtrl'
import { getAdjacentContent } from '../core/content-navigation'
/**
 * Creates a pagination footer component for content navigation using mtrl layout
 * @param {string} currentPath - Current content path
 * @param {Object} router - Router instance for navigation
 * @returns {HTMLElement} - The pagination element
 */
export function createContentPagination (currentPath, router) {
  // Get adjacent content
  const { previous, next } = getAdjacentContent(currentPath)

  const paginationLayout = [
    'pagination', {
      className: 'content-pagination',
      attributes: { role: 'navigation', 'aria-label': 'Content pagination' }
    }, [
      // Previous container with nested link
      createElement, 'prevContainer', {
        tag: 'div',
        className: 'pagination-prev'
      },
      previous ? [
        createElement, 'prevLink', {
          tag: 'a',
          className: 'pagination-link',
          attributes: { href: `/${previous.path}` },
          events: { click: (e) => { e.preventDefault(); if (router) router.navigate(previous.path) } }
        }, [
          createElement, 'prevContent', { tag: 'span', className: 'pagination-content' }, [
            createElement, 'prevLabel', {
              tag: 'small',
              className: 'pagination-label',
              html: '← Previous' // Arrow inside the label
            },
            createElement, 'prevTitle', {
              tag: 'span',
              className: 'pagination-title',
              text: previous.title
            }
          ]
        ]
      ] : [],

      // Next container with nested link
      createElement, 'nextContainer', {
        tag: 'div',
        className: 'pagination-next'
      },
      next ? [
        createElement, 'nextLink', {
          tag: 'a',
          className: 'pagination-link',
          attributes: { href: `/${next.path}` },
          events: { click: (e) => { e.preventDefault(); if (router) router.navigate(next.path) } }
        }, [
          createElement, 'nextContent', { tag: 'span', className: 'pagination-content' }, [
            createElement, 'nextLabel', {
              tag: 'small',
              className: 'pagination-label',
              html: 'Up next →' // Arrow inside the label
            },
            createElement, 'nextTitle', {
              tag: 'span',
              className: 'pagination-title',
              text: next.title
            }
          ]
        ]
      ] : []
    ]
  ]

  const pagination = createLayout(paginationLayout)
  return pagination.element
}
export default createContentPagination
