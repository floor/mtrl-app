// build.js
import { mkdir } from 'fs/promises'
import { watch } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import * as sass from 'sass'

const __dirname = dirname(fileURLToPath(import.meta.url))
const isWatch = process.argv.includes('--watch')

const compileSass = async () => {
  try {
    const inputFile = join(__dirname, 'src/client/styles/main.scss')
    const outputFile = join(__dirname, 'dist/styles/main.css')

    // console.log('Compiling SASS:', {
    //   input: inputFile,
    //   output: outputFile
    // })

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

    console.log('SASS compilation successful')
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
      outdir: join(__dirname, 'dist'),
      minify: true,
      minifyWhitespace: true,
      minifyIdentifiers: true,
      minifySyntax: true,
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

    console.log('App built successfully')
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
      watch(path, { recursive: true }, async (_, filename) => {
        if (filename?.endsWith('.ts')) {
          console.log(`\nSource change detected: ${filename}`)
          await buildApp()
        }
      })
    })
  }

  const watchScssFiles = () => {
    scssWatchPaths.forEach(path => {
      watch(path, { recursive: true }, async (_, filename) => {
        if (filename?.endsWith('.scss')) {
          console.log(`\nStyle change detected: ${filename}`)
          await compileSass()
        }
      })
    })
  }

  return {
    watchJsFiles,
    watchScssFiles
  }
}

const build = async () => {
  try {
    await mkdir(join(__dirname, 'dist'), { recursive: true })
    await mkdir(join(__dirname, 'dist/styles'), { recursive: true })

    await buildApp()
    await compileSass()

    if (isWatch) {
      console.log('\nWatching for changes...')
      const { watchJsFiles, watchScssFiles } = setupWatchers()
      watchJsFiles()
      watchScssFiles()
    }
  } catch (error) {
    console.error('Build error:', error)
    process.exit(1)
  }
}

build()
