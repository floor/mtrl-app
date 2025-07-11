// src/client/content/components/chips/index.js

import { createComponentsLayout } from '../../../layout'
import { createLayout } from 'mtrl-addons'

import { initChipVariants } from './variants'
import { initChipWithIcons } from './icons'
import { initSelectableChips } from './selectable'
// import { initChipSet } from './chipset'
import { initFilterChipSet } from './filter'
import { initInputChips } from './input'
import { initInteractiveChipExample } from './interactive'

/**
 * Creates the main Chips content showcase
 * @param {HTMLElement} container - The container element to append content to
 */
export const createChipsContent = (container) => {
  const info = {
    title: 'Chips',
    description: 'Compact elements that represent an input, attribute, or action'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  initChipVariants(layout.body)
  initChipWithIcons(layout.body)
  initSelectableChips(layout.body)
  // initChipSet(layout.body)
  initFilterChipSet(layout.body)
  initInputChips(layout.body)
  initInteractiveChipExample(layout.body)
}
