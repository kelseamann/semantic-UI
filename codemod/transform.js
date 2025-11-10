/**
 * JSCodeShift Transform: Add Semantic Data Attributes to PatternFly Components
 * 
 * This transform adds standardized data-* attributes to all PatternFly components
 * in user code, making them more AI-friendly. Attributes appear on rendered DOM elements.
 * 
 * Usage:
 *   jscodeshift -t codemod/transform.js path/to/files
 */

const {
  inferRole,
  inferPurpose,
  inferVariant,
  inferContext,
  inferState,
  inferActionType,
  inferSize,
  inferActionListVariant,
  isPatternFlyComponent,
  STANDARD_ATTRIBUTES,
} = require('./static-inference');

/**
 * Semantic attribute names (without 'data-' prefix)
 */
const SEMANTIC_ATTR_NAMES = STANDARD_ATTRIBUTES.map(attr => attr.replace('data-', ''));

/**
 * Check if element already has semantic attributes
 */
function hasSemanticAttributes(attributes) {
  if (!attributes || attributes.length === 0) {
    return false;
  }
  
  return attributes.some(attr => {
    const name = attr.name?.name || attr.name?.value;
    if (!name) return false;
    
    // Check for old format (data-semantic-*) or new format (data-role, etc.)
    return name.startsWith('data-semantic-') || SEMANTIC_ATTR_NAMES.includes(name.replace('data-', ''));
  });
}

/**
 * Find parent context by traversing up the AST
 */
function findParentContext(path, imports) {
  let current = path.parent;
  let depth = 0;
  const maxDepth = 10; // Prevent infinite loops
  
  while (current && depth < maxDepth) {
    if (current.value) {
      const node = current.value;
      
      // Check if parent is a JSX element
      if (node.type === 'JSXElement' && node.openingElement) {
        const parentName = node.openingElement.name?.name;
        if (parentName && isPatternFlyComponent(parentName, imports)) {
          const parentProps = node.openingElement.attributes || [];
          const purpose = inferPurpose(parentName, parentProps);
          if (purpose === 'form-container' || purpose === 'overlay') {
            return inferContext(parentName, parentProps);
          }
        }
      }
    }
    
    current = current.parent;
    depth++;
  }
  
  return null;
}

/**
 * Analyze ClipboardCopy children to infer content type variants (with-array, json-object)
 * Traverses the AST to find array or JSON object content in children
 */
function analyzeClipboardCopyChildren(j, path) {
  let hasArray = false;
  let hasJsonObject = false;
  
  // Find the JSXElement that contains this opening element
  let parentElement = null;
  let current = path.parent;
  
  // Traverse up to find the JSXElement
  while (current && !parentElement) {
    if (current.value && current.value.type === 'JSXElement') {
      parentElement = current.value;
      break;
    }
    current = current.parent;
  }
  
  if (!parentElement || !parentElement.children) {
    return { hasArray: false, hasJsonObject: false };
  }
  
  // Look through children for text content that might indicate array or JSON
  // Check for JSXText or JSXExpressionContainer with array/object patterns
  parentElement.children.forEach(child => {
    if (child.type === 'JSXText') {
      const text = child.value.trim();
      // Check for JSON object pattern (starts with { or contains JSON-like structure)
      if (text.startsWith('{') || (text.includes('"') && (text.includes(':') || text.includes(',')))) {
        hasJsonObject = true;
      }
      // Check for array pattern (starts with [)
      if (text.startsWith('[')) {
        hasArray = true;
      }
    } else if (child.type === 'JSXExpressionContainer' && child.expression) {
      // Check for ArrayExpression or ObjectExpression in JSX expressions
      if (child.expression.type === 'ArrayExpression') {
        hasArray = true;
      } else if (child.expression.type === 'ObjectExpression') {
        hasJsonObject = true;
      }
    }
  });
  
  return { hasArray, hasJsonObject };
}

/**
 * Analyze Breadcrumb children to infer variant (with-dropdown, with-heading)
 * Traverses the AST to find BreadcrumbDropdown or BreadcrumbHeading children
 */
function analyzeBreadcrumbChildren(j, path) {
  let hasDropdown = false;
  let hasHeading = false;
  
  // Find the JSXElement that contains this opening element
  let parentElement = null;
  let current = path.parent;
  
  // Traverse up to find the JSXElement
  while (current && !parentElement) {
    if (current.value && current.value.type === 'JSXElement') {
      parentElement = current.value;
      break;
    }
    current = current.parent;
  }
  
  if (!parentElement || !parentElement.children) {
    return { hasDropdown: false, hasHeading: false };
  }
  
  // Look through children for BreadcrumbDropdown or BreadcrumbHeading
  parentElement.children.forEach(child => {
    if (child.type === 'JSXElement' && child.openingElement) {
      const childName = child.openingElement.name?.name;
      if (childName) {
        const name = childName.toLowerCase();
        if (name.includes('breadcrumbdropdown') || name.includes('dropdown')) {
          hasDropdown = true;
        }
        if (name.includes('breadcrumbheading') || name.includes('heading')) {
          hasHeading = true;
        }
      }
    }
  });
  
  return { hasDropdown, hasHeading };
}

/**
 * Analyze ActionList children to infer grouping variant
 * Traverses the AST to find ActionListItem children and their button/kebab contents
 */
function analyzeActionListChildren(j, path) {
  const children = [];
  
  // Find the JSXElement that contains this opening element
  // path.node is the JSXOpeningElement, we need the parent JSXElement
  let parentElement = null;
  let current = path.parent;
  
  // Traverse up to find the JSXElement
  while (current && !parentElement) {
    if (current.value && current.value.type === 'JSXElement') {
      parentElement = current.value;
      break;
    }
    current = current.parent;
  }
  
  if (!parentElement || !parentElement.children) {
    return children;
  }
  
  // Look through children for ActionListItem components
  parentElement.children.forEach(child => {
    if (child.type === 'JSXElement' && child.openingElement) {
      const childName = child.openingElement.name?.name;
      if (childName && childName.toLowerCase().includes('actionlistitem')) {
        // Look for buttons or kebab inside ActionListItem
        if (child.children) {
          child.children.forEach(grandchild => {
            if (grandchild.type === 'JSXElement' && grandchild.openingElement) {
              const grandchildName = grandchild.openingElement.name?.name;
              if (grandchildName) {
                const name = grandchildName.toLowerCase();
                if (name.includes('button')) {
                  // Check button variant
                  const buttonProps = grandchild.openingElement.attributes || [];
                  const variantAttr = buttonProps.find(attr => 
                    attr.name?.name === 'variant'
                  );
                  if (variantAttr && variantAttr.value) {
                    const variant = variantAttr.value.type === 'StringLiteral' 
                      ? variantAttr.value.value 
                      : 'button';
                    children.push(variant);
                  } else {
                    // No variant specified, default to 'button' (will be inferred as primary by button logic)
                    children.push('button');
                  }
                } else if (name.includes('kebab') || name.includes('menutoggle') || name.includes('icon')) {
                  // Generic "icon" instead of "kebab" to cover kebab and other icons
                  children.push('icon');
                }
              }
            }
          });
        }
      }
    }
  });
  
  return children;
}

/**
 * Create semantic data attributes
 * Only adds attributes when we can infer meaningful values (not null)
 */
function createSemanticAttributes(j, componentName, props, parentContext, path = null) {
  const role = inferRole(componentName);
  const purpose = inferPurpose(componentName, props);
  
  // For ActionList, analyze children to infer grouping variant
  // For Breadcrumb, analyze children to detect dropdown/heading variants
  // For ClipboardCopy, analyze children to detect content type variants (array, json-object)
  let variant;
  if (componentName.toLowerCase().includes('actionlist') && path) {
    const children = analyzeActionListChildren(j, path);
    variant = inferActionListVariant(children);
  } else if (componentName.toLowerCase().includes('breadcrumb') && 
             !componentName.toLowerCase().includes('breadcrumbitem') && 
             !componentName.toLowerCase().includes('breadcrumbheading') && 
             path) {
    const childrenInfo = analyzeBreadcrumbChildren(j, path);
    // Override variant if children analysis detects dropdown or heading
    const baseVariant = inferVariant(componentName, props);
    if (childrenInfo.hasDropdown) {
      variant = 'with-dropdown';
    } else if (childrenInfo.hasHeading) {
      variant = 'with-heading';
    } else {
      variant = baseVariant;
    }
  } else if (componentName.toLowerCase().includes('clipboardcopy') && path) {
    const childrenInfo = analyzeClipboardCopyChildren(j, path);
    const baseVariant = inferVariant(componentName, props);
    // Add content type variants if detected via children analysis
    const variantParts = baseVariant ? baseVariant.split('-') : [];
    if (childrenInfo.hasArray) {
      // Only add if expandable (expanded with array)
      if (variantParts.includes('expandable')) {
        variantParts.push('with-array');
      }
    }
    if (childrenInfo.hasJsonObject && !variantParts.includes('json-object')) {
      variantParts.push('json-object');
    }
    variant = variantParts.length > 0 ? variantParts.join('-') : baseVariant;
  } else {
    variant = inferVariant(componentName, props);
  }
  
  const context = inferContext(componentName, props, parentContext);
  const state = inferState(componentName, props);
  const actionType = inferActionType(componentName, props);
  const size = inferSize(componentName, props);
  
  const attributes = [];
  
  // Always add purpose (it always has a value)
  attributes.push(j.jsxAttribute(j.jsxIdentifier('data-purpose'), j.literal(purpose)));
  
  // Only add role if we inferred a meaningful value (some structural children don't get roles)
  if (role !== null) {
    attributes.push(j.jsxAttribute(j.jsxIdentifier('data-role'), j.literal(role)));
  }
  
  // Only add variant, context, state, action-type, and size if we inferred meaningful values
  if (variant !== null) {
    attributes.push(j.jsxAttribute(j.jsxIdentifier('data-variant'), j.literal(variant)));
  }
  
  if (context !== null) {
    attributes.push(j.jsxAttribute(j.jsxIdentifier('data-context'), j.literal(context)));
  }
  
  if (state !== null) {
    attributes.push(j.jsxAttribute(j.jsxIdentifier('data-state'), j.literal(state)));
  }
  
  if (actionType !== null) {
    attributes.push(j.jsxAttribute(j.jsxIdentifier('data-action-type'), j.literal(actionType)));
  }
  
  if (size !== null) {
    attributes.push(j.jsxAttribute(j.jsxIdentifier('data-size'), j.literal(size)));
  }
  
  return attributes;
}

/**
 * Main transform function
 */
module.exports = function transformer(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  
  // Track imports to identify PatternFly components
  const imports = [];
  root.find(j.ImportDeclaration).forEach(path => {
    imports.push(path.node);
  });
  
  // Process all JSX opening elements (handles both self-closing and regular elements)
  root.find(j.JSXOpeningElement).forEach(path => {
    const node = path.node;
    const componentName = node.name?.name;
    
    // Skip if not a valid component name
    if (!componentName || typeof componentName !== 'string') {
      return;
    }
    
    // Check if this is a PatternFly component
    if (!isPatternFlyComponent(componentName, imports)) {
      return;
    }
    
    // Skip structural child components - they don't need separate semantic attributes
    // The parent component has the attributes that describe the whole structure
    // This applies to components that are always used as children of a parent component
    const name = componentName.toLowerCase();
    
    // Structural children to skip:
    // - Breadcrumb: BreadcrumbItem, BreadcrumbHeading
    // - Accordion: AccordionItem, AccordionContent, AccordionToggle
    // - Card: CardBody, CardHeader, CardTitle
    // - ActionList: ActionListItem
    // - Modal: ModalContent, ModalHeader
    // - DataList: DataListAction (only this one is skipped - others get full attributes)
    // - DescriptionList: None skipped - all children get attributes (they have meaningful variants/states)
    // - Form: FormGroup, FormSection (if they exist)
    const structuralChildren = [
      'breadcrumbitem', 'breadcrumbheading',
      'accordionitem', 'accordioncontent', 'accordiontoggle',
      'cardbody', 'cardheader', 'cardtitle',
      'actionlistitem',
      'modalcontent', 'modalheader',
      'datalistaction', // Only DataListAction is skipped, other DataList children get attributes
      // DescriptionList children are NOT skipped - they have meaningful variants/states
      // Droppable and Draggable are NOT skipped - they get all attributes except role (handled by parent)
    ];
    
    if (structuralChildren.some(child => name.includes(child))) {
      return;
    }
    
    // Note: Independent components (Button, Link, etc.) keep their attributes
    // even when nested, because they can be used independently
    
    // Skip if already has semantic attributes (don't duplicate)
    const existingAttrs = node.attributes || [];
    if (hasSemanticAttributes(existingAttrs)) {
      return;
    }
    
    // Find parent context for nested components
    const parentContext = findParentContext(path, imports);
    
    // Create and add semantic attributes
    const newAttributes = createSemanticAttributes(j, componentName, existingAttrs, parentContext, path);
    node.attributes = [...existingAttrs, ...newAttributes];
  });
  
  return root.toSource({
    quote: 'single',
    trailingComma: true,
    lineTerminator: '\n',
  });
};

