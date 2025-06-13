export default `
<div style="display: flex; flex-direction: column; gap: 24px;">
  <h3 style="margin-bottom: 16px;">Select with Density Options</h3>
  
  <div style="display: flex; gap: 16px; align-items: flex-start;">
    <div style="flex: 1;">
      <h4 style="margin-bottom: 8px; font-size: 14px;">Default Density (56px)</h4>
      <div id="select-default-density"></div>
    </div>
    
    <div style="flex: 1;">
      <h4 style="margin-bottom: 8px; font-size: 14px;">Compact Density (40px)</h4>
      <div id="select-compact-density"></div>
    </div>
  </div>
  
  <div style="margin-top: 32px;">
    <h3 style="margin-bottom: 16px;">Outlined Variant with Density</h3>
    <div style="display: flex; gap: 16px; align-items: flex-start;">
      <div style="flex: 1;">
        <h4 style="margin-bottom: 8px; font-size: 14px;">Default Density</h4>
        <div id="select-outlined-default"></div>
      </div>
      
      <div style="flex: 1;">
        <h4 style="margin-bottom: 8px; font-size: 14px;">Compact Density</h4>
        <div id="select-outlined-compact"></div>
      </div>
    </div>
  </div>
  
  <div style="margin-top: 32px;">
    <h3 style="margin-bottom: 16px;">Dynamic Density Toggle</h3>
    <div id="select-dynamic-density"></div>
    <button id="toggle-density-btn" style="margin-top: 16px; padding: 8px 16px;">
      Toggle Density
    </button>
    <p id="density-status" style="margin-top: 8px; font-size: 14px; color: #666;"></p>
  </div>
</div>

<script type="module">
import { createSelect } from '/src/components/select/index.js';

// Sample options for all selects
const countryOptions = [
  { id: 'us', text: 'United States' },
  { id: 'ca', text: 'Canada' },
  { id: 'mx', text: 'Mexico' },
  { id: 'uk', text: 'United Kingdom' },
  { id: 'de', text: 'Germany' },
  { id: 'fr', text: 'France' },
  { id: 'jp', text: 'Japan' },
  { id: 'au', text: 'Australia' }
];

// Default density (filled variant)
const defaultSelect = createSelect({
  label: 'Country',
  options: countryOptions,
  value: 'us',
  supportingText: 'Select your country'
});
document.getElementById('select-default-density').appendChild(defaultSelect.element);

// Compact density (filled variant)
const compactSelect = createSelect({
  label: 'Country',
  options: countryOptions,
  value: 'ca',
  density: 'compact',
  supportingText: 'Select your country'
});
document.getElementById('select-compact-density').appendChild(compactSelect.element);

// Default density (outlined variant)
const outlinedDefaultSelect = createSelect({
  label: 'Country',
  variant: 'outlined',
  options: countryOptions,
  value: 'uk'
});
document.getElementById('select-outlined-default').appendChild(outlinedDefaultSelect.element);

// Compact density (outlined variant)
const outlinedCompactSelect = createSelect({
  label: 'Country',
  variant: 'outlined',
  density: 'compact',
  options: countryOptions,
  value: 'de'
});
document.getElementById('select-outlined-compact').appendChild(outlinedCompactSelect.element);

// Dynamic density toggle
const dynamicSelect = createSelect({
  label: 'Dynamic Density Select',
  options: countryOptions,
  value: 'fr',
  supportingText: 'This select can change density'
});
document.getElementById('select-dynamic-density').appendChild(dynamicSelect.element);

// Update density status
const updateDensityStatus = () => {
  const currentDensity = dynamicSelect.getDensity();
  document.getElementById('density-status').textContent = 
    \`Current density: \${currentDensity} (\${currentDensity === 'default' ? '56px' : '40px'} height)\`;
};

updateDensityStatus();

// Toggle density button
document.getElementById('toggle-density-btn').addEventListener('click', () => {
  const currentDensity = dynamicSelect.getDensity();
  const newDensity = currentDensity === 'default' ? 'compact' : 'default';
  
  dynamicSelect.setDensity(newDensity);
  updateDensityStatus();
});

// Log density for all selects
console.log('Default select density:', defaultSelect.getDensity());
console.log('Compact select density:', compactSelect.getDensity());
</script>
`;
