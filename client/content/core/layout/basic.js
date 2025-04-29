import {
  createContentSection
} from '../../../layout'

import {
  createLayout,
  createElement
} from 'mtrl'

export const createBasicLayout = (container) => {
  const layout = createLayout(createContentSection({
    title: 'Basic Layout Structure',
    description: 'A standard layout with header, sidebar, main content, and footer.',
    class: 'theme-colors'
  }), container).getAll()

  const basicLayoutContainer = createElement({
    class: 'layout-demo basic-layout'
  })

  // Create header
  const header = createElement({
    tag: 'header',
    class: 'layout-demo__header',
    text: 'Header'
  })

  // Create main area with sidebar and content
  const main = createElement({
    tag: 'main',
    class: 'layout-demo__main'
  })

  const sidebar = createElement({
    tag: 'aside',
    class: 'layout-demo__sidebar',
    text: 'Sidebar'
  })

  const content = createElement({
    tag: 'section',
    class: 'layout-demo__content',
    text: 'Main Content'
  })

  main.appendChild(sidebar)
  main.appendChild(content)

  // Create footer
  const footer = createElement({
    tag: 'footer',
    class: 'layout-demo__footer',
    text: 'Footer'
  })

  // Append elements to the container
  basicLayoutContainer.appendChild(header)
  basicLayoutContainer.appendChild(main)
  basicLayoutContainer.appendChild(footer)

  layout.body.appendChild(basicLayoutContainer)
}
