# Component Implementation Checklist

Use this checklist when implementing each new semantic component wrapper.

## Pre-Implementation
- [ ] Review PatternFly component documentation
- [ ] Identify all props and their purposes
- [ ] Determine semantic properties to add
- [ ] Decide on category and complexity
- [ ] Plan auto-inference logic

## Implementation
- [ ] Run component generator script
- [ ] Extend PatternFly component props properly
- [ ] Add semantic-specific props with TypeScript types
- [ ] Implement auto-inference logic
- [ ] Add semantic metadata generation
- [ ] Include proper data attributes
- [ ] Add JSDoc comments and examples
- [ ] Handle edge cases (null, undefined, etc.)
- [ ] Preserve all PatternFly functionality
- [ ] Support ref forwarding if needed

## Testing
- [ ] Create unit test file
- [ ] Test basic rendering
- [ ] Test semantic metadata attributes
- [ ] Test auto-inference logic
- [ ] Test prop forwarding
- [ ] Test with various prop combinations
- [ ] Test accessibility features
- [ ] Test TypeScript types
- [ ] Achieve >90% code coverage

## Documentation
- [ ] Add JSDoc to component interface
- [ ] Add usage examples in JSDoc
- [ ] Document semantic props purpose
- [ ] Add to component README
- [ ] Create Storybook story (if applicable)
- [ ] Add migration example from PatternFly

## Integration
- [ ] Export from category index.ts
- [ ] Export from main index.ts
- [ ] Update INTEGRATION_STRATEGY.md
- [ ] Add to component list
- [ ] Check bundle size impact
- [ ] Verify tree-shaking works

## Quality Checks
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Passes all tests
- [ ] Bundle size acceptable
- [ ] No console warnings
- [ ] Accessibility audit passed
- [ ] Works with SemanticContext
- [ ] Works with validation utilities

## Example Checklist for TextInput

### Pre-Implementation
- [x] Reviewed PatternFly TextInput docs
- [x] Identified props: value, onChange, type, placeholder, etc.
- [x] Semantic props: inputType, purpose, validationContext
- [x] Category: forms, Complexity: simple
- [x] Plan: Infer purpose from type (email, password, etc.)

### Implementation
- [x] Generated component file
- [x] Extended TextInput props
- [x] Added inputType, purpose, validationContext props
- [x] Auto-infer purpose from type prop
- [x] Generated metadata with field context
- [x] Added data-input-type, data-purpose attributes
- [x] JSDoc with examples
- [x] Handled controlled/uncontrolled
- [x] All PatternFly props forwarded
- [x] forwardRef for form integration

### Testing
- [x] Created TextInput.test.tsx
- [x] Tests rendering
- [x] Tests metadata
- [x] Tests inference (type="email" → purpose="email-input")
- [x] Tests onChange forwarding
- [x] Tests various types
- [x] Tests accessibility
- [x] Tests types compile
- [x] 95% coverage

### Documentation
- [x] JSDoc on interface
- [x] Usage examples
- [x] Semantic props documented
- [x] Added to forms README
- [x] Created Storybook story
- [x] Migration example

### Integration
- [x] Exported from forms/index.ts
- [x] Exported from main index
- [x] Updated strategy doc
- [x] Added to Priority 2 list
- [x] Bundle size +2KB (acceptable)
- [x] Tree-shaking verified

### Quality
- [x] Zero TS errors
- [x] Zero lint errors
- [x] All tests pass
- [x] Bundle acceptable
- [x] No warnings
- [x] WCAG AA compliant
- [x] Context integration works
- [x] Validation works

