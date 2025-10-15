# Semantic UI Layer

A standalone React library that wraps PatternFly design system components with semantic meaning and additional metadata for AI tooling like Cursor.

## Overview

Semantic UI Layer enhances PatternFly components by adding:

- **Semantic Role Identification**: Each component has a clear semantic purpose that AI tools can understand
- **AI Metadata**: Rich metadata including descriptions, complexity levels, and usage patterns
- **Context Awareness**: Components understand their usage context and adapt accordingly
- **AI-Friendly Documentation**: Structured data that helps AI tools provide better suggestions
- **Validation Utilities**: Tools to help developers identify when they're using native HTML elements instead of semantic components

## Features

### 🎯 Semantic Components
- `Button` - Buttons with action context (primary, secondary, destructive, etc.)
- `Card` - Cards with content purpose (data-display, action-panel, etc.)
- `Modal` - Modals with interaction type (confirmation, form, workflow, etc.)
- `Flex` / `FlexItem` - Layout components with semantic purpose
- `Th`, `Td`, `Tr`, `Thead`, `Tbody` - Table components with data context
- `Checkbox`, `Link`, `StatusBadge`, `StarIcon` - Form and UI components

### 🤖 AI Metadata
Each component includes structured metadata:
```typescript
{
  description: "Primary action button for form context",
  category: "forms",
  complexity: "simple",
  accessibility: ["keyboard-navigable", "screen-reader-friendly"],
  usage: ["form-submission", "user-interaction"]
}
```

### 🔍 Validation Utilities
- `runSemanticValidation()` - Validates DOM for native HTML elements that should use semantic components
- `clearValidationHighlights()` - Removes validation highlights from elements
- `highlightValidationWarnings()` - Highlights elements with validation warnings
- `logValidationResults()` - Logs validation results to console

### 🔧 Developer Experience
- TypeScript support with full type safety
- Comprehensive prop interfaces
- Built-in validation and error handling
- Easy customization and extension

## Installation

```bash
npm install semantic-ui-layer
```

## Peer Dependencies

This library requires PatternFly React components:

```bash
npm install @patternfly/react-core @patternfly/react-icons
```

## Usage

### Basic Example

```tsx
import React from 'react';
import { Button, Card, Modal } from 'semantic-ui-layer';

function MyComponent() {
  return (
    <Card purpose="data-summary" contentType="data">
      <h3>User Dashboard</h3>
      <p>Welcome back, John!</p>
      
      <Button 
        action="primary" 
        context="form"
        onClick={() => console.log('Action clicked')}
      >
        Save Changes
      </Button>
    </Card>
  );
}
```

### Advanced Usage with Custom Metadata

```tsx
import { Modal } from 'semantic-ui-layer';

function ConfirmationModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal
      purpose="confirmation"
      interactionType="blocking"
      isOpen={isOpen}
      onClose={onClose}
      aiMetadata={{
        description: "Confirmation dialog for destructive actions",
        complexity: "moderate",
        accessibility: ["keyboard-navigable", "focus-management"],
        usage: ["confirmation", "destructive-action", "workflow-step"]
      }}
    >
      <h2>Delete Item</h2>
      <p>Are you sure you want to delete this item?</p>
      <Button action="destructive" onClick={onConfirm}>
        Delete
      </Button>
      <Button action="secondary" onClick={onClose}>
        Cancel
      </Button>
    </Modal>
  );
}
```

### Using Validation Utilities

```tsx
import { runSemanticValidation, clearValidationHighlights } from 'semantic-ui-layer';

function ValidationExample() {
  const handleValidate = () => {
    const result = runSemanticValidation(true); // true = highlight warnings
    console.log('Validation result:', result);
  };

  const handleClearHighlights = () => {
    clearValidationHighlights();
  };

  return (
    <div>
      <Button onClick={handleValidate}>Validate Semantic Usage</Button>
      <Button onClick={handleClearHighlights}>Clear Highlights</Button>
    </div>
  );
}
```

## How Semantic Metadata Works

Your components use a **three-layer system** to automatically generate rich metadata for AI tooling. Let's break down exactly how it works using the Button component as an example.

### Layer 1: Auto-Inference ✨

The library **automatically infers** semantic properties from PatternFly props you're already using:

```tsx
// You write:
<Button 
  variant="danger"      // PatternFly prop
  onClick={handleDelete} // PatternFly prop
>
  Delete
</Button>

// Library automatically infers:
// action: "destructive"  (from variant="danger")
// context: "interactive" (from presence of onClick)
```

**How it works** (from `Button.tsx` lines 27-28):

```typescript
// Button.tsx imports utilities from single source of truth
import { inferButtonAction, inferContext } from '../../utils/inference';

// Step 1: Infer ACTION from PatternFly's variant prop
const inferredAction = action || inferButtonAction(variant);
// inferButtonAction in utils/inference.ts:
//   case 'danger': return 'destructive';  ✅ Matches!
// Result: inferredAction = "destructive"

// Step 2: Infer CONTEXT from PatternFly props  
const inferredContext = context || inferContext({ onClick, isDisabled, ...props });
// inferContext checks for onClick and returns 'interactive'
// Result: inferredContext = "interactive"
```

**DRY Principle**: All inference logic lives in `utils/inference.ts` - a single source of truth shared by all components. Change it once, affects everywhere!

**You can override auto-inference:**

```tsx
<Button 
  variant="danger"
  onClick={handleDelete}
  action="destructive"    // Explicit override
  context="modal"         // Explicit override
>
  Delete
</Button>
```

### Layer 2: Semantic Role 🎯

The `semanticRole` is a **unique identifier** that describes what the component does and where it's used.

**How it's determined** (from `Button.tsx` line 33):

```typescript
const role = semanticRole || `button-${inferredAction}-${inferredContext}`;
// Result: "button-destructive-interactive"
```

**Pattern**: `{component}-{action}-{context}`

**Examples:**
- `"button-primary-form"` - Primary action button in a form
- `"button-destructive-modal"` - Destructive action in a modal
- `"button-navigation-toolbar"` - Navigation button in a toolbar

**The role appears in the DOM:**

```html
<button data-semantic-role="button-destructive-interactive">
  Delete
</button>
```

**Custom semantic role:**

```tsx
<Button semanticRole="custom-delete-user-button">
  Delete
</Button>
```

### Layer 3: AI Metadata 🤖

The `aiMetadata` object contains **rich structured data** that AI tools can parse and understand.

**How it's determined** (from `Button.tsx` lines 34-39):

```typescript
const metadata = aiMetadata || {
  // Natural language description
  description: `${inferredAction} action button for ${inferredContext} context`,
  // Result: "destructive action button for interactive context"
  
  // Component category
  category: 'forms',
  
  // Complexity level
  complexity: 'simple',
  
  // Usage patterns
  usage: [`${inferredContext}-${inferredAction}`, 'user-interaction']
  // Result: ["interactive-destructive", "user-interaction"]
};
```

**The metadata appears in the DOM as JSON:**

```html
<button 
  data-semantic-role="button-destructive-interactive"
  data-ai-metadata='{"description":"destructive action button for interactive context","category":"forms","complexity":"simple","usage":["interactive-destructive","user-interaction"]}'
  data-action="destructive"
  data-context="interactive"
>
  Delete
</button>
```

**Custom AI metadata:**

```tsx
<Button 
  variant="danger"
  aiMetadata={{
    description: "Permanently deletes the selected user from the database",
    category: "admin-actions",
    complexity: "moderate",
    usage: ["user-management", "data-deletion", "admin-dashboard"]
  }}
>
  Delete User
</Button>
```

### Complete Example: All Three Layers

```tsx
// Minimal usage - library auto-generates everything
<Button variant="danger" onClick={handleDelete}>
  Delete
</Button>

// Resulting metadata:
// semanticRole: "button-destructive-interactive"
// aiMetadata: {
//   description: "destructive action button for interactive context",
//   category: "forms",
//   complexity: "simple",
//   usage: ["interactive-destructive", "user-interaction"]
// }

// Full control - override everything
<Button 
  variant="danger"
  onClick={handleDelete}
  action="destructive"
  context="modal"
  semanticRole="delete-user-confirmation-button"
  aiMetadata={{
    description: "Permanently deletes user after confirmation",
    category: "admin-actions",
    complexity: "moderate",
    usage: ["user-management", "admin-panel"],
    accessibility: ["requires-confirmation", "keyboard-accessible"]
  }}
>
  Delete User
</Button>
```

### What AI Tools See

When AI tools (like Cursor, GitHub Copilot, or ChatGPT) analyze your code, they can:

1. **Read the semantic role** to understand the button's purpose
2. **Parse the AI metadata** to get rich context
3. **Suggest better code** based on usage patterns
4. **Generate tests** that match the component's intent
5. **Find bugs** by comparing intent vs. implementation

**Example AI suggestions:**

```typescript
// AI sees: semanticRole="button-destructive-interactive"
// AI suggests: "This destructive button should have a confirmation dialog"

// AI sees: usage includes "user-management"
// AI suggests: "Add RBAC check before allowing delete"

// AI sees: complexity="moderate"
// AI suggests: "Consider adding loading state and error handling"
```

### Auto-Inference for Other Components

Every component uses similar inference patterns:

**TextInput:**
```tsx
<TextInput type="email" />
// Infers: purpose="email-input", context="form"
```

**Select:**
```tsx
<Select variant="typeahead" />
// Infers: selectionType="typeahead", purpose="data-entry"
```

**Switch:**
```tsx
<Switch label="Enable notifications" />
// Infers: purpose="setting", toggleTarget="feature"
```

**Card:**
```tsx
<Card isClickable>
// Infers: purpose="action-panel", contentType="interactive"
```

## Component API

### Button

```tsx
interface ButtonProps extends Omit<React.ComponentProps<typeof Button>, 'children'>, SemanticComponentProps {
  action?: 'primary' | 'secondary' | 'destructive' | 'navigation' | 'toggle';
  context?: 'form' | 'toolbar' | 'modal' | 'card' | 'navigation' | 'table' | 'alert';
}
```

### Card

```tsx
interface CardProps extends Omit<React.ComponentProps<typeof Card>, 'children'>, SemanticComponentProps {
  purpose?: 'content-display' | 'data-summary' | 'action-panel' | 'information' | 'navigation';
  contentType?: 'text' | 'data' | 'media' | 'mixed' | 'interactive';
}
```

### Modal

```tsx
interface ModalProps extends React.ComponentProps<typeof Modal>, SemanticComponentProps {
  purpose?: 'confirmation' | 'form' | 'information' | 'selection' | 'workflow';
  interactionType?: 'blocking' | 'non-blocking' | 'progressive' | 'multi-step';
}
```

## Development

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd semantic-ui-layer

# Install dependencies
npm install

# Build the library
npm run build

# Run in development mode
npm run dev
```

### Available Scripts

- `npm run build` - Build the library for production
- `npm run dev` - Build in watch mode for development
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
src/
├── components/          # Semantic component wrappers
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── index.ts            # Main export file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Roadmap

- [x] Core semantic components (Button, Card, Modal, Flex, Table components)
- [x] AI metadata system
- [x] Validation utilities for semantic usage
- [ ] Additional PatternFly component wrappers
- [ ] Storybook documentation
- [ ] AI tooling integration examples
- [ ] Performance optimizations
- [ ] Theme customization support

