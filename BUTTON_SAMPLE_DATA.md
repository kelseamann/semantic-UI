# Button Component Sample Data Output

This document provides comprehensive sample data output for the Button component, demonstrating various configurations and their generated semantic metadata.

## Basic Button Examples

### 1. Primary Action Button
```tsx
<Button variant="primary" onClick={handleSubmit}>
  Save Changes
</Button>
```

**Generated Semantic Metadata:**
```json
{
  "semanticName": "Action",
  "semanticRole": "button-action-default",
  "action": "primary",
  "context": "default",
  "target": "default",
  "consequence": "safe",
  "affectsParent": false,
  "dataAttributes": {
    "data-semantic-name": "Action",
    "data-semantic-path": "Action",
    "data-parent": "none",
    "data-wrapper": "none",
    "data-num-parents": 0,
    "data-semantic-role": "button-action-default",
    "data-action-variant": "primary",
    "data-target": "default",
    "data-consequence": "safe",
    "data-affects-parent": false
  }
}
```

### 2. Secondary Button
```tsx
<Button variant="secondary" onClick={handleCancel}>
  Cancel
</Button>
```

**Generated Semantic Metadata:**
```json
{
  "semanticName": "Action",
  "semanticRole": "button-action-default",
  "action": "secondary",
  "context": "default",
  "target": "default",
  "consequence": "safe",
  "affectsParent": false,
  "dataAttributes": {
    "data-semantic-name": "Action",
    "data-semantic-path": "Action",
    "data-parent": "none",
    "data-wrapper": "none",
    "data-num-parents": 0,
    "data-semantic-role": "button-action-default",
    "data-action-variant": "secondary",
    "data-target": "default",
    "data-consequence": "safe",
    "data-affects-parent": false
  }
}
```

### 3. Destructive Button
```tsx
<Button variant="danger" onClick={handleDelete}>
  Delete Item
</Button>
```

**Generated Semantic Metadata:**
```json
{
  "semanticName": "Action",
  "semanticRole": "button-destructive-default",
  "action": "destructive",
  "context": "default",
  "target": "default",
  "consequence": "destructive-permanent",
  "affectsParent": false,
  "dataAttributes": {
    "data-semantic-name": "Action",
    "data-semantic-path": "Action",
    "data-parent": "none",
    "data-wrapper": "none",
    "data-num-parents": 0,
    "data-semantic-role": "button-destructive-default",
    "data-action-variant": "destructive",
    "data-target": "default",
    "data-consequence": "destructive-permanent",
    "data-affects-parent": false
  }
}
```

## Navigation Buttons

### 4. Internal Navigation Link
```tsx
<Button href="/dashboard" variant="link">
  Go to Dashboard
</Button>
```

**Generated Semantic Metadata:**
```json
{
  "semanticName": "Navigation",
  "semanticRole": "button-navigation-default",
  "action": "navigation",
  "context": "default",
  "target": "default",
  "consequence": "safe",
  "affectsParent": false,
  "dataAttributes": {
    "data-semantic-name": "Navigation",
    "data-semantic-path": "Navigation",
    "data-parent": "none",
    "data-wrapper": "none",
    "data-num-parents": 0,
    "data-semantic-role": "button-navigation-default",
    "data-action-variant": "link",
    "data-target": "default",
    "data-consequence": "safe",
    "data-affects-parent": false
  }
}
```

### 5. External Link Button
```tsx
<Button href="https://example.com" target="_blank" variant="link">
  Visit External Site
</Button>
```

**Generated Semantic Metadata:**
```json
{
  "semanticName": "External Link",
  "semanticRole": "button-external-default",
  "action": "external",
  "context": "default",
  "target": "_blank",
  "consequence": "safe",
  "affectsParent": false,
  "dataAttributes": {
    "data-semantic-name": "External Link",
    "data-semantic-path": "External Link",
    "data-parent": "none",
    "data-wrapper": "none",
    "data-num-parents": 0,
    "data-semantic-role": "button-external-default",
    "data-action-variant": "link",
    "data-target": "_blank",
    "data-consequence": "safe",
    "data-affects-parent": false
  }
}
```

## Contextual Buttons (with Hierarchy)

### 6. Modal Action Button
```tsx
<SemanticContext.Provider value={contextValue}>
  <Modal isOpen={true}>
    <Button variant="primary" onClick={handleModalAction}>
      Confirm
    </Button>
  </Modal>
</SemanticContext.Provider>
```

**Generated Semantic Metadata:**
```json
{
  "semanticName": "Modal Action",
  "semanticRole": "button-action-modal",
  "action": "primary",
  "context": "modal",
  "target": "default",
  "consequence": "safe",
  "affectsParent": false,
  "dataAttributes": {
    "data-semantic-name": "Modal Action",
    "data-semantic-path": "Modal > Modal Action",
    "data-parent": "Modal",
    "data-wrapper": "Modal",
    "data-num-parents": 1,
    "data-semantic-role": "button-action-modal",
    "data-action-variant": "primary",
    "data-target": "default",
    "data-consequence": "safe",
    "data-affects-parent": false
  }
}
```

### 7. Form Submit Button
```tsx
<SemanticContext.Provider value={contextValue}>
  <Form>
    <Button type="submit" variant="primary">
      Submit Form
    </Button>
  </Form>
</SemanticContext.Provider>
```

**Generated Semantic Metadata:**
```json
{
  "semanticName": "Form Action",
  "semanticRole": "button-action-form",
  "action": "primary",
  "context": "form",
  "target": "default",
  "consequence": "safe",
  "affectsParent": false,
  "dataAttributes": {
    "data-semantic-name": "Form Action",
    "data-semantic-path": "Form > Form Action",
    "data-parent": "Form",
    "data-wrapper": "Form",
    "data-num-parents": 1,
    "data-semantic-role": "button-action-form",
    "data-action-variant": "primary",
    "data-target": "default",
    "data-consequence": "safe",
    "data-affects-parent": false
  }
}
```

### 8. Card Action Button
```tsx
<SemanticContext.Provider value={contextValue}>
  <Card>
    <Button variant="secondary" onClick={handleCardAction}>
      View Details
    </Button>
  </Card>
</SemanticContext.Provider>
```

**Generated Semantic Metadata:**
```json
{
  "semanticName": "Card Action",
  "semanticRole": "button-action-card",
  "action": "secondary",
  "context": "card",
  "target": "default",
  "consequence": "safe",
  "affectsParent": false,
  "dataAttributes": {
    "data-semantic-name": "Card Action",
    "data-semantic-path": "Card > Card Action",
    "data-parent": "Card",
    "data-wrapper": "Card",
    "data-num-parents": 1,
    "data-semantic-role": "button-action-card",
    "data-action-variant": "secondary",
    "data-target": "default",
    "data-consequence": "safe",
    "data-affects-parent": false
  }
}
```

## Specialized Button Types

### 9. Toggle Button
```tsx
<Button variant="control" onClick={handleToggle}>
  Toggle Feature
</Button>
```

**Generated Semantic Metadata:**
```json
{
  "semanticName": "Action",
  "semanticRole": "button-toggle-default",
  "action": "toggle",
  "context": "default",
  "target": "default",
  "consequence": "safe",
  "affectsParent": false,
  "dataAttributes": {
    "data-semantic-name": "Action",
    "data-semantic-path": "Action",
    "data-parent": "none",
    "data-wrapper": "none",
    "data-num-parents": 0,
    "data-semantic-role": "button-toggle-default",
    "data-action-variant": "toggle",
    "data-target": "default",
    "data-consequence": "safe",
    "data-affects-parent": false
  }
}
```

### 10. Disabled Button
```tsx
<Button variant="primary" isDisabled>
  Disabled Action
</Button>
```

**Generated Semantic Metadata:**
```json
{
  "semanticName": "Action",
  "semanticRole": "button-action-disabled",
  "action": "primary",
  "context": "disabled",
  "target": "default",
  "consequence": "safe",
  "affectsParent": false,
  "dataAttributes": {
    "data-semantic-name": "Action",
    "data-semantic-path": "Action",
    "data-parent": "none",
    "data-wrapper": "none",
    "data-num-parents": 0,
    "data-semantic-role": "button-action-disabled",
    "data-action-variant": "primary",
    "data-target": "default",
    "data-consequence": "safe",
    "data-affects-parent": false
  }
}
```

## Custom Semantic Properties

### 11. Custom Semantic Name
```tsx
<Button 
  variant="primary" 
  semanticName="Save User Profile"
  onClick={handleSave}
>
  Save
</Button>
```

**Generated Semantic Metadata:**
```json
{
  "semanticName": "Save User Profile",
  "semanticRole": "button-action-default",
  "action": "primary",
  "context": "default",
  "target": "default",
  "consequence": "safe",
  "affectsParent": false,
  "dataAttributes": {
    "data-semantic-name": "Save User Profile",
    "data-semantic-path": "Save User Profile",
    "data-parent": "none",
    "data-wrapper": "none",
    "data-num-parents": 0,
    "data-semantic-role": "button-action-default",
    "data-action-variant": "primary",
    "data-target": "default",
    "data-consequence": "safe",
    "data-affects-parent": false
  }
}
```

### 12. Custom Semantic Role
```tsx
<Button 
  variant="secondary" 
  semanticRole="button-workflow-step"
  onClick={handleNext}
>
  Next Step
</Button>
```

**Generated Semantic Metadata:**
```json
{
  "semanticName": "Action",
  "semanticRole": "button-workflow-step",
  "action": "secondary",
  "context": "default",
  "target": "default",
  "consequence": "safe",
  "affectsParent": false,
  "dataAttributes": {
    "data-semantic-name": "Action",
    "data-semantic-path": "Action",
    "data-parent": "none",
    "data-wrapper": "none",
    "data-num-parents": 0,
    "data-semantic-role": "button-workflow-step",
    "data-action-variant": "secondary",
    "data-target": "default",
    "data-consequence": "safe",
    "data-affects-parent": false
  }
}
```

## Parent-Affecting Buttons

### 13. Modal Close Button
```tsx
<Button 
  variant="plain" 
  target="parent-modal"
  onClick={handleClose}
>
  Close
</Button>
```

**Generated Semantic Metadata:**
```json
{
  "semanticName": "Action",
  "semanticRole": "button-action-default",
  "action": "plain",
  "context": "default",
  "target": "parent-modal",
  "consequence": "safe",
  "affectsParent": true,
  "dataAttributes": {
    "data-semantic-name": "Action",
    "data-semantic-path": "Action",
    "data-parent": "none",
    "data-wrapper": "none",
    "data-num-parents": 0,
    "data-semantic-role": "button-action-default",
    "data-action-variant": "plain",
    "data-target": "parent-modal",
    "data-consequence": "safe",
    "data-affects-parent": true
  }
}
```

### 14. Form Reset Button
```tsx
<Button 
  variant="secondary" 
  target="parent-form"
  onClick={handleReset}
>
  Reset Form
</Button>
```

**Generated Semantic Metadata:**
```json
{
  "semanticName": "Action",
  "semanticRole": "button-action-default",
  "action": "secondary",
  "context": "default",
  "target": "parent-form",
  "consequence": "safe",
  "affectsParent": true,
  "dataAttributes": {
    "data-semantic-name": "Action",
    "data-semantic-path": "Action",
    "data-parent": "none",
    "data-wrapper": "none",
    "data-num-parents": 0,
    "data-semantic-role": "button-action-default",
    "data-action-variant": "secondary",
    "data-target": "parent-form",
    "data-consequence": "safe",
    "data-affects-parent": true
  }
}
```

## Complex Hierarchy Example

### 15. Nested Context Button
```tsx
<SemanticContext.Provider value={contextValue}>
  <Modal isOpen={true}>
    <Card>
      <Form>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </Card>
  </Modal>
</SemanticContext.Provider>
```

**Generated Semantic Metadata:**
```json
{
  "semanticName": "Modal Action",
  "semanticRole": "button-action-modal",
  "action": "primary",
  "context": "modal",
  "target": "default",
  "consequence": "safe",
  "affectsParent": false,
  "dataAttributes": {
    "data-semantic-name": "Modal Action",
    "data-semantic-path": "Modal > Card > Form > Modal Action",
    "data-parent": "Form",
    "data-wrapper": "Modal",
    "data-num-parents": 3,
    "data-semantic-role": "button-action-modal",
    "data-action-variant": "primary",
    "data-target": "default",
    "data-consequence": "safe",
    "data-affects-parent": false
  }
}
```

## AI Metadata Examples

### 16. Button with Full AI Metadata
```tsx
<Button 
  variant="primary"
  onClick={handleSave}
  aiMetadata={{
    description: "Saves user profile changes to the database",
    category: "button",
    accessibility: ["keyboard-navigable", "screen-reader-friendly"],
    usage: ["user-interface", "user-interaction", "form-submission"],
    hierarchy: {
      parents: ["ProfileForm"],
      depth: 1,
      path: "ProfileForm > SaveButton"
    },
    action: {
      type: "save",
      target: "database",
      consequence: "safe",
      affectsParent: false
    }
  }}
>
  Save Profile
</Button>
```

**Generated Semantic Metadata:**
```json
{
  "semanticName": "Action",
  "semanticRole": "button-action-default",
  "action": "primary",
  "context": "default",
  "target": "default",
  "consequence": "safe",
  "affectsParent": false,
  "aiMetadata": {
    "description": "Saves user profile changes to the database",
    "category": "button",
    "accessibility": ["keyboard-navigable", "screen-reader-friendly"],
    "usage": ["user-interface", "user-interaction", "form-submission"],
    "hierarchy": {
      "parents": ["ProfileForm"],
      "depth": 1,
      "path": "ProfileForm > SaveButton"
    },
    "action": {
      "type": "save",
      "target": "database",
      "consequence": "safe",
      "affectsParent": false
    }
  },
  "dataAttributes": {
    "data-semantic-name": "Action",
    "data-semantic-path": "Action",
    "data-parent": "none",
    "data-wrapper": "none",
    "data-num-parents": 0,
    "data-semantic-role": "button-action-default",
    "data-action-variant": "primary",
    "data-target": "default",
    "data-consequence": "safe",
    "data-affects-parent": false
  }
}
```

## Summary of Button Variants and Their Semantic Properties

| Variant | Action Type | Action Variant | Consequence | Typical Use Case |
|---------|-------------|----------------|-------------|------------------|
| `primary` | `action` | `primary` | `safe` | Main actions, form submission |
| `secondary` | `action` | `secondary` | `safe` | Secondary actions, cancel |
| `danger` | `action` | `destructive` | `destructive-permanent` | Delete, remove operations |
| `control` | `action` | `toggle` | `safe` | Toggle states, controls |
| `tertiary` | `action` | `tertiary` | `safe` | Tertiary actions |
| `plain` | `action` | `plain` | `safe` | Minimal styling actions |
| `link` | `action` | `link` | `safe` | Link-style buttons |

## Context Inference Rules

| Context | Triggered By | Description |
|---------|--------------|-------------|
| `default` | No specific context | Standard button context |
| `active` | Has `onClick` or `onSubmit` | Interactive button |
| `disabled` | `isDisabled={true}` | Disabled button |
| `readonly` | `isReadOnly={true}` | Read-only button |

## Target Types

| Target | Description | Affects Parent |
|--------|-------------|----------------|
| `default` | Standard button behavior | `false` |
| `parent-modal` | Closes or affects parent modal | `true` |
| `parent-form` | Resets or affects parent form | `true` |
| `_blank` | Opens in new window/tab | `false` |

This sample data demonstrates the comprehensive semantic metadata generation capabilities of the Button component, showing how different configurations produce meaningful semantic information for AI tooling and accessibility.



