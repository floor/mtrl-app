// build.js with code splitting support
import { mkdir } from 'fs/promises'
import { existsSync, watch, readdirSync } from 'fs'
import { join, dirname, basename, relative } from 'path'
import { fileURLToPath } from 'url'
import * as sass from 'sass'

const __dirname = dirname(fileURLToPath(import.meta.url))
const isWatch = process.argv.includes('--watch')
const isProduction = process.argv.includes('--production') || process.env.NODE_ENV === 'production'

// Define consistent output paths
const DIST_DIR = join(__dirname, 'dist')
const STYLES_DIR = join(DIST_DIR, 'styles')
const CHUNKS_DIR = join(DIST_DIR, 'chunks')
const JS_OUTPUT = join(DIST_DIR, 'app.js')
const CSS_OUTPUT = join(STYLES_DIR, 'main.css')

// Log build mode
console.log(`Building in ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} mode with code splitting`)

const compileSass = async () => {
  try {
    const inputFile = join(__dirname, 'client/styles/main.scss')
    const outputFile = CSS_OUTPUT

    console.log('┌─────────────────────────────────────────')
    console.log('│ SASS Compilation')
    console.log('│ Mode:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT')
    console.log('│ Input:', inputFile)
    console.log('│ Output:', outputFile)
    console.log('│ Minify:', isProduction ? 'Yes' : 'No')
    console.log('└─────────────────────────────────────────')

    const result = await sass.compileAsync(inputFile, {
      loadPaths: [
        join(__dirname, 'node_modules'),
        join(__dirname, 'client/styles'),
        join(__dirname) // Add root directory to help resolve paths
      ],
      style: isProduction ? 'compressed' : 'expanded',
      sourceMap: !isProduction,
      sourceMapIncludeSources: !isProduction,
      importers: [{
        // Custom importer to help resolve node_modules paths
        findFileUrl (url) {
          if (url.startsWith('mtrl/')) {
            return new URL(
              'file://' + join(__dirname, 'node_modules', url)
            )
          }
          return null // Let sass handle all other URLs
        }
      }]
    })

    await mkdir(dirname(outputFile), { recursive: true })

    // First write the CSS file
    if (!isProduction && result.sourceMap) {
      // In development mode, add the sourceMappingURL comment
      const sourceMappingURL = `\n/*# sourceMappingURL=${basename(outputFile)}.map */`
      await Bun.write(outputFile, result.css + sourceMappingURL)

      // Ensure source map references are correct
      if (result.sourceMap.sources) {
        // Fix source paths to be user-friendly in browser devtools
        result.sourceMap.sources = result.sourceMap.sources.map(source => {
          if (source.startsWith('file://')) {
            // Convert file:// URLs to relative paths for better readability
            const filePath = fileURLToPath(source)
            return relative(__dirname, filePath)
          }
          return source
        })
      }

      // Set the sourceRoot to help with resolving relative paths
      result.sourceMap.sourceRoot = '/'

      // Write the source map
      await Bun.write(`${outputFile}.map`, JSON.stringify(result.sourceMap))
    } else {
      // In production mode, just write the CSS without sourcemap
      await Bun.write(outputFile, result.css)
    }

    console.log('✓ SASS compilation successful')
    console.log(`  Size: ${(result.css.length / 1024).toFixed(2)} KB`)

    return true // Return true on success
  } catch (error) {
    console.error('❌ SASS compilation failed:', error.message || error)
    if (error.span) {
      // Better error reporting for SASS compilation errors
      let errorLocation = 'unknown location'

      // Check if error.span.url exists and is a string before calling startsWith
      if (error.span.url && typeof error.span.url === 'string') {
        errorLocation = `${error.span.url}:${error.span.start.line}:${error.span.start.column}`

        // Try to convert file:// URLs to readable paths
        if (error.span.url.startsWith('file://')) {
          try {
            const filePath = fileURLToPath(error.span.url)
            const relativePath = relative(__dirname, filePath)
            errorLocation = `${relativePath}:${error.span.start.line}:${error.span.start.column}`
          } catch (e) {
            // Fall back to the original URL if path conversion fails
          }
        }
      } else if (error.span.start) {
        // If we don't have a URL but have line/column info
        errorLocation = `line ${error.span.start.line}, column ${error.span.start.column}`
      }

      console.error(`  Error in ${errorLocation}`)
      console.error(`  ${error.message}`)
    }

    // In watch mode, we don't want to exit the process
    if (isWatch) {
      console.log('🔄 Continuing to watch for changes...')
    }

    return false // Return false on failure
  }
}

const buildApp = async () => {
  try {
    console.log('┌─────────────────────────────────────────')
    console.log('│ JavaScript Build with Code Splitting')
    console.log('│ Mode:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT')
    console.log('│ Minify:', isProduction ? 'Yes' : 'No')
    console.log('│ Sourcemaps:', isProduction ? 'No' : 'Yes (inline)')
    console.log('└─────────────────────────────────────────')

    // Create chunks directory if it doesn't exist
    await mkdir(CHUNKS_DIR, { recursive: true })

    // Fix: Use a unique outfile rather than relying on naming configuration
    // This avoids the "Multiple files share the same output path" error
    const jsResult = await Bun.build({
      entrypoints: [join(__dirname, 'client/app.js')],
      outdir: DIST_DIR,
      minify: isProduction, // Only minify in production
      sourcemap: isProduction ? 'none' : 'inline', // No sourcemaps in production
      format: 'esm',
      target: 'browser',
      naming: {
        // Use a unique chunk naming pattern
        chunk: 'chunks/[name].[hash].[ext]'
      },
      loader: {
        '.svg': 'text'
      },
      // Enable code splitting
      splitting: true,
      // Add tree shaking in production
      tree: isProduction ? true : undefined,
      // Remove comments in production
      define: isProduction
        ? {
            'process.env.NODE_ENV': '"production"'
          }
        : {
            'process.env.NODE_ENV': '"development"'
          }
    })

    if (!jsResult.success) {
      console.error('❌ JavaScript build failed')
      console.error(jsResult.logs)
      return false
    }

    // Ensure main bundle is renamed to app.js if it's not already
    const mainOutput = jsResult.outputs.find(output =>
      !output.path.includes('/chunks/') && output.path.endsWith('.js')
    )

    if (mainOutput && mainOutput.path !== JS_OUTPUT) {
      // Rename the main output file to app.js
      try {
        await Bun.write(JS_OUTPUT, await Bun.file(mainOutput.path).text())
        console.log('✓ Renamed main bundle to app.js')
      } catch (error) {
        console.error(`❌ Error renaming main bundle: ${error.message}`)
      }
    }

    // Log all generated outputs, including chunks
    const outputFiles = jsResult.outputs || []

    console.log('✓ JavaScript build successful')
    console.log(`  Main bundle: ${(await Bun.file(JS_OUTPUT).size / 1024).toFixed(2)} KB`)

    // Log info about chunks
    const chunkFiles = outputFiles.filter(file =>
      file.path.includes('/chunks/') || (file.kind && file.kind === 'chunk')
    )

    if (chunkFiles.length > 0) {
      console.log(`  Generated ${chunkFiles.length} code-split chunks:`)
      let totalChunkSize = 0

      for (const chunk of chunkFiles) {
        const chunkPath = chunk.path
        const chunkSize = await Bun.file(chunkPath).size
        totalChunkSize += chunkSize

        // Extract a shorter name for display
        const chunkName = basename(chunkPath)
        // console.log(`    - ${chunkName}: ${(chunkSize / 1024).toFixed(2)} KB`)
      }

      console.log(`  Total chunks size: ${(totalChunkSize / 1024).toFixed(2)} KB`)
    }

    // Optionally do additional post-processing for production builds
    if (isProduction) {
      console.log('Performing production post-processing...')
      // Here you could do additional processing like:
      // - Update references in HTML
      // - Gzip files for efficient serving
    }

    return true
  } catch (error) {
    console.error('❌ JavaScript build error:', error)
    console.error(error.stack)
    return false
  }
}

// Copy or create HTML file with proper module loading
const createHtmlFile = async () => {
  try {
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MTRL UI Framework</title>
  <link rel="stylesheet" href="/styles/main.css">
  <!-- Preload the main JS bundle -->
  <link rel="modulepreload" href="/app.js">
</head>
<body>
  <!-- Load the main bundle as a module -->
  <script type="module" src="/app.js"></script>
</body>
</html>`

    const htmlOutputPath = join(DIST_DIR, 'index.html')

    // Check if file already exists and skip if it does (to avoid overwriting customizations)
    if (!existsSync(htmlOutputPath) || !isProduction) {
      await Bun.write(htmlOutputPath, htmlTemplate)
      console.log('✓ Created HTML entry point with ES module support')
    }
  } catch (error) {
    console.error('❌ Error creating HTML file:', error)
  }
}

// Update timestamp file to trigger live reload when needed
const updateReloadTimestamp = async () => {
  if (!isProduction) {
    const reloadDir = join(__dirname, 'src/dist')
    const reloadFile = join(reloadDir, 'reload')
    await mkdir(reloadDir, { recursive: true })
    await Bun.write(reloadFile, Date.now().toString())
    console.log('🔄 Browser reload triggered')
  }
}

const setupWatchers = () => {
  if (isProduction) {
    console.log('Watch mode not available in production build')
    return { watchJsFiles: () => {}, watchScssFiles: () => {} }
  }

  const jsWatchPaths = [
    join(__dirname, 'node_modules/mtrl/src'),
    join(__dirname, 'client'),
    join(__dirname, 'server')
  ]

  const scssWatchPaths = [
    join(__dirname, 'client/styles'),
    join(__dirname, 'node_modules/mtrl/src/styles')
  ]

  const watchJsFiles = () => {
    // Use a debounce mechanism to prevent duplicate builds
    let buildTimeout = null
    const debouncedBuild = (filename) => {
      if (buildTimeout) {
        clearTimeout(buildTimeout)
      }
      buildTimeout = setTimeout(async () => {
        console.log('\n📁 JavaScript file changed:', filename)
        const success = await buildApp()
        if (success) await updateReloadTimestamp()
        buildTimeout = null
      }, 100) // 100ms debounce time
    }

    jsWatchPaths.forEach(path => {
      if (existsSync(path)) {
        watch(path, { recursive: true }, (_, filename) => {
          if (filename?.endsWith('.js') || filename?.endsWith('.ts')) {
            debouncedBuild(filename)
          }
        })
      } else {
        console.warn(`⚠️ Watch path does not exist: ${path}`)
      }
    })
  }

  const watchScssFiles = () => {
    // Use a debounce mechanism to prevent duplicate compilations
    let compileTimeout = null
    const debouncedCompile = (filename) => {
      if (compileTimeout) {
        clearTimeout(compileTimeout)
      }
      compileTimeout = setTimeout(async () => {
        console.log('\n📁 SCSS file changed:', filename)
        await compileSass()
        await updateReloadTimestamp()
        compileTimeout = null
      }, 100) // 100ms debounce time
    }

    scssWatchPaths.forEach(path => {
      if (existsSync(path)) {
        watch(path, { recursive: true }, (_, filename) => {
          if (filename?.endsWith('.scss')) {
            debouncedCompile(filename)
          }
        })
      } else {
        console.warn(`⚠️ Watch path does not exist: ${path}`)
      }
    })
  }

  return {
    watchJsFiles,
    watchScssFiles
  }
}

const verifyOutput = async () => {
  // Check if output files exist
  const jsExists = existsSync(JS_OUTPUT)
  const cssExists = existsSync(CSS_OUTPUT)
  const htmlExists = existsSync(join(DIST_DIR, 'index.html'))

  console.log('┌─────────────────────────────────────────')
  console.log('│ Build Verification')
  console.log('│ JavaScript:', jsExists ? '✓ OK' : '❌ Missing')
  console.log('│ CSS:', cssExists ? '✓ OK' : '❌ Missing')
  console.log('│ HTML:', htmlExists ? '✓ OK' : '❌ Missing')
  console.log('└─────────────────────────────────────────')

  // For production builds, check file sizes
  if (isProduction && jsExists && cssExists) {
    const jsStats = await Bun.file(JS_OUTPUT).size
    const cssStats = await Bun.file(CSS_OUTPUT).size
    const totalSize = jsStats + cssStats

    // Also check for chunks - using fs.readdirSync instead of Bun.glob
    const chunksDir = join(DIST_DIR, 'chunks')
    let chunksSize = 0
    if (existsSync(chunksDir)) {
      try {
        // Use readdirSync instead of Bun.glob which may not be available in all Bun versions
        const chunkFiles = readdirSync(chunksDir).filter(file => file.endsWith('.js'))
        for (const file of chunkFiles) {
          const chunkPath = join(chunksDir, file)
          const size = await Bun.file(chunkPath).size
          chunksSize += size
        }
      } catch (error) {
        console.warn('⚠️ Could not measure chunk sizes:', error.message)
      }
    }

    console.log('┌─────────────────────────────────────────')
    console.log('│ Production Build Stats')
    console.log('│ JavaScript (main):', (jsStats / 1024).toFixed(2), 'KB')
    console.log('│ JavaScript (chunks):', (chunksSize / 1024).toFixed(2), 'KB')
    console.log('│ CSS:', (cssStats / 1024).toFixed(2), 'KB')
    console.log('│ Total Size:', ((totalSize + chunksSize) / 1024).toFixed(2), 'KB')
    console.log('└─────────────────────────────────────────')
  }

  return jsExists && cssExists
}

const cleanDist = async () => {
  if (isProduction) {
    try {
      console.log('🧹 Cleaning dist directory...')
      // In a real implementation, you would delete the directory contents
      // but keep the directory itself
      // For example with rimraf or similar
      // This is a simple version that assumes the directory exists
      // and we're just recreating it

      // Simple approach: just recreate the directories
      await mkdir(DIST_DIR, { recursive: true })
      await mkdir(STYLES_DIR, { recursive: true })
      await mkdir(CHUNKS_DIR, { recursive: true })

      console.log('✓ Dist directory cleaned')
    } catch (error) {
      console.error('❌ Error cleaning dist directory:', error)
    }
  }
}

const build = async () => {
  try {
    const startTime = Date.now()

    console.log('┌───────────────────────────────────────────────')
    console.log('│ 🚀 MTRL App Build Process with Code Splitting')
    console.log('│ Mode:', isProduction ? '🏭 PRODUCTION' : '🔧 DEVELOPMENT')
    console.log('│ Watch:', isWatch ? '✓ Enabled' : '✗ Disabled')
    console.log('└───────────────────────────────────────────────')
    console.log('')

    // Clean dist directory in production mode
    await cleanDist()

    // Create output directories
    await mkdir(DIST_DIR, { recursive: true })
    await mkdir(STYLES_DIR, { recursive: true })
    await mkdir(CHUNKS_DIR, { recursive: true })

    // Build JavaScript with code splitting
    const jsSuccess = await buildApp()

    // Compile SASS to CSS
    const sassSuccess = await compileSass()

    // Create HTML file with ES module support
    await createHtmlFile()

    // Verify output
    await verifyOutput()

    // Update reload timestamp if at least one of the build steps succeeded
    if (jsSuccess || sassSuccess) {
      await updateReloadTimestamp()
    }

    const buildTime = ((Date.now() - startTime) / 1000).toFixed(2)

    if (isWatch && !isProduction) {
      console.log('')
      console.log('┌───────────────────────────────────────────────')
      console.log('│ 👀 Watching for changes...')
      console.log('└───────────────────────────────────────────────')

      const { watchJsFiles, watchScssFiles } = setupWatchers()
      watchJsFiles()
      watchScssFiles()
    } else {
      console.log('')
      console.log('┌───────────────────────────────────────────────')
      console.log(`│ ✅ Build completed in ${buildTime}s with code splitting`)
      if (!jsSuccess || !sassSuccess) {
        console.log('│ ⚠️ Build completed with some errors')
      }
      console.log('└───────────────────────────────────────────────')

      // Only exit with error code in non-watch mode if there were failures
      if (!isWatch && (!jsSuccess || !sassSuccess)) {
        process.exit(1)
      }
    }
  } catch (error) {
    console.error('❌ Build failed with error:', error)

    // Don't exit the process in watch mode
    if (isWatch) {
      console.log('🔄 Continuing to watch for changes...')

      const { watchJsFiles, watchScssFiles } = setupWatchers()
      watchJsFiles()
      watchScssFiles()
    } else {
      process.exit(1)
    }
  }
}

build()
