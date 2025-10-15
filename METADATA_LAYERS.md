# The Three Layers of Semantic Metadata

Quick reference for how metadata is generated in every component.

## 🎯 Overview

```
PatternFly Props → Layer 1 (Inference) → Layer 2 (Role) → Layer 3 (Metadata) → DOM
```

## Layer 1: Auto-Inference

**Input:** PatternFly props you're already using
**Output:** Semantic properties (`action`, `context`, `purpose`, etc.)

### Button Example

```typescript
// Code location: src/components/core/Button.tsx lines 26-30

const inferredAction = action || (
  variant === 'primary' ? 'primary' : 
  variant === 'danger' ? 'destructive' : 
  variant === 'link' ? 'navigation' : 
  'secondary'
);

const inferredContext = context || (onClick ? 'interactive' : 'form');
```

**What it does:**
- Looks at `variant` prop → determines `action`
- Looks at `onClick` prop → determines `context`
- User can override by providing explicit `action` or `context` props

### Other Components

| Component | Infers From | Infers To |
|-----------|------------|-----------|
| **TextInput** | `type="email"` | `purpose="email-input"` |
| **TextInput** | `type="password"` | `purpose="password-input"` |
| **Select** | `variant="typeahead"` | `selectionType="typeahead"` |
| **Card** | `isClickable={true}` | `purpose="action-panel"` |
| **Switch** | (default) | `purpose="setting"` |
| **Radio** | `name="theme"` | `groupContext="theme"` |

## Layer 2: Semantic Role

**Input:** Inferred semantic properties
**Output:** Unique identifier string

### Pattern

```typescript
// Code location: src/components/core/Button.tsx line 33

const role = semanticRole || `button-${inferredAction}-${inferredContext}`;
```

**Format:** `{component}-{semantic-prop-1}-{semantic-prop-2}`

### Examples

| Component | Inferred Props | Semantic Role |
|-----------|---------------|---------------|
| Button | action: "primary", context: "form" | `"button-primary-form"` |
| Button | action: "destructive", context: "modal" | `"button-destructive-modal"` |
| TextInput | purpose: "email-input", context: "form" | `"textinput-email-input-form"` |
| Card | purpose: "data-summary", contentType: "data" | `"card-data-summary-data"` |
| Switch | purpose: "setting", context: "settings" | `"switch-setting-settings"` |

### Why This Matters

The semantic role is a **stable, predictable identifier** that AI tools can use to:
- Group similar components together
- Suggest patterns based on role
- Generate tests for specific roles
- Find all instances of a specific button type

## Layer 3: AI Metadata

**Input:** Inferred semantic properties + component type
**Output:** Rich JSON object

### Structure

```typescript
// Code location: src/components/core/Button.tsx lines 34-39

const metadata = aiMetadata || {
  description: `${inferredAction} action button for ${inferredContext} context`,
  category: 'forms',
  complexity: 'simple',
  usage: [`${inferredContext}-${inferredAction}`, 'user-interaction']
};
```

### Metadata Fields

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `description` | string | Natural language description | "destructive action button for interactive context" |
| `category` | string | Component category | "forms", "navigation", "data-display" |
| `complexity` | enum | How complex to use | "simple", "moderate", "complex" |
| `usage` | string[] | Usage patterns | ["form-submission", "user-interaction"] |
| `accessibility` | string[] | A11y features | ["keyboard-navigable", "screen-reader-friendly"] |

### Per-Component Metadata

#### Button
```json
{
  "description": "destructive action button for interactive context",
  "category": "forms",
  "complexity": "simple",
  "usage": ["interactive-destructive", "user-interaction"]
}
```

#### TextInput
```json
{
  "description": "email-input for form context",
  "category": "forms",
  "complexity": "simple",
  "usage": ["data-entry", "form-input", "user-interaction"]
}
```

#### Card
```json
{
  "description": "action-panel card containing interactive content",
  "category": "data-display",
  "complexity": "moderate",
  "usage": ["action-panel-display", "content-organization"]
}
```

#### Modal
```json
{
  "description": "confirmation modal with blocking interaction",
  "category": "overlay",
  "complexity": "complex",
  "usage": ["user-interaction", "workflow-step", "confirmation"]
}
```

## 🔄 Complete Flow Diagram

```
User Code:
  <Button variant="danger" onClick={handleDelete}>Delete</Button>

↓ Component receives props

Layer 1: Auto-Inference
  variant="danger" → inferredAction = "destructive"
  onClick exists   → inferredContext = "interactive"

↓ Generate identifier

Layer 2: Semantic Role
  semanticRole = "button-destructive-interactive"

↓ Generate metadata

Layer 3: AI Metadata
  {
    description: "destructive action button for interactive context",
    category: "forms",
    complexity: "simple",
    usage: ["interactive-destructive", "user-interaction"]
  }

↓ Attach to DOM

Final Output:
  <button 
    class="pf-c-button pf-m-danger"
    data-semantic-name="Button"
    data-semantic-role="button-destructive-interactive"
    data-ai-metadata='{"description":"...","category":"forms",...}'
    data-action="destructive"
    data-context="interactive"
  >
    Delete
  </button>
```

## 🎛️ Override Levels

### Level 1: Full Auto (Default)
```tsx
<Button variant="danger" onClick={handleDelete}>
  Delete
</Button>
// Everything inferred automatically
```

### Level 2: Partial Override
```tsx
<Button 
  variant="danger"
  onClick={handleDelete}
  action="destructive"  // Override action
  context="modal"       // Override context
>
  Delete
</Button>
// Role and metadata auto-generated from overrides
```

### Level 3: Role Override
```tsx
<Button 
  variant="danger"
  onClick={handleDelete}
  semanticRole="delete-user-button"  // Override role
>
  Delete
</Button>
// Metadata still auto-generated
```

### Level 4: Full Control
```tsx
<Button 
  variant="danger"
  onClick={handleDelete}
  action="destructive"
  context="modal"
  semanticRole="delete-user-confirmation-button"
  aiMetadata={{
    description: "Permanently deletes the selected user",
    category: "admin-actions",
    complexity: "moderate",
    usage: ["user-management", "data-deletion"]
  }}
>
  Delete
</Button>
// Everything explicitly provided
```

## 📍 Code Locations

All inference logic lives in:
- **`src/utils/inference.ts`** - Shared inference functions
- **Each component file** - Component-specific inference (lines 25-40 typically)

All type definitions in:
- **`src/types/index.ts`** - SemanticComponentProps interface

## 🤖 How AI Consumes This

When an AI tool reads your code, it sees:

### In JSX (Source Code)
```tsx
<Button variant="danger" onClick={handleDelete}>Delete</Button>
```

### In DOM (Runtime)
```html
<button 
  data-semantic-role="button-destructive-interactive"
  data-ai-metadata='{"description":"destructive action button..."}'
>
  Delete
</button>
```

### AI Understanding
```
Component: Button
Purpose: Destructive action (delete/remove)
Context: Interactive (user-triggered)
Category: Form control
Complexity: Simple
Patterns: ["interactive-destructive", "user-interaction"]
```

### AI Suggestions
- "Add confirmation dialog for destructive actions"
- "Consider adding loading state"
- "Check user permissions before allowing delete"
- "Add error handling for failed deletions"
- "Consider making this action reversible"

---

**Last Updated:** Build successful - all 17 components following this pattern

