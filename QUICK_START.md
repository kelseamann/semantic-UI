# Quick Start Guide

## Your Semantic UI Layer is Ready!

Your project now wraps [PatternFly React](https://github.com/patternfly/patternfly-react-seed) components with semantic metadata for AI tooling.

## What You Have

### ✅ 17 Semantic Components
- **Core**: Button, Link, StarIcon
- **Forms**: Checkbox, TextInput, TextArea, Select, Radio, Switch
- **Data Display**: Card, StatusBadge, Table components
- **Layout**: Flex, FlexItem
- **Overlay**: Modal
- **Navigation**: MenuToggle, DropdownItem

### ✅ Smart Auto-Inference
Components automatically understand their purpose:
```tsx
// Type determines purpose automatically
<TextInput type="email" />
// → purpose="email-input" auto-detected!

<Button variant="danger" />
// → action="destructive" auto-detected!
```

### ✅ Developer Tools
- Component generator script
- Test templates
- Implementation checklists
- Comprehensive documentation

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Library
```bash
npm run build
```

### 3. Use in Your App
```typescript
import { Button, TextInput, Card } from 'semantic-ui-layer';

function MyComponent() {
  return (
    <Card purpose="data-summary">
      <TextInput
        type="email"
        placeholder="Your email"
        context="form"
      />
      <Button
        variant="primary"
        action="primary"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Card>
  );
}
```

## Generate New Components

### Quick Generate
```bash
npm run generate:component Alert feedback simple
```

This creates:
- `src/components/feedback/Alert.tsx`
- Proper TypeScript types
- Semantic metadata structure
- Data attributes
- JSDoc documentation

### Generator Syntax
```bash
npm run generate:component <ComponentName> <category> <complexity>
```

**Categories**:
- `core` - Basic UI elements
- `forms` - Form inputs and controls
- `data-display` - Cards, tables, lists
- `layout` - Layout and positioning
- `overlay` - Modals, popovers
- `navigation` - Nav, breadcrumbs, tabs
- `feedback` - Alerts, toasts, progress
- `advanced` - Complex components

**Complexity**: `simple` | `moderate` | `complex`

## Key Features

### Semantic Metadata
Every component includes:
```tsx
<Button
  data-semantic-name="Button"
  data-semantic-role="button-primary-form"
  data-ai-metadata='{"description":"...","category":"forms",...}'
  data-action="primary"
  data-context="form"
>
  Click me
</Button>
```

### Context Awareness
```tsx
import { SemanticProvider } from 'semantic-ui-layer';

<SemanticProvider>
  <Form>
    <TextInput /> {/* Knows it's in a form context */}
  </Form>
</SemanticProvider>
```

## Examples

### Form with Validation
```tsx
import { TextInput, TextArea, Button, Switch } from 'semantic-ui-layer';

function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subscribe, setSubscribe] = useState(false);

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        isRequired
        validated={emailError ? 'error' : 'default'}
      />
      
      <TextArea
        purpose="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message..."
        isRequired
      />
      
      <Switch
        purpose="preference"
        toggleTarget="feature"
        label="Subscribe to newsletter"
        isChecked={subscribe}
        onChange={setSubscribe}
      />
      
      <Button variant="primary" type="submit">
        Send Message
      </Button>
    </form>
  );
}
```

### Settings Page
```tsx
import { Radio, Switch, Select, Button } from 'semantic-ui-layer';

function Settings() {
  return (
    <div>
      <h2>Theme</h2>
      <Radio
        name="theme"
        id="theme-light"
        label="Light"
        groupContext="theme-selection"
        purpose="preference"
      />
      <Radio
        name="theme"
        id="theme-dark"
        label="Dark"
        groupContext="theme-selection"
        purpose="preference"
      />
      
      <h2>Notifications</h2>
      <Switch
        purpose="feature-toggle"
        label="Email notifications"
        toggleTarget="feature"
      />
      
      <h2>Language</h2>
      <Select
        purpose="setting"
        context="settings"
        selections={language}
        onSelect={handleLanguageChange}
      >
        <SelectOption value="en">English</SelectOption>
        <SelectOption value="es">Español</SelectOption>
      </Select>
      
      <Button variant="primary" action="primary">
        Save Settings
      </Button>
    </div>
  );
}
```

## Next Steps

### 1. Test Your Build
```bash
npm run build
npm run type-check
npm run lint
```

### 2. Create Example App
Create a demo application showing off your semantic components

### 3. Add More Components
Use the generator to wrap more PatternFly components:
```bash
# Navigation components
npm run generate:component Nav navigation moderate
npm run generate:component Breadcrumb navigation simple
npm run generate:component Tabs navigation moderate

# Feedback components
npm run generate:component Alert feedback simple
npm run generate:component Toast feedback moderate
npm run generate:component Progress feedback simple
```

### 4. Write Tests
Use the test template in `scripts/test-template.tsx`

### 5. Add Storybook
```bash
npx sb init
```

## Documentation

- **INTEGRATION_STRATEGY.md** - Complete integration roadmap
- **COMPONENT_CHECKLIST.md** - Implementation checklist
- **PROGRESS_SUMMARY.md** - What's been done
- **README.md** - Main project README

## Troubleshooting

### Build Fails
```bash
# Clean and rebuild
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Type Errors
```bash
# Check types
npm run type-check

# Fix common issues
npm install --save-dev @types/react @types/react-dom
```

### Import Errors
Make sure imports use correct paths:
```typescript
// Correct
import { Button } from 'semantic-ui-layer';

// Also works
import { Button } from 'semantic-ui-layer/dist/index.esm.js';
```

## Migration from PatternFly

### Step 1: Install
```bash
npm install semantic-ui-layer
```

### Step 2: Update Imports
```typescript
// Before
import { Button, Card, Modal } from '@patternfly/react-core';

// After
import { Button, Card, Modal } from 'semantic-ui-layer';
```

### Step 3: Add Semantic Props (Optional)
```typescript
// Works as-is (all PF props supported)
<Button variant="primary">Save</Button>

// Enhanced with semantic props
<Button 
  variant="primary" 
  action="primary" 
  context="form"
>
  Save
</Button>
```

## Best Practices

### 1. Let Auto-Inference Work
```tsx
// Good - let it infer
<TextInput type="email" />

// Also good - explicit when needed
<TextInput type="text" purpose="username-input" />
```

### 2. Provide Context
```tsx
// Good - explicit context
<Button context="modal" action="primary">
  Confirm
</Button>
```

### 3. Use Semantic Names
```tsx
// Good - descriptive names
<Card semanticName="UserProfileCard">
  <TextInput semanticName="UsernameInput" />
</Card>
```

### 4. Preserve PatternFly Patterns
```tsx
// Good - PatternFly patterns still work
<Button
  variant="primary"
  isLoading={loading}
  isDisabled={disabled}
  icon={<SaveIcon />}
  action="primary"  // Added semantic context
>
  Save
</Button>
```

## Support

For issues, questions, or contributions:
1. Check existing documentation
2. Review INTEGRATION_STRATEGY.md
3. Open an issue on GitHub
4. Submit a pull request

## What's Next?

Your semantic UI layer is well-positioned to become a comprehensive wrapper for PatternFly React. The immediate next steps are:

1. ✅ Build and test current components
2. 🔄 Add Priority 3: Navigation components
3. 📝 Create Storybook documentation
4. 🧪 Write comprehensive tests
5. 📦 Publish to npm
6. 🎨 Create example applications
7. 📣 Share with community

---

**Happy coding!** 🚀

Your semantic UI layer makes PatternFly components AI-friendly and developer-friendly.

