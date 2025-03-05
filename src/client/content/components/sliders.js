// src/client/content/components/button.js
import { capitalize } from '../../core/utils'

import {
  contentLayout,
  createComponentsSectionLayout
} from '../../config'

import {
  createLayout,
  createSlider
} from 'mtrl'

import {
  SLIDER_COLORS,
  SLIDER_SIZES,
  SLIDER_ORIENTATIONS,
  SLIDER_EVENTS
} from 'mtrl/src/components/slider'

export const createSlidersContent = (container) => {
  const info = {
    title: 'Slider',
    description: 'Let users make selections from a range of values'
  }

  container.classList.add('components')

  const layout = createLayout(contentLayout(info), container).component

  initBasicSlider(layout.body)
  initRangeSlider(layout.body)
  initSliderTicksAndLabels(layout.body)
  initVerticalSlider(layout.body)
  initDisabledSlider(layout.body)
  initEventsAPISlider(layout.body)
}

export const initBasicSlider = (container) => {
  const title = 'Simple Slider'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Example 1: Basic slider
  const slider = createSlider({
    min: 0,
    max: 100,
    value: 50,
    step: 1
  })
  layout.body.appendChild(slider.element)
}

export const initRangeSlider = (container) => {
  const title = 'Range slider'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const slider = createSlider({
    min: 0,
    max: 1000,
    value: 200,
    secondValue: 800,
    range: true,
    color: SLIDER_COLORS.SECONDARY
  })
  // btn.on('click', () => components.logEvent(`${variant} button clicked`))
  layout.body.appendChild(slider.element)
}

export const initSliderTicksAndLabels = (container) => {
  const title = 'Slider with tick marks and labels'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const slider = createSlider({
    min: 0,
    max: 5,
    value: 2,
    step: 1,
    ticks: true,
    tickLabels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent', 'Outstanding'],
    color: SLIDER_COLORS.TERTIARY
  })

  layout.body.appendChild(slider.element)
}

export const initVerticalSlider = (container) => {
  const title = 'Vertical slider'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const slider = createSlider({
    min: 0,
    max: 100,
    value: 75,
    orientation: SLIDER_ORIENTATIONS.VERTICAL,
    showValue: true,
    // Format value as percentage
    valueFormatter: (value) => `${value}%`
  })

  layout.body.appendChild(slider.element)
}

export const initDisabledSlider = (container) => {
  const title = 'Disabled slider'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const slider = createSlider({
    min: 0,
    max: 10,
    value: 5,
    disabled: true
  })

  layout.body.appendChild(slider.element)
}

export const initEventsAPISlider = (container) => {
  const title = 'Using events and API'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const slider = createSlider({
    min: 0,
    max: 100,
    value: 50,
    on: {
    // Log changes
      change: (event) => {
        console.log(`Value changed to: ${event.value}`)
      },
      // Show when dragging starts
      start: () => {
        console.log('Dragging started')
      },
      // Show when dragging ends
      end: () => {
        console.log('Dragging ended')
      }
    }
  })

  layout.body.appendChild(slider.element)
}
