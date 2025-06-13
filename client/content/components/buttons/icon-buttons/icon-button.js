import {
  createLayout, createIconButton,
  createChips, createSwitch,
  BUTTON_VARIANTS,
  BUTTON_SIZES
} from 'mtrl'
import { capitalize } from '../../../../core/utils'
import {
  createComponentSection
} from '../../../../layout'
import { downloadIcon, bookmarkIcon, likeIcon, sendIcon } from '../../../../icons'

export const createIconButtonComponent = (container) => {
  const title = 'Button Component'
  const description = 'Interactive playground to experiment with button variants, icons, text customization, and disabled states'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  // Create the button in the showcase section
  const icons = {
    download: downloadIcon,
    bookmark: bookmarkIcon,
    send: sendIcon,
    like: likeIcon
  }

  // Add the button to the showcase
  const showcase = createLayout(
    [createIconButton, 'button', {
      variant: BUTTON_VARIANTS.FILLED,
      icon: likeIcon,
      ariaLabel: 'like',
      class: 'button'
    }]
    , layout.showcase)
  const button = showcase.get('button')

  const variants = []
  Object.entries(BUTTON_VARIANTS).forEach(([value, label]) => {
    variants.push({ value, label })
  })

  const sizes = []
  Object.entries(BUTTON_SIZES).forEach(([value, label]) => {
    sizes.push({ value, label })
  })

  // Component context information and controls in the info section
  const info = createLayout(
    [{ layout: { type: 'grid', column: 1, gap: 4, autoHeight: true, dense: true, align: 'center' } /* style: { transform: 'scale(.9)' } */ },
      [createChips, 'variant', { scrollable: false, label: 'Variant' }],
      [createSwitch, 'shape', { label: 'Square' }],
      [createChips, 'size', { scrollable: false, label: 'Size' }],
      [createChips, 'icon', { scrollable: false, label: 'Icon' }],
      [createSwitch, 'disabled', { label: 'Disabled', checked: true }]
    ], layout.info).component

  Object.entries(icons).forEach(([key, icon]) => {
    info.icon.addChip({
    // text: key,
      value: key,
      leadingIcon: icon,
      variant: key === 'none' ? 'default' : 'filter',
      selectable: key !== 'none'
    })
  })

  for (let i = 0; i < variants.length; i++) {
    info.variant.addChip({
      text: variants[i].label,
      value: variants[i].value,
      variant: 'filter',
      selectable: true,
      selected: variants[i].label === 'filled'
    })
  }

  for (let i = 0; i < sizes.length; i++) {
    info.size.addChip({
      text: sizes[i].label,
      value: sizes[i].value,
      variant: 'filter',
      selectable: true,
      selected: sizes[i].label === 's'
    })
  }

  info.disabled.on('change', (value) => {
    if (value.checked) {
      button.enable()
    } else {
      button.disable()
    }
  })

  info.shape.on('change', (value) => {
    if (value.checked) {
      button.setShape('square')
    } else {
      button.setShape('round')
    }
  })

  info.variant.on('change', (value) => {
    button.setVariant(value[0].toLowerCase())
  })

  info.size.on('change', (value) => {
    button.setSize(value[0].toLowerCase())
  })

  info.icon.on('change', (value) => {
    console.log('icon change')
    button.setIcon(icons[value[0]])
  })
}
