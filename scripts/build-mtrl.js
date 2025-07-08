#!/usr/bin/env bun

/**
 * Ultra-fast development build for mtrl package
 * Optimized for speed - builds directly into mtrl-app/dist/mtrl/
 */

import { join, dirname } from 'path'
import { existsSync, rmSync, watch } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = join(__dirname, '..')
const MTRL_DIR = join(ROOT_DIR, '..', 'mtrl')
const OUTPUT_DIR = join(ROOT_DIR, 'dist', 'mtrl')

const isWatch = process.argv.includes('--watch')

console.log(`🔨 [BUILD-MTRL] Ultra-fast ${isWatch ? 'watch' : 'build'} mode...`)

// Check if mtrl directory exists
if (!existsSync(MTRL_DIR)) {
  console.error('❌ [BUILD-MTRL] mtrl directory not found:', MTRL_DIR)
  process.exit(1)
}

const buildMtrl = async () => {
  try {
    // Quick clean - only remove js files, keep directory structure
    if (existsSync(OUTPUT_DIR)) {
      const jsFile = join(OUTPUT_DIR, 'index.js')
      if (existsSync(jsFile)) rmSync(jsFile, { force: true })
    }

    const startTime = Date.now()
    
    // Ultra-fast bundle - optimized for development speed
    const result = await Bun.build({
      entrypoints: [join(MTRL_DIR, 'index.ts')],
      outdir: OUTPUT_DIR,
      target: 'browser',
      format: 'esm',
      minify: false,           // Skip minification for speed
      splitting: false,        // Skip code splitting for speed  
      sourcemap: 'inline',     // Inline sourcemaps are faster
      naming: 'index.js',
      external: [],            // Bundle everything for simplicity
      define: {
        'process.env.NODE_ENV': '"development"'
      }
    })

    if (!result.success) {
      console.error('❌ [BUILD-MTRL] Build failed:', result.logs)
      if (!isWatch) process.exit(1)
      return false
    }

    const buildTime = Date.now() - startTime
    const size = await Bun.file(join(OUTPUT_DIR, 'index.js')).size
    
    console.log(`✅ [BUILD-MTRL] Built in ${buildTime}ms (${(size / 1024).toFixed(1)}KB)`)
    return true

  } catch (error) {
    console.error('❌ [BUILD-MTRL] Build error:', error.message)
    if (!isWatch) process.exit(1)
    return false
  }
}

// Initial build
await buildMtrl()

// Watch mode
if (isWatch) {
  console.log('👀 [BUILD-MTRL] Watching for changes...')
  
  const watchPaths = [
    join(MTRL_DIR, 'src'),
    join(MTRL_DIR, 'index.ts')
  ]

  // Debounce mechanism to prevent duplicate builds
  let buildTimeout = null
  const debouncedBuild = (filename) => {
    if (buildTimeout) {
      clearTimeout(buildTimeout)
    }
    buildTimeout = setTimeout(async () => {
      console.log(`\n📁 [BUILD-MTRL] File changed: ${filename}`)
      await buildMtrl()
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
      console.warn(`⚠️ [BUILD-MTRL] Watch path does not exist: ${path}`)
    }
  })

  // Keep process alive
  process.on('SIGINT', () => {
    console.log('\n👋 [BUILD-MTRL] Stopping watch mode...')
    process.exit(0)
  })
} 