#!/usr/bin/env bun
/**
 * Script to generate static snapshots of mtrl-app using the snpsht package
 * This script uses the existing sitemap.xml
 */

import Snpsht from 'snpsht'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the project root directory (one level up from the script directory)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

async function generateSnapshots () {
  console.log('🚀 Generating static snapshots of mtrl-app...')

  // Configuration - adjust these values as needed
  const baseUrl = 'http://localhost:4000' // Your local mtrl-app instance
  const sitemapUrl = 'http://localhost:4000/sitemap.xml' // Path to your existing sitemap
  const outDir = path.join(projectRoot, 'snapshot') // Store snapshots at project root level

  console.log(`Base URL: ${baseUrl}`)
  console.log(`Sitemap: ${sitemapUrl}`)
  console.log(`Output Directory: ${outDir}`)

  // Initialize snpsht
  const snpsht = new Snpsht({
    baseUrl,
    sitemapUrl,
    outDir,
    concurrency: 2,
    waitForNetworkIdle: true,
    timeout: 30000,
    additionalWaitMs: 1000,
    prettyHtml: true,
    includeMetadata: true,
    verbose: true
  })

  try {
    // Generate snapshots
    const result = await snpsht.generate()

    console.log('\n📊 Results:')
    console.log(`Total URLs: ${result.total}`)
    console.log(`Successful: ${result.success}`)
    console.log(`Failed: ${result.failed}`)

    if (result.failed > 0) {
      console.log('\n⚠️ Failed URLs:')
      result.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`- ${r.url}: ${r.error}`)
        })
    }

    console.log('\n✅ Snapshot generation complete!')
    console.log(`Snapshots are available in: ${outDir}`)
    console.log('\nTo view snapshots in your browser, visit: http://localhost:4000/snapshot/')
    console.log('Individual pages can be accessed at: http://localhost:4000/snapshot/{page-path}')
  } catch (error) {
    console.error('❌ Error generating snapshots:', error)
  } finally {
    // Always close to release resources
    await snpsht.close()
  }
}

// Run the function
generateSnapshots().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
