import {
  createComponentSection
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
  const layout = createLayout(createComponentSection({ title }), container).component

  const textfieldPosition = createTextfield({
    label: 'Position',
    leadingIcon: faceIcon,
    text: 'Position'
  })

  const menu = createMenu({
    opener: textfieldPosition,
    items: organisation
  })

  // const textfieldLocation = createTextfield({
  //   label: 'Location',
  //   leadingIcon: locationIcon,
  //   text: 'Location'
  // })

  // const menu2 = createMenu({
  //   opener: textfieldLocation,
  //   items: location
  // })

  menu.on('select', (event) => {
    console.trace('event', event)
    console.log(`Selected position: ${event.itemId}`)
    textfieldPosition.setValue(event.item.text)
  })

  // menu2.on('select', (event) => {
  //   console.log('event', event)
  //   console.log(`Selected location: ${event.itemId}`)
  //   textfieldLocation.setValue(event.item.text)
  // })

  layout.showcase.appendChild(textfieldPosition.element)
  // layout.showcase.appendChild(textfieldLocation.element)
}
