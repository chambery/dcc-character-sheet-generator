# DCC Character Sheet Generator - AI Coding Agent Instructions

## Project Overview
A TypeScript/Bun app that programmatically fills PDF character sheets for tabletop RPG systems (DCC, Weird Frontiers) with procedurally generated character data. Uses `pdf-lib` to overlay text on blank PDF templates at precise coordinates.

## Architecture

### Core Flow
1. **Entry Point**: `src/main.ts` - CLI that takes class path (e.g., `dcc/gf-4up-dashboard`) and optional level
2. **Generator**: `src/generate.ts` - Orchestrates character generation:
   - Dynamically imports character sheet configs from `src/character_sheets/`
   - Rolls stats using `@randsum/dice` (3d6 for abilities, d100 for occupation, etc.)
   - Sets global `system` variable ('dcc' or 'weird_frontiers') for data lookups
   - Handles sheet offsets for 4-up layouts (4 characters per page)
3. **PDF Processing**: `src/process_pdf.ts` - Renders text on PDFs using custom font (ReenieBeanie.ttf)

### Character Sheet Pattern
Character sheets follow a consistent config pattern in `src/character_sheets/`:

```typescript
export default {
  filename: 'blank_sheet.pdf',    // PDF template in assets/
  system: 'weird_frontiers',       // Determines data paths
  style: { font_size: 12 },       // Default styling
  offset: [{ x: 374, y: 300 }],   // For 4-up layouts
  fields: {
    str: { 
      x: 32, y: 638,                          // Coordinate on PDF
      calc: (scores: Stats) => scores['str'], // Value computation
      style: { size: 22, color: rgb(...) }    // Optional styling
    }
  }
}
```

**Weird Frontiers sheets** use inheritance via `lodash/fp.merge()`:
```typescript
import base from '../index'
export default (() => merge(base, { /* overrides */ }))()
```

### Field Calculation System
Fields support flexible value computation:
- `calc`: Function that takes `Stats` and optional dice notation, returns display value
- `dice`: Function that takes level and returns dice notation (e.g., `'1d8'`)
- Coordinates (`x`, `y`) can be functions for dynamic positioning
- `style` can be a function returning `DrawTextStyle` for conditional formatting

### Global System Context
Uses `globalThis.system` to dynamically load system-specific data:
```typescript
const resolvedPath = path.resolve('src/data/' + system + '/occupations.ts')
```
Data modules in `src/data/{dcc,weird_frontiers}/` provide lookup tables.

## Key Utilities (`src/utils/`)
- `ability_modifier()`: D&D-style stat modifiers
- `hp()`, `damage()`: Dice rolling with stat modifiers
- `occupation()`, `birth_augur()`: Dynamic data lookups using global `system`
- `decorate()`: Adds prefixes ('+' for positive modifiers)
- `curve_text()`: Renders text along bezier curves for artistic layouts
- `shrink_text()`: Adaptive font sizing

## Development Workflows

### Running the Generator
```bash
bun src/main.ts <class-path> [level]
# Examples:
bun src/main.ts weird_frontiers/calavera 1
bun src/main.ts dcc/gf-4up-dashboard 0
```
Output: `out/<class-name>.pdf`

### Watch Mode
```bash
bun watcher.ts bun src/main.ts <class-path>
```
Regenerates PDF on any file change (ignores `out/` directory).

### Coordinate Designer Tool
Open `designer.html` in browser to overlay coordinate grid on PDF for finding field positions. Click to get lower-left corner coordinates.

## Project-Specific Conventions

### 4-Up Sheet Offsets
Many DCC funnel sheets have 4 characters per page. Provide **one** offset to duplicate with reflection:
```typescript
offset: [{ x: 374, y: 300 }]  // Generates: [{x:0,y:300}, {x:374,y:0}, {x:374,y:300}, {x:0,y:0}]
```
Or provide all three explicitly if asymmetric.

### Font Requirements
Google Fonts must be from GitHub repo (not fonts.google.com) due to `pdf-lib` embedding requirements:
```
https://github.com/google/fonts/blob/.../ReenieBeanie.ttf
```

### System-Specific Data
When adding new systems, create parallel directory structure:
- `src/data/<system>/` - Lookup tables
- `src/character_sheets/<system>/` - Sheet configs
Ensure `system` field matches directory name exactly.

### Async Field Calculations
Use `async` for data lookups (`occupation()`, `birth_augur()`) as they dynamically import:
```typescript
calc: async (scores: Stats) => await occupation(scores)
```

## Adding New Character Sheets

1. Place blank PDF in `assets/`
2. Use `designer.html` to find field coordinates
3. Create config in `src/character_sheets/<system>/<class>/`
4. For Weird Frontiers, extend `src/character_sheets/weird_frontiers/index.ts` base
5. Run generator: `bun src/main.ts <system>/<class> <level>`

## Dependencies
- **pdf-lib**: PDF manipulation and text rendering
- **@randsum/dice**: Dice rolling (D6, D20, D100, roll notation parser)
- **dayjs**: Timestamp generation (not currently used)
- **lodash/fp**: Functional utilities, especially `merge()` for config inheritance
