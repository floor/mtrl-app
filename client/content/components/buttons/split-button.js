// src/client/content/components/buttons/split-button.js

import { createLayout } from 'mtrl-addons'
import {
  createComponentsLayout,
  createComponentSection,
  createDocs
} from '../../../layout'

import {
  createSplitButton,
  createSnackbar,
  createChips,
  createSwitch
} from 'mtrl'

const watchIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
  <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm112-260 56-56-128-128v-176h-80v208l152 152Z"/>
</svg>`

const watchItems = [
  { id: 'queue', text: 'Add to queue' },
  { id: 'playlist', text: 'Save to playlist' },
  { id: 'share', text: 'Share' }
]

export const createSplitButtonContent = (container) => {
  const info = {
    title: 'Split button',
    description: 'A split button pairs one action with a button that opens more choices. The leading button does the common thing; the trailing button opens a menu, and its chevron turns over while the menu is open.'
  }
  const layout = createLayout(createComponentsLayout(info), container).component

  createPlayground(layout.body)
  createSizes(layout.body)
  createVariants(layout.body)
  createDocs(layout.body, 'components/split-button.md')
}

const section = (container, title, description) => {
  const layout = createLayout(createComponentSection({ title, description }), container).component
  layout.body.classList.add('mtrl-content__grid')
  return layout.body
}

/**
 * The first section: one split button and the controls that drive it
 */
function createPlayground (container) {
  const layout = createLayout(
    createComponentSection({
      title: 'Split button',
      description: 'The leading button carries the action, the trailing button opens the menu. Both halves share a variant and a size.',
      class: 'layout--stack layout--stack-gap-16'
    }),
    container
  ).component

  let variant = 'filled'
  let size = 's'
  let withIcon = true
  const holder = { current: null }

  const mount = () => {
    holder.current?.destroy()
    holder.current = createSplitButton({
      text: 'Watch later',
      icon: withIcon ? watchIcon : undefined,
      variant,
      size,
      trailingLabel: 'More watch options',
      items: watchItems,
      onClick: () => createSnackbar({ message: 'Added to Watch later' }).show(),
      onSelect: ({ item }) => createSnackbar({ message: `Chose ${item.text}` }).show()
    })
    layout.showcase.appendChild(holder.current.element)
  }

  const info = createLayout(
    [{ layout: { type: 'grid', column: 1, gap: 4, dense: true, align: 'center' } },
      [createChips, 'variant', { scrollable: false, label: 'Variant' }],
      [createChips, 'size', { scrollable: false, label: 'Size' }],
      [createSwitch, 'icon', { label: 'Leading icon', checked: true, class: 'switch--dense' }],
      [createSwitch, 'disabled', { label: 'Disabled', class: 'switch--dense' }]
    ], layout.info).component

  ;['filled', 'tonal', 'outlined', 'elevated'].forEach((value) => {
    info.variant.addChip({ text: value, value, variant: 'filter', selectable: true, selected: value === variant })
  })
  ;['xs', 's', 'm', 'l', 'xl'].forEach((value) => {
    info.size.addChip({ text: value, value, variant: 'filter', selectable: true, selected: value === size })
  })

  layout.info.appendChild(info.element)
  mount()

  info.variant.on('change', (selected) => { variant = selected[0]; mount() })
  info.size.on('change', (selected) => { size = selected[0]; mount() })
  info.icon.on('change', (e) => { withIcon = e.checked; mount() })
  info.disabled.on('change', (e) => {
    if (e.checked) holder.current.disable()
    else holder.current.enable()
  })
}

function createSizes (container) {
  const body = section(
    container,
    'Sizes',
    'Five sizes, matching the button and icon button scale: 32, 40, 56, 96 and 136dp tall. The inner corners and the chevron grow with the size; the space between the halves stays 2dp.'
  )
  for (const size of ['xs', 's', 'm', 'l', 'xl']) {
    body.appendChild(createSplitButton({
      text: 'Watch later',
      icon: watchIcon,
      size,
      trailingLabel: `More watch options, ${size}`,
      items: watchItems
    }).element)
  }
}

function createVariants (container) {
  const body = section(
    container,
    'Colour',
    'The same four styles the button offers. Unlike a toggle button, the colour does not change when the menu opens: only a state layer and the shape do.'
  )
  for (const variant of ['filled', 'tonal', 'outlined', 'elevated']) {
    body.appendChild(createSplitButton({
      text: 'Save',
      variant,
      trailingLabel: `More save options, ${variant}`,
      items: [
        { id: 'copy', text: 'Save a copy' },
        { id: 'template', text: 'Save as template' }
      ]
    }).element)
  }
}
