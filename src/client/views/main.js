// src/client/views/layout.js

import {
  createElement,
  createNavigation,
  createButton
} from 'mtrl'

import {
  iconMtrl,
  iconComponents,
  iconGetstarted,
  iconStyles,
  iconCore,
  iconLight,
  iconDark
} from '../icons'

export const createMainView = () => {
  return [
    [createNavigation, 'rail', {
      variant: 'rail',
      behavior: 'fixed',
      items: [
        { id: 'home', icon: iconMtrl, label: 'Home' },
        { id: 'getstarted', icon: iconGetstarted, label: 'Get Started' },
        { id: 'core', icon: iconCore, label: 'Core' },
        { id: 'styles', icon: iconStyles, label: 'Styles' },
        { id: 'components', icon: iconComponents, label: 'Components' }
      ]
    }],
    [createNavigation, 'nav', {
      variant: 'drawer',
      items: []
    }],
    [createElement, 'main', { class: 'mtrl-main' }],
    [createButton, 'toggleDarkmode', { icon: iconDark, iconSize: 'medium', class: 'toggle-darkmode', variant: 'outlined', size: '' }]
  ]
}
