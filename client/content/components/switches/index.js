// src/client/content/components/switches/index.js

import {
  componentsLayout
} from '../../../layout'

import { initBasicSwitches } from './basic'
import { initDisabledSwitches } from './disabled'
import { initSupportingText } from './supporting'
import { createSwitchDocs } from './docs'

import {
  createLayout
} from 'mtrl'

// const CHECK_ICON = `
// <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//   <polyline points="20 6 9 17 4 12"></polyline>
// </svg>`

/**
 * Create the switches content
 * @param {HTMLElement} container - The container element
 */
export const createSwitchesContent = (container) => {
  const info = {
    title: 'Switches',
    description: 'Switches toggle the selection of an item on or off'
  }

  console.log('createSwitchDocs')

  const layout = createLayout(componentsLayout(info), container).component

  initBasicSwitches(layout.body)
  initSupportingText(layout.body)
  initDisabledSwitches(layout.body)
  createSwitchDocs(layout.body)
}

// Ensure we export as default for better compatibility with dynamic loader
export default createSwitchesContent
