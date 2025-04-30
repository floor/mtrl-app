// src/client/config.js

import {
  themesIcon,
  darkIcon
} from './icons'

import {
  createButton
} from 'mtrl'

import { sitemap } from './sitemap'

export const appLayout = [
  ['content', { tag: 'div', className: 'content' }],
  [createButton, 'moreMenu', { icon: themesIcon, class: 'more-menu', variant: 'outlined', ariaLabel: 'Themes' }],
  [createButton, 'toggleDarkmode', { icon: darkIcon, class: 'toggle-darkmode', variant: 'outlined', ariaLabel: 'Darkmode' }]
]

// Navigation structure for the new Navigation System
export const navigationLayout = sitemap

export const themesMenu = [
  { id: 'ocean', text: 'Ocean' },
  { id: 'forest', text: 'Forest' },
  { id: 'spring', text: 'Spring' },
  { id: 'summer', text: 'Summer' },
  { id: 'autumn', text: 'Autumn' },
  { id: 'winter', text: 'Winter' },
  { id: 'material', text: 'Material' }
]
