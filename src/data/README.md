# Violet Room Overlays Documentation

## Overview
The `violetRoomOverlays.json` file contains atmospheric text content for the Violet Room experience, providing cyber-mystical overlay text that bridges the digital and spiritual realms.

## Structure

### Meta Information
- `_meta.description`: Purpose and context of the overlay content
- `_meta.version`: Semantic version for tracking changes
- `_meta.lastUpdated`: Date of last content update
- `_meta.usage`: Detailed usage context and purpose

### Overlay Objects
Each overlay contains:
- `id`: Unique, descriptive identifier (snake_case)
- `category`: Functional category for grouping and filtering
- `text`: The actual overlay content
- `metadata`: Additional properties for implementation

## Categories

- **entrance**: Entry point and welcome content
- **communication**: Network and connection-related text
- **navigation**: Movement and pathway content  
- **access**: Authentication and permission content
- **interaction**: User interface and input content
- **storage**: Data and memory-related content
- **reflection**: Contemplative and meditative content
- **transition**: Boundary and state-change content

## Metadata Properties

- `tone`: Emotional/atmospheric quality (mystical, ethereal, atmospheric, etc.)
- `placement`: Suggested UI placement context
- `duration`: Recommended display duration (short, medium, long)

## Usage Example

```typescript
import overlayData from './data/violetRoomOverlays.json';

// Get all overlays
const allOverlays = overlayData.overlays;

// Filter by category
const entranceOverlays = allOverlays.filter(o => o.category === 'entrance');

// Get specific overlay by ID
const specificOverlay = allOverlays.find(o => o.id === 'cathedral_static');

// Access metadata
const tone = specificOverlay?.metadata.tone; // "mystical"
```

## Design Principles

1. **Atmospheric**: Content maintains a cyber-mystical aesthetic
2. **Poetic**: Language is elevated and evocative
3. **Thematic**: Consistent spiritual/digital duality
4. **Flexible**: Structure supports various implementation needs
5. **Descriptive**: IDs and categories facilitate easy integration

## Content Guidelines

- Maintain the cyber-mystical theme
- Use vivid, evocative imagery
- Balance technical and spiritual metaphors
- Keep text concise but impactful
- Ensure accessibility and clarity