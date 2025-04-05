// src/client/content/components/radios.js

import {
  componentsLayout,
  createComponentsSectionLayout
} from '../../layout'

import {
  createLayout,
  fRadios
} from 'mtrl'

export const createRadiosContent = (container) => {
  const info = {
    title: 'Buttons',
    description: 'Let users take action and make choices with one tap'
  }

  const layout = createLayout(componentsLayout(info), container).getAll()

  console.log('layout', layout)

  initRadiosSizes(layout.body)
}

export const initRadiosSizes = (container) => {
  const title = 'Radios Size'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const small = fRadios({
    name: 'size1',
    options: [
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' },
      { value: 'xl', label: 'Extra Large' }
    ]
  })

  const radios = fRadios({
    name: 'size2',
    options: [
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' },
      { value: 'xl', label: 'Extra Large' }
    ]
  })

  const large = fRadios({
    name: 'size3',
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
