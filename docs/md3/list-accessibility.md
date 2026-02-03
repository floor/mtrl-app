# List Accessibility

Material Design 3 Lists accessibility guidelines for the mtrl library.

## Use Cases

Users should be able to do the following with assistive technology:

- Navigate to a list item
- Select a list item

## Visual Indicators

### Indicate Selection with More Than Color

To make selected items clear for everyone, don't rely on color as the only visual cue. Use an additional indicator such as:

- Radio buttons or checkboxes
- Leading or trailing icons
- A visual style not related to color (e.g., underlined text)

**Best practice:** Use two visual cues to show a list item is selected, like a leading checkmark and filled color.

## Interaction States

### Touch

When a user taps on a list item, a touch ripple appears, indicating interaction feedback.

### Cursor

| State | Description |
|-------|-------------|
| Hover | Visual cue that a list item is interactive (darker fill) |
| Selected | Colored fill with checked box indicator |

### Keyboard & Switch

When a user tabs to a single-action list, a focus indicator appears. The focused list item can be activated via `Space` or `Enter`.

## Focus Behavior

### Single-Action Lists

- The first element in a list should receive focus by default
- If the list has a selected element, focus goes to the selected item instead
- After an element is focused, navigate within the list using arrow keys
- All list items must be activatable using `Space` or `Enter`

### Multi-Action Lists

Multi-action list items contain a primary action and at least one supplementary action. The list item as a whole isn't selectable; only individual actions are.

Keyboard navigation for multi-action lists:

1. `Tab` to the list item focuses the first element
2. Move between focusable elements using `Up`, `Down`, `Left`, and `Right` arrow keys
3. Activate a focused element using `Space` or `Enter`

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus to the first list item, last list item, or outside the list component |
| `Down` / `Right` | Move to the next element; wraps to top if at end |
| `Up` / `Left` | Move to the previous element; wraps to bottom if at start |
| `Space` / `Enter` | Select a list item |

## Labeling Elements

Accessibility labels are used with assistive devices like screen readers. The accessibility label for a list item is typically the same as the label text and supporting text combined.

## Platform-Specific Implementation

### Single-Select Lists

| Trait | Web | MDC-Android | Jetpack Compose |
|-------|-----|-------------|-----------------|
| **Aria Label** | Container: Describe selection type | Match visible label text | Match visible label text |
| | List item: Match visible label text | | |
| **Role** | Container: `listbox` | `radiobutton` | `radiobutton` |
| | List item: `option` | | |
| **State** | `selected` / not selected | `checked` / not checked | `checked` / not checked |

### Multi-Select Lists

| Trait | Web | MDC-Android | Jetpack Compose |
|-------|-----|-------------|-----------------|
| **Aria Label** | Container: Describe selection type | Match visible label text | Match visible label text |
| | List item: Match visible label text | | |
| **Role** | Container: `listbox` | `checkbox` | `checkbox` |
| | List item: `option` | | |
| **State** | `selected` / not selected | `checked` / not checked | `checked` / not checked |

## Web Implementation Notes

- A list container's accessibility label should describe the type of selection available
- The container role is `listbox`
- List items have role `option`

## Implementation Checklist

- [ ] Focus management for single-action lists
- [ ] Focus management for multi-action lists
- [ ] Keyboard navigation with arrow keys
- [ ] `Space`/`Enter` activation
- [ ] Proper ARIA roles (`listbox`, `option`)
- [ ] ARIA states (`aria-selected`)
- [ ] Multiple visual indicators for selection
- [ ] Touch ripple feedback
- [ ] Hover states
- [ ] Focus indicators
