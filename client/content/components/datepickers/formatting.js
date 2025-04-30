import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createDatePicker
} from 'mtrl'

export const initFormatting = (container) => {
  const title = 'Date Formatting'
  const description = 'DatePicker supports different date display formats'
  const layout = createLayout(createComponentSection({ title, description, class: 'noflex' }), container).component

  // Create grid layout for different formats
  const grid = document.createElement('div')
  grid.style.display = 'grid'
  grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))'
  grid.style.gap = '24px'
  grid.style.marginBottom = '24px'

  // Define format examples
  const formats = [
    { format: 'MM/DD/YYYY', description: 'Default US format', example: '01/15/2023' },
    { format: 'DD/MM/YYYY', description: 'International format', example: '15/01/2023' },
    { format: 'YYYY-MM-DD', description: 'ISO format', example: '2023-01-15' },
    { format: 'MMMM D, YYYY', description: 'Long format', example: 'January 15, 2023' },
    { format: 'MMM D, YY', description: 'Short format', example: 'Jan 15, 23' },
    { format: 'D MMMM YYYY', description: 'European style', example: '15 January 2023' }
  ]

  // Create a date picker for each format
  formats.forEach(formatInfo => {
    const formatContainer = document.createElement('div')

    // Format title
    const formatTitle = document.createElement('h4')
    formatTitle.textContent = formatInfo.format
    formatTitle.style.marginBottom = '4px'

    // Format description
    const formatDesc = document.createElement('p')
    formatDesc.textContent = formatInfo.description
    formatDesc.style.fontSize = '14px'
    formatDesc.style.marginTop = '0'
    formatDesc.style.marginBottom = '8px'
    formatDesc.style.color = '#666'

    // Create date picker with this format
    const datePicker = createDatePicker({
      label: `Format: ${formatInfo.format}`,
      placeholder: formatInfo.example,
      dateFormat: formatInfo.format
    })

    // Set an initial date to show the format
    const today = new Date()
    datePicker.setValue(today)

    // Add elements to container
    formatContainer.appendChild(formatTitle)
    formatContainer.appendChild(formatDesc)
    formatContainer.appendChild(datePicker.element)

    // Add to grid
    grid.appendChild(formatContainer)
  })

  // Add the grid to the layout
  layout.body.appendChild(grid)

  // Format tokens explanation
  const formatHelp = document.createElement('div')
  formatHelp.innerHTML = `
    <p style="margin-top: 16px; font-weight: bold;">Format Tokens:</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
      <tr style="background-color: #f5f5f5;">
        <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Token</th>
        <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Description</th>
        <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Example</th>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><code>YYYY</code></td>
        <td style="padding: 8px; border: 1px solid #ddd;">4-digit year</td>
        <td style="padding: 8px; border: 1px solid #ddd;">2023</td>
      </tr>
      <tr style="background-color: #f5f5f5;">
        <td style="padding: 8px; border: 1px solid #ddd;"><code>YY</code></td>
        <td style="padding: 8px; border: 1px solid #ddd;">2-digit year</td>
        <td style="padding: 8px; border: 1px solid #ddd;">23</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><code>MMMM</code></td>
        <td style="padding: 8px; border: 1px solid #ddd;">Full month name</td>
        <td style="padding: 8px; border: 1px solid #ddd;">January</td>
      </tr>
      <tr style="background-color: #f5f5f5;">
        <td style="padding: 8px; border: 1px solid #ddd;"><code>MMM</code></td>
        <td style="padding: 8px; border: 1px solid #ddd;">Short month name</td>
        <td style="padding: 8px; border: 1px solid #ddd;">Jan</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><code>MM</code></td>
        <td style="padding: 8px; border: 1px solid #ddd;">2-digit month</td>
        <td style="padding: 8px; border: 1px solid #ddd;">01</td>
      </tr>
      <tr style="background-color: #f5f5f5;">
        <td style="padding: 8px; border: 1px solid #ddd;"><code>M</code></td>
        <td style="padding: 8px; border: 1px solid #ddd;">Month without leading zero</td>
        <td style="padding: 8px; border: 1px solid #ddd;">1</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><code>DD</code></td>
        <td style="padding: 8px; border: 1px solid #ddd;">2-digit day</td>
        <td style="padding: 8px; border: 1px solid #ddd;">05</td>
      </tr>
      <tr style="background-color: #f5f5f5;">
        <td style="padding: 8px; border: 1px solid #ddd;"><code>D</code></td>
        <td style="padding: 8px; border: 1px solid #ddd;">Day without leading zero</td>
        <td style="padding: 8px; border: 1px solid #ddd;">5</td>
      </tr>
    </table>
  `
  layout.body.appendChild(formatHelp)
}
