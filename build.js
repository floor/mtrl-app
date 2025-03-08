// build.js
import { mkdir } from 'fs/promises'
import { existsSync, watch } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import * as sass from 'sass'

const __dirname = dirname(fileURLToPath(import.meta.url))
const isWatch = process.argv.includes('--watch')

// Define consistent output paths
const DIST_DIR = join(__dirname, 'dist')
const STYLES_DIR = join(DIST_DIR, 'styles')
const JS_OUTPUT = join(DIST_DIR, 'app.js')
const CSS_OUTPUT = join(STYLES_DIR, 'main.css')

const compileSass = async () => {
  try {
    const inputFile = join(__dirname, 'src/client/styles/main.scss')
    const outputFile = CSS_OUTPUT

    console.log('Compiling SASS:', {
      input: inputFile,
      output: outputFile
    })

    const result = await sass.compileAsync(inputFile, {
      loadPaths: [
        join(__dirname, 'node_modules'),
        join(__dirname, 'src/client/styles'),
        join(__dirname) // Add root directory to help resolve paths
      ],
      style: 'expanded',
      sourceMap: true,
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
    await Bun.write(outputFile, result.css)

    if (result.sourceMap) {
      await Bun.write(`${outputFile}.map`, JSON.stringify(result.sourceMap))
    }

    console.log('SASS compilation successful:', outputFile)
  } catch (error) {
    console.error('SASS compilation failed:', error)
    if (error.span) {
      console.error(`Error in ${error.span.url}:${error.span.start.line}:${error.span.start.column}`)
    }
  }
}

const buildApp = async () => {
  try {
    const jsResult = await Bun.build({
      entrypoints: [join(__dirname, 'src/client/app.js')],
      outdir: DIST_DIR,
      minify: true, // During development, set to true for production
      sourcemap: 'external',
      format: 'esm',
      target: 'browser',
      naming: {
        entry: 'app.js'
      },
      loader: {
        '.svg': 'text'
      }
    })

    if (!jsResult.success) {
      console.error('App build failed:', jsResult.logs)
      return false
    }

    console.log('App built successfully:', JS_OUTPUT)
    return true
  } catch (error) {
    console.error('Error building app:', error)
    return false
  }
}

const setupWatchers = () => {
  const jsWatchPaths = [
    join(__dirname, 'node_modules/mtrl/src'),
    join(__dirname, 'src/client'),
    join(__dirname, 'src/server')
  ]

  const scssWatchPaths = [
    join(__dirname, 'src/client/styles'),
    join(__dirname, 'node_modules/mtrl/src/styles'),
    join(__dirname, 'node_modules/mtrl/src/components')
  ]

  const watchJsFiles = () => {
    jsWatchPaths.forEach(path => {
      if (existsSync(path)) {
        watch(path, { recursive: true }, async (_, filename) => {
          if (filename?.endsWith('.js') || filename?.endsWith('.ts')) {
            console.log(`\nSource change detected: ${filename}`)
            await buildApp()
          }
        })
      } else {
        console.warn(`Watch path does not exist: ${path}`)
      }
    })
  }

  const watchScssFiles = () => {
    scssWatchPaths.forEach(path => {
      if (existsSync(path)) {
        watch(path, { recursive: true }, async (_, filename) => {
          if (filename?.endsWith('.scss')) {
            console.log(`\nStyle change detected: ${filename}`)
            await compileSass()
          }
        })
      } else {
        console.warn(`Watch path does not exist: ${path}`)
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

  console.log('Output verification:')
  console.log(`- JS file (${JS_OUTPUT}): ${jsExists ? 'Exists' : 'Missing'}`)
  console.log(`- CSS file (${CSS_OUTPUT}): ${cssExists ? 'Exists' : 'Missing'}`)

  return jsExists && cssExists
}

const build = async () => {
  try {
    console.log('Building application...')
    console.log(`- Output directory: ${DIST_DIR}`)
    console.log(`- JS output: ${JS_OUTPUT}`)
    console.log(`- CSS output: ${CSS_OUTPUT}`)

    // Create output directories
    await mkdir(DIST_DIR, { recursive: true })
    await mkdir(STYLES_DIR, { recursive: true })

    // Build JavaScript
    console.log('\nBuilding JavaScript...')
    const jsSuccess = await buildApp()

    // Compile SASS to CSS
    console.log('\nCompiling SASS...')
    await compileSass()

    // Verify output
    await verifyOutput()

    if (isWatch) {
      console.log('\nWatching for changes...')
      const { watchJsFiles, watchScssFiles } = setupWatchers()
      watchJsFiles()
      watchScssFiles()
    }

    console.log('\nBuild complete!')
  } catch (error) {
    console.error('Build error:', error)
    process.exit(1)
  }
}

build()
