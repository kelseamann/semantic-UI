# Semantic UI Layer

A standalone React library that wraps PatternFly design system components with semantic meaning and additional metadata for AI tooling like Cursor.

## Overview

Semantic UI Layer enhances PatternFly components by adding:

- **Semantic Role Identification**: Each component has a clear semantic purpose that AI tools can understand
- **AI Metadata**: Rich metadata including descriptions, complexity levels, and usage patterns
- **Enhanced Accessibility**: Automatic ARIA attributes and accessibility validation
- **Context Awareness**: Components understand their usage context and adapt accordingly
- **AI-Friendly Documentation**: Structured data that helps AI tools provide better suggestions

## Features

### 🎯 Semantic Components
- `SemanticButton` - Buttons with action context (primary, secondary, destructive, etc.)
- `SemanticCard` - Cards with content purpose (data-display, action-panel, etc.)
- `SemanticModal` - Modals with interaction type (confirmation, form, workflow, etc.)

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

### ♿ Enhanced Accessibility
- Automatic ARIA attribute generation
- Keyboard shortcut metadata
- Accessibility validation and warnings
- Screen reader optimizations

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
import { SemanticButton, SemanticCard, SemanticModal } from 'semantic-ui-layer';

function MyComponent() {
  return (
    <SemanticCard purpose="data-summary" contentType="data">
      <h3>User Dashboard</h3>
      <p>Welcome back, John!</p>
      
      <SemanticButton 
        action="primary" 
        context="form"
        onClick={() => console.log('Action clicked')}
      >
        Save Changes
      </SemanticButton>
    </SemanticCard>
  );
}
```

### Advanced Usage with Custom Metadata

```tsx
import { SemanticModal } from 'semantic-ui-layer';

function ConfirmationModal({ isOpen, onClose, onConfirm }) {
  return (
    <SemanticModal
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
      accessibility={{
        ariaLabel: "Confirm deletion",
        ariaDescription: "This action cannot be undone"
      }}
    >
      <h2>Delete Item</h2>
      <p>Are you sure you want to delete this item?</p>
      <SemanticButton action="destructive" onClick={onConfirm}>
        Delete
      </SemanticButton>
      <SemanticButton action="secondary" onClick={onClose}>
        Cancel
      </SemanticButton>
    </SemanticModal>
  );
}
```

### Using Hooks

```tsx
import { useSemanticMetadata, useAccessibility } from 'semantic-ui-layer';

function CustomComponent() {
  const { metadata } = useSemanticMetadata('CustomButton', {
    description: 'Custom action button',
    complexity: 'moderate'
  });

  const { enhancedProps } = useAccessibility('button', props, {
    action: 'primary'
  });

  return <button {...enhancedProps}>Custom Button</button>;
}
```

## Component API

### SemanticButton

```tsx
interface SemanticButtonProps extends ButtonProps, SemanticComponentProps {
  action?: 'primary' | 'secondary' | 'destructive' | 'navigation' | 'toggle';
  context?: 'form' | 'toolbar' | 'modal' | 'card' | 'navigation';
}
```

### SemanticCard

```tsx
interface SemanticCardProps extends CardProps, SemanticComponentProps {
  purpose?: 'content-display' | 'data-summary' | 'action-panel' | 'information' | 'navigation';
  contentType?: 'text' | 'data' | 'media' | 'mixed' | 'interactive';
}
```

### SemanticModal

```tsx
interface SemanticModalProps extends ModalProps, SemanticComponentProps {
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

- [ ] Additional PatternFly component wrappers
- [ ] Storybook documentation
- [ ] Automated accessibility testing
- [ ] AI tooling integration examples
- [ ] Performance optimizations
- [ ] Theme customization support
