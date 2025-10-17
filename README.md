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
Each component includes structured, queryable data attributes:
```html
<button
  data-semantic-name="Form Action"
  data-semantic-path="Modal > Form > Button"
  data-parent="Modal"
  data-wrapper="Form"
  data-num-parents="1"
  data-semantic-role="button-action-active"
  data-action-variant="destructive"
  data-target="user-record"
  data-consequence="destructive-permanent"
  data-affects-parent="false"
>
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

Your components use an **intelligent inference system** to automatically generate rich metadata for AI tooling, plus a **hierarchical context system** to track visual parents and wrappers. Let's break down exactly how it works.

### Auto-Inference from PatternFly Props ✨

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
// action.type: "action"       (from presence of onClick)
// action.variant: "destructive" (from variant="danger")
// context: "active"           (from presence of onClick)
// semanticRole: "button-action-active"
```

**How it works** (from `Button.tsx`):

```typescript
// Button.tsx imports utilities from single source of truth
import { inferButtonAction, inferContext, inferCategory } from '../../utils/inference';

// Step 1: Infer ACTION (behavior + styling) from PatternFly props
const inferredAction = inferButtonAction(variant, href, onClick, target);
// inferButtonAction checks onClick first (behavior), then variant (styling)
// Result: { type: "action", variant: "destructive" }

// Step 2: Infer CONTEXT from PatternFly props  
const inferredContext = context || inferContext({ onClick, isDisabled });
// inferContext checks for onClick and returns 'active'
// Result: "active"

// Step 3: Infer CATEGORY from component name
const category = inferCategory('Button');
// Result: "button"
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

**How it's determined** (from `Button.tsx`):

```typescript
const actionType = inferredAction.type;  // "action"
const role = semanticRole || `button-${actionType}-${inferredContext}`;
// Result: "button-action-active"
```

**Pattern**: `{component}-{action}-{context}`

**Examples:**
- `"button-action-active"` - Action button with active state
- `"button-navigation-active"` - Navigation button (active)
- `"button-external-active"` - External link button

**The role and other attributes appear in the DOM:**

```html
<button 
  data-semantic-name="Form Action"
  data-semantic-path="Modal > Form > Button"
  data-parent="Modal"
  data-wrapper="Form"
  data-num-parents="1"
  data-semantic-role="button-action-active"
  data-action-variant="destructive"
  data-consequence="destructive-permanent"
>
  Delete
</button>
```

**Custom semantic role:**

```tsx
<Button semanticRole="custom-delete-user-button">
  Delete
</Button>
```

### Hierarchical Context System 🏗️

Components automatically track their **visual parents** (require user action to see) and **wrappers** (always visible containers).

**Visual Parents vs Wrappers:**
- **Visual Parent**: Modal, Drawer, Tab - must be opened/clicked to see contents
- **Wrapper**: Form, Card, Grid - always visible, organize content

**How it works:**

```tsx
// SemanticProvider tracks the hierarchy
<SemanticProvider>
  <Modal>  {/* Visual parent - must be opened */}
    <Form>  {/* Wrapper - always visible */}
      <Button>Delete</Button>
    </Form>
  </Modal>
</SemanticProvider>

// Button automatically gets:
// data-parent="Modal" (immediate visual parent)
// data-wrapper="Form" (immediate wrapper)
// data-num-parents="1" (count of visual parents)
// data-semantic-path="Modal > Form > Button" (full path)
// data-semantic-name="Form Action" (wrapper prioritized - acts on form data)
```

**Semantic Naming Priority:**
1. **Wrapper first** - Button acts on wrapper's context (e.g., "Form Action" submits form data)
2. **Parent second** - If no wrapper, acts on parent (e.g., "Modal Action" affects modal)
3. **Standalone** - Just action type (e.g., "Action", "Navigation", "External Link")

**All metadata appears as queryable data attributes:**

```html
<button 
  data-semantic-name="Form Action"
  data-semantic-path="Modal > Form > Button"
  data-parent="Modal"
  data-wrapper="Form"
  data-num-parents="1"
  data-semantic-role="button-action-active"
  data-action-variant="destructive"
  data-target="user-record"
  data-consequence="destructive-permanent"
  data-affects-parent="false"
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

1. **Read the semantic role** to understand component type, action, and state
2. **Parse queryable data attributes** to get rich context
3. **Understand hierarchy** via parent/wrapper relationships
4. **Suggest better code** based on context and consequences
5. **Generate tests** that match the component's intent
6. **Find bugs** by comparing intent vs. implementation

**Example AI analysis:**

```javascript
// AI queries: [data-semantic-name="Form Action"]
// AI understands: "This button submits form data, not modal actions"

// AI sees: data-consequence="destructive-permanent"
// AI suggests: "Add confirmation dialog for destructive actions"

// AI sees: data-parent="Modal", data-num-parents="1"
// AI understands: "Button is inside modal, may need focus management"

// AI queries: [data-wrapper="Form"][data-action-variant="destructive"]
// AI finds: All destructive actions in forms for testing
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

## Testing & Consumption

### Quick Start: Test the Library

**1. Create a new React app**
```bash
npx create-react-app semantic-test-app
cd semantic-test-app
```

**2. Install PatternFly peer dependencies**
```bash
npm install @patternfly/react-core @patternfly/react-icons
```

**3. Install semantic-ui-layer**

Option A: Install from local path
```bash
npm install /path/to/semantic-ui-layer
```

Option B: Link for development
```bash
cd /path/to/semantic-ui-layer
npm link
cd /path/to/semantic-test-app
npm link semantic-ui-layer
```

**4. Create a test component**

```jsx
// src/App.js
import React from 'react';
import { SemanticProvider, Modal, Form, Button } from 'semantic-ui-layer';
import '@patternfly/react-core/dist/styles/base.css';

function App() {
  const [isModalOpen, setIsModalOpen] = React.useState(true);

  return (
    <SemanticProvider>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Test">
        <Form>
          <Button variant="primary" onClick={() => console.log('Submit')}>
            Submit
          </Button>
          <Button variant="danger" onClick={() => console.log('Delete')}>
            Delete Account
          </Button>
        </Form>
      </Modal>
    </SemanticProvider>
  );
}

export default App;
```

**5. Run and inspect**
```bash
npm start
# Open browser DevTools > Elements tab
# Inspect the buttons to see data-* attributes
```

### Expected Attributes

Every Button component should render with these `data-*` attributes:

| Attribute | Example Value | Purpose |
|-----------|---------------|---------|
| `data-semantic-name` | `"Form Action"` | Human-readable name (wrapper/parent + action type) |
| `data-semantic-path` | `"Modal > Form > Button"` | Full hierarchical path |
| `data-parent` | `"Modal"` | Immediate visual parent (requires user action to see) |
| `data-wrapper` | `"Form"` | Immediate wrapper (always visible structure) |
| `data-num-parents` | `"1"` | Count of visual parents (depth) |
| `data-semantic-role` | `"button-action-active"` | Component type + action + state |
| `data-action-variant` | `"destructive"` | Visual styling variant |
| `data-target` | `"default"` | What the action affects |
| `data-consequence` | `"destructive-permanent"` | Impact level of action |
| `data-affects-parent` | `"false"` | Whether it closes/dismisses parent |

### Verifying Installation

**Check 1: Imports work**
```jsx
import { Button } from 'semantic-ui-layer'; // Should not error
```

**Check 2: Components render**
```jsx
<Button variant="primary">Click Me</Button> // Should render
```

**Check 3: Attributes appear**
Open DevTools and verify button has `data-semantic-role`, `data-parent`, etc.

**Check 4: SemanticProvider works**
```jsx
<SemanticProvider>
  <Modal><Button>Test</Button></Modal>
</SemanticProvider>
// Button should have data-parent="Modal"
```

### Troubleshooting

**Missing attributes?**
- Ensure `<SemanticProvider>` wraps your app
- Check browser console for errors

**Wrong parent/wrapper values?**
- Verify component nesting in JSX
- Only Modal, Drawer are "parents"
- Form, Card are "wrappers"

**TypeScript errors?**
- Ensure `@patternfly/react-core` is installed
- Check peer dependency versions

**Import errors?**
- Run `npm run build` in semantic-ui-layer
- Verify dist/ folder exists
- Try `npm link` again

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

