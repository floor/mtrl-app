import {
  createLayout,
  createElement,
  createButton
} from 'mtrl'

import { createContentSection } from '../../../layout/content'

export const createColorPalettes = (container) => {
  const body = createLayout(createContentSection({
    title: 'Theme Colors',
    description: 'Theme colors provide semantic meaning and are used consistently across components. Use these tokens to maintain visual consistency and accessibility.',
    class: 'color-palettes'
  }), container).get('body')

  // Create color swatches for primary and secondary palettes
  const palettes = [
    { name: 'primary', label: 'Primary', tones: [10, 30, 50, 70, 90] },
    { name: 'secondary', label: 'Secondary', tones: [10, 30, 50, 70, 90] },
    { name: 'tertiary', label: 'Tertiary', tones: [10, 30, 50, 70, 90] },
    { name: 'error', label: 'Error', tones: [10, 30, 50, 70, 90] }
  ]

  palettes.forEach(palette => {
    // Create a palette container
    const colorPalette = createElement({
      tag: 'div',
      class: 'color-palette'
    })

    // Add palette title
    const paletteTitle = createElement({
      tag: 'h3',
      class: 'color-palette__title',
      text: palette.label
    })
    colorPalette.appendChild(paletteTitle)

    // Create swatches for each tone
    palette.tones.forEach(tone => {
      // Determine color value based on tone
      let backgroundColor, variableName

      if (tone === 50) {
        backgroundColor = `var(--mtrl-sys-color-${palette.name})`
        variableName = `var(--mtrl-sys-color-${palette.name})`
      } else if (tone < 50) {
        // For lighter tones
        backgroundColor = `color-mix(in srgb, var(--mtrl-sys-color-${palette.name}) ${tone * 2}%, var(--mtrl-sys-color-surface))`
        variableName = `${palette.name}-${tone}`
      } else {
        // For darker tones
        backgroundColor = `color-mix(in srgb, var(--mtrl-sys-color-${palette.name}) ${100 - (tone - 50)}%, var(--mtrl-sys-color-on-surface))`
        variableName = `${palette.name}-${tone}`
      }

      const swatch = createElement({
        tag: 'div',
        class: 'color-swatch',
        style: `background-color: ${backgroundColor};`
      })

      // Add tone label with better contrast
      const toneName = createElement({
        tag: 'div',
        class: 'color-swatch__tone',
        text: `${palette.name}-${tone}`
      })

      // Determine text color based on tone for better contrast
      const textColor = tone < 50 ? 'var(--mtrl-sys-color-on-surface)' : 'var(--mtrl-sys-color-surface)'
      toneName.style.color = textColor

      // Add abbreviated color value for cleaner display
      const toneValue = createElement({
        tag: 'div',
        class: 'color-swatch__value',
        text: variableName
      })
      toneValue.style.color = textColor

      swatch.appendChild(toneName)
      swatch.appendChild(toneValue)
      colorPalette.appendChild(swatch)
    })

    body.appendChild(colorPalette)
  })
}
