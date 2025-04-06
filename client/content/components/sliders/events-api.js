import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fSlider
} from 'mtrl'

export const initEventsAPI = (container) => {
  const title = 'Using events and API'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  const slider = fSlider({
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
