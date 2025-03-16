// src/client/content/components/switches.js

import {
  componentsLayout,
  createComponentsSectionLayout
} from '../../layout'

import {
  createLayout,
  createSwitch
} from 'mtrl'

const CHECK_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>`

export const createSwitchesContent = (container) => {
  const info = {
    title: 'Switches',
    description: 'Switches toggle the selection of an item on or off'
  }

  const layout = createLayout(componentsLayout(info), container).component

  initBasicSwitches(layout.body)
  initLabelPositions(layout.body)
}

export const initBasicSwitches = (container) => {
  const title = 'Basic Switches'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Default switch
  const defaultSwitch = createSwitch({
    label: 'Default Switch'
  })
  layout.body.appendChild(defaultSwitch.element)

  // Checked switch
  const checkedSwitch = createSwitch({
    label: 'Initially Checked',
    checked: true
  })
  layout.body.appendChild(checkedSwitch.element)

  // Disabled switch
  const disabledSwitch = createSwitch({
    label: 'Disabled Switch',
    disabled: true
  })
  layout.body.appendChild(disabledSwitch.element)

  // Disabled and checked switch
  const disabledCheckedSwitch = createSwitch({
    label: 'Disabled Checked',
    disabled: true,
    checked: true
  })
  layout.body.appendChild(disabledCheckedSwitch.element)
}

export const initLabelPositions = (container) => {
  const title = 'Label Positions'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Label at end (default)
  const endLabelSwitch = createSwitch({
    label: 'Label at End (Default)',
    labelPosition: 'end'
  })
  layout.body.appendChild(endLabelSwitch.element)

  // Label at start
  const startLabelSwitch = createSwitch({
    label: 'Label at Start',
    labelPosition: 'start'
  })
  layout.body.appendChild(startLabelSwitch.element)

  // Disabled with start label
  const disabledStartLabelSwitch = createSwitch({
    label: 'Disabled with Start Label',
    labelPosition: 'start',
    disabled: true
  })
  layout.body.appendChild(disabledStartLabelSwitch.element)
}
