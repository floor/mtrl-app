# Placeholders Feature

The placeholders feature generates temporary items to display while real data is loading. It analyzes data structure patterns to create realistic placeholders that match your content format.

## Overview

The placeholders feature provides:

- **Intelligent placeholder generation** based on data structure analysis
- **Pattern recognition** for different field types (text, numbers, dates, etc.)
- **Configurable masking** with random variations
- **Seamless replacement** when real data arrives
- **Memory-efficient** placeholder recycling

## Architecture

### Data Structure Analysis

The feature analyzes real data to understand content patterns:

```typescript
interface FieldStructure {
  type: "string" | "number" | "boolean" | "date" | "object" | "array";
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  subStructure?: Record<string, FieldStructure>;
}

// Analysis process
const analyzeDataStructure = (items: any[]) => {
  const sampleSize = Math.min(items.length, MAX_SAMPLE_SIZE);
  const sample = items.slice(0, sampleSize);

  // Analyze each field in the sample
  fieldStructures = analyzeFields(sample);
  hasAnalyzed = true;
};
```

### Placeholder Generation

Based on the analysis, placeholders are generated:

```typescript
const generatePlaceholderItem = (index: number): any => {
  if (!fieldStructures) {
    return { id: index, name: "XXXXXXXXXX", _placeholder: true };
  }

  const placeholder: any = { _placeholder: true };

  for (const [field, structure] of Object.entries(fieldStructures)) {
    placeholder[field] = generateFieldValue(structure);
  }

  return placeholder;
};
```

### Field Value Generation

Different strategies for different field types:

```typescript
const generateFieldValue = (structure: FieldStructure): any => {
  switch (structure.type) {
    case "string":
      return generateMaskedString(structure.minLength, structure.maxLength);
    case "number":
      return generateMaskedNumber(structure.pattern);
    case "date":
      return "XXXX-XX-XX";
    case "boolean":
      return false;
    case "object":
      return generateNestedPlaceholder(structure.subStructure);
    default:
      return "XXXXXXXXXX";
  }
};
```

## Integration Flow

### 1. Initial Display

When viewport initializes with no data:

```typescript
// Show initial placeholders
const initialRange = {
  start: 0,
  end: Math.min(PLACEHOLDER_COUNT, totalItems - 1),
};
showPlaceholders(initialRange);
```

### 2. Structure Learning

On first data load:

```typescript
component.on?.("viewport:range-loaded", (data) => {
  if (!hasAnalyzed && data.items?.length > 0) {
    analyzeDataStructure(data.items);
  }
  replacePlaceholders(data.items, data.offset);
});
```

### 3. Placeholder Replacement

When real data arrives:

```typescript
const replacePlaceholders = (items: any[], offset: number) => {
  let replacedCount = 0;

  for (let i = 0; i < items.length; i++) {
    const index = offset + i;
    const currentItem = component.items[index];

    if (isPlaceholder(currentItem)) {
      component.items[index] = items[i];
      replacedCount++;
    }
  }

  if (replacedCount > 0) {
    component.emit?.("viewport:placeholders-replaced", {
      offset,
      count: replacedCount,
    });
  }
};
```

## Configuration

### Constants

```typescript
PLACEHOLDER: {
  MASK_CHARACTER: "X",              // Character for masked content
  CSS_CLASS: "viewport-item__placeholder",
  MIN_SAMPLE_SIZE: 5,               // Min items to analyze
  MAX_SAMPLE_SIZE: 20,              // Max items to analyze
  PLACEHOLDER_FLAG: "_placeholder", // Property marking placeholders
  RANDOM_LENGTH_VARIANCE: true,     // Vary placeholder lengths
  PATTERN_ANALYSIS: {
    SAMPLE_SIZE: 50                 // Items to analyze for patterns
  }
}
```

### Options

```typescript
interface PlaceholderConfig {
  enabled?: boolean; // Enable placeholders (default: true)
  analyzeFirstLoad?: boolean; // Learn from first data (default: true)
  maskCharacter?: string; // Character for masking (default: "X")
  randomVariance?: boolean; // Add length variations (default: true)
  cssClass?: string; // CSS class for styling
}
```

## API

### Methods

#### `analyzeDataStructure(items: any[])`

Analyzes item structure for intelligent placeholder generation.

#### `generatePlaceholderItem(index: number): any`

Creates a single placeholder item.

#### `generatePlaceholderItems(range: ItemRange): any[]`

Creates multiple placeholder items for a range.

#### `showPlaceholders(range: ItemRange)`

Displays placeholders for a specific range.

#### `isPlaceholder(item: any): boolean`

Checks if an item is a placeholder.

#### `replacePlaceholders(items: any[], offset: number)`

Replaces placeholders with real data.

#### `clear()`

Clears all placeholder state and learned patterns.

### Events

#### Emits

- `viewport:placeholders-shown` - When placeholders are displayed
- `viewport:placeholders-replaced` - When placeholders are replaced

## Pattern Recognition

### String Fields

```typescript
// Analyzes string patterns
{
  type: "string",
  minLength: 5,
  maxLength: 50,
  pattern: "text"  // or "email", "url", "phone"
}

// Generates realistic masks
"John Doe" → "XXXX XXX"
"user@example.com" → "XXXX@XXXXXXX.XXX"
```

### Number Fields

```typescript
// Analyzes number patterns
{
  type: "number",
  minLength: 3,
  maxLength: 5,
  pattern: "currency"  // or "integer", "decimal"
}

// Generates appropriate masks
123.45 → "XXX.XX"
1000 → "XXXX"
```

### Complex Objects

```typescript
// Recursively analyzes nested structures
{
  user: {
    name: "XXXX XXXXX",
    email: "XXXX@XXXXXX.XXX",
    age: "XX"
  },
  timestamp: "XXXX-XX-XX"
}
```

## Styling

Placeholders have a special CSS class for styling:

```scss
.viewport-item__placeholder {
  opacity: 0.6;

  // Animated loading effect
  @keyframes placeholder-shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.1) 25%,
    rgba(0, 0, 0, 0.05) 50%,
    rgba(0, 0, 0, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: placeholder-shimmer 1.5s infinite;
}
```

## Performance Considerations

1. **Analysis Caching** - Structure analysis happens only once
2. **Placeholder Recycling** - Reuses placeholder objects
3. **Lazy Generation** - Creates placeholders only when needed
4. **Memory Efficient** - Minimal overhead per placeholder

## Troubleshooting

### Placeholders Not Showing

- Check if `enabled` option is true
- Verify total items count is set
- Ensure viewport is initialized

### Placeholders Not Replaced

- Verify `collection:range-loaded` event is fired
- Check if real data has `_placeholder: true` property
- Ensure rendering feature is updating DOM
- See [Collection Feature](./collection.md) troubleshooting

### Poor Placeholder Quality

- Increase sample size for better analysis
- Ensure first data load has representative items
- Check if data structure is consistent

### Performance Issues

- Reduce placeholder count
- Disable random variance
- Use simpler mask patterns
