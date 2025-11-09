# Semantic Attributes Codemod

This codemod automatically adds standardized `data-*` attributes to all PatternFly components in your codebase, making them more AI-friendly and easier for AI tools to understand.

## What It Does

The codemod transforms your PatternFly components from:

```tsx
<Card isClickable>
  <CardBody>
    I'm a card
    <Button variant="danger">Cancel</Button>
  </CardBody>
</Card>
```

Into:

```tsx
<Card 
  isClickable
  data-role="card"
  data-purpose="clickable"
  data-variant="default"
  data-context="default"
  data-state="active"
>
  <CardBody
    data-role="card-body"
    data-purpose="display"
    data-variant="default"
    data-context="default"
    data-state="default"
  >
    I'm a card
    <Button 
      variant="danger"
      data-role="button"
      data-purpose="action"
      data-variant="danger"
      data-context="default"
      data-state="active"
    >
      Cancel
    </Button>
  </CardBody>
</Card>
```

**Rendered HTML in Browser:**
```html
<div class="pf-c-card" data-role="card" data-purpose="clickable" data-variant="default" data-context="default" data-state="active">
  <div class="pf-c-card__body" data-role="card-body" data-purpose="display" data-variant="default" data-context="default" data-state="default">
    I'm a card
    <button class="pf-c-button pf-m-danger" data-role="button" data-purpose="action" data-variant="danger" data-context="default" data-state="active">
      Cancel
    </button>
  </div>
</div>
```

## Standardized Attributes

Every PatternFly component gets the same 5 attributes that **appear on the rendered DOM elements**:

| Attribute | Description | Example Values |
|-----------|-------------|----------------|
| `data-role` | What the component IS | `button`, `card`, `input`, `modal` |
| `data-purpose` | What it DOES | `action`, `display`, `input`, `navigation` |
| `data-variant` | How it LOOKS | `primary`, `danger`, `secondary`, `text` |
| `data-context` | Where it's USED | `form`, `modal`, `table`, `toolbar` |
| `data-state` | Current STATE | `active`, `disabled`, `selected`, `readonly` |

**Important**: These attributes will appear on the actual rendered HTML elements in your browser. React automatically forwards all `data-*` attributes to the underlying DOM elements, and PatternFly components respect this behavior.

## Usage

### Quick Start

```bash
# Transform all files in src/
./codemod/add-semantic-attributes.sh src/

# Transform a specific file
./codemod/add-semantic-attributes.sh src/components/MyComponent.tsx

# Transform current directory
./codemod/add-semantic-attributes.sh
```

### Using jscodeshift Directly

```bash
# Install jscodeshift globally (if not already installed)
npm install -g jscodeshift

# Run the transform
jscodeshift -t codemod/transform.js --extensions=ts,tsx,js,jsx --parser=tsx src/
```

## How It Works

1. **Component Detection**: Scans import statements to identify PatternFly components
   - Recognizes imports from `@patternfly/react-core`, `@patternfly/react-table`, etc.
   - Handles both named and default imports
   - Handles aliased imports (e.g., `import { Button as PFButton }`)
   - **Works for ALL PatternFly components**, not just wrapped ones

2. **Static Inference**: Analyzes component props to infer semantic properties
   - **Enhanced inference** for components with specific logic (Button, Card, Modal, Form, Input, Select, etc.)
   - **Generic inference with fallbacks** for other PF components (Alert, Breadcrumb, Tabs, etc.)
   - Reads `variant`, `type`, `onClick`, `isDisabled`, etc.
   - Determines purpose from component name and props
   - Detects parent context for nested components

3. **Attribute Injection**: Adds standardized attributes without modifying existing code
   - Preserves all existing props and formatting
   - Skips components that already have semantic attributes (no duplicates)
   - Maintains code style and comments

4. **DOM Rendering**: Attributes automatically appear on rendered HTML elements
   - React forwards all `data-*` attributes to DOM elements
   - PatternFly components respect React's attribute forwarding
   - Attributes are queryable in browser DevTools

### Inference Quality

**Components with Enhanced Inference:**
- Button, Card, Modal, Form, TextInput, TextArea, Select, Checkbox, Radio, Switch
- Flex, FlexItem, Table components (Th, Td, Tr, Thead, Tbody)
- Link, Drawer, MenuToggle, DropdownItem

**Components with Generic Inference:**
- All other PatternFly components (Alert, Breadcrumb, Tabs, Accordion, etc.)
- Uses heuristics and fallbacks to provide reasonable defaults
- Still adds all 5 standardized attributes

## Supported PatternFly Packages

The codemod works with **ALL components** imported from these PatternFly packages:

- `@patternfly/react-core` - All core components (Button, Card, Modal, Form, Input, Select, etc.)
- `@patternfly/react-table` - All table components (Table, Th, Td, Tr, Thead, Tbody, etc.)
- `@patternfly/react-icons` - Icon components
- `@patternfly/react-charts` - Chart components
- `@patternfly/react-topology` - Topology components

**Important**: The codemod processes **any component** imported from these packages, not just the ones we've wrapped. It uses intelligent inference with fallbacks for unknown components.

## Inference Examples

### Button Component
```tsx
// Input
<Button variant="danger" onClick={handleDelete}>Delete</Button>

// Output (attributes added)
<Button 
  variant="danger" 
  onClick={handleDelete}
  data-role="button"
  data-purpose="action"
  data-variant="danger"
  data-context="default"
  data-state="active"
>
  Delete
</Button>
```

**Rendered HTML:**
```html
<button 
  class="pf-c-button pf-m-danger" 
  data-role="button" 
  data-purpose="action" 
  data-variant="danger" 
  data-context="default" 
  data-state="active"
>
  Delete
</button>
```

### Card Component
```tsx
// Input
<Card isClickable isSelected>
  <CardBody>Content</CardBody>
</Card>

// Output
<Card 
  isClickable 
  isSelected
  data-role="card"
  data-purpose="clickable"
  data-variant="default"
  data-context="default"
  data-state="selected"
>
  <CardBody
    data-role="card-body"
    data-purpose="display"
    data-variant="default"
    data-context="default"
    data-state="default"
  >
    Content
  </CardBody>
</Card>
```

**Rendered HTML:**
```html
<div class="pf-c-card" data-role="card" data-purpose="clickable" data-variant="default" data-context="default" data-state="selected">
  <div class="pf-c-card__body" data-role="card-body" data-purpose="display" data-variant="default" data-context="default" data-state="default">
    Content
  </div>
</div>
```

### Form Input
```tsx
// Input
<TextInput type="email" isRequired />

// Output
<TextInput 
  type="email" 
  isRequired
  data-role="text-input"
  data-purpose="input"
  data-variant="email"
  data-context="form"
  data-state="default"
/>
```

**Rendered HTML:**
```html
<input 
  type="email" 
  class="pf-c-form-control" 
  required
  data-role="text-input" 
  data-purpose="input" 
  data-variant="email" 
  data-context="form" 
  data-state="default"
/>
```

## Limitations

### Static Analysis Only
The codemod uses **static analysis** (what it can see in your source code), not runtime values:

✅ **Works:**
- `variant="danger"` (literal string)
- `isDisabled={true}` (literal boolean)
- `onClick={handler}` (prop exists)

❌ **Can't Detect:**
- `variant={someVariable}` (variable value unknown)
- `onClick={condition ? handler1 : handler2}` (runtime decision)
- Dynamic props from state or context

### Parent Context Detection
Parent context is detected by analyzing the JSX tree structure, but:
- Only works for direct parent-child relationships
- Limited to 10 levels deep (prevents infinite loops)
- May not detect context from React Context API

## Extending the Codemod

### Adding New PatternFly Packages

Edit `codemod/static-inference.js`:

```javascript
const PF_PACKAGES = [
  '@patternfly/react-core',
  '@patternfly/react-table',
  '@patternfly/react-icons',
  '@patternfly/react-charts',
  '@patternfly/react-topology',
  '@patternfly/react-new-package', // Add here
];
```

### Adding New Component Inference Rules

Edit `codemod/static-inference.js`:

```javascript
function inferPurpose(componentName, props) {
  // Add your custom logic here
  if (componentName === 'MyNewComponent') {
    return 'custom-purpose';
  }
  // ... existing logic
}
```

### Customizing Attributes

Edit `codemod/transform.js` to add or modify attributes:

```javascript
const newAttributes = [
  j.jsxAttribute(
    j.jsxIdentifier('data-semantic-role'),
    j.literal(role)
  ),
  // Add more attributes here
  j.jsxAttribute(
    j.jsxIdentifier('data-custom-attr'),
    j.literal('custom-value')
  ),
];
```

## Troubleshooting

### Components Not Being Transformed

1. **Check imports**: Make sure components are imported from PatternFly packages
2. **Check file extensions**: Only `.ts`, `.tsx`, `.js`, `.jsx` files are processed
3. **Check existing attributes**: Components with existing `data-semantic-*` attributes are skipped

### Incorrect Inferences

The codemod uses heuristics to infer values. If results are incorrect:
1. Manually add attributes to override inferred values
2. Update inference logic in `static-inference.js`
3. Report issues with specific component patterns

### Formatting Issues

The codemod preserves your existing formatting. If you see formatting changes:
1. Run your formatter (Prettier, ESLint) after the transform
2. The codemod uses single quotes and trailing commas by default

## Best Practices

1. **Run on Clean Code**: Transform before adding custom logic
2. **Version Control**: Commit before running, review changes after
3. **Test After**: Verify your app still works after transformation
4. **Incremental**: Transform one directory at a time for large codebases
5. **Review Changes**: Use `git diff` to review what was changed

## Integration with AI Tools

Once attributes are added and rendered, AI tools can query the DOM:

- **Query by purpose**: Find all action buttons: `[data-purpose="action"]`
- **Query by context**: Find all form inputs: `[data-context="form"]`
- **Query by state**: Find all disabled components: `[data-state="disabled"]`
- **Query by role**: Find all cards: `[data-role="card"]`
- **Query by variant**: Find all danger buttons: `[data-variant="danger"]`

**Example Browser Queries:**
```javascript
// Find all action buttons
document.querySelectorAll('[data-purpose="action"]')

// Find all form inputs
document.querySelectorAll('[data-context="form"]')

// Find all danger variants
document.querySelectorAll('[data-variant="danger"]')
```

## Contributing

To improve the codemod:

1. Add new inference rules in `static-inference.js`
2. Add support for new PatternFly components
3. Improve parent context detection
4. Add more sophisticated static analysis

## License

MIT License - same as the main project

