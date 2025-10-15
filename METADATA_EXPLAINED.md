# AI Metadata & Semantic Role Explained

## Overview

Your library's power comes from two critical pieces of data attached to every component:

1. **`semanticRole`** - A unique identifier describing what the component does and where it's used
2. **`aiMetadata`** - Rich structured data that AI tools can parse and understand

Let's break down exactly how these work in your Button component.

## How It Works Currently

### Step 1: Props Coming In

```typescript
<Button 
  variant="danger"      // From PatternFly
  onClick={handleDelete} // From PatternFly
  action="destructive"  // NEW: Your semantic prop (optional)
  context="modal"       // NEW: Your semantic prop (optional)
  aiMetadata={...}      // NEW: Custom AI metadata (optional)
  semanticRole="..."    // NEW: Custom role (optional)
>
  Delete
</Button>
```

### Step 2: Auto-Inference (Lines 25-30 in Button.tsx)

The component **automatically figures out** what it's for:

```typescript
// Line 26-28: Infer ACTION from PatternFly's variant
const inferredAction = action || (
  variant === 'primary' ? 'primary' : 
  variant === 'danger' ? 'destructive' :   // ✅ This matches!
  variant === 'link' ? 'navigation' : 
  'secondary'
);
// Result: inferredAction = "destructive"

// Line 30: Infer CONTEXT from PatternFly props
const inferredContext = context || (onClick ? 'interactive' : 'form');
// Result: inferredContext = "interactive" (because onClick exists)
```

**Key Point**: You can provide `action` and `context` explicitly, OR let the component infer them from PatternFly props. This makes your library both powerful AND easy to use.

### Step 3: Generate semanticRole (Line 33)

```typescript
const role = semanticRole || `button-${inferredAction}-${inferredContext}`;
// Result: "button-destructive-interactive"
```

This creates a **unique, descriptive identifier** that tells AI:
- It's a `button`
- It performs a `destructive` action
- It's in an `interactive` context

### Step 4: Generate aiMetadata (Lines 34-39)

```typescript
const metadata = aiMetadata || {
  description: `${inferredAction} action button for ${inferredContext} context`,
  // Result: "destructive action button for interactive context"
  
  category: 'forms',           // What type of component
  complexity: 'simple',        // How complex to use
  usage: [                     // How it's used
    `${inferredContext}-${inferredAction}`, 
    'user-interaction'
  ]
  // Result: ["interactive-destructive", "user-interaction"]
};
```

### Step 5: Attach to DOM (Lines 50-54)

```typescript
<PFButton
  {...props}
  data-semantic-name="Button"
  data-semantic-role="button-destructive-interactive"
  data-ai-metadata='{"description":"destructive action button for interactive context","category":"forms","complexity":"simple","usage":["interactive-destructive","user-interaction"]}'
  data-action="destructive"
  data-context="interactive"
>
  Delete
</PFButton>
```

The AI can now read the DOM and understand **exactly** what this button does!

## Current Metadata Structure

### SemanticComponentProps (defined in `src/types/index.ts`)

```typescript
export interface SemanticComponentProps {
  /** Human-readable semantic name for the component instance */
  semanticName?: string;
  
  /** Semantic role or purpose of the component */
  semanticRole?: string;
  
  /** Additional metadata for AI tooling */
  aiMetadata?: {
    description?: string;           // What this component does
    category?: string;              // Component category
    complexity?: 'simple' | 'moderate' | 'complex';
    accessibility?: string[];       // A11y features
    usage?: string[];              // Usage patterns
  };
  
  /** Accessibility enhancements */
  accessibility?: {
    ariaLabel?: string;
    ariaDescription?: string;
    keyboardShortcuts?: string[];
  };
}
```

## What Props Are Tracked?

Looking at Button.tsx:

### Destructured Props (Lines 14-23)
```typescript
export const Button: React.FC<ButtonProps> = ({
  semanticRole,    // ✅ USER PROVIDED - Custom semantic role
  aiMetadata,      // ✅ USER PROVIDED - Custom AI metadata
  action,          // ✅ USER PROVIDED - Semantic action type
  context,         // ✅ USER PROVIDED - Usage context
  children,        // ⚛️  REACT - Button content
  variant,         // 🎨 PATTERNFLY - Visual style (also used for inference!)
  onClick,         // 🎨 PATTERNFLY - Click handler (used for inference!)
  isDisabled,      // 🎨 PATTERNFLY - Disabled state
  ...props         // 🎨 PATTERNFLY - All other PatternFly props
}) => {
```

**Why track these specific props?**
- **semanticRole, aiMetadata**: Direct user customization
- **action, context**: Semantic-specific props for clarity
- **variant, onClick, isDisabled**: PatternFly props that help infer semantic meaning
- **children**: Standard React prop
- **...props**: Pass through all other PatternFly functionality

## How to Tailor Metadata for AI

### Current Issues & Opportunities

#### 1. **Description is Too Generic**
```typescript
// Current (Line 35)
description: `${inferredAction} action button for ${inferredContext} context`
// Result: "destructive action button for interactive context"

// ❌ Problem: Too mechanical, not conversational
```

#### 2. **Category is Hardcoded**
```typescript
// Current (Line 36)
category: 'forms'

// ❌ Problem: Not all buttons are forms! 
// A navigation button shouldn't be in "forms" category
```

#### 3. **Complexity Doesn't Consider Props**
```typescript
// Current (Line 37)
complexity: 'simple'

// ❌ Problem: Always simple, even for complex buttons with icons, loading states, etc.
```

#### 4. **Usage is Too Abstract**
```typescript
// Current (Line 38)
usage: [`${inferredContext}-${inferredAction}`, 'user-interaction']
// Result: ["interactive-destructive", "user-interaction"]

// ❌ Problem: AI might not understand "interactive-destructive"
// Better: ["delete-record", "confirm-action", "modal-dismiss"]
```

## Improved Metadata Strategy

### What AI Really Needs

AI tools (like Cursor, GitHub Copilot, ChatGPT-4) consume this metadata to:

1. **Suggest code**: "User wants a delete button → suggest Button with variant='danger'"
2. **Explain code**: "This button deletes the user's account"
3. **Generate tests**: "Test that clicking this button calls the delete handler"
4. **Find bugs**: "This destructive button has no confirmation dialog"
5. **Refactor**: "These 5 buttons are all doing similar things, consolidate?"

### Enhanced Metadata Structure

```typescript
interface EnhancedAIMetadata {
  // Core identification
  description: string;          // Natural language: "Deletes the selected user from the database"
  category: string;             // Semantic category, not visual
  complexity: 'simple' | 'moderate' | 'complex';
  
  // Intent & behavior
  intent: string;               // What the user wants to achieve: "delete", "submit", "cancel"
  consequence: string;          // What happens: "destructive", "safe", "navigational"
  requiresConfirmation: boolean; // Should this action be confirmed?
  
  // Context & relationships
  usage: string[];              // Concrete use cases
  relatedComponents: string[];  // What components typically appear with this
  userFlow: string[];           // Typical user journey
  
  // Accessibility & UX
  accessibility: string[];      // A11y features
  uxPatterns: string[];        // Common UX patterns this follows
  
  // Technical details
  dataImpact: 'read' | 'write' | 'delete' | 'none';  // Does it modify data?
  apiCalls: string[];          // What APIs it typically calls
  stateChanges: string[];      // What state it modifies
}
```

### Example: Enhanced Button Metadata

```typescript
// Current
{
  description: "destructive action button for interactive context",
  category: "forms",
  complexity: "simple",
  usage: ["interactive-destructive", "user-interaction"]
}

// Enhanced
{
  description: "Permanently deletes a user record with confirmation dialog",
  category: "actions",
  complexity: "moderate", // has confirmation flow
  
  intent: "delete-user",
  consequence: "destructive-permanent",
  requiresConfirmation: true,
  
  usage: [
    "user-management",
    "data-deletion", 
    "admin-actions"
  ],
  relatedComponents: [
    "Modal",          // for confirmation
    "Alert",          // for error handling
    "Table"           // where it's typically used
  ],
  userFlow: [
    "view-user-list",
    "select-user",
    "click-delete-button",
    "confirm-in-modal",
    "show-success-toast"
  ],
  
  accessibility: [
    "keyboard-accessible",
    "screen-reader-friendly",
    "high-contrast-mode"
  ],
  uxPatterns: [
    "confirmation-required",
    "destructive-action-pattern",
    "undo-not-available"
  ],
  
  dataImpact: "delete",
  apiCalls: ["DELETE /api/users/:id"],
  stateChanges: ["remove-from-user-list", "update-user-count"]
}
```

## Metadata Generation Strategies

### 1. **Static Analysis** (Current)
Look at PatternFly props to infer meaning:
```typescript
variant === 'danger' → action: 'destructive'
onClick exists → context: 'interactive'
```

### 2. **Prop Composition Analysis** (New Opportunity)
```typescript
// If button has BOTH:
if (variant === 'danger' && onClick && !isDisabled) {
  metadata.requiresConfirmation = true;
  metadata.consequence = 'destructive-immediate';
}

// If button has loading state:
if (props.isLoading) {
  metadata.complexity = 'moderate';
  metadata.stateChanges.push('async-operation-in-progress');
}
```

### 3. **Context Provider Integration** (Already have!)
Your `SemanticContext` can track hierarchy:
```typescript
<Modal purpose="confirmation">
  <Button variant="danger">Delete</Button>
  {/* Button knows it's in a confirmation modal! */}
</Modal>

// Enhanced metadata:
metadata.context = "confirmation-modal";
metadata.userFlow = ["modal-opened", "user-confirms", "action-executed"];
```

### 4. **Children Analysis**
```typescript
// Analyze button text
if (children.includes('Delete')) {
  metadata.intent = 'delete';
} else if (children.includes('Submit')) {
  metadata.intent = 'submit';
} else if (children.includes('Cancel')) {
  metadata.intent = 'cancel';
}
```

### 5. **Icon Analysis**
```typescript
if (props.icon?.type?.name === 'TrashIcon') {
  metadata.intent = 'delete';
  metadata.dataImpact = 'delete';
}
```

## Next Steps: Tailoring Your Metadata

### Phase 1: Enhance Inference (src/utils/inference.ts)
Add more sophisticated inference functions:
```typescript
// NEW functions to add:
export const inferIntent = (props, children) => { ... }
export const inferConsequence = (action, context) => { ... }
export const inferDataImpact = (action, intent) => { ... }
export const inferRequiresConfirmation = (consequence, context) => { ... }
```

### Phase 2: Enrich Metadata Structure (src/types/index.ts)
Expand the `aiMetadata` interface:
```typescript
aiMetadata?: {
  // Existing
  description?: string;
  category?: string;
  complexity?: 'simple' | 'moderate' | 'complex';
  accessibility?: string[];
  usage?: string[];
  
  // NEW
  intent?: string;
  consequence?: string;
  requiresConfirmation?: boolean;
  relatedComponents?: string[];
  userFlow?: string[];
  uxPatterns?: string[];
  dataImpact?: 'read' | 'write' | 'delete' | 'none';
}
```

### Phase 3: Update Components
Enhance each component's metadata generation:
```typescript
const metadata = aiMetadata || {
  description: generateNaturalDescription(inferredAction, inferredContext, children),
  category: inferCategory(inferredAction, inferredContext),
  complexity: inferComplexity(Object.keys(props).length, inferredAction),
  
  intent: inferIntent(props, children),
  consequence: inferConsequence(inferredAction, inferredContext),
  requiresConfirmation: inferRequiresConfirmation(inferredAction),
  
  usage: inferUsagePatterns(inferredAction, inferredContext),
  relatedComponents: getRelatedComponents(inferredAction, inferredContext),
  
  accessibility: inferAccessibilityFeatures(props),
  uxPatterns: inferUXPatterns(inferredAction, inferredContext),
  
  dataImpact: inferDataImpact(inferredAction),
};
```

## Example: Real-World Scenarios

### Scenario 1: Delete User Button in Admin Panel
```tsx
<Button 
  variant="danger"
  onClick={handleDeleteUser}
  context="table"
  icon={<TrashIcon />}
>
  Delete User
</Button>
```

**Current Metadata:**
```json
{
  "description": "destructive action button for interactive context",
  "category": "forms",
  "complexity": "simple"
}
```

**Enhanced Metadata:**
```json
{
  "description": "Permanently removes the selected user from the system with confirmation",
  "category": "admin-actions",
  "complexity": "moderate",
  "intent": "delete-user",
  "consequence": "destructive-permanent",
  "requiresConfirmation": true,
  "usage": ["user-management", "admin-dashboard", "data-deletion"],
  "relatedComponents": ["Table", "Modal", "Alert"],
  "userFlow": ["select-row", "click-delete", "confirm-modal", "show-toast"],
  "dataImpact": "delete",
  "apiCalls": ["DELETE /api/users/:id"],
  "accessibility": ["keyboard-accessible", "screen-reader-announces-consequence"],
  "uxPatterns": ["confirmation-required", "destructive-action", "undo-unavailable"]
}
```

**What AI Can Do:**
- ✅ Suggest adding a confirmation modal
- ✅ Warn if no error handling is present
- ✅ Generate appropriate tests
- ✅ Suggest adding undo functionality
- ✅ Check for proper RBAC/permissions

### Scenario 2: Submit Form Button
```tsx
<Button 
  type="submit"
  variant="primary"
  isLoading={submitting}
>
  Save Changes
</Button>
```

**Enhanced Metadata:**
```json
{
  "description": "Submits the form data to save user changes",
  "category": "form-actions",
  "complexity": "moderate",
  "intent": "submit-form",
  "consequence": "safe-write",
  "requiresConfirmation": false,
  "usage": ["form-submission", "data-entry", "settings-panel"],
  "relatedComponents": ["Form", "TextInput", "Toast"],
  "userFlow": ["fill-form", "click-submit", "show-loading", "show-success"],
  "dataImpact": "write",
  "stateChanges": ["form-submitting", "validation-active"],
  "accessibility": ["keyboard-submit-enter", "loading-announced"],
  "uxPatterns": ["loading-state", "disabled-while-submitting", "validation-feedback"]
}
```

**What AI Can Do:**
- ✅ Suggest adding form validation
- ✅ Recommend loading state handling
- ✅ Generate success/error toast messages
- ✅ Check for duplicate submission prevention
- ✅ Suggest keyboard shortcuts

## Summary

### Current System (✅ Working!)
- Infers `action` from PatternFly's `variant`
- Infers `context` from presence of `onClick`
- Generates basic `semanticRole` and `aiMetadata`
- Allows manual override of everything

### Improvement Opportunities
1. **Richer descriptions** - Natural language, not template strings
2. **Dynamic categories** - Based on semantic meaning, not hardcoded
3. **Contextual complexity** - Analyze props to determine complexity
4. **Intent detection** - Understand what user wants to achieve
5. **Consequence awareness** - Know the impact of actions
6. **Relationship mapping** - Connect related components
7. **User flow tracking** - Document typical usage patterns
8. **Data impact analysis** - Understand CRUD operations

### The Goal
Make metadata so rich that AI can:
- **Write better code** using your components
- **Explain code** to developers
- **Find bugs** by understanding intent vs implementation
- **Generate tests** that cover real user scenarios
- **Suggest improvements** based on UX patterns
- **Refactor intelligently** by understanding relationships

Would you like me to:
1. Create enhanced metadata for your existing 17 components?
2. Build the enhanced inference utilities?
3. Show examples of how AI tools will consume this data?

