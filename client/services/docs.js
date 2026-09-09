// client/services/docs.js

/**
 * Fetch documentation markup from the server.
 *
 * The markdown is rendered server-side (server/services/markdown.ts) and this
 * fetches the result. There used to be a second, different markdown parser
 * here, so the same document rendered differently depending on the route that
 * served it, and tables came out as plain text on one of them.
 *
 * @param {string} markdownPath Path to the markdown file, relative to /docs
 * @returns {Promise<string>} HTML ready to insert into the DOM
 */
export async function fetchMarkdown (markdownPath) {
  try {
    const response = await fetch(`/md/${markdownPath}`, {
      headers: { Accept: 'text/html' }
    })

    if (!response.ok) {
      throw new Error(`Failed to load markdown: ${response.status}`)
    }

    return await response.text()
  } catch (error) {
    console.error('Error fetching markdown:', error)
    return `<div class="error">Error loading content: ${error.message}</div>`
  }
}

export default fetchMarkdown
