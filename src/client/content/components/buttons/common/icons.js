// src/client/content/components/button/icons.js

import {
  createComponentsSectionLayout
} from '../../../../layout'

import {
  createLayout,
  createButton
} from 'mtrl'

const heartIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
</svg>`

export const initIcons = (container) => {
  const title = 'Buttons icons'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component
  const states = ['enabled', 'disabled']
  states.forEach(state => {
    const disabled = state === 'enabled'

    // log.info('disabled', disabled)

    const btn = createButton({
      icon: heartIcon,
      iconSize: 'medium',
      ariaLabel: 'Like'
    })

    if (!disabled) btn.disable()

    // btn.on('click', () => components.logEvent(`${variant} button clicked`))
    layout.showcase.appendChild(btn.element)
  })
}
