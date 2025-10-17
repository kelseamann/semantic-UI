# Hierarchy System Test Example

## Complete Example: Modal > Form > Button

```tsx
import { SemanticProvider, Modal, Form, Button } from 'semantic-ui-layer';

function RegistrationModal() {
  return (
    <SemanticProvider>
      <Modal isOpen={true} purpose="form">
        <Form purpose="create">
          <Button variant="primary" onClick={handleSubmit}>
            Submit Registration
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Account
          </Button>
        </Form>
      </Modal>
    </SemanticProvider>
  );
}
```

## Resulting HTML with Semantic Metadata

### Modal (Visual Parent)
```html
<div
  data-semantic-name="Modal"
  data-semantic-path="Modal"
  data-parent="none"
  data-wrapper="none"
  data-num-parents="0"
  data-semantic-role="modal-form-blocking"
  data-purpose="form"
  data-interaction-type="blocking"
>
```

### Form (Wrapper inside Modal)
```html
<form
  data-semantic-name="Form"
  data-semantic-path="Modal > Form"
  data-parent="Modal"
  data-wrapper="none"
  data-num-parents="1"
  data-semantic-role="form-create"
  data-purpose="create"
>
```

### Submit Button (inside Form)
```html
<button
  data-semantic-name="Form Action"
  data-semantic-path="Modal > Form > Button"
  data-parent="Modal"
  data-wrapper="Form"
  data-num-parents="1"
  data-semantic-role="button-action-active"
  data-action-variant="primary"
  data-target="default"
  data-consequence="safe"
  data-affects-parent="false"
>
  Submit Registration
</button>
```

### Delete Button (inside Form)
```html
<button
  data-semantic-name="Form Action"
  data-semantic-path="Modal > Form > Button"
  data-parent="Modal"
  data-wrapper="Form"
  data-num-parents="1"
  data-semantic-role="button-action-active"
  data-action-variant="destructive"
  data-target="default"
  data-consequence="destructive-permanent"
  data-affects-parent="false"
>
  Delete Account
</button>
```

## What AI Can Now Understand

### 1. Hierarchy Queries
```javascript
// Find all buttons inside modal forms
document.querySelectorAll('[data-parent="Modal"][data-wrapper="Form"]');
// Returns: 2 buttons

// Find destructive actions in forms
document.querySelectorAll('[data-wrapper="Form"][data-consequence="destructive-permanent"]');
// Returns: "Delete Account" button
```

### 2. AI Prototyping Suggestions

**AI sees Submit button:**
- ✅ In a form (...data-wrapper="Form")
- ✅ Primary variant (data-action-variant="primary")
- ✅ Safe consequence
- ✅ Inside modal (data-parent="Modal")
- 💡 Suggestion: "Form submission in modal - consider adding loading state"

**AI sees Delete button:**
- ⚠️ Destructive action (data-consequence="destructive-permanent")
- ⚠️ In a form (data-wrapper="Form")
- ⚠️ Inside modal (data-parent="Modal")
- 🚨 Warning: "Destructive actions should have confirmation. Consider a nested confirmation modal or explicit confirmation checkbox."

### 3. Designer Can Query Issues
```javascript
// "Are there any destructive buttons without confirmation?"
const destructiveButtons = document.querySelectorAll('[data-consequence="destructive-permanent"]');

destructiveButtons.forEach(btn => {
  const parent = btn.getAttribute('data-parent');
  const wrapper = btn.getAttribute('data-wrapper');
  console.log(`Found: ${btn.textContent} in ${wrapper} (parent: ${parent})`);
  // AI suggests: Add confirmation for this action
});
```

## Component Breakdown

| Component | Type | Qualification | Purpose |
|-----------|------|---------------|---------|
| **Modal** | Visual Parent | Qualified (true) | User must open to see contents |
| **Form** | Wrapper | Not Qualified (false) | Always visible, organizes content |
| **Button** | Interactive | N/A | Takes action on Form data |

## Key Insights

1. **`data-semantic-name="Form Action"`** - Button acts on Form data (not Modal)
2. **`data-parent="Modal"`** - Button is inside a Modal (only 1 level deep)
3. **`data-wrapper="Form"`** - Button is wrapped by Form (its immediate context)
4. **`data-num-parents="1"`** - Only 1 visual parent to navigate through
5. **`data-semantic-path`** - Full path shows complete structure

## Next Steps

- [ ] Test with nested modals (Modal > Modal)
- [ ] Test with no parent (standalone Form)
- [ ] Test with Card wrapper (Modal > Card > Button)
- [ ] Test with multiple wrappers (Modal > Card > Form > Button)

