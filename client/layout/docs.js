import {
  createContentSection
} from './index'

import {
  fetchMarkdown
} from '../services/docs'

import {
  createLayout
} from 'mtrl'

// Import highlighter if not already imported elsewhere
// import codeHighlighter from '../../../core/code/highlight'

export const createDocs = async (container, path) => {
  const title = 'Documentation'
  const layout = createLayout(createContentSection({ title }), container).component

  console.log('createSwitchDocs')

  // Show loading state
  layout.body.innerHTML = '<div class="loading">Loading documentation...</div>'

  try {
    // Await the promise from fetchMarkdown
    const htmlContent = await fetchMarkdown(path)
    console.log('Markdown content loaded successfully')

    // Set the HTML content to the layout body
    layout.body.innerHTML = htmlContent

    // Apply the class for styling
    layout.body.classList.add('markdown-container')
  } catch (error) {
    console.error('Error loading documentation:', error)
    layout.body.innerHTML = `<div class="error">Error loading documentation: ${error.message}</div>`
  }
}

// Alternative implementation (if you can't make the function async)
export const createDocsAlternative = (container, path) => {
  const title = 'Documentation'
  const layout = createLayout(createContentSection({ title }), container).component

  // Show loading state
  layout.body.innerHTML = '<div class="loading">Loading documentation...</div>'

  // Fetch the markdown and update the DOM when ready
  fetchMarkdown(path)
    .then(htmlContent => {
      console.log('Markdown content loaded successfully')
      layout.body.innerHTML = htmlContent
      layout.body.classList.add('markdown-container')
    })
    .catch(error => {
      console.error('Error loading documentation:', error)
      layout.body.innerHTML = `<div class="error">Error loading documentation: ${error.message}</div>`
    })

  return layout
}
