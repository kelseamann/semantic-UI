# How We Decide What Goes Into Each Data-* Attribute "Bucket"

This document explains in simple terms how we determine the value for each of the 7 data-* attributes we add to PatternFly components.

## Overview

Each component gets analyzed by 7 functions (one per "bucket"). These functions look at:
- **Component name** (e.g., "Button", "Card", "TextInput")
- **Props** (e.g., `variant="primary"`, `isDisabled={true}`, `onClick={...}`)
- **Parent context** (where the component is used - e.g., inside a Form, Modal, Toolbar)
- **Children** (for some components, we analyze child elements to infer variants)

## The 7 Buckets (Data-* Attributes)

### 1. `data-role` - "What the component IS"

**Function:** `inferRole(componentName)`

**What it does:**
- Takes the component name (e.g., "Button", "Card", "TextInput")
- Converts it to lowercase
- Looks it up in a `roleMap` object that maps component names to semantic roles
- Returns a more descriptive role than the component name itself

**Examples:**
- `Button` → `"button"`
- `Card` → `"card"`
- `TextInput` → `"text-input"`
- `AccordionItem` → `"accordion-section"` (more descriptive than just "accordion-item")
- `ActionListItem` → `"action-item"` (more descriptive)

**Special cases:**
- Icons (components ending with "Icon") → always `"icon"`
- Brand → always `"logo"`
- Some structural children return `null` (they don't get a role)

**Props used:** None (only uses component name)

---

### 2. `data-purpose` - "What the component DOES"

**Function:** `inferPurpose(componentName, props)`

**What it does:**
- Takes component name and props
- Checks component name patterns (e.g., includes "button", "card", "form")
- Checks specific props to determine purpose
- Returns a purpose that describes the component's function

**Common purposes:**
- `"action"` - Buttons, clickable elements
- `"display"` - Cards, lists, text that shows information
- `"input"` - Text inputs, selects, checkboxes, form controls
- `"navigation"` - Links, nav items, tabs, pagination
- `"form-container"` - Forms, wizards
- `"guidance"` - Tooltips, hints, popovers
- `"selection"` - Toggle groups, tree view items
- `"status-tracking"` - Progress bars, spinners

**Props checked:**
- `onClick`, `onSubmit` → indicates action
- `href` → indicates navigation
- `isSelectable`, `isClickable` → for cards
- `onClose`, `isDismissible` → for labels (filter purpose)
- `color` → for labels (status-indicator purpose)
- `action` prop → for Forms (to infer purpose like "create", "edit")

**Examples:**
- Button with `onClick` → `"action"`
- Link with `href` → `"navigation"`
- Card with `isSelectable` → `"selectable"`
- Form with `action="/api/create"` → purpose inferred from action URL

---

### 3. `data-variant` - "How it LOOKS"

**Function:** `inferVariant(componentName, props)` + sometimes `analyzeChildren()` functions

**What it does:**
- Takes component name and props
- Checks for `variant` prop (most common)
- Checks for other visual/style props (e.g., `size`, `color`, `orientation`)
- For some components, analyzes children to infer variants
- Returns a string or array of variant names (can combine multiple variants)

**Props checked:**
- `variant` → most common (e.g., `variant="primary"`, `variant="danger"`)
- `size` → for size variants (e.g., `size="sm"`, `size="lg"`)
- `orientation` → for orientation (e.g., `orientation="vertical"`)
- `isFilled`, `isCompact`, `isSticky` → boolean style props
- `color` → for color variants
- `format` → for Timestamp (12-hour vs 24-hour)
- `headingLevel` → for Title (h1-h6)

**Children analysis (for some components):**
- `InputGroup` → `analyzeInputGroupChildren()` checks for buttons/icons/text on left/right
- `List` → `analyzeListChildren()` checks for icons in list items
- `LoginForm` → `analyzeLoginFormChildren()` checks for password toggles, header utilities
- `DualListSelector` → checks children for tooltips, search, actions
- `Masthead` → checks for vertical nav
- `Menu/Dropdown/Select` → checks children for various menu features

**Examples:**
- Button with `variant="primary"` → `"primary"`
- Card with `isSelectable` → `"selectable"`
- InputGroup with icon on left → `"with-icon-before"`
- List with icons → `"with-icons"`
- Timestamp with `format="12-hour"` → `"12-hour"`

**Note:** Variants can combine (e.g., `"primary-danger"` for a primary button that's also danger)

---

### 4. `data-context` - "Where it's USED"

**Function:** `inferContext(componentName, props, parentContext, parentPurpose)`

**What it does:**
- Takes component name, props, and parent context/purpose
- Checks if component should inherit context from parent
- Returns a context string describing where the component is typically used

**Common contexts:**
- `"form"` - Inside forms
- `"modal"` - Inside modals
- `"overlay"` - Inside modals or drawers (overlay components)
- `"toolbar"` - Inside toolbars
- `"table"` - Inside tables
- `"card"` - Inside cards
- `"page"` - On pages (rendered as `"in-page"` in HTML)
- `"masthead"` - In the top navigation bar
- `"sidebar"` - In sidebars
- `"wizard"` - Inside wizards
- `"authentication"` - Inside login forms

**How it works:**
1. First checks if component has a specific context (e.g., `LoginForm` → `"authentication"`)
2. Then checks `parentContext` (inherited from parent via `findParentContext()` in transform.js)
3. For Forms, checks `parentPurpose` - if Form has purpose like "create", children get context "create" (not "form")
4. Defaults to a common context if no parent context found

**Special cases:**
- `Page` → returns `null` (it's the root), but its children get `"page"` context
- `Toolbar` → provides `"toolbar"` context to its children
- `Wizard` → provides `"wizard"` context to its children
- `Sidebar` → provides `"sidebar"` context to its children
- `Modal` and `Drawer` → both return `"overlay"` context
- `data-context="page"` → rendered as `data-context="in-page"` in HTML

**Props checked:**
- `isModal` → for Wizard (determines if overlay or page context)
- `parentContext` → inherited from parent component
- `parentPurpose` → inherited from Form parent (for purpose-based context)

---

### 5. `data-state` - "Current STATE"

**Function:** `inferState(componentName, props)`

**What it does:**
- Takes component name and props
- Checks for state-related props (disabled, checked, selected, open, etc.)
- Returns a state string describing the current state

**Common states:**
- `"disabled"` - Component is disabled
- `"checked"` - Checkbox/radio is checked
- `"unchecked"` - Checkbox/radio is unchecked
- `"selected"` - Item is selected
- `"unselected"` - Item is not selected
- `"open"` - Menu/dropdown/modal is open
- `"closed"` - Menu/dropdown/modal is closed
- `"expanded"` - Accordion/tree item is expanded
- `"collapsed"` - Accordion/tree item is collapsed
- `"read-only"` - Input is read-only
- `"edit"` - InlineEdit is in edit mode
- `"error"` - Input has error validation
- `"warning"` - Input has warning validation
- `"active"` - Component is active/current
- `"loading"` - Component is loading

**Props checked:**
- `isDisabled`, `disabled` → `"disabled"`
- `isChecked`, `checked` → `"checked"`
- `isSelected`, `selected` → `"selected"`
- `isOpen`, `open` → `"open"` or `"closed"`
- `isExpanded`, `expanded` → `"expanded"` or `"collapsed"`
- `isReadOnly`, `readOnly` → `"read-only"`
- `isInvalid`, `invalid`, `validated="error"` → `"error"`
- `validated="warning"` → `"warning"`
- `isActive`, `active` → `"active"`
- `isCurrent` → `"current"` (for wizard steps)
- `isVisited` → `"visited"` (for wizard steps)

**Special cases:**
- Some components don't have states (display components like Timestamp, Title)
- Some states are component-specific (e.g., wizard steps have "visited", "current", "disabled")
- HelperText state is detected and applied to the form input it's associated with

**Examples:**
- Button with `isDisabled={true}` → `"disabled"`
- Checkbox with `isChecked={true}` → `"checked"`
- Menu with `isOpen={true}` → `"open"`
- Input with `validated="error"` → `"error"`

---

### 6. `data-action-type` - "Type of ACTION"

**Function:** `inferActionType(componentName, props)`

**What it does:**
- Takes component name and props
- Determines the type of action the component performs
- Only applies to interactive components

**Common action types:**
- `"destructive"` - Dangerous actions (delete, remove) - from `variant="danger"`
- `"navigation"` - Navigation actions (links, tabs, pagination, skip links)
- `"actionable"` - Alert links that perform actions
- `"toggle"` - Toggle actions (Switch, toggle groups)
- `"selection"` - Selection actions (ToggleGroup, TreeView)
- `"form"` - Form actions (Wizard)
- `"determinate"` - Progress with measurable value (Progress, ProgressStepper)
- `"indeterminate"` - Progress without measurable value (Spinner)

**Props checked:**
- `variant="danger"` → `"destructive"`
- `href` → `"navigation"`
- `actionType` prop → if explicitly set

**Special cases:**
- Most components return `null` (no action-type needed)
- Only interactive components get action-type
- Progress components use action-type to distinguish determinate vs indeterminate

**Examples:**
- Button with `variant="danger"` → `"destructive"`
- Link with `href` → `"navigation"`
- Switch → `"toggle"`
- Progress → `"determinate"`
- Spinner → `"indeterminate"`

---

### 7. `data-size` - "SIZE/SPACING"

**Function:** `inferSize(componentName, props)`

**What it does:**
- Takes component name and props
- Checks for size-related props
- Returns a size string

**Common sizes:**
- `"compact"` - Compact spacing
- `"default"` - Default spacing
- `"small"`, `"sm"` - Small size
- `"medium"`, `"md"` - Medium size
- `"large"`, `"lg"` - Large size
- `"extra-small"`, `"xs"` - Extra small
- `"extra-large"`, `"xl"` - Extra large

**Props checked:**
- `size` → most common (e.g., `size="sm"`, `size="lg"`)
- `isCompact`, `compact` → `"compact"`
- Component-specific size props

**Special cases:**
- Most components return `null` (size not applicable)
- Only components that have meaningful size variants get this attribute
- Icons have size variants (sm, md, lg, xl, 2xl, 3xl)
- Progress has size variants (small, large)
- Spinner has size variants (extra-small, small, medium, large)

**Examples:**
- Icon with `size="lg"` → `"lg"`
- Progress with `size="small"` → `"small"`
- Spinner with `size="large"` → `"large"`

---

## Helper Functions

### `propsToMap(props)`
Converts JSX props array to a Map for easy lookup. Handles both `StringLiteral` and `Literal` types.

### `findParentContext(path, j)`
Traverses up the AST to find parent component and determine its context. Returns:
- `{ context, purpose }` for Forms (so children can inherit purpose)
- Context string for other parents (Page, Sidebar, Toolbar, Wizard, LoginForm)
- `null` if no parent context found

### Children Analysis Functions
Some components analyze their children to infer variants:
- `analyzeInputGroupChildren()` - Checks for buttons/icons/text on left/right
- `analyzeListChildren()` - Checks for icons in list items
- `analyzeLoginFormChildren()` - Checks for password toggles, header utilities
- `analyzeDualListSelectorChildren()` - Checks for tooltips, search, actions
- `analyzeMastheadChildren()` - Checks for vertical nav
- `analyzeMenuChildren()` - Checks for menu features (search, favorites, etc.)

---

## Summary

Each component goes through all 7 functions in order:
1. `inferRole()` - What it IS (from component name)
2. `inferPurpose()` - What it DOES (from name + props)
3. `inferVariant()` - How it LOOKS (from props + sometimes children)
4. `inferContext()` - Where it's USED (from parent context)
5. `inferState()` - Current STATE (from props)
6. `inferActionType()` - Type of ACTION (from name + props)
7. `inferSize()` - SIZE (from props)

If a function returns `null`, that attribute is not added to the component.

