// src/client/content/components/loading-indicator/index.js

import { createLayout } from 'mtrl-addons'
import {
  createComponentsLayout,
  createComponentSection,
  createDocs
} from '../../../layout'

import {
  createLoadingIndicator,
  createButton,
  createChips,
  createSlider,
  createSwitch
} from 'mtrl'

export const createLoadingIndicatorContent = (container) => {
  const info = {
    title: 'Loading indicator',
    description: 'Loading indicators show that content is on its way, for waits between 200 milliseconds and 5 seconds. The active indicator loops through seven Material shapes; beyond 5 seconds use a progress indicator.'
  }
  const layout = createLayout(createComponentsLayout(info), container).component

  createPlayground(layout.body)
  createSizes(layout.body)
  createInButton(layout.body)
  createDocs(layout.body, 'components/loading-indicator.md')
}

// A section whose body is a row of indicators
const section = (container, title, description) => {
  const layout = createLayout(createComponentSection({ title, description }), container).component
  layout.body.classList.add('mtrl-content__grid')
  return layout.body
}

/**
 * The first section: one indicator and the controls that drive it
 * @param {HTMLElement} container - Container element
 */
function createPlayground (container) {
  const layout = createLayout(
    createComponentSection({
      title: 'Loading indicator',
      description: 'Default on a surface, or contained over other content; 24 to 240dp; indeterminate or driven by a value.',
      class: 'layout--stack layout--stack-gap-16'
    }),
    container
  ).component

  let contained = false
  let size = 96
  let value = null
  let running = true

  const indicator = { current: null }

  const mount = () => {
    indicator.current?.destroy()
    indicator.current = createLoadingIndicator({ contained, size, value, ariaLabel: 'Loading the preview' })
    if (!running) indicator.current.stop()
    layout.showcase.appendChild(indicator.current.element)
  }

  const info = createLayout(
    [{ layout: { type: 'grid', column: 1, gap: 4, dense: true, align: 'center' } },
      [createChips, 'variant', { scrollable: false, label: 'Container' }],
      [createSlider, 'size', { label: 'Size', min: 24, max: 240, value: size, step: 8, size: 'XS', variant: 'discrete' }],
      [createSwitch, 'determinate', { label: 'Determinate', class: 'switch--dense' }],
      [createSlider, 'value', { label: 'Value', min: 0, max: 100, value: 30, step: 1, size: 'M', variant: 'discrete', disabled: true }],
      [createSwitch, 'running', { label: 'Running', checked: true, class: 'switch--dense' }]
    ], layout.info).component

  ;[{ text: 'default', value: 'default' }, { text: 'contained', value: 'contained' }].forEach(({ text, value: chipValue }) => {
    info.variant.addChip({
      text,
      value: chipValue,
      variant: 'filter',
      selectable: true,
      selected: chipValue === 'default'
    })
  })

  layout.info.appendChild(info.element)
  mount()

  info.variant.on('change', (selected) => {
    contained = selected[0] === 'contained'
    mount()
  })
  info.size.on('input', (event) => {
    size = event.value
    indicator.current.setSize(size)
  })
  info.determinate.on('change', (e) => {
    if (e.checked) {
      value = info.value.getValue() / 100
      info.value.enable()
      info.running.disable()
    } else {
      value = null
      info.value.disable()
      info.running.enable()
    }
    indicator.current.setValue(value)
  })
  info.value.on('input', (event) => {
    if (value === null) return
    value = event.value / 100
    indicator.current.setValue(value)
  })
  info.running.on('change', (e) => {
    running = e.checked
    if (running) indicator.current.start()
    else indicator.current.stop()
  })
}

function createSizes (container) {
  const body = section(
    container,
    'Sizes',
    'The default is 48dp; the size can go from 24dp to 240dp and the ratio between the container and the active indicator holds.'
  )
  for (const size of [24, 48, 96, 160]) {
    body.appendChild(createLoadingIndicator({ size, contained: true, ariaLabel: `Loading, ${size}px` }).element)
  }
}

function createInButton (container) {
  const body = section(
    container,
    'While something runs',
    'Show it in the empty space the content will fill, or next to the control that started the work. Stop and start keep the current shape.'
  )
  const indicator = createLoadingIndicator({ size: 32, ariaLabel: 'Checking for updates' })
  const toggle = createButton({ text: 'Stop', variant: 'tonal' })
  toggle.on('click', () => {
    if (indicator.isRunning()) {
      indicator.stop()
      toggle.setText('Start')
    } else {
      indicator.start()
      toggle.setText('Stop')
    }
  })
  body.appendChild(indicator.element)
  body.appendChild(toggle.element)
}
