# Phase 2: Comprehensive Test Plan
## Hierarchy System - Visual Parents & Wrappers

## ✅ Implemented Components

### Visual Parents (Qualified)
- [x] **Modal** - Overlay that must be opened
- [x] **Drawer** - Side panel that must be expanded

### Wrappers (Not Qualified)
- [x] **Form** - Always visible, organizes inputs
- [x] **Card** - Always visible, groups content

---

## Test Scenarios

### 1. Single Visual Parent

#### Test 1.1: Modal > Button
```tsx
<Modal>
  <Button variant="primary">Close</Button>
</Modal>
```

**Expected Button Attributes:**
- `data-semantic-name="Modal Action"`
- `data-parent="Modal"`
- `data-wrapper="none"`
- `data-num-parents="1"`

#### Test 1.2: Drawer > Button
```tsx
<Drawer isExpanded={true}>
  <Button variant="secondary">Filter</Button>
</Drawer>
```

**Expected Button Attributes:**
- `data-semantic-name="Drawer Action"`
- `data-parent="Drawer"`
- `data-wrapper="none"`
- `data-num-parents="1"`

---

### 2. Single Wrapper

#### Test 2.1: Form > Button
```tsx
<Form>
  <Button variant="primary">Submit</Button>
</Form>
```

**Expected Button Attributes:**
- `data-semantic-name="Form Action"`
- `data-parent="none"`
- `data-wrapper="Form"`
- `data-num-parents="0"`

#### Test 2.2: Card > Button
```tsx
<Card>
  <Button variant="secondary">View Details</Button>
</Card>
```

**Expected Button Attributes:**
- `data-semantic-name="Card Action"`
- `data-parent="none"`
- `data-wrapper="Card"`
- `data-num-parents="0"`

---

### 3. Visual Parent + Wrapper (Priority: Wrapper Wins)

#### Test 3.1: Modal > Form > Button ⭐ PRIMARY USE CASE
```tsx
<Modal>
  <Form>
    <Button variant="danger">Delete Account</Button>
  </Form>
</Modal>
```

**Expected Button Attributes:**
- `data-semantic-name="Form Action"` ← Wrapper prioritized
- `data-semantic-path="Modal > Form > Button"`
- `data-parent="Modal"`
- `data-wrapper="Form"`
- `data-num-parents="1"`
- `data-action-variant="destructive"`
- `data-consequence="destructive-permanent"`

**AI Insight:** "Destructive action in modal form - should have confirmation"

#### Test 3.2: Modal > Card > Button
```tsx
<Modal>
  <Card>
    <Button variant="primary">Save Settings</Button>
  </Card>
</Modal>
```

**Expected Button Attributes:**
- `data-semantic-name="Card Action"` ← Wrapper prioritized
- `data-parent="Modal"`
- `data-wrapper="Card"`
- `data-num-parents="1"`

#### Test 3.3: Drawer > Form > Button
```tsx
<Drawer>
  <Form purpose="filter">
    <Button variant="primary">Apply Filters</Button>
  </Form>
</Drawer>
```

**Expected Button Attributes:**
- `data-semantic-name="Form Action"` ← Wrapper prioritized
- `data-parent="Drawer"`
- `data-wrapper="Form"`
- `data-num-parents="1"`

---

### 4. Multiple Wrappers (Last Wrapper Wins)

#### Test 4.1: Modal > Card > Form > Button
```tsx
<Modal>
  <Card>
    <Form>
      <Button variant="primary">Submit</Button>
    </Form>
  </Card>
</Modal>
```

**Expected Button Attributes:**
- `data-semantic-name="Form Action"` ← Last wrapper
- `data-semantic-path="Modal > Card > Form > Button"`
- `data-parent="Modal"`
- `data-wrapper="Form"` ← Immediate wrapper
- `data-num-parents="1"`

**AI Insight:** Form is immediate context, Card is just structure

---

### 5. Nested Visual Parents (Multiple Qualified)

#### Test 5.1: Modal > Drawer > Button ⚠️ RARE BUT VALID
```tsx
<Modal>
  <Drawer>
    <Button variant="secondary">Nested Action</Button>
  </Drawer>
</Modal>
```

**Expected Button Attributes:**
- `data-semantic-name="Drawer Action"` ← Immediate parent
- `data-semantic-path="Modal > Drawer > Button"`
- `data-parent="Drawer"` ← Immediate parent
- `data-wrapper="none"`
- `data-num-parents="2"` ← TWO visual parents!

**AI Warning:** "2+ nested visual parents - users may get lost"

#### Test 5.2: Modal > Drawer > Form > Button
```tsx
<Modal>
  <Drawer>
    <Form>
      <Button variant="primary">Save</Button>
    </Form>
  </Drawer>
</Modal>
```

**Expected Button Attributes:**
- `data-semantic-name="Form Action"` ← Wrapper prioritized
- `data-semantic-path="Modal > Drawer > Form > Button"`
- `data-parent="Drawer"` ← Immediate parent
- `data-wrapper="Form"`
- `data-num-parents="2"` ← Modal AND Drawer

---

### 6. Standalone (No Parent, No Wrapper)

#### Test 6.1: Standalone Button
```tsx
<Button variant="primary">Click Me</Button>
```

**Expected Button Attributes:**
- `data-semantic-name="Action"`
- `data-semantic-path="Button"`
- `data-parent="none"`
- `data-wrapper="none"`
- `data-num-parents="0"`

#### Test 6.2: Standalone Navigation Button
```tsx
<Button variant="link" href="/users">View Users</Button>
```

**Expected Button Attributes:**
- `data-semantic-name="Navigation"`
- `data-semantic-role="button-navigation-active"`
- `data-parent="none"`
- `data-wrapper="none"`
- `data-num-parents="0"`

---

### 7. Edge Cases

#### Test 7.1: Form > Card > Button (Wrappers Only)
```tsx
<Form>
  <Card>
    <Button variant="primary">Submit</Button>
  </Card>
</Form>
```

**Expected Button Attributes:**
- `data-semantic-name="Card Action"` ← Last wrapper
- `data-semantic-path="Form > Card > Button"`
- `data-parent="none"` ← No visual parents
- `data-wrapper="Card"` ← Immediate wrapper
- `data-num-parents="0"`

#### Test 7.2: Multiple Buttons in Same Context
```tsx
<Modal>
  <Form>
    <Button variant="primary">Submit</Button>
    <Button variant="secondary">Cancel</Button>
    <Button variant="danger">Delete</Button>
  </Form>
</Modal>
```

**All Buttons Should Have:**
- Same `data-parent="Modal"`
- Same `data-wrapper="Form"`
- Same `data-num-parents="1"`
- Different `data-action-variant` (primary, secondary, destructive)
- Different `data-consequence` (safe, safe, destructive-permanent)

**AI Insight:** "Form has 1 primary, 1 cancel, 1 destructive - good UX pattern"

---

## AI Queries to Test

### Query 1: Find All Destructive Actions in Modal Forms
```javascript
document.querySelectorAll('[data-parent="Modal"][data-wrapper="Form"][data-consequence="destructive-permanent"]')
```

**Should Find:** Test 3.1 button

### Query 2: Find Deeply Nested Components (2+ parents)
```javascript
document.querySelectorAll('[data-num-parents]:not([data-num-parents="0"]):not([data-num-parents="1"])')
```

**Should Find:** Tests 5.1, 5.2 buttons

**AI Suggests:** "Simplify navigation - too many layers"

### Query 3: Find All Actions in Drawers
```javascript
document.querySelectorAll('[data-parent="Drawer"]')
```

**Should Find:** Tests 1.2, 3.3, 5.1, 5.2 buttons

### Query 4: Find Forms Without Parents (Standalone Forms)
```javascript
document.querySelectorAll('form[data-parent="none"]')
```

**Should Find:** Tests 2.1, 7.1 forms

---

## Expected AI Suggestions by Scenario

| Test | AI Should Suggest |
|------|-------------------|
| 3.1 | "Destructive action in modal form needs confirmation" |
| 5.1 | "2 nested visual parents - users may get confused" |
| 5.2 | "3-layer navigation (Modal > Drawer > Form) - simplify?" |
| 7.2 Delete | "Destructive button should be visually separated from submit/cancel" |

---

## Testing Checklist

- [ ] Test 1.1: Modal > Button
- [ ] Test 1.2: Drawer > Button
- [ ] Test 2.1: Form > Button
- [ ] Test 2.2: Card > Button
- [ ] Test 3.1: Modal > Form > Button ⭐
- [ ] Test 3.2: Modal > Card > Button
- [ ] Test 3.3: Drawer > Form > Button
- [ ] Test 4.1: Modal > Card > Form > Button
- [ ] Test 5.1: Modal > Drawer > Button
- [ ] Test 5.2: Modal > Drawer > Form > Button
- [ ] Test 6.1: Standalone Button
- [ ] Test 6.2: Standalone Navigation Button
- [ ] Test 7.1: Form > Card > Button
- [ ] Test 7.2: Multiple Buttons in Same Context
- [ ] All AI Queries work correctly
- [ ] No console errors in SemanticContext
- [ ] All data attributes render correctly

---

## Next: Create Automated Tests

After manual verification, create Jest tests for each scenario.

