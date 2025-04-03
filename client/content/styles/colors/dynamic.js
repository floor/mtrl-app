import {
  createLayout,
  createElement,
  createButton
} from 'mtrl'

import { createContentSection } from '../../../layout/content'

export const createDynamicTheme = (container) => {
  console.log('createDynamicTheme', container)
  const layout = createLayout(createContentSection({
    title: 'Theme',
    description: 'Try different themes to see how color tokens adapt to maintain consistency across themes and color modes.',
    class: 'theme-colors'
  }), container).getAll()

  const body = layout.body

  console.log('body', body)

  const themeTitle = layout.title

  // Show theme color samples
  const themeColorChips = createElement({
    tag: 'div',
    class: 'theme-color-chips'
  })

  // Theme switchers
  const themeSwitchers = createElement({
    tag: 'div',
    class: 'theme-switchers'
  })

  const themes = [
    { name: 'ocean', label: 'Ocean Theme' },
    { name: 'forest', label: 'Forest Theme' },
    { name: 'sunset', label: 'Sunset Theme' },
    { name: 'material', label: 'Material Theme' },
    { name: 'spring', label: 'Spring Theme' },
    { name: 'summer', label: 'Summer Theme' },
    { name: 'autumn', label: 'Autumn Theme' },
    { name: 'winter', label: 'Winter Theme' }
    // { name: 'bluekhaki', label: 'Blue Khaki' },
    // { name: 'brownbeige', label: 'Brown Beige' },
    // { name: 'tealcaramel', label: 'Teal Caramel' },
    // { name: 'greenbeige', label: 'Green Beige' },
    // { name: 'sageivory', label: 'Sage Ivory' },
    // { name: 'browngreen', label: 'Brown Green' }
  ]

  themes.forEach(theme => {
    const button = createButton({
      text: theme.label,
      variant: 'filled',
      size: 'small',
      class: `theme-button theme-${theme.name} ${theme.name === 'ocean' ? 'active-theme' : ''}`
    })

    button.on('click', () => {
      // Remove active class from all buttons
      const allButtons = themeSwitchers.querySelectorAll('.theme-button')
      allButtons.forEach(btn => btn.classList.remove('active-theme'))

      // Add active class to clicked button
      button.element.classList.add('active-theme')

      // Change theme
      document.body.setAttribute('data-theme', theme.name)
      themeTitle.textContent = `Theme: ${theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}`
    })

    themeSwitchers.appendChild(button.element)
  })

  const darkModeButton = createButton({
    text: 'Toggle Dark Mode',
    variant: 'outlined',
    size: 'small'
  })

  themeSwitchers.appendChild(darkModeButton.element)

  darkModeButton.on('click', () => {
    const currentMode = document.body.getAttribute('data-theme-mode')
    const newMode = currentMode === 'dark' ? 'light' : 'dark'
    document.body.setAttribute('data-theme-mode', newMode)
    darkModeButton.setText(newMode === 'dark' ? 'Switch to Light' : 'Switch to Dark')
  })

  body.appendChild(themeColorChips)
  body.appendChild(themeSwitchers)
}
