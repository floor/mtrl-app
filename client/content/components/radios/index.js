// src/client/content/components/radios.js

import {
  componentsLayout,
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fRadios
} from 'mtrl'

export const createRadiosContent = (container) => {
  const info = {
    title: 'Buttons',
    description: 'Let users take action and make choices with one tap'
  }

  const layout = fLayout(componentsLayout(info), container).getAll()

  initRadios(layout.body)
}

export const initRadios = (container) => {
  const title = 'Radios'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  const small = fRadios({
    name: 'size1',
    options: [
      { value: 'sm', label: 'Option 1' },
      { value: 'md', label: 'Option 2' },
      { value: 'lg', label: 'Option 3' },
      { value: 'xl', label: 'Option 4' }
    ]
  })

  const radios = fRadios({
    name: 'size2',
    options: [
      { value: 'sm', label: 'Option 1' },
      { value: 'md', label: 'Option 2' },
      { value: 'lg', label: 'Option 3' },
      { value: 'xl', label: 'Option 4' }
    ]
  })

  const large = fRadios({
    name: 'size3',
    options: [
      { value: 'sm', label: 'Option 1' },
      { value: 'md', label: 'Option 2' },
      { value: 'lg', label: 'Option 3' },
      { value: 'xl', label: 'Option 4' }
    ]
  })

  layout.body.appendChild(small.element)
  layout.body.appendChild(radios.element)
  layout.body.appendChild(large.element)
}
