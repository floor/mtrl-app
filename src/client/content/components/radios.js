// src/client/content/components/radios.js

import {
  contentLayout,
  createComponentsSectionLayout
} from '../../config'

import {
  RADIO_DIRECTIONS,
  RADIO_SIZES
} from 'mtrl/src/components/radios'

import {
  createLayout,
  createRadios
} from 'mtrl'

export const createRadiosContent = (container) => {
  const info = {
    title: 'Buttons',
    description: 'Let users take action and make choices with one tap'
  }

  container.classList.add('components')

  const layout = createLayout(contentLayout(info), container).component

  initRadiosSizes(layout.body)
}

export const initRadiosSizes = (container) => {
  const title = 'Radios Size'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const small = createRadios({
    name: 'size',
    direction: RADIO_DIRECTIONS.HORIZONTAL,
    size: RADIO_SIZES.SMALL,
    options: [
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' },
      { value: 'xl', label: 'Extra Large' }
    ]
  })

  const radios = createRadios({
    name: 'size',
    direction: RADIO_DIRECTIONS.HORIZONTAL,
    options: [
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' },
      { value: 'xl', label: 'Extra Large' }
    ]
  })

  const large = createRadios({
    name: 'size',
    direction: RADIO_DIRECTIONS.HORIZONTAL,
    size: RADIO_SIZES.LARGE,
    options: [
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' },
      { value: 'xl', label: 'Extra Large' }
    ]
  })

  layout.body.appendChild(small.element)
  layout.body.appendChild(radios.element)
  layout.body.appendChild(large.element)
}
