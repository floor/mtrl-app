// src/client/content/components/menus.js

import {
  contentLayout,
  createComponentsSectionLayout
} from '../../config'

import {
  createLayout,
  createMenu,
  createButton,
  createElement
} from 'mtrl'

const moreIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
</svg>`

export const createMenusContent = (container) => {
  const info = {
    title: 'Menus',
    description: 'Display a list of choices on a temporary surface'
  }

  container.classList.add('components')

  const layout = createLayout(contentLayout(info), container).component

  initBasicMenu(layout.body)
  initNestedMenu(layout.body)
  initIconMenu(layout.body)
  initCustomMenu(layout.body)
}

export const initBasicMenu = (container) => {
  const title = 'Basic Menu'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const demoContainer = createElement({ class: 'mtrl-content__demo' })

  const button = createButton({
    text: 'Show Basic Menu',
    variant: 'filled'
  })

  const menu = createMenu({
    items: [
      { name: 'new', text: 'New File' },
      { name: 'open', text: 'Open...' },
      { type: 'divider' },
      { name: 'save', text: 'Save' },
      { name: 'save-as', text: 'Save As...' }
    ],
    openingButton: button
  })

  button.on('click', () => {
    menu.show().position(button.element)
  })

  menu.on('select', ({ name, text }) => {
    console.log(`Selected: ${name} (${text})`)
  })

  demoContainer.appendChild(button.element)
  layout.body.appendChild(demoContainer)
}

export const initNestedMenu = (container) => {
  const title = 'Nested Menu'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const demoContainer = createElement({ class: 'mtrl-content__demo' })

  const button = createButton({
    text: 'Show Nested Menu',
    variant: 'tonal'
  })

  const menu = createMenu({
    items: [
      {
        name: 'format',
        text: 'Format',
        items: [
          { name: 'bold', text: 'Bold' },
          { name: 'italic', text: 'Italic' },
          { name: 'underline', text: 'Underline' }
        ]
      },
      {
        name: 'paragraph',
        text: 'Paragraph',
        items: [
          { name: 'align-left', text: 'Align Left' },
          { name: 'align-center', text: 'Center' },
          { name: 'align-right', text: 'Align Right' }
        ]
      },
      { type: 'divider' },
      { name: 'find', text: 'Find and Replace...' }
    ],
    openingButton: button
  })

  button.on('click', () => {
    menu.show().position(button.element)
  })

  menu.on('select', ({ name, text }) => {
    console.log(`Selected nested item: ${name} (${text})`)
  })

  demoContainer.appendChild(button.element)
  layout.body.appendChild(demoContainer)
}

export const initIconMenu = (container) => {
  const title = 'Icon Menu'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const demoContainer = createElement({ class: 'mtrl-content__demo' })

  const button = createButton({
    icon: moreIcon,
    variant: 'outlined'
  })

  const menu = createMenu({
    items: [
      { name: 'refresh', text: 'Refresh' },
      { name: 'settings', text: 'Settings' },
      { type: 'divider' },
      { name: 'keyboard', text: 'Keyboard shortcuts' },
      { name: 'help', text: 'Help' }
    ],
    openingButton: button
  })

  button.on('click', () => {
    menu.show().position(button.element)
  })

  menu.on('select', ({ name, text }) => {
    console.log(`Selected from icon menu: ${name} (${text})`)
  })

  demoContainer.appendChild(button.element)
  layout.body.appendChild(demoContainer)
}

export const initCustomMenu = (container) => {
  const title = 'Custom Menu'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const demoContainer = createElement({ class: 'mtrl-content__demo' })

  const button = createButton({
    text: 'Show Custom Menu',
    variant: 'elevated'
  })

  const menu = createMenu({
    items: [
      { name: 'share', text: 'Share', disabled: true },
      { name: 'download', text: 'Download' },
      { type: 'divider' },
      { name: 'rename', text: 'Rename' },
      { name: 'delete', text: 'Delete', disabled: true }
    ],
    openingButton: button
  })

  button.on('click', () => {
    menu.show().position(button.element, {
      align: 'center',
      vAlign: 'bottom'
    })
  })

  menu.on('select', ({ name, text }) => {
    console.log(`Selected from custom menu: ${name} (${text})`)
  })

  demoContainer.appendChild(button.element)
  layout.body.appendChild(demoContainer)
}
