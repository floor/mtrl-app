// src/client/config.js

import {
  themesIcon,
  darkIcon
} from './icons'

import {
  createIconButton
  // setComponentDefaults
} from 'mtrl'

import { sitemap } from './sitemap'

// setComponentDefaults('button', {
//   shape: 'round'
// })

export const appLayout = [
  ['content', { tag: 'div', className: 'content' }],
  [createIconButton, 'moreMenu', { icon: themesIcon, class: 'more-menu', variant: 'outlined', ariaLabel: 'Themes' }],
  [createIconButton, 'toggleDarkmode', { icon: darkIcon, class: 'toggle-darkmode', variant: 'outlined', ariaLabel: 'Darkmode' }]
]

// Navigation structure for the new Navigation System
export const navigationLayout = sitemap

export const themesMenu = [
  { id: 'ocean', text: 'Ocean' },
  { id: 'forest', text: 'Forest' },
  { id: 'desert', text: 'Desert' },
  { id: 'spring', text: 'Spring' },


  { id: 'summer', text: 'Summer' },
  { id: 'autumn', text: 'Autumn' },
  { id: 'winter', text: 'Winter' },

  { id: 'brownbeige', text: 'Brown/Beige' },
  { id: 'browngreen', text: 'Brown/Green' },
  { id: 'sageivory', text: 'Sage/Ivory' },
  { id: 'tealcaramel', text: 'Teal/Caramel' },

  { id: 'material', text: 'Material' }
]
