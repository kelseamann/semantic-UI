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

