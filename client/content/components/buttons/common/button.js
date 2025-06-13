import {
  createLayout, createButton,
  createChips, createSwitch, createTextfield,
  BUTTON_VARIANTS,
  BUTTON_SIZES
} from 'mtrl'
import { capitalize } from '../../../../core/utils'
import {
  createComponentSection
} from '../../../../layout'
import { downloadIcon, bookmarkIcon, likeIcon, sendIcon, closeIcon } from '../../../../icons'

export const createButtonComponent = (container) => {
  const title = 'Button Component'
  const description = 'Interactive playground to experiment with button variants, icons, text customization, and disabled states'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  // Create the button in the showcase section
  let defaultText = 'Button'
  const icons = {
    download: downloadIcon,
    bookmark: bookmarkIcon,
    send: sendIcon,
    like: likeIcon,
    none: closeIcon
  }

  // Add the button to the showcase
  const showcase = createLayout(
    [createButton, 'button', {
      variant: BUTTON_VARIANTS.FILLED,
      text: defaultText,
      class: 'button--showcase'
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
      [createTextfield, 'text', { label: 'Text', value: 'Button', variant: 'outlined', density: 'compact', style: { width: '100%' } }],
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
    if (!button.hasIcon()) {
      defaultText = button.getText() || defaultText
    }
    if (value[0] !== 'none') {
      const text = capitalize(value[0])
      button.setIcon(icons[value[0]])
      button.setText(text)
      info.text.setValue(text)
    } else {
      button.setIcon('')
      button.setText(defaultText)
      info.text.setValue(defaultText)
    }
  })

  info.text.on('input', (event) => {
    // consoole.log()
    button.setText(event.value)
    defaultText = event.value
    // if (event.value) {
    //   addClass(button.element, 'button-circular')
    // } else {
    //   removeClass(button.element, 'button-circular')
    // }
  })
}
