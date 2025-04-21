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
      attributes: { role: 'navigation', 'aria-label': 'Content pagination' },
      layout: { type: 'row', justify: 'between', align: 'center' }
    }, [
      // Previous container with link nested inside
      'prevContainer', { className: 'pagination-prev pagination-container' },
      previous
        ? [
            createElement, 'prevLink', {
              tag: 'a',
              className: 'pagination-link prev',
              attributes: { href: `/${previous.path}` },
              events: { click: (e) => { e.preventDefault(); if (router) router.navigate(previous.path) } }
            }, [
              createElement, 'prevArrow', { tag: 'span', className: 'pagination-arrow', text: '←' },
              createElement, 'prevContent', { tag: 'span', className: 'pagination-content' }, [
                createElement, 'prevLabel', { tag: 'small', className: 'pagination-label', text: 'Previous' },
                createElement, 'prevTitle', { tag: 'span', className: 'pagination-title', text: previous.title }
              ]
            ]
          ]
        : null,

      // Next container with link nested inside
      'nextContainer', { className: 'pagination-next pagination-container' },
      next
        ? [
            createElement, 'nextLink', {
              tag: 'a',
              className: 'pagination-link next',
              attributes: { href: `/${next.path}` },
              events: { click: (e) => { e.preventDefault(); if (router) router.navigate(next.path) } }
            }, [
              createElement, 'nextContent', { tag: 'span', className: 'pagination-content' }, [
                createElement, 'nextLabel', { tag: 'small', className: 'pagination-label', text: 'Next' },
                createElement, 'nextTitle', { tag: 'span', className: 'pagination-title', text: next.title }
              ],
              createElement, 'nextArrow', { tag: 'span', className: 'pagination-arrow', text: '→' }
            ]
          ]
        : null
    ]
  ]

  const pagination = createLayout(paginationLayout)
  return pagination.element
}

export default createContentPagination
