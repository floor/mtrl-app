import { createComponentSection } from '../../../layout'

import {
  createLayout,
  createProgress,
  createChips,
  createSlider,
  createSwitch,
  createSnackbar,
  // In real word, you do not need this or maybe (will affect the bundle size, not that much)
  PROGRESS_VARIANTS,
  PROGRESS_SHAPES
} from 'mtrl'

/**
 * Initializes the interactive progress section
 * @param {HTMLElement} container - Container element
 */
export const createProgressComponent = (container) => {
  const title = 'Progress Component'
  const description = 'With shapes, thickness and indeterminate'
  const layout = createLayout(
    createComponentSection({
      title,
      description,
      class: 'layout--stack layout--stack-gap-16'
    }),
    container
  ).component

  let showLabel = false

  let value = 25
  const animate = true
  let size = 196

  let currentThickness = 'thick'
  const initialShape = 'wavy'
  const indeterminate = false
  const initialVariant = PROGRESS_VARIANTS.CIRCULAR

  const progress = createProgress({
    variant: initialVariant,
    value,
    showLabel,
    labelFormatter: (value, max) => `${Math.round(value)}%`,
    thickness: currentThickness,
    indeterminate,
    shape: initialShape,
    size: initialVariant === PROGRESS_VARIANTS.CIRCULAR ? size : undefined,
    parent: layout.showcase
  })

  // Progress simulation state
  let simulationInterval = null
  let currentSimulationValue = 0

  // info control
  const thicknesses = [
    {
      label: '2',
      value: 2
    },
    {
      label: 'THIN',
      value: 'thin'
    },
    {
      label: 'THICK',
      value: 'thick'
    },
    {
      label: '12',
      value: 12
    },
    {
      label: '16',
      value: 16
    }
  ]

  const variants = Object.entries(PROGRESS_VARIANTS).map(([label, value]) => ({
    label,
    value
  }))

  const shapes = Object.entries(PROGRESS_SHAPES).map(([label, value]) => ({
    label,
    value
  }))

  const info = createLayout(
    [{ layout: { type: 'grid', column: 1, gap: 4, dense: true, align: 'center' } },
      [createChips, 'variant', { scrollable: false, label: 'Variant' }],
      [createSlider, 'value', { label: 'Value', min: 0, max: 100, value, step: 1, size: 'M', variant: 'discrete' }],
      [createSlider, 'size', { label: 'Size', min: 20, max: 240, value: size, step: 10, size: 'XS', variant: 'discrete' }],
      [createChips, 'thickness', { scrollable: false, label: 'Thickness' }],
      [createChips, 'shape', { scrollable: false, label: 'Shape' }],
      [createSwitch, 'simulate', { label: 'Simulate Download', class: 'switch--dense' }],
      [createSwitch, 'indeterminate', { label: 'Indeterminate', class: 'switch--dense' }],
      [createSwitch, 'label', { label: 'Show Label', checked: showLabel, class: 'switch--dense' }],
      [createSwitch, 'visible', { label: 'Visible', checked: true, class: 'switch--dense' }]
    ], layout.info).component

  // Add variant chips
  variants.forEach(({ label, value }) => {
    info.variant.addChip({
      text: label.toLowerCase(),
      value,
      variant: 'filter',
      selectable: true,
      selected: value === initialVariant
    })
  })

  // Add thickness chips
  thicknesses.forEach(({ label, value }) => {
    info.thickness.addChip({
      text: label.toLowerCase(),
      value,
      variant: 'filter',
      selectable: true,
      selected: label.toLowerCase() === currentThickness
    })
  })

  // Add shape chips
  shapes.forEach(({ label, value }) => {
    info.shape.addChip({
      text: label.toLowerCase(),
      value,
      variant: 'filter',
      selectable: true,
      selected: value === initialShape
    })
  })

  layout.info.appendChild(info.element)

  // Events

  info.value.on('input', (event) => {
    // console.log('Value input:', {
    //   value: event.value,
    //   isSimulating: !!simulationInterval,
    //   isVisible: progress.isVisible?.(),
    //   progressState: progress.state
    // })

    if (value === event.value) return

    value = event.value

    // Don't update if simulation is running
    if (simulationInterval) {
      simulateProgress(false)
      info.simulate.uncheck()
      return
    }

    if (!progress.isVisible()) {
      // console.log('Component not visible, showing first')
      progress.show()
    }

    info.indeterminate.uncheck()
    info.indeterminate.enable()
    info.visible.check()

    // console.log('Setting value from input:', event.value)
    progress.setValue(event.value, animate)
  })

  info.size.on('input', (event) => {
    progress.setSize(event.value)
    size = event.value
  })

  info.variant.on('change', (variant) => {
    const newVariant = variant[0]
    const isCircular = newVariant === PROGRESS_VARIANTS.CIRCULAR

    // Get current values before destroying
    const isIndeterminate = info.indeterminate.isChecked()
    const currentShape = info.shape.getSelectedValues()?.[0] || initialShape

    // Remove old progress element
    progress.element.remove()

    console.log('display', info.size)

    if (isCircular) {
      info.size.element.style.display = 'inline-flex'
    } else {
      info.size.element.style.display = 'none'
    }

    const newProgress = createProgress({
      variant: newVariant,
      value,
      showLabel,
      labelFormatter: (value, max) => `${Math.round(value)}%`,
      thickness: currentThickness,
      indeterminate: isIndeterminate,
      size: isCircular ? size : undefined,
      shape: currentShape,
      parent: layout.showcase
    })

    // Replace the old progress reference
    Object.keys(progress).forEach((key) => {
      delete progress[key]
    })
    Object.keys(newProgress).forEach((key) => {
      progress[key] = newProgress[key]
    })

    // Add new element to showcase
    layout.showcase.appendChild(progress.element)

    // Reattach completion handler
    progress.on('complete', () => {
      console.log('complete')
      // progress.hide()
      info.value.enable()
      info.simulate.uncheck()
      const snackbar = createSnackbar({
        message: 'Progress Completed'
      })
      snackbar.show()
    })
  })

  info.thickness.on('change', (thickness) => {
    let value = thickness[0]
    if (thickness[0] !== 'thin' && thickness[0] !== 'thick') {
      value = parseInt(thickness[0], 10)
    }

    currentThickness = value
    console.log('thickness', thickness)
    progress.setThickness(value)
  })

  info.shape.on('change', (shape) => {
    progress.setShape(shape[0])
  })

  info.indeterminate.on('change', (e) => {
    // Don't update if simulation is running
    if (simulationInterval) return

    if (e.checked === true) {
      progress.setIndeterminate(true)
      // Disable variant chips by adding disabled class
      info.variant.element.classList.add('disabled')
      info.variant.element.querySelectorAll('.mtrl-chip').forEach((chip) => {
        chip.classList.add('disabled')
      })
    } else {
      progress.setIndeterminate(false)
    }
  })

  info.simulate.on('change', (e) => {
    if (e.checked === true) {
      // Stop indeterminate mode if active
      if (info.indeterminate.isChecked()) {
        progress.setIndeterminate(false)
      }
      info.visible.check()
      simulateProgress(true)
    } else {
      simulateProgress(false)
    }
  })

  info.label.on('change', (e) => {
    if (e.checked === true) {
      // Show first, then set value to ensure proper initialization
      showLabel = true
      progress.showLabel()
    } else {
      showLabel = false
      progress.hideLabel()
    }
  })

  info.visible.on('change', (e) => {
    if (simulationInterval) return

    if (e.checked === true) {
      // Show first, then set value to ensure proper initialization
      progress.show()
      // Only set value if not indeterminate
      if (!info.indeterminate.isChecked()) {
        const valueToSet = currentSimulationValue || value
        console.log('Setting value after show:', valueToSet)
        progress.setValue(valueToSet)
      }
    } else {
      progress.hide()
    }
  })

  // Handle completion
  progress.on('complete', () => {
    console.log('complete')
    // progress.hide()
    // info.visible.uncheck()
    info.value.enable()
    info.simulate.uncheck()
    const snackbar = createSnackbar({
      message: 'Progress Completed'
    })
    snackbar.show()
  })

  /**
   * Simulates a download progress with realistic increments
   * @param {boolean} start - Whether to start or stop the simulation
   */
  const simulateProgress = (start) => {
    console.log('simulateProgress --', start)
    if (start) {
      value = 0
      progress.setValue(0, false)

      // Reset progress to 0 and show progress bar
      currentSimulationValue = 0
      progress.setValue(currentSimulationValue)
      info.value.setValue(currentSimulationValue)
      progress.show()

      console.log('Set download-specific label formatter')

      // Set download-specific label formatter
      progress.setLabelFormatter((value, max) => {
        // Calculate simulated download speed (MB/s)
        const speed =
          value < 50
            ? (Math.random() * 3 + 2).toFixed(1)
            : (Math.random() * 1 + 0.5).toFixed(1)
        const downloaded = (value * 2.5).toFixed(0) // Simulate 250MB file
        return `${downloaded}MB / 250MB (${speed} MB/s)`
      })

      // Disable manual controls during simulation
      // info.value.disable()
      info.indeterminate.uncheck()
      // Disable variant chips by adding disabled class
      info.variant.element.classList.add('disabled')
      info.variant.element.querySelectorAll('.mtrl-chip').forEach((chip) => {
        chip.classList.add('disabled')
      })

      // Start simulation with realistic intervals
      simulationInterval = setInterval(() => {
        // Simulate variable download speed (slower at the end)
        let increment
        if (currentSimulationValue < 20) {
          increment = Math.random() * 8 + 3 // Fast start: 3-11
        } else if (currentSimulationValue < 40) {
          increment = Math.random() * 24 + 2 // Medium: 2-8
        } else if (currentSimulationValue < 60) {
          increment = Math.random() * 6 + 2 // Medium: 2-8
        } else if (currentSimulationValue < 80) {
          increment = Math.random() * 4 + 1 // Slower: 1-5
        } else {
          increment = Math.random() * 2 + 0.2 // Very slow near end: 0.5-2.5
        }

        currentSimulationValue = Math.min(
          100,
          currentSimulationValue + increment
        )

        // Update progress component
        progress.setValue(currentSimulationValue)
        info.value.setValue(currentSimulationValue, animate)

        // Complete simulation
        if (currentSimulationValue >= 100) {
          clearInterval(simulationInterval)
          simulationInterval = null

          // Restore default formatter after a short delay
          setTimeout(() => {
            progress.setLabelFormatter((value, max) => `${Math.round(value)}%`)
          }, 2000)
        }
      }, 200)
    } else {
      // Stop simulation
      if (simulationInterval) {
        clearInterval(simulationInterval)
        simulationInterval = null
      }

      // Restore default label formatter
      // progress.setLabelFormatter((value, max) => `${Math.round(value)}%`)

      // Show progress bar and re-enable controls
      progress.show()
      info.value.enable()
      info.indeterminate.enable()
      // Re-enable variant chips by removing disabled class
      info.variant.element.classList.remove('disabled')
      info.variant.element.querySelectorAll('.mtrl-chip').forEach((chip) => {
        chip.classList.remove('disabled')
      })
    }
  }
}
