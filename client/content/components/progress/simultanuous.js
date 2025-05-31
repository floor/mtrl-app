// src/components/progress/showcase/progress.js
import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createProgress,
  createChips,
  createSlider,
  createSwitch,
  PROGRESS_VARIANTS,
  PROGRESS_SHAPES
} from 'mtrl'

/**
 * Initializes the interactive progress section
 * @param {HTMLElement} container - Container element
 */
export const createProgressBothComponent = (container) => {
  const title = 'Progress Simutunous Component'
  const description = 'With shapes, thickness and indeterminate'
  const layout = createLayout(createComponentSection({
    title,
    description,
    class: 'layout--stack layout--stack-gap-16'
  }), container).component

  const initialValue = 25
  const indeterminate = false

  // Create linear and circular progress indicators for interaction
  const linearProgress = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: initialValue,
    showLabel: true,
    indeterminate
  })

  const circularProgress = createProgress({
    variant: PROGRESS_VARIANTS.CIRCULAR,
    value: initialValue,
    size: 192,
    indeterminate
  })

  layout.showcase.appendChild(circularProgress.element)
  layout.showcase.appendChild(linearProgress.element)

  // Progress simulation state
  let simulationInterval = null
  let currentSimulationValue = 0

  /**
   * Simulates a download progress with realistic increments
   * @param {boolean} start - Whether to start or stop the simulation
   */
  const simulateProgress = (start) => {
    if (start) {
      // Reset progress to 0 and show progress bars
      currentSimulationValue = 0
      linearProgress.setValue(currentSimulationValue)
      circularProgress.setValue(currentSimulationValue)
      info.value.setValue(currentSimulationValue)
      linearProgress.show()
      circularProgress.show()

      // Disable manual controls during simulation
      info.value.disable()
      info.indeterminate.disable()

      // Start simulation with realistic intervals (let CSS handle smooth transitions)
      simulationInterval = setInterval(() => {
        // Simulate variable download speed (slower at the end)
        let increment
        if (currentSimulationValue < 20) {
          increment = Math.random() * 8 + 3 // Fast start: 3-11
        } else if (currentSimulationValue < 60) {
          increment = Math.random() * 6 + 2 // Medium: 2-8
        } else if (currentSimulationValue < 90) {
          increment = Math.random() * 4 + 1 // Slower: 1-5
        } else {
          increment = Math.random() * 2 + 0.5 // Very slow near end: 0.5-2.5
        }

        currentSimulationValue = Math.min(100, currentSimulationValue + increment)

        // Update progress components (they handle smooth transitions)
        // linearProgress.setValue(currentSimulationValue)
        circularProgress.setValue(currentSimulationValue)
        info.value.setValue(currentSimulationValue)

        // Complete simulation
        if (currentSimulationValue >= 100) {
          clearInterval(simulationInterval)
          simulationInterval = null
        }
      }, 100) // Update every 300ms, let CSS transitions handle smoothness

    } else {
      console.log('---')
      // Stop simulation
      if (simulationInterval) {
        clearInterval(simulationInterval)
        simulationInterval = null
      }

      // Show progress bars and re-enable controls
      linearProgress.show()
      circularProgress.show()
      info.value.enable()
      info.indeterminate.enable()
    }
  }

  // info control
  const thicknesses = [{
    label: 'THIN',
    value: 'thin'
  },
  {
    label: 'THICK',
    value: 'thick'
  }, {
    label: 'CUSTOM',
    value: 12
  }]

  // console.log('thicknesses', thicknesses)

  const shapes = []
  Object.entries(PROGRESS_SHAPES).forEach(([label, value]) => {
    shapes.push({ value, label })
  })

  const info = createLayout(
    [{ layout: { type: 'grid', column: 1, gap: 4, dense: true, align: 'center' } /* style: { transform: 'scale(.9)' } */ },
      // [createElement, 'description', { tag: 'p', text: 'Modify the badge properties using the controls below.' }],
      [createSlider, 'value', { label: 'Value', min: 0, max: 100, value: initialValue, step: 1, variant: 'discrete' }],
      [createChips, 'thickness', { scrollable: false, label: 'Thickness' }],
      [createChips, 'shape', { scrollable: false, label: 'Shape (experimental)' }],
      [createSwitch, 'indeterminate', { label: 'Indeterminate', class: 'switch--dense' }],
      [createSwitch, 'simulate', { label: 'Simulate Download', class: 'switch--dense' }],
      [createSwitch, 'hide', { label: 'Hide', checked: true, class: 'switch--dense' }]
    ], layout.info).component

  for (let i = 0; i < thicknesses.length; i++) {
    info.thickness.addChip({
      text: thicknesses[i].label.toLowerCase(),
      value: thicknesses[i].value,
      variant: 'filter',
      selectable: true,
      selected: thicknesses[i].label === 'THIN'
    })
  }

  for (let i = 0; i < shapes.length; i++) {
    info.shape.addChip({
      text: shapes[i].label.toLowerCase(),
      value: shapes[i].value,
      variant: 'filter',
      selectable: true,
      selected: shapes[i].value === 'line'
    })
  }

  layout.info.appendChild(info.element)

  // Events

  info.value.on('input', (event) => {
    // Don't update if simulation is running
    if (simulationInterval) return

    if (!linearProgress.isVisible()) linearProgress.show()
    if (!circularProgress.isVisible()) linearProgress.show()

    info.indeterminate.uncheck()

    linearProgress.setValue(event.value)
    circularProgress.setValue(event.value)
  })

  info.thickness.on('change', (thickness) => {
    // console.log('thickness', thickness[0])
    let value = thickness[0]
    if (thickness[0] !== 'thin' && thickness[0] !== 'thick') {
      value = parseInt(thickness[0], 10)
    }

    linearProgress.setThickness(value)
    circularProgress.setThickness(value)
    info.thickness = `Thickness (${thickness[0]})`
  })

  info.shape.on('change', (shape) => {
    // console.log('shape', shape)
    linearProgress.setShape(shape[0])
    circularProgress.setShape(shape[0])
  })

  info.indeterminate.on('change', (e) => {
    // Don't update if simulation is running
    if (simulationInterval) return

    // console.log('indeterminate', e.checked)
    if (e.checked === true) {
      linearProgress.setIndeterminate(true)
      circularProgress.setIndeterminate(true)
      info.value.disable()
      info.simulate.disable()
    } else {
      linearProgress.setIndeterminate(false)
      circularProgress.setIndeterminate(false)
      info.value.enable()
      info.simulate.enable()
    }
  })

  info.hide.on('change', (e) => {
    // Don't update if simulation is running
    if (simulationInterval) return

    // console.log('indeterminate', e.checked)
    if (e.checked === true) {
      linearProgress.hide()
      circularProgress.hide()
    } else {
      linearProgress.show()
      circularProgress.show()
    }
  })

  // New simulation switch event
  info.simulate.on('change', (e) => {
    // console.log('simulate download', e.checked)
    if (e.checked === true) {
      // Stop indeterminate mode if active
      if (info.indeterminate.isChecked()) {
        info.indeterminate.uncheck()
        linearProgress.setIndeterminate(false)
        circularProgress.setIndeterminate(false)
      }

      simulateProgress(true)
    } else {
      simulateProgress(false)
    }
  })

  const hideOnComplete = (progress) => {
    return new Promise((resolve) => {
      progress.on('complete', () => {
        progress.hide();
        resolve();
      });
    });
  };

  // Wait for both to complete
  Promise.all([
    hideOnComplete(linearProgress),
    hideOnComplete(circularProgress)
  ]).then(() => {
    console.log('Both progress bars completed and hidden');
  });
}
