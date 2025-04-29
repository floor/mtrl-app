// client/services/docs.js

/**
 * Fetch and parse markdown content from the server
 * @param {string} markdownPath Path to the markdown file (relative to /docs)
 * @returns {Promise<string>} HTML content ready to insert into the DOM
 */
export async function fetchMarkdown (markdownPath) {
  try {
    // Request raw markdown content
    const response = await fetch(`/md/${markdownPath}`, {
      headers: {
        Accept: 'text/plain'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to load markdown: ${response.status}`)
    }

    // Get the markdown content
    const markdown = await response.text()

    // Parse the markdown to HTML
    const html = parseMarkdown(markdown)

    return html
  } catch (error) {
    console.error('Error fetching markdown:', error)
    return `<div class="error">Error loading content: ${error.message}</div>`
  }
}

/**
 * Parse markdown text to HTML
 * @param {string} markdown Raw markdown content
 * @returns {string} Parsed HTML
 */
function parseMarkdown (markdown) {
  // Modified markdown parsing approach that handles code blocks first
  let html = markdown

  // Store code blocks temporarily to prevent processing their contents
  const codeBlocks = []

  // Extract code blocks first to prevent processing markdown inside them
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gm, (match, language, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`
    const lang = language || 'plaintext'
    codeBlocks.push(`<pre class="language-${lang}"><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`)
    return placeholder
  })

  // Extract inline code to prevent processing markdown inside them
  const inlineCodes = []
  html = html.replace(/\`(.*?)\`/gm, (match, code) => {
    const placeholder = `__INLINE_CODE_${inlineCodes.length}__`
    inlineCodes.push(`<code>${escapeHtml(code)}</code>`)
    return placeholder
  })

  // Now process other markdown elements
  html = html
    // Headers - ensure they're at the start of a line
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
    .replace(/^###### (.*$)/gm, '<h6>$1</h6>')

    // Blockquotes
    .replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')

    // Bold and italic
    .replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gm, '<em>$1</em>')

    // Images
    .replace(/!\[(.*?)\]\((.*?)\)/gm, '<img alt="$1" src="$2" loading="lazy" />')

    // Links
    .replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2">$1</a>')

    // Tables (basic support)
    .replace(/^\|(.*)\|$/gm, (match, content) => {
      // Table row content
      const cells = content.split('|').map(cell => cell.trim())

      // Check if this is a header separator row
      if (cells.every(cell => cell === '' || cell.match(/^[-:]+$/))) {
        return '' // Skip separator row
      }

      // Create table cells
      const cellsHtml = cells.map(cell => `<td>${cell}</td>`).join('')
      return `<tr>${cellsHtml}</tr>`
    })

    // Horizontal rule
    .replace(/^---$/gm, '<hr>')

    // Lists
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')

    // Paragraphs (any line not starting with a special character)
    .replace(/^(?!\<)(.+)/gm, '<p>$1</p>')

  // Process lists properly (wrap li items in ul/ol)
  html = processLists(html)

  // Process tables properly (wrap rows in table structure)
  html = processTables(html)

  // Restore inline code blocks
  inlineCodes.forEach((code, index) => {
    html = html.replace(`__INLINE_CODE_${index}__`, code)
  })

  // Restore code blocks last
  codeBlocks.forEach((block, index) => {
    html = html.replace(`__CODE_BLOCK_${index}__`, block)
  })

  return html
}

/**
 * Process list items into proper list structures
 * @param {string} html Partially processed HTML
 * @returns {string} HTML with proper list structures
 */
function processLists (html) {
  // Find sequences of list items and wrap them
  let processedHtml = html

  // Handle unordered lists
  processedHtml = processedHtml.replace(/<li>(?:(?!<\/li>).)*<\/li>(?:\s*<li>(?:(?!<\/li>).)*<\/li>)*/g, match => {
    return `<ul class="markdown-list">${match}</ul>`
  })

  return processedHtml
}

/**
 * Process table rows into proper table structures
 * @param {string} html Partially processed HTML
 * @returns {string} HTML with proper table structures
 */
function processTables (html) {
  // Find sequences of table rows and wrap them in table structure
  let processedHtml = html

  // Replace consecutive tr elements with a full table
  processedHtml = processedHtml.replace(/<tr>(?:(?!<\/tr>).)*<\/tr>(?:\s*<tr>(?:(?!<\/tr>).)*<\/tr>)*/g, match => {
    // Split into rows
    const rows = match.split('</tr>').filter(row => row.trim().length > 0)

    if (rows.length > 0) {
      // Assume first row is header
      const headerRow = rows[0] + '</tr>'
      const headerHtml = headerRow.replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>')

      // Rest are body rows
      const bodyRows = rows.slice(1).map(row => row + '</tr>').join('')

      return `<table class="markdown-table">
        <thead>${headerHtml}</thead>
        <tbody>${bodyRows}</tbody>
      </table>`
    }

    return `<table class="markdown-table">${match}</table>`
  })

  return processedHtml
}

/**
 * Escape HTML special characters
 * @param {string} html Raw HTML to escape
 * @returns {string} Escaped HTML safe to insert
 */
function escapeHtml (html) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
