// src/client/services/art-api.js

/**
 * Service for fetching artwork data from the Art Institute of Chicago API
 * Documentation: https://api.artic.edu/docs/
 */

const ART_API_BASE_URL = 'https://api.artic.edu/api/v1'
const ART_IMAGE_BASE_URL = 'https://www.artic.edu/iiif/2'

/**
 * Search for artworks based on query parameters
 * @param {Object} params - Search parameters
 * @returns {Promise<Object>} Search results
 */
export const searchArtworks = async (params = {}) => {
  try {
    // Default search parameters
    const defaultParams = {
      limit: 10,
      fields: 'id,title,artist_title,date_display,image_id,style_title,medium_display,dimensions',
      query: {
        term: {
          is_public_domain: true
        }
      }
    }

    // Merge default params with provided params
    const searchParams = { ...defaultParams, ...params }

    // Convert query object to JSON string for API
    const queryParam = encodeURIComponent(JSON.stringify(searchParams.query))

    // Build URL
    const url = `${ART_API_BASE_URL}/artworks/search?q=${queryParam}&limit=${searchParams.limit}&fields=${searchParams.fields}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error searching artworks:', error)
    throw error
  }
}

/**
 * Get artwork by ID
 * @param {string|number} id - Artwork ID
 * @returns {Promise<Object>} Artwork data
 */
export const getArtwork = async (id) => {
  try {
    const url = `${ART_API_BASE_URL}/artworks/${id}?fields=id,title,artist_title,date_display,image_id,style_title,medium_display,dimensions,description`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error fetching artwork #${id}:`, error)
    throw error
  }
}

/**
 * Get image URL for artwork
 * @param {string} imageId - Image ID from artwork data
 * @param {number} width - Desired image width
 * @param {number} height - Desired image height (set to 0 for proportional height)
 * @returns {string} Image URL
 */
export const getArtworkImageUrl = (imageId, width = 400, height = 0) => {
  if (!imageId) {
    return null
  }

  // If height is 0, use 'full' for proportional scaling
  const heightParam = height || 'full'

  // Format: {base_url}/{identifier}/{region}/{size}/{rotation}/{quality}.{format}
  return `${ART_IMAGE_BASE_URL}/${imageId}/full/${width},${heightParam}/0/default.jpg`
}

/**
 * Search for famous artworks and transform to our app format
 * @returns {Promise<Array>} Formatted artwork data
 */
export const getFamousArtworks = async () => {
  try {
    // Search for famous artworks
    const searchResults = await searchArtworks({
      limit: 20,
      query: {
        bool: {
          must: [
            { term: { is_public_domain: true } },
            { exists: { field: 'image_id' } }
          ],
          should: [
            { term: { is_boosted: true } },
            { range: { popularity_score: { gte: 90 } } }
          ]
        }
      }
    })

    // Format the results to match our app's data structure
    const formattedArtworks = searchResults.data.map(artwork => ({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist_title || 'Unknown Artist',
      year: artwork.date_display || 'Unknown Date',
      style: artwork.style_title || 'Unknown Style',
      description: artwork.description || `${artwork.title} by ${artwork.artist_title || 'Unknown Artist'}, ${artwork.medium_display || 'various media'}.`,
      imageId: artwork.image_id,
      imageUrl: artwork.image_id ? getArtworkImageUrl(artwork.image_id) : null,
      orientation: getImageOrientation(artwork)
    }))

    return formattedArtworks
  } catch (error) {
    console.error('Error fetching famous artworks:', error)
    return []
  }
}

/**
 * Determine image orientation from dimensions
 * @param {Object} artwork - Artwork data
 * @returns {string} 'Portrait' or 'Landscape'
 */
const getImageOrientation = (artwork) => {
  if (!artwork.dimensions) {
    return 'Landscape' // Default
  }

  const dimensions = artwork.dimensions.toLowerCase()

  // Try to extract height and width from dimensions
  const heightMatch = dimensions.match(/height:?\s*(\d+(\.\d+)?)\s*(cm|mm|in)/i)
  const widthMatch = dimensions.match(/width:?\s*(\d+(\.\d+)?)\s*(cm|mm|in)/i)

  if (heightMatch && widthMatch) {
    const height = parseFloat(heightMatch[1])
    const width = parseFloat(widthMatch[1])

    return height > width ? 'Portrait' : 'Landscape'
  }

  return 'Landscape' // Default fallback
}

export default {
  searchArtworks,
  getArtwork,
  getArtworkImageUrl,
  getFamousArtworks
}
