// src/client/content/components/radios.js

import {
  createComponentsLayout,
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createRadios
} from 'mtrl'

export const createRadiosContent = (container) => {
  const info = {
    title: 'Buttons',
    description: 'Let users take action and make choices with one tap'
  }

  const layout = createLayout(createComponentsLayout(info), container).getAll()

  initRadios(layout.body)
}

export const initRadios = (container) => {
  const title = 'Radios'
  const layout = createLayout(createComponentSection({ title }), container).component

  const small = createRadios({
    name: 'size1',
    options: [
      { value: 'sm', label: 'Option 1' },
      { value: 'md', label: 'Option 2' },
      { value: 'lg', label: 'Option 3' },
      { value: 'xl', label: 'Option 4' }
    ]
  })

  const radios = createRadios({
    name: 'size2',
    options: [
      { value: 'sm', label: 'Option 1' },
      { value: 'md', label: 'Option 2' },
      { value: 'lg', label: 'Option 3' },
      { value: 'xl', label: 'Option 4' }
    ]
  })

  const large = createRadios({
    name: 'size3',
    options: [
      { value: 'sm', label: 'Option 1' },
      { value: 'md', label: 'Option 2' },
      { value: 'lg', label: 'Option 3' },
      { value: 'xl', label: 'Option 4' }
    ]
  })

  layout.showcase.appendChild(small.element)
  layout.showcase.appendChild(radios.element)
  layout.showcase.appendChild(large.element)
}
