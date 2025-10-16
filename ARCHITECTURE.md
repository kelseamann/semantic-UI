# Semantic UI Layer - Architecture

## File Structure

```
semantic-ui-layer/
├── src/
│   ├── index.ts                          # Main entry point
│   ├── types/index.ts                    # Core type definitions
│   ├── context/SemanticContext.tsx       # Hierarchy tracking
│   ├── utils/
│   │   ├── inference.ts                  # All inference logic (DRY source)
│   │   ├── metadata.ts                   # Metadata utilities
│   │   └── accessibility.ts              # Accessibility helpers
│   ├── hooks/
│   │   ├── useSemanticMetadata.ts        # Metadata hook
│   │   └── useAccessibility.ts           # A11y hook
│   └── components/
│       ├── core/                         # Core UI components
│       │   ├── Button.tsx
│       │   ├── Link.tsx
│       │   └── StarIcon.tsx
│       ├── forms/                        # Form components
│       │   ├── Checkbox.tsx
│       │   ├── TextInput.tsx
│       │   ├── TextArea.tsx
│       │   ├── Select.tsx
│       │   ├── Radio.tsx
│       │   └── Switch.tsx
│       ├── data-display/                 # Data display components
│       │   ├── Card.tsx
│       │   ├── StatusBadge.tsx
│       │   ├── Tbody.tsx
│       │   ├── Thead.tsx
│       │   ├── Tr.tsx
│       │   ├── Th.tsx
│       │   └── Td.tsx
│       ├── layout/                       # Layout components
│       │   ├── Flex.tsx
│       │   └── FlexItem.tsx
│       ├── overlay/                      # Overlay components
│       │   └── Modal.tsx
│       └── navigation/                   # Navigation components
│           ├── MenuToggle.tsx
│           └── DropdownItem.tsx
```

---

## Core Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER APPLICATION                                │
│                                                                           │
│  <SemanticProvider>  ← Wraps app to enable hierarchy tracking           │
│    <Modal>           ← Adds "Modal" to context stack                    │
│      <Form>          ← Adds "Form" to context stack                     │
│        <Button />    ← Uses context to get hierarchy                    │
│      </Form>         ← Removes "Form" from stack                        │
│    </Modal>          ← Removes "Modal" from stack                       │
│  </SemanticProvider>                                                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SEMANTIC COMPONENT                               │
│                      (e.g., Button.tsx, Link.tsx)                       │
│                                                                           │
│  1. Receive props (variant, onClick, children, etc.)                    │
│  2. Try to get hierarchy from SemanticContext                           │
│  3. Call inference functions for semantic properties                    │
│  4. Build structured metadata                                            │
│  5. Render PatternFly component with data-* attributes                  │
└─────────────────────────────────────────────────────────────────────────┘
                 │                         │                     │
                 │                         │                     │
                 ▼                         ▼                     ▼
    ┌──────────────────┐    ┌──────────────────────┐   ┌──────────────┐
    │ SemanticContext  │    │ utils/inference.ts   │   │ types/index  │
    │                  │    │                      │   │              │
    │ getHierarchy()   │    │ inferButtonAction()  │   │ Hierarchy    │
    │ addContext()     │    │ inferContext()       │   │ Metadata     │
    │ removeContext()  │    │ inferCardPurpose()   │   │ Action       │
    │ clearContext()   │    │ inferInputPurpose()  │   │ Metadata     │
    └──────────────────┘    │ inferSelectPurpose() │   │ Semantic     │
                             │ ...20+ functions     │   │ Props        │
                             └──────────────────────┘   └──────────────┘
                                       │
                                       │ (DRY principle)
                                       │ Single source of truth
                                       ▼
                             ┌──────────────────────┐
                             │   All Components     │
                             │   Import From Here   │
                             └──────────────────────┘
```

---

## Data Flow: Component Rendering

```
Component Render
    │
    ├─► 1. Get Hierarchy (optional)
    │       │
    │       └─► useSemanticContext().getHierarchy()
    │           Returns: { parents: string[], depth: number, path: string }
    │
    ├─► 2. Infer Semantic Properties
    │       │
    │       ├─► inferButtonAction(variant, href, onClick, target) → { type: "action", variant: "primary" }
    │       ├─► inferContext({ onClick, isDisabled, ... }) → "active" | "disabled" | ...
    │       └─► inferCategory('Button') → "button"
    │
    ├─► 3. Build Metadata Object
    │       │
    │       └─► {
    │             description: string,
    │             category: string,
    │             hierarchy: HierarchyMetadata,
    │             action: ActionMetadata { 
    │               type,           // What it DOES
    │               variant,        // How it LOOKS
    │               target, 
    │               consequence, 
    │               affectsParent 
    │             }
    │           }
    │
    └─► 4. Render with Data Attributes
            │
                └─► <PatternFly Component
                  data-semantic-name="Button"
                  data-semantic-path="Modal > Form > Button"
                  data-semantic-hierarchy='["Modal", "Form"]'
                  data-hierarchy-depth="2"
                  data-semantic-role="button-action-active"
                  data-category="button"
                  data-description="action action button (primary style) for active context"
                  data-action-type="action"
                  data-action-variant="primary"
                  data-target="user-record"
                  data-consequence="safe"
                  data-affects-parent="false"
                  data-context="active"
                />
```

---

## Key Type Definitions

### `src/types/index.ts`

```typescript
HierarchyMetadata {
  parents: string[]      // ["Modal", "Form"]
  depth: number          // 2
  path: string           // "Modal > Form"
}

ActionMetadata {
  type: string           // "action", "navigation", "external" (what it DOES)
  variant: string        // "primary", "destructive", "secondary" (how it LOOKS)
  target?: string        // "user-record", "parent-modal"
  consequence?: string   // "destructive-permanent", "safe"
  affectsParent?: boolean // true if closes/dismisses parent
}

SemanticComponentProps {
  semanticName?: string
  semanticRole?: string
  target?: string        // What the component affects
  aiMetadata?: {
    description, category, complexity,
    accessibility, usage,
    hierarchy: HierarchyMetadata,
    action: ActionMetadata
  }
}
```

---

## Inference System (DRY)

### `src/utils/inference.ts` - Single Source of Truth

All components import inference logic from this file:

```typescript
// Button inference
inferButtonAction(variant, href, onClick, target) → { type: string, variant: string }
inferContext(props) → string
inferCategory(componentName) → string

// Card inference
inferCardPurpose(isClickable, isCompact, children) → string
inferCardContentType(children) → string

// Form inference
inferInputPurpose(type, name, id) → string
inferSelectPurpose(isCreatable, isMulti) → string
inferRadioPurpose(props) → string
inferSwitchPurpose(label, isReversed) → string
inferCheckboxPurpose(props) → string
inferTextAreaPurpose(rows, placeholder) → string

// Modal inference
inferModalPurpose(variant, title) → string
inferModalInteractionType(hasForm, title) → string

// Link inference
inferLinkPurpose(href, children) → string

// Status inference
inferStatusBadgeType(status) → string
inferStatusBadgePurpose(isRead) → string

// Context inference
inferFormContext(props) → string
inferValidationContext(validated, isInvalid, isValid) → string
inferSettingsContext(props) → string


// Category inference
inferCategory(componentType) → "forms" | "navigation" | "overlay" | ...
```

**Benefits:**
- ✅ No duplicated logic
- ✅ Consistent inference across all components
- ✅ Single place to update inference rules
- ✅ Easily testable
- ✅ Type-safe

---

## SemanticContext System

### `src/context/SemanticContext.tsx`

Manages hierarchical component relationships:

```typescript
SemanticProvider
    │
    ├─ State: contextStack: string[]
    │
    └─ Methods:
        ├─ addContext(name: string)        // Push to stack
        ├─ removeContext()                 // Pop from stack
        ├─ clearContext()                  // Reset stack
        └─ getHierarchy(): HierarchyData   // Get current hierarchy
                │
                └─ Returns:
                    {
                      parents: [...contextStack],
                      depth: contextStack.length,
                      path: contextStack.join(' > ')
                    }
```

**Usage Pattern:**

```typescript
// In Modal component
React.useEffect(() => {
  addContext('Modal');
  return () => removeContext();
}, []);

// In Button component
const hierarchy = getHierarchy();
// If contextStack = ['Modal', 'Form']:
// hierarchy = { parents: ['Modal', 'Form'], depth: 2, path: 'Modal > Form' }
```

---

## Component Data Attributes

All components render with structured, queryable data attributes:

```html
<button
  data-semantic-name="Button"
  data-semantic-path="Modal > Form > Button"
  data-semantic-hierarchy='["Modal", "Form"]'
  data-hierarchy-depth="2"
  data-semantic-role="button-action-active"
  data-category="button"
  data-description="action action button (destructive style) for active context"
  data-action-type="action"
  data-action-variant="destructive"
  data-target="user-record"
  data-consequence="destructive-permanent"
  data-affects-parent="false"
  data-context="active"
>
  Delete
</button>
```

### Why Individual Attributes?

Each piece of metadata is a separate, queryable attribute:

```javascript
// Find all destructive actions
document.querySelectorAll('[data-consequence="destructive-permanent"]')

// Find buttons that affect their parent (close modals, dismiss forms)
document.querySelectorAll('[data-affects-parent="true"]')

// Find deeply nested components
document.querySelectorAll('[data-hierarchy-depth="3"]')

// Find all buttons by category
document.querySelectorAll('[data-category="button"]')

// Find navigation actions
document.querySelectorAll('[data-action-type="navigation"]')
```

---

## How AI Understands Components

### Without Structured Metadata:
```html
<button>Delete</button>
```
```
❌ "A button that deletes something, but where? What context? What consequences?"
```

### With Individual Queryable Attributes:
```html
<button 
  data-semantic-path="Modal > Form > Button"
  data-hierarchy-depth="2"
  data-action-type="action"
  data-action-variant="destructive"
  data-target="user-record"
  data-consequence="destructive-permanent"
  data-affects-parent="false"
  data-context="active"
>
  Delete
</button>
```
```
✅ "This is a destructive action Button" (data-action-variant)
✅ "It's INSIDE a Modal and Form at depth 2" (data-semantic-path, data-hierarchy-depth)
✅ "It deletes user-record" (data-target)
✅ "It does NOT close the parent modal" (data-affects-parent: false)
✅ "It's in an active state" (data-context)
✅ "It's a destructive-permanent action" (data-consequence)
✅ "All attributes are queryable via CSS selectors"
```

---

## Component Implementation Pattern

Every component follows this pattern:

```typescript
import { useSemanticContext } from '../../context/SemanticContext';
import { inferX, inferY } from '../../utils/inference';
import { SemanticComponentProps } from '../../types';

export const Component = ({ 
  semanticName, semanticRole, aiMetadata, target, 
  ...props 
}) => {
  // 1. Get hierarchy (optional - graceful fallback)
  let hierarchy;
  try {
    const semanticContext = useSemanticContext();
    hierarchy = semanticContext.getHierarchy();
  } catch {
    hierarchy = { parents: [], depth: 0, path: '' };
  }

  // 2. Infer semantic properties using DRY utilities
  const inferredAction = action || inferX(props);
  const inferredContext = context || inferY(props);
  
  // 3. Build metadata with hierarchy + action
  const metadata = aiMetadata || {
    description: `${inferredAction} for ${inferredContext}`,
    category: 'forms',
    complexity: 'simple',
    hierarchy,
    action: {
      type: inferredAction,
      target: target || 'default',
      consequence: inferredAction === 'destructive' ? 'destructive-permanent' : 'safe',
      affectsParent: target === 'parent-modal' || target === 'parent-form'
    }
  };

  // 4. Render with structured data attributes
  return (
    <PatternFlyComponent
      {...props}
      data-semantic-name={semanticName || 'Component'}
      data-semantic-path={hierarchy.path ? `${hierarchy.path} > ${semanticName}` : semanticName}
      data-semantic-hierarchy={JSON.stringify(hierarchy.parents)}
      data-semantic-role={semanticRole}
      data-ai-metadata={JSON.stringify(metadata)}
      data-action={inferredAction}
      data-target={target || 'default'}
      data-context={inferredContext}
    />
  );
};
```

---

## Export Structure

### `src/index.ts`

```typescript
// Types
export * from './types';

// Context
export { SemanticProvider, useSemanticContext } from './context/SemanticContext';

// Components (organized by category)
export * from './components/core';
export * from './components/forms';
export * from './components/data-display';
export * from './components/layout';
export * from './components/overlay';
export * from './components/navigation';

// Utilities
export * from './utils';

// Hooks
export * from './hooks';
```

---

## Summary

| Layer | Location | Purpose |
|-------|----------|---------|
| **Types** | `src/types/` | TypeScript interfaces |
| **Context** | `src/context/` | Hierarchy tracking |
| **Inference** | `src/utils/inference.ts` | DRY semantic inference (single source) |
| **Components** | `src/components/` | PatternFly wrappers with metadata |
| **Hooks** | `src/hooks/` | Reusable React hooks |
| **Utils** | `src/utils/` | Helper functions |

**Key Principle**: All inference logic lives in `utils/inference.ts` (DRY), and all components import from it.

**Data Flow**: Props → Inference → Hierarchy → Metadata → Data Attributes → AI Consumption

