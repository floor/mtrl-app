import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createMenu,
  createButton
} from 'mtrl'

import {
  location,
  organisation
} from '../../../data'

import { faceIcon, locationIcon } from '../../../icons'

export const initNestedMenu = (container) => {
  const title = 'Nested Menu'
  const layout = createLayout(createComponentSection({ title }), container).component

  const buttonPosition = createButton({
    icon: faceIcon,
    text: 'Position',
    variant: 'tonal'
  })

  const menu = createMenu({
    opener: buttonPosition,
    items: organisation
  })

  const buttonLocation = createButton({
    icon: locationIcon,
    text: 'Location',
    variant: 'tonal'
  })

  const menu2 = createMenu({
    opener: buttonLocation,
    items: location
  })

  menu.on('select', (event) => {
    console.log('event', event)
    console.log(`Selected position: ${event.itemId}`)
    buttonPosition.setText(event.item.text)
  })

  menu2.on('select', (event) => {
    console.log('event', event)
    console.log(`Selected location: ${event.itemId}`)
    buttonLocation.setText(event.item.text)
  })

  layout.body.appendChild(buttonPosition.element)
  layout.body.appendChild(buttonLocation.element)
}
