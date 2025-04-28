import {
  createContentSection
} from '../../../layout'

import {
  fetchMarkdown
} from '../../../services/docs'

import {
  createLayout
} from 'mtrl'

// Import highlighter if not already imported elsewhere
// import codeHighlighter from '../../../core/code/highlight'

export const createSwitchDocs = async (container) => {
  const title = 'Documentation'
  const layout = createLayout(createContentSection({ title }), container).component

  console.log('createSwitchDocs')

  // Show loading state
  layout.body.innerHTML = '<div class="loading">Loading documentation...</div>'

  try {
    // Await the promise from fetchMarkdown
    const htmlContent = await fetchMarkdown('components/switch.md')
    console.log('Markdown content loaded successfully')

    // Set the HTML content to the layout body
    layout.body.innerHTML = htmlContent

    // Apply the class for styling
    layout.body.classList.add('markdown-container')

    // Apply code highlighting with a small delay to ensure the DOM is updated
    // setTimeout(() => {
    //   codeHighlighter.highlight(layout.body, { delay: 0 })
    // }, 50)
  } catch (error) {
    console.error('Error loading documentation:', error)
    layout.body.innerHTML = `<div class="error">Error loading documentation: ${error.message}</div>`
  }
}

// Alternative implementation (if you can't make the function async)
export const createSwitchDocsAlternative = (container) => {
  const title = 'Documentation'
  const layout = createLayout(createContentSection({ title }), container).component

  // Show loading state
  layout.body.innerHTML = '<div class="loading">Loading documentation...</div>'

  // Fetch the markdown and update the DOM when ready
  fetchMarkdown('components/switch.md')
    .then(htmlContent => {
      console.log('Markdown content loaded successfully')
      layout.body.innerHTML = htmlContent
      layout.body.classList.add('markdown-container')

      // Apply code highlighting
      // setTimeout(() => {
      //   codeHighlighter.highlight(layout.body, { delay: 0 })
      // }, 50)
    })
    .catch(error => {
      console.error('Error loading documentation:', error)
      layout.body.innerHTML = `<div class="error">Error loading documentation: ${error.message}</div>`
    })

  return layout
}
