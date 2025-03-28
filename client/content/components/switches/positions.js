import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createSwitch
} from 'mtrl'

export const initPositionsSwitches = (container) => {
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

  // // Disabled with start label
  // const disabledStartLabelSwitch = createSwitch({
  //   label: 'Disabled with Start Label',
  //   labelPosition: 'start',
  //   disabled: true
  // })
  // layout.body.appendChild(disabledStartLabelSwitch.element)
}
