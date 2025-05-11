#!/usr/bin/env bun
// scripts/generate-og-images.js
//
// This script generates OpenGraph images for the different sections of the mtrl website
// It requires the 'sharp' package to be installed:
// bun add sharp
//
// Usage: bun run scripts/generate-og-images.js

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Path to public directory where we'll save the images
const PUBLIC_DIR = path.join(__dirname, '..', 'public')

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })
}

// OG image dimensions - Facebook recommends 1200x630 pixels
const OG_WIDTH = 1200
const OG_HEIGHT = 630

// Define the main sections for which we'll generate images
const sections = [
  { name: 'default', title: 'mtrl UI Framework', accent: '#0073b1' }, // Primary blue
  { name: 'components', title: 'Components', accent: '#43a047' }, // Green
  { name: 'core', title: 'Core Concepts', accent: '#ff9800' }, // Orange
  { name: 'styles', title: 'Styles & Theming', accent: '#9c27b0' }, // Purple
  { name: 'getstarted', title: 'Get Started', accent: '#2196f3' } // Blue
]

/**
 * Generate an OpenGraph image for a section
 * @param {Object} section The section definition
 */
async function generateOgImage (section) {
  const { name, title, accent } = section

  // Create a simple SVG template for the OG image
  const svg = `
    <svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="100%" height="100%" fill="#ffffff" />
      
      <!-- Accent color bar at top -->
      <rect width="100%" height="16" fill="${accent}" />
      
      <!-- Logo placeholder - using mtrl text as a stand-in -->
      <text x="80" y="180" font-family="Arial, sans-serif" font-size="140" font-weight="bold" fill="#2c2c2c">mtrl</text>
      
      <!-- Section title -->
      <text x="80" y="320" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="${accent}">${title}</text>
      
      <!-- Description text -->
      <text x="80" y="400" font-family="Arial, sans-serif" font-size="36" fill="#555555">Lightweight TypeScript/JavaScript component library</text>
      <text x="80" y="450" font-family="Arial, sans-serif" font-size="36" fill="#555555">inspired by Material Design principles</text>
      
      <!-- Bottom accent bar -->
      <rect y="${OG_HEIGHT - 16}" width="100%" height="16" fill="${accent}" />
    </svg>
  `

  // Output path for the OG image
  const outputFilename = name === 'default' ? 'og-image.png' : `og-image-${name}.png`
  const outputPath = path.join(PUBLIC_DIR, outputFilename)

  try {
    // Convert SVG to PNG
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath)

    console.log(`✅ Generated ${outputFilename}`)
  } catch (error) {
    console.error(`❌ Error generating ${outputFilename}:`, error)
  }
}

/**
 * Main function to generate all OG images
 */
async function generateAllOgImages () {
  console.log('Generating OpenGraph images...')

  // Generate images for all sections
  for (const section of sections) {
    await generateOgImage(section)
  }

  console.log('✨ OpenGraph image generation complete!')
}

// Run the script
generateAllOgImages()
