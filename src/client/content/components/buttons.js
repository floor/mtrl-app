// src/client/content/components/button.js
import { capitalize } from '../../core/utils'

import {
  contentLayout,
  createComponentsSectionLayout
} from '../../config'

import {
  createLayout,
  createButton
} from 'mtrl'

const heartIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
</svg>`

export const createButtonsContent = (container) => {
  const info = {
    title: 'Buttons',
    description: 'Let users take action and make choices with one tap'
  }

  container.classList.add('components')

  const layout = createLayout(contentLayout(info), container).component

  initButtonVariants(layout.body)
  initButtonVariantsDisabled(layout.body)
  initButtonSizes(layout.body)
  initIconButtons(layout.body)
}

export const initButtonVariants = (container) => {
  const title = 'Buttons Variants'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const variants = ['filled', 'tonal', 'elevated', 'outlined', 'text']
  variants.forEach(variant => {
    const text = capitalize(variant)
    const btn = createButton({
      text: `${text} button`,
      variant,
      ripple: true
    })
    btn.element.addEventListener('click', () => log.info('native button clicked'))
    btn.on('click', () => log.info('component button clicked'))
    layout.body.appendChild(btn.element)
  })
}

export const initButtonVariantsDisabled = (container) => {
  const title = 'Buttons Disabled'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const variants = ['filled', 'tonal', 'elevated', 'outlined', 'text']
  variants.forEach(variant => {
    const text = capitalize(variant)
    const btn = createButton({
      text: `${text} Button`,
      variant,
      disabled: true
    })
    // btn.on('click', () => components.logEvent(`${variant} button clicked`))
    layout.body.appendChild(btn.element)
  })
}

export const initButtonSizes = (container) => {
  const title = 'Buttons Sizes'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const sizes = ['medium', 'small', 'large']
  sizes.forEach(size => {
    const text = capitalize(size)
    const btn = createButton({
      text: `${text} Button`,
      size
    })
    // btn.on('click', () => components.logEvent(`${variant} button clicked`))
    layout.body.appendChild(btn.element)
  })
}

export const initIconButtons = (container) => {
  const title = 'Buttons icons'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component
  const states = ['enabled', 'disabled']
  states.forEach(state => {
    const disabled = state === 'enabled'

    // log.info('disabled', disabled)

    const btn = createButton({
      icon: heartIcon,
      iconSize: 'medium'
    })

    if (!disabled) btn.disable()

    // btn.on('click', () => components.logEvent(`${variant} button clicked`))
    layout.body.appendChild(btn.element)
  })
}
