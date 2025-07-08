#!/usr/bin/env bun

/**
 * Ultra-fast development build for mtrl-addons package
 * Optimized for speed - builds directly into mtrl-app/dist/mtrl-addons/
 */

import { join, dirname } from 'path'
import { existsSync, rmSync, watch } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = join(__dirname, '..')
const ADDONS_DIR = join(ROOT_DIR, '..', 'mtrl-addons')
const OUTPUT_DIR = join(ROOT_DIR, 'dist', 'mtrl-addons')

const isWatch = process.argv.includes('--watch')

console.log(`🔨 [BUILD-ADDONS] Ultra-fast ${isWatch ? 'watch' : 'build'} mode...`)

// Check if mtrl-addons directory exists
if (!existsSync(ADDONS_DIR)) {
  console.error('❌ [BUILD-ADDONS] mtrl-addons directory not found:', ADDONS_DIR)
  process.exit(1)
}

const buildAddons = async () => {
  try {
    // Quick clean - only remove built files
    if (existsSync(OUTPUT_DIR)) {
      const filesToRemove = ['index.js', 'index.mjs']
      filesToRemove.forEach(file => {
        const filePath = join(OUTPUT_DIR, file)
        if (existsSync(filePath)) rmSync(filePath, { force: true })
      })
    }

    const startTime = Date.now()

    // Build ES module version (primary)
    const esmResult = await Bun.build({
      entrypoints: [join(ADDONS_DIR, 'src', 'index.ts')],
      outdir: OUTPUT_DIR,
      target: 'browser',
      format: 'esm',
      minify: false,           // Skip minification for speed
      splitting: false,        // Skip code splitting for speed
      sourcemap: 'inline',     // Inline sourcemaps are faster
      naming: 'index.mjs',
      external: [],            // Bundle everything for development
      define: {
        'process.env.NODE_ENV': '"development"'
      }
    })

    if (!esmResult.success) {
      console.error('❌ [BUILD-ADDONS] ES module build failed:', esmResult.logs)
      if (!isWatch) process.exit(1)
      return false
    }

    // Build CommonJS version (for compatibility)  
    const cjsResult = await Bun.build({
      entrypoints: [join(ADDONS_DIR, 'src', 'index.ts')],
      outdir: OUTPUT_DIR,
      target: 'browser',
      format: 'cjs',
      minify: false,
      splitting: false,
      sourcemap: 'inline',
      naming: 'index.js',
      external: [],
      define: {
        'process.env.NODE_ENV': '"development"'
      }
    })

    if (!cjsResult.success) {
      console.error('❌ [BUILD-ADDONS] CommonJS build failed:', cjsResult.logs)
      if (!isWatch) process.exit(1)
      return false
    }

    const buildTime = Date.now() - startTime
    const esmSize = await Bun.file(join(OUTPUT_DIR, 'index.mjs')).size
    const cjsSize = await Bun.file(join(OUTPUT_DIR, 'index.js')).size
    
    console.log(`✅ [BUILD-ADDONS] Built in ${buildTime}ms`)
    console.log(`  ES: ${(esmSize / 1024).toFixed(1)}KB | CJS: ${(cjsSize / 1024).toFixed(1)}KB`)
    return true

  } catch (error) {
    console.error('❌ [BUILD-ADDONS] Build error:', error.message)
    if (!isWatch) process.exit(1)
    return false
  }
}

// Initial build
await buildAddons()

// Watch mode
if (isWatch) {
  console.log('👀 [BUILD-ADDONS] Watching for changes...')
  
  const watchPaths = [
    join(ADDONS_DIR, 'src')
  ]

  // Debounce mechanism to prevent duplicate builds
  let buildTimeout = null
  const debouncedBuild = (filename) => {
    if (buildTimeout) {
      clearTimeout(buildTimeout)
    }
    buildTimeout = setTimeout(async () => {
      console.log(`\n📁 [BUILD-ADDONS] File changed: ${filename}`)
      await buildAddons()
      buildTimeout = null
    }, 100) // 100ms debounce
  }

  watchPaths.forEach((path) => {
    if (existsSync(path)) {
      watch(path, { recursive: true }, (_, filename) => {
        if (filename?.endsWith('.ts') || filename?.endsWith('.js')) {
          debouncedBuild(filename)
        }
      })
    } else {
      console.warn(`⚠️ [BUILD-ADDONS] Watch path does not exist: ${path}`)
    }
  })

  // Keep process alive
  process.on('SIGINT', () => {
    console.log('\n👋 [BUILD-ADDONS] Stopping watch mode...')
    process.exit(0)
  })
} 