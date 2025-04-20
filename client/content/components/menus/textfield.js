import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createMenu,
  createTextfield
} from 'mtrl'

import {
  location,
  organisation
} from '../../../data'

import { faceIcon, locationIcon } from '../../../icons'

export const initTexfieldMenu = (container) => {
  const title = 'Textfield menu'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const textfieldPosition = createTextfield({
    label: 'Position',
    leadingIcon: faceIcon,
    text: 'Position'
  })

  const menu = createMenu({
    opener: textfieldPosition,
    items: organisation
  })

  const textfieldLocation = createTextfield({
    label: 'Location',
    leadingIcon: locationIcon,
    text: 'Location'
  })

  const menu2 = createMenu({
    opener: textfieldLocation,
    items: location
  })

  menu.on('select', (event) => {
    console.log('event', event)
    console.log(`Selected position: ${event.itemId}`)
    textfieldPosition.setValue(event.itemId)
  })

  menu2.on('select', (event) => {
    console.log('event', event)
    console.log(`Selected location: ${event.itemId}`)
  })

  layout.body.appendChild(textfieldPosition.element)
  layout.body.appendChild(textfieldLocation.element)
}
