# Lists Development Environment

This directory contains the development environment for both the current mtrl list system and the new mtrl-addons collection system.

## Showcase Components

### Current System (mtrl)

- **`list.js`** - Main list component with 100k entries, debugging, and performance monitoring
- **`basic.js`** - Basic list examples
- **`cursor.js`** - Cursor-based pagination
- **`users.js`** - User list examples
- **`pagination.js`** - Pagination examples
- **`collection-events.js`** - Event handling demos
- **`debug-navigation.js`** - Navigation debugging
- **`virtual-positioning-test.js`** - Virtual scrolling tests

### New System (mtrl-addons)

- **`collection-addons.js`** - New collection system showcase with same functionality as `list.js`

## Development Workflow

### Access the Showcase

1. Start the mtrl-app server: `http://localhost:4000/components/lists`
2. Both systems will be displayed side-by-side for comparison

### Feature Comparison

Both showcases provide identical features:

- **100k entries** - Performance testing with large datasets
- **Page navigation** - Jump to specific pages using chips or input
- **Index jumping** - Scroll to specific indices using slider
- **Animation toggle** - Enable/disable smooth scrolling
- **Performance monitoring** - Track renders, scrolls, and timing
- **Debug panels** - Real-time state monitoring
- **API integration** - Uses `/api/users` endpoint

### Development Process

1. **Reference Implementation** - The current `list.js` remains as reference
2. **New Implementation** - `collection-addons.js` uses the new mtrl-addons system
3. **API Compatibility** - Both systems use the same API surface
4. **Performance Testing** - Side-by-side comparison of performance metrics

### Implementation Status

- ✅ **Showcase Environment** - Ready for development
- ⏳ **Collection System** - Placeholder implementation ready for replacement
- 🔄 **Real Implementation** - TODO: Replace placeholder with actual collection system

### Next Steps

1. Implement the core collection system in `mtrl-addons/src/core/collection/`
2. Replace the placeholder in `collection-addons.js` with real implementation
3. Compare performance metrics between old and new systems
4. Test with real API data and edge cases

## Debugging

- **Console Logging** - All actions logged with `[COLLECTION-ADDONS]` prefix
- **Performance Metrics** - Click "Show Performance Metrics" button
- **Debug Panel** - Real-time state monitoring in the UI
- **Side-by-Side Comparison** - Both systems visible for direct comparison

## Testing

- **Real API Data** - Uses actual `/api/users` endpoint
- **Large Datasets** - 100k entries for performance testing
- **User Interactions** - All controls and interactions work
- **Edge Cases** - Empty states, loading states, errors handled
