#!/usr/bin/env bun
// scripts/verify-seo.js
//
// This script verifies the SEO setup by checking that all snapshots have proper
// canonical links, meta tags, and other SEO-related elements

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Setup paths
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const SNAPSHOT_DIR = path.join(__dirname, '..', 'snapshot')

// Check if snapshot directory exists
if (!fs.existsSync(SNAPSHOT_DIR)) {
  console.error('❌ Snapshot directory not found. Run `bun run snapshot` first.')
  process.exit(1)
}

/**
 * Function to scan the snapshot directory
 */
function scanDirectory (dir, results = []) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // Recursive call for directories
      scanDirectory(filePath, results)
    } else if (file.endsWith('.html')) {
      // Found an HTML file
      results.push(filePath)
    }
  }

  return results
}

/**
 * Check a single HTML file for SEO elements
 */
function checkHtmlFile (filePath) {
  const relativePath = path.relative(SNAPSHOT_DIR, filePath)
  const html = fs.readFileSync(filePath, 'utf-8')
  const issues = []

  // Check for title
  if (!html.includes('<title>')) {
    issues.push('Missing title tag')
  }

  // Check for meta description
  if (!html.includes('<meta name="description"')) {
    issues.push('Missing meta description')
  }

  // Check for canonical link
  if (!html.includes('<link rel="canonical"')) {
    issues.push('Missing canonical link')
  }

  // Check for Open Graph tags
  if (!html.includes('<meta property="og:')) {
    issues.push('Missing Open Graph tags')
  }

  // Check for Twitter Card tags
  if (!html.includes('<meta name="twitter:')) {
    issues.push('Missing Twitter Card tags')
  }

  // Check for snapshot metadata
  if (!html.includes('<meta name="snpsht:generated"')) {
    issues.push('Missing snapshot generation metadata')
  }

  return {
    path: relativePath,
    issues
  }
}

/**
 * Main function
 */
async function main () {
  console.log('🔍 Verifying SEO setup in snapshots...')

  // Get all HTML files
  const htmlFiles = scanDirectory(SNAPSHOT_DIR)

  if (htmlFiles.length === 0) {
    console.error('❌ No HTML files found in snapshot directory.')
    process.exit(1)
  }

  console.log(`Found ${htmlFiles.length} HTML files in snapshot directory.`)

  // Check each file
  const results = htmlFiles.map(checkHtmlFile)

  // Count files with issues
  const filesWithIssues = results.filter(result => result.issues.length > 0)

  // Display results
  console.log('\n📊 SEO Verification Results:')
  console.log(`• ${htmlFiles.length} total snapshot files`)
  console.log(`• ${htmlFiles.length - filesWithIssues.length} files with complete SEO setup`)
  console.log(`• ${filesWithIssues.length} files with issues`)

  // Show details for files with issues
  if (filesWithIssues.length > 0) {
    console.log('\n❗ Files with SEO issues:')

    for (const result of filesWithIssues) {
      console.log(`\n${result.path}:`)
      for (const issue of result.issues) {
        console.log(`  • ${issue}`)
      }
    }

    console.log('\n⚠️ Some snapshots have SEO issues. Please fix them and regenerate snapshots.')
  } else {
    console.log('\n✅ All snapshots have complete SEO setup!')
  }
}

// Run the script
main().catch(console.error)
