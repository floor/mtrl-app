// src/client/content/components/cards/helpers.js

import { createElement } from 'mtrl'

// Create a section with heading and description
export const createCardSection = (title, description) => {
  const section = createElement({
    tag: 'section',
    class: 'mtrl-content__section'
  })

  const heading = createElement({
    tag: 'h2',
    class: 'mtrl-content__section-title',
    text: title
  })

  const desc = createElement({
    tag: 'p',
    class: 'mtrl-content__description',
    text: description
  })

  section.appendChild(heading)
  section.appendChild(desc)

  return section
}

// Create a grid container for cards
export const createCardGrid = () => {
  return createElement({
    tag: 'div',
    class: 'cards-grid'
  })
}

// Create a list container for horizontal cards
export const createCardList = () => {
  return createElement({
    tag: 'div',
    class: 'cards-list'
  })
}
