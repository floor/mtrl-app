#!/usr/bin/env bun
/**
 * update-sitemap-dates.js
 *
 * A script to update the sitemap.js file with last modified dates from git
 * for each corresponding content file.
 *
 * Run with: bun run update-sitemap-dates.js
 */

import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Get the project root directory
const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, '..') // Go up one level from scripts directory

// File paths
const SITEMAP_PATH = join(PROJECT_ROOT, 'client', 'sitemap.js')
const CONTENT_DIR = join(PROJECT_ROOT, 'client', 'content')

/**
 * Execute a git command and return the output
 * @param {string[]} args Git command arguments
 * @returns {Promise<string>} Command output
 */
async function git (args) {
  return new Promise((resolve, reject) => {
    const process = spawn('git', args, { cwd: PROJECT_ROOT })

    let stdout = ''
    let stderr = ''

    process.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    process.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Git command failed with code ${code}: ${stderr}`))
      } else {
        resolve(stdout.trim())
      }
    })
  })
}

/**
 * Get the last modified date of a file from git
 * @param {string} filePath Path to the file relative to project root
 * @returns {Promise<string>} ISO date string (YYYY-MM-DD)
 */
async function getLastModifiedDate (filePath) {
  try {
    // Get the last commit date for the file
    const output = await git(['log', '-1', '--format=%ai', '--', filePath])

    if (!output) {
      console.warn(`No git history found for ${filePath}`)
      return new Date().toISOString().split('T')[0] // Today as fallback
    }

    // Parse the date (format: YYYY-MM-DD HH:MM:SS +ZONE)
    const date = new Date(output)
    return date.toISOString().split('T')[0] // YYYY-MM-DD
  } catch (error) {
    console.error(`Error getting date for ${filePath}:`, error.message)
    return new Date().toISOString().split('T')[0] // Today as fallback
  }
}

/**
 * Get the creation date of a file from git
 * @param {string} filePath Path to the file relative to project root
 * @returns {Promise<string>} ISO date string (YYYY-MM-DD)
 */
async function getCreationDate (filePath) {
  try {
    // Get the first commit date for the file
    const output = await git(['log', '--follow', '--format=%ai', '--reverse', '--', filePath])

    if (!output) {
      console.warn(`No git history found for ${filePath}`)
      return new Date().toISOString().split('T')[0] // Today as fallback
    }

    // Get the first line (earliest commit)
    const firstLine = output.split('\n')[0]

    // Parse the date (format: YYYY-MM-DD HH:MM:SS +ZONE)
    const date = new Date(firstLine)
    return date.toISOString().split('T')[0] // YYYY-MM-DD
  } catch (error) {
    console.error(`Error getting creation date for ${filePath}:`, error.message)
    return new Date().toISOString().split('T')[0] // Today as fallback
  }
}

/**
 * Update the sitemap with last modified dates
 */
async function updateSitemapDates () {
  console.log('Updating sitemap dates from git...')

  try {
    // Read the current sitemap
    const sitemapContent = await fs.readFile(SITEMAP_PATH, 'utf8')

    // Create a backup of the original file
    const backupPath = join(PROJECT_ROOT, 'client', 'sitemap.js.bak')
    await fs.writeFile(backupPath, sitemapContent, 'utf8')
    console.log(`Backup created at ${backupPath}`)

    // First, clean up any malformed lastModified or createdDate entries
    let cleanedContent = sitemapContent
    // This regex removes standalone lastModified or createdDate entries that aren't properly part of an object
    cleanedContent = cleanedContent.replace(/,\s*(?:lastModified|createdDate):\s*['"][^'"]*['"]\s*(?=,|\n)/g, '')

    // Find the beginning of the sitemap declaration
    const sitemapStartIndex = cleanedContent.indexOf('export const sitemap = {')
    if (sitemapStartIndex === -1) {
      throw new Error('Could not find sitemap declaration in the file')
    }

    // Only process the sitemap structure part, not the imports
    const sitemapStructure = cleanedContent.substring(sitemapStartIndex)

    // Parse the sitemap using regex to find all path entries within the sitemap structure
    const pathRegex = /path:\s*['"]([^'"]+)['"]/g
    let match
    const paths = []

    while ((match = pathRegex.exec(sitemapStructure)) !== null) {
      paths.push(match[1])
    }

    console.log(`Found ${paths.length} paths in sitemap.js`)

    // Map URL paths to content files and get their last modified dates
    const modifiedDates = {}

    for (const urlPath of paths) {
      // Skip empty paths
      if (!urlPath) continue

      // Convert URL path to content file path
      // For example: '/styles' -> '/client/content/styles/index.js'
      const relativePath = urlPath.replace(/^\//, '') // Remove leading slash
      let contentPath

      if (relativePath === '') {
        // Handle root path
        contentPath = join(CONTENT_DIR, 'index.js')
      } else {
        // First check if there's a direct file match
        contentPath = join(CONTENT_DIR, `${relativePath}.js`)

        // If not, look for an index.js in the directory
        try {
          await fs.access(contentPath)
        } catch {
          contentPath = join(CONTENT_DIR, relativePath, 'index.js')
        }
      }

      try {
        // Check if the content file exists
        await fs.access(contentPath)

        // Get its last modified date from git
        const lastModified = await getLastModifiedDate(contentPath)

        // Get its creation date from git
        const createdDate = await getCreationDate(contentPath)

        modifiedDates[urlPath] = {
          lastModified,
          createdDate
        }

        console.log(`${urlPath} -> ${contentPath}:`)
        console.log(`  - Created: ${createdDate}`)
        console.log(`  - Modified: ${lastModified}`)
      } catch (error) {
        console.warn(`Content file not found: ${contentPath} for ${urlPath}`)
      }
    }

    // Update the sitemap content with the dates
    let updatedContent = cleanedContent

    // Function to properly format property insertion
    function insertPropertyAfter (content, searchText, position, propertyName, propertyValue) {
      // Find the next comma or closing bracket after the position
      const commaPos = content.indexOf(',', position)
      const bracketPos = content.indexOf('}', position)
      const nextLinePos = content.indexOf('\n', position)

      // Determine the proper indentation level
      // Find the indentation of the line containing the path property
      const lineStart = content.lastIndexOf('\n', position)
      let indentation = ''
      if (lineStart !== -1) {
        // Extract the whitespace at the beginning of the line
        const lineText = content.substring(lineStart + 1, position)
        const match = lineText.match(/^(\s+)/)
        if (match) {
          indentation = match[1]
        }
      }

      // Determine where to insert based on what comes first
      let insertPos = -1
      if (commaPos !== -1 && (bracketPos === -1 || commaPos < bracketPos)) {
        // Insert after the comma
        insertPos = commaPos + 1
      } else if (bracketPos !== -1) {
        // Insert before the closing bracket
        insertPos = bracketPos
        // Need to add a comma if not already present
        if (content.substring(position, bracketPos).trim() !== '') {
          return content.substring(0, insertPos) +
                 `,\n${indentation}${propertyName}: '${propertyValue}'` +
                 content.substring(insertPos)
        }
      } else if (nextLinePos !== -1) {
        // If no comma or bracket, try inserting at the next line break
        insertPos = nextLinePos
      } else {
        // Fallback - insert directly after the search text
        insertPos = position
      }

      if (insertPos !== -1) {
        return content.substring(0, insertPos) +
               `\n${indentation}${propertyName}: '${propertyValue}',` +
               content.substring(insertPos)
      }

      // If all else fails, just append after the search text
      return content.substring(0, position) +
             `, ${propertyName}: '${propertyValue}'` +
             content.substring(position)
    }

    // Process each path and add/update date properties
    for (const [urlPath, dates] of Object.entries(modifiedDates)) {
      // Find the path declaration in the sitemap
      const pathDeclaration = `path: '${urlPath}'`
      const altPathDeclaration = `path: "${urlPath}"`

      // Try with single quotes first
      let pathPos = updatedContent.indexOf(pathDeclaration)
      if (pathPos === -1) {
        // Try with double quotes
        pathPos = updatedContent.indexOf(altPathDeclaration)
        if (pathPos === -1) {
          console.warn(`Could not find path '${urlPath}' in the sitemap`)
          continue
        }
      }

      // Find the end position of the path declaration
      const pathEndPos = pathPos + (pathPos === updatedContent.indexOf(pathDeclaration)
        ? pathDeclaration.length
        : altPathDeclaration.length)

      // Check if lastModified already exists for this path object
      const objectEndPos = updatedContent.indexOf('}', pathEndPos)
      const sectionToCheck = updatedContent.substring(pathEndPos, objectEndPos !== -1 ? objectEndPos : undefined)

      const hasLastModified = sectionToCheck.includes('lastModified:')
      const hasCreatedDate = sectionToCheck.includes('createdDate:')

      // First add createdDate if it doesn't exist
      if (!hasCreatedDate) {
        updatedContent = insertPropertyAfter(
          updatedContent,
          updatedContent.substring(pathPos, pathEndPos),
          pathEndPos,
          'createdDate',
          dates.createdDate
        )

        // Recalculate path position since we modified the content
        pathPos = updatedContent.indexOf(pathDeclaration)
        if (pathPos === -1) {
          pathPos = updatedContent.indexOf(altPathDeclaration)
        }
      }

      // Then add/update lastModified (updating is handled by replacing the existing value)
      if (!hasLastModified) {
        // Get the updated pathEndPos after possible createdDate insertion
        const updatedPathEndPos = pathPos + (pathPos === updatedContent.indexOf(pathDeclaration)
          ? pathDeclaration.length
          : altPathDeclaration.length)

        updatedContent = insertPropertyAfter(
          updatedContent,
          updatedContent.substring(pathPos, updatedPathEndPos),
          updatedPathEndPos,
          'lastModified',
          dates.lastModified
        )
      } else {
        // Update existing lastModified
        const lastModifiedPos = updatedContent.indexOf('lastModified:', pathEndPos)
        if (lastModifiedPos !== -1) {
          const valueStartPos = updatedContent.indexOf("'", lastModifiedPos + 12) + 1
          const valueEndPos = updatedContent.indexOf("'", valueStartPos)

          if (valueStartPos !== -1 && valueEndPos !== -1) {
            updatedContent = updatedContent.substring(0, valueStartPos) +
                             dates.lastModified +
                             updatedContent.substring(valueEndPos)
          }
        }
      }
    }

    // Write the updated sitemap
    await fs.writeFile(SITEMAP_PATH, updatedContent, 'utf8')

    console.log('Sitemap dates updated successfully!')
  } catch (error) {
    console.error('Error updating sitemap dates:', error)
    process.exit(1)
  }
}

/**
 * Check if a file exists
 * @param {string} filePath Path to the file
 * @returns {Promise<boolean>} True if file exists
 */
async function fileExists (filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

// Run the script
updateSitemapDates().catch(error => {
  console.error('Script failed:', error)
  process.exit(1)
})
