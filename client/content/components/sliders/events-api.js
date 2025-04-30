import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createSlider
} from 'mtrl'

export const initEventsAPI = (container) => {
  const title = 'Using events and API'
  const layout = createLayout(createComponentSection({ title }), container).component

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
