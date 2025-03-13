import {
  createComponentsSectionLayoutInfo
} from '../../../config'

import {
  createLayout,
  createSlider
} from 'mtrl'

const callVolume = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>`

export const initContinuous = (container) => {
  const title = 'Continuous Slider with Label'
  const layout = createLayout(createComponentsSectionLayoutInfo({ title }), container).component

  const slider = createSlider({
    label: 'Brightness',
    min: 0,
    max: 100,
    value: 250,
    step: 1
  })
  layout.body.appendChild(slider.element)
}

export const initContinuous1000 = (container) => {
  const title = 'Continuous Slider with Label and Icon'
  const layout = createLayout(createComponentsSectionLayoutInfo({ title }), container).component

  const sliderCallVolume = createSlider({
    label: 'Call volume',
    icon: callVolume,
    min: 0,
    max: 10,
    value: 3,
    step: 1,
    size: 'small'
  })

  const sliderAlarmVolume = createSlider({
    label: 'Alarm volume',
    icon: callVolume,
    min: 0,
    max: 10,
    value: 3,
    step: 1
  })

  // slider.setLabel('Phone volume 2')
  // slider.setIcon(callVolume)

  layout.showcase.appendChild(sliderCallVolume.element)
  layout.showcase.appendChild(sliderAlarmVolume.element)
}
