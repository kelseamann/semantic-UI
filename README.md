# Semantic UI Layer - Codemod

A codemod tool that automatically adds standardized semantic `data-*` attributes to **all PatternFly components** in your codebase, making them AI-friendly and easier for AI tools to understand.

## Overview

This tool transforms your existing PatternFly components by adding semantic metadata attributes that appear on rendered DOM elements. AI tools can query these attributes to better understand your UI structure and component relationships.

**Key Benefits:**
- ✅ Works with **ALL PatternFly components** (not just a subset)
- ✅ Zero code changes required - just run the codemod
- ✅ Attributes appear on rendered HTML elements
- ✅ Queryable by AI tools and browser DevTools
- ✅ Non-destructive - preserves all existing code

## Quick Start

```bash
# Install jscodeshift (if not already installed)
npm install -g jscodeshift

# Run the codemod on your codebase
jscodeshift -t node_modules/semantic-ui-layer/codemod/transform.js --extensions=ts,tsx,js,jsx --parser=tsx src/
```

Or use the provided script:

```bash
# If you have semantic-ui-layer installed
./node_modules/semantic-ui-layer/codemod/add-semantic-attributes.sh src/
```

## What It Does

The codemod transforms your PatternFly components from:

```tsx
<Card isClickable>
  <CardBody>
    <Button variant="danger">Cancel</Button>
  </CardBody>
</Card>
```

Into:

```tsx
<Card 
  isClickable
  data-role="card"
  data-purpose="action-panel"
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

**These attributes appear on the rendered DOM elements** in your browser:

```html
<div class="pf-c-card" data-role="card" data-purpose="action-panel" data-variant="default" data-context="default" data-state="active">
  <div class="pf-c-card__body" data-role="card-body" data-purpose="display" data-variant="default" data-context="default" data-state="default">
    <button class="pf-c-button pf-m-danger" data-role="button" data-purpose="action" data-variant="danger" data-context="default" data-state="active">
      Cancel
    </button>
  </div>
</div>
```

## Standardized Attributes

Every PatternFly component gets the same 5 attributes that appear on rendered DOM elements:

| Attribute | Description | Example Values |
|-----------|-------------|----------------|
| `data-role` | What the component IS | `button`, `card`, `input`, `modal`, `alert`, `breadcrumb` |
| `data-purpose` | What it DOES | `action`, `display`, `input`, `navigation`, `overlay` |
| `data-variant` | How it LOOKS | `primary`, `danger`, `secondary`, `warning`, `info` |
| `data-context` | Where it's USED | `form`, `modal`, `table`, `toolbar`, `navigation` |
| `data-state` | Current STATE | `active`, `disabled`, `selected`, `readonly`, `open` |

## Features

- ✅ **Universal Coverage**: Works with **ALL PatternFly components** from supported packages
- ✅ **Automatic Detection**: Identifies PatternFly components by analyzing import statements
- ✅ **Smart Inference**: Enhanced inference for common components, generic inference with fallbacks for others
- ✅ **Non-Destructive**: Preserves all existing code, formatting, and comments
- ✅ **Idempotent**: Safe to run multiple times (skips components that already have attributes)
- ✅ **DOM-Ready**: Attributes appear on rendered HTML elements (React forwards `data-*` attributes)

## Installation

```bash
npm install semantic-ui-layer
```

## Usage

### Transform Entire Directory

```bash
jscodeshift -t node_modules/semantic-ui-layer/codemod/transform.js --extensions=ts,tsx,js,jsx --parser=tsx src/
```

### Transform Specific File

```bash
jscodeshift -t node_modules/semantic-ui-layer/codemod/transform.js src/components/MyComponent.tsx
```

### Preview Changes (Dry Run)

```bash
jscodeshift -t node_modules/semantic-ui-layer/codemod/transform.js --dry src/
```

### Using the Bash Script

```bash
# Transform all files in src/
./node_modules/semantic-ui-layer/codemod/add-semantic-attributes.sh src/

# Transform a specific file
./node_modules/semantic-ui-layer/codemod/add-semantic-attributes.sh src/components/MyComponent.tsx

# Transform current directory
./node_modules/semantic-ui-layer/codemod/add-semantic-attributes.sh
```

## Supported PatternFly Packages

The codemod works with **ALL components** imported from these PatternFly packages:

- `@patternfly/react-core` - All core components (Button, Card, Modal, Form, Input, Select, Alert, Breadcrumb, Tabs, Accordion, Popover, Tooltip, etc.)
- `@patternfly/react-table` - All table components (Table, Th, Td, Tr, Thead, Tbody, etc.)
- `@patternfly/react-icons` - Icon components
- `@patternfly/react-charts` - Chart components
- `@patternfly/react-topology` - Topology components

**Important**: The codemod processes **any component** imported from these packages, not just a limited subset. It uses intelligent inference with fallbacks for unknown components.

## How It Works

1. **Component Detection**: Scans import statements to identify PatternFly components
   - Works for **ALL components** imported from PatternFly packages
   - Handles both named and default imports
   - Handles aliased imports (e.g., `import { Button as PFButton }`)

2. **Static Inference**: Analyzes component props to infer semantic properties
   - **Enhanced inference** for common components (Button, Card, Modal, Form, Input, Select, Checkbox, Radio, Switch, Flex, Table components, Link, Drawer, etc.)
   - **Generic inference with fallbacks** for other PF components (Alert, Breadcrumb, Tabs, Accordion, Popover, Tooltip, etc.)
   - Reads `variant`, `type`, `onClick`, `isDisabled`, etc.
   - Determines purpose from component name and props
   - Detects parent context for nested components

3. **Attribute Injection**: Adds standardized attributes without modifying existing code
   - Preserves all existing props, formatting, and comments
   - Idempotent - safe to run multiple times

4. **DOM Rendering**: React automatically forwards `data-*` attributes to rendered DOM elements
   - All attributes appear on the actual HTML elements in the browser
   - Queryable via DevTools and JavaScript

### Inference Quality

**Components with Enhanced Inference:**
- Button, Card, Modal, Form, TextInput, TextArea, Select, Checkbox, Radio, Switch
- Flex, FlexItem, Table components (Th, Td, Tr, Thead, Tbody)
- Link, Drawer, MenuToggle, DropdownItem

**Components with Generic Inference:**
- All other PatternFly components (Alert, Breadcrumb, Tabs, Accordion, Popover, Tooltip, Wizard, etc.)
- Uses heuristics and fallbacks to provide reasonable defaults
- Still adds all 5 standardized attributes

## Examples

### Button Component

```tsx
// Before
<Button variant="danger" onClick={handleDelete}>Delete</Button>

// After
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

### Alert Component (Generic Inference)

```tsx
// Before
<Alert variant="warning" title="Warning">This is a warning</Alert>

// After
<Alert 
  variant="warning" 
  title="Warning"
  data-role="alert"
  data-purpose="display"
  data-variant="warning"
  data-context="default"
  data-state="default"
>
  This is a warning
</Alert>
```

### Form with Inputs

```tsx
// Before
<Form>
  <TextInput type="email" isRequired />
  <Select>
    <SelectOption value="1">Option 1</SelectOption>
  </Select>
</Form>

// After
<Form
  data-role="form"
  data-purpose="form-container"
  data-variant="default"
  data-context="default"
  data-state="default"
>
  <TextInput 
    type="email" 
    isRequired
    data-role="text-input"
    data-purpose="input"
    data-variant="email"
    data-context="form"
    data-state="default"
  />
  <Select
    data-role="select"
    data-purpose="input"
    data-variant="default"
    data-context="form"
    data-state="default"
  >
    <SelectOption value="1">Option 1</SelectOption>
  </Select>
</Form>
```

## Querying Attributes in Browser

Once attributes are added, you can query them in the browser:

```javascript
// Find all action buttons
document.querySelectorAll('[data-purpose="action"]')

// Find all form inputs
document.querySelectorAll('[data-context="form"]')

// Find all danger variants
document.querySelectorAll('[data-variant="danger"]')

// Find all cards
document.querySelectorAll('[data-role="card"]')

// Find all disabled components
document.querySelectorAll('[data-state="disabled"]')
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

## Best Practices

1. **Run on Clean Code**: Transform before adding complex logic
2. **Version Control**: Commit before running, review changes after
3. **Test After**: Verify your app still works after transformation
4. **Incremental**: Transform one directory at a time for large codebases
5. **Review Changes**: Use `git diff` to review what was changed

## Troubleshooting

### Components Not Being Transformed

1. **Check imports**: Make sure components are imported from PatternFly packages
2. **Check file extensions**: Only `.ts`, `.tsx`, `.js`, `.jsx` files are processed
3. **Check existing attributes**: Components with existing `data-role`, `data-purpose`, etc. are skipped

### Incorrect Inferences

The codemod uses heuristics to infer values. If results are incorrect:
1. Manually add attributes to override inferred values
2. Update inference logic in `codemod/static-inference.js`
3. Report issues with specific component patterns

### Formatting Issues

The codemod preserves your existing formatting. If you see formatting changes:
1. Run your formatter (Prettier, ESLint) after the transform
2. The codemod uses single quotes and trailing commas by default

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
    j.jsxIdentifier('data-role'),
    j.literal(role)
  ),
  // Add more attributes here
  j.jsxAttribute(
    j.jsxIdentifier('data-custom-attr'),
    j.literal('custom-value')
  ),
];
```

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

## Documentation

For detailed documentation, examples, and customization options, see [`codemod/README.md`](./codemod/README.md).

## Alternative: Wrapper Library

This repository also contains a React wrapper library that provides semantic components. The wrapper library is available for reference but the codemod is the recommended approach for adding semantic attributes to existing PatternFly codebases.

The wrapper library includes 23 components with enhanced semantic metadata:
- Core: Button, Card, Modal, Form, Link, Drawer
- Forms: TextInput, TextArea, Select, Checkbox, Radio, Switch
- Data Display: StatusBadge, Table components (Th, Td, Tr, Thead, Tbody)
- Layout: Flex, FlexItem
- Navigation: MenuToggle, DropdownItem

See the source code in `src/components/` for implementation details.

## Development

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd semantic-ui-layer

# Install dependencies
npm install
```

### Available Scripts

- `npm run codemod` - Run the codemod transform
- `npm run codemod:dry` - Preview changes without modifying files
- `npm run build` - Build the wrapper library (if needed)
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Contributing

To improve the codemod:

1. Add new inference rules in `codemod/static-inference.js`
2. Add support for new PatternFly components
3. Improve parent context detection
4. Add more sophisticated static analysis

## License

MIT License - see LICENSE file for details
