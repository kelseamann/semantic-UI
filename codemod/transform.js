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
 * Returns an object with { context, purpose } if parent is Form, or just context string for others
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
            const context = inferContext(parentName, parentProps);
            
            // For Form, return both context and purpose so children can inherit purpose
            if (purpose === 'form-container') {
              return { context, purpose };
            }
            
            // For LoginForm, return authentication context so children inherit it
            if (purpose === 'authentication' || parentName.toLowerCase().includes('loginform')) {
              return 'authentication';
            }
            
            // For overlay components, just return context
            if (purpose === 'overlay') {
              return context;
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
 * Analyze InputGroup children to infer variant (with-button-left, with-button-right, with-buttons-both, with-icon-before, with-icon-after, with-text-prefix, with-text-suffix, search)
 * Traverses the AST to find buttons, text, icons, or search icons in InputGroup
 */
function analyzeInputGroupChildren(j, path) {
  let hasButtonLeft = false;
  let hasButtonRight = false;
  let hasIconLeft = false;
  let hasIconRight = false;
  let hasTextLeft = false;
  let hasTextRight = false;
  let hasSearch = false;
  
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
    return { hasButtonLeft: false, hasButtonRight: false, hasIconLeft: false, hasIconRight: false, hasTextLeft: false, hasTextRight: false, hasSearch: false };
  }
  
  // Look through children for buttons, text, or search icons
  // InputGroup children are typically in order: [left element, input, right element]
  let foundInput = false;
  parentElement.children.forEach(child => {
    if (child.type === 'JSXElement' && child.openingElement) {
      const childName = child.openingElement.name?.name;
      if (childName) {
        const name = childName.toLowerCase();
        // Check if this is the input (middle element)
        if (name.includes('input') || name.includes('textinput') || name.includes('textarea') || name.includes('select')) {
          foundInput = true;
          return; // Skip input itself
        }
        
        // If we haven't found the input yet, this is a left element
        // If we've found the input, this is a right element
        const isLeft = !foundInput;
        
        // Check for buttons
        if (name.includes('button')) {
          if (isLeft) {
            hasButtonLeft = true;
          } else {
            hasButtonRight = true;
          }
        }
        // Check for icons (components ending with "icon" or "Icon")
        if (name.endsWith('icon')) {
          if (isLeft) {
            hasIconLeft = true;
          } else {
            hasIconRight = true;
          }
        }
        // Check for InputGroupText (text prefix/suffix, not icon)
        if (name.includes('inputgrouptext')) {
          if (isLeft) {
            hasTextLeft = true;
          } else {
            hasTextRight = true;
          }
        }
        // Check for search icon/button
        if (name.includes('search') || name.includes('searchicon')) {
          hasSearch = true;
          // Search button is typically on the right
          if (!isLeft) {
            hasButtonRight = true;
            hasIconRight = true;
          } else {
            hasIconLeft = true;
          }
        }
      }
    }
  });
  
  return { hasButtonLeft, hasButtonRight, hasIconLeft, hasIconRight, hasTextLeft, hasTextRight, hasSearch };
}

/**
 * Analyze List children to infer variant (with-icons, small-icons, big-icons)
 * Traverses the AST to find icons in ListItem children
 */
function analyzeListChildren(j, path) {
  let hasIcons = false;
  let hasSmallIcons = false;
  let hasBigIcons = false;
  
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
    return { hasIcons: false, hasSmallIcons: false, hasBigIcons: false };
  }
  
  // Look through children for ListItem components with icons
  parentElement.children.forEach(child => {
    if (child.type === 'JSXElement' && child.openingElement) {
      const childName = child.openingElement.name?.name;
      if (childName && childName.toLowerCase().includes('listitem')) {
        // Check if ListItem has icon children
        if (child.children) {
          child.children.forEach(grandchild => {
            if (grandchild.type === 'JSXElement' && grandchild.openingElement) {
              const grandchildName = grandchild.openingElement.name?.name;
              if (grandchildName) {
                const name = grandchildName.toLowerCase();
                // Check for icon components (ending with "icon" or "Icon")
                if (name.endsWith('icon')) {
                  hasIcons = true;
                  // Check icon size if available
                  const iconProps = grandchild.openingElement.attributes || [];
                  const sizeAttr = iconProps.find(attr => 
                    attr.name?.name === 'size'
                  );
                  if (sizeAttr && sizeAttr.value) {
                    const size = sizeAttr.value.type === 'StringLiteral' 
                      ? sizeAttr.value.value.toLowerCase()
                      : null;
                    if (size === 'sm' || size === 'small') {
                      hasSmallIcons = true;
                    } else if (size === 'lg' || size === 'large' || size === 'xl') {
                      hasBigIcons = true;
                    }
                  }
                }
              }
            }
          });
        }
      }
    }
  });
  
  return { hasIcons, hasSmallIcons, hasBigIcons };
}

/**
 * Analyze LoginForm children to infer variant (show-hide-password, customized-header-utilities)
 * Traverses the AST to find password toggle or customized header utilities
 */
function analyzeLoginFormChildren(j, path) {
  let hasShowHidePassword = false;
  let hasCustomizedHeaderUtilities = false;
  
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
    return { hasShowHidePassword: false, hasCustomizedHeaderUtilities: false };
  }
  
  // Look through children for password toggle or customized header utilities
  parentElement.children.forEach(child => {
    if (child.type === 'JSXElement' && child.openingElement) {
      const childName = child.openingElement.name?.name;
      if (childName) {
        const name = childName.toLowerCase();
        // Check for InputGroup containing password input with toggle button
        if (name.includes('inputgroup')) {
          // Check if InputGroup contains password input and button
          let hasPasswordInput = false;
          let hasToggleButton = false;
          if (child.children) {
            child.children.forEach(grandchild => {
              if (grandchild.type === 'JSXElement' && grandchild.openingElement) {
                const grandchildName = grandchild.openingElement.name?.name;
                if (grandchildName) {
                  const gcName = grandchildName.toLowerCase();
                  // Check for password input
                  if (gcName.includes('textinput') || gcName.includes('input')) {
                    const inputProps = grandchild.openingElement.attributes || [];
                    const typeAttr = inputProps.find(attr => attr.name?.name === 'type');
                    if (typeAttr && typeAttr.value) {
                      const typeValue = typeAttr.value.type === 'StringLiteral' 
                        ? typeAttr.value.value.toLowerCase()
                        : '';
                      if (typeValue === 'password') {
                        hasPasswordInput = true;
                      }
                    }
                  }
                  // Check for button (toggle)
                  if (gcName.includes('button')) {
                    hasToggleButton = true;
                  }
                }
              }
            });
          }
          if (hasPasswordInput && hasToggleButton) {
            hasShowHidePassword = true;
          }
        }
        // Check for password input with show/hide toggle prop
        if (name.includes('textinput') || name.includes('input')) {
          const inputProps = child.openingElement.attributes || [];
          const typeAttr = inputProps.find(attr => attr.name?.name === 'type');
          const hasToggle = inputProps.some(attr => 
            attr.name?.name === 'showPasswordToggle' || 
            attr.name?.name === 'isPasswordToggleVisible' ||
            attr.name?.name === 'onTogglePassword'
          );
          if (typeAttr && typeAttr.value) {
            const typeValue = typeAttr.value.type === 'StringLiteral' 
              ? typeAttr.value.value.toLowerCase()
              : '';
            if (typeValue === 'password' && hasToggle) {
              hasShowHidePassword = true;
            }
          }
        }
        // Check for customized header utilities (LoginHeader, LoginHeaderUtilities, etc.)
        if (name.includes('loginheader') || name.includes('header') || 
            (name.includes('utilities') && name.includes('login')) ||
            (name.includes('brand') && name.includes('login')) ||
            (name.includes('logo') && name.includes('login'))) {
          hasCustomizedHeaderUtilities = true;
        }
      }
    }
  });
  
  return { hasShowHidePassword, hasCustomizedHeaderUtilities };
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
 * Check if a form input has HelperText associated with it
 * HelperText can be:
 * 1. A parent wrapper: <HelperText><TextInput /></HelperText>
 * 2. A sibling in the same parent: <FormGroup><TextInput /><HelperText /></FormGroup>
 * 
 * HelperText is state-dependent (error, warning, success, indeterminate) and should be a variant of the input
 */
function checkForHelperText(j, path) {
  let hasHelperText = false;
  let helperTextState = null; // 'error', 'warning', 'success', 'indeterminate' (default)
  
  // Helper function to extract state from HelperText props
  function extractHelperTextState(helperTextProps) {
    const propsMap = new Map();
    helperTextProps.forEach(attr => {
      if (attr.name && attr.name.name) {
        let value = true; // Boolean shorthand
        if (attr.value) {
          if (attr.value.type === 'StringLiteral' || attr.value.type === 'Literal') {
            value = attr.value.value;
          } else if (attr.value.type === 'JSXExpressionContainer' && attr.value.expression) {
            if (attr.value.expression.type === 'BooleanLiteral') {
              value = attr.value.expression.value;
            }
          } else if (attr.value.type === 'BooleanLiteral') {
            value = attr.value.value;
          }
        }
        propsMap.set(attr.name.name, value);
      }
    });
    
    // Determine state from HelperText props (priority: error > warning > success > indeterminate)
    if (propsMap.has('isError') && propsMap.get('isError')) {
      return 'error';
    } else if (propsMap.has('isWarning') && propsMap.get('isWarning')) {
      return 'warning';
    } else if (propsMap.has('isSuccess') && propsMap.get('isSuccess')) {
      return 'success';
    } else if (propsMap.has('isIndeterminate') && propsMap.get('isIndeterminate')) {
      return 'indeterminate';
    } else {
      // Default state if no explicit state prop
      return 'indeterminate';
    }
  }
  
  // CASE 1: Check if HelperText is a parent wrapper (traverse UP)
  let current = path.parent;
  let depth = 0;
  const maxDepth = 10; // Prevent infinite loops
  
  while (current && depth < maxDepth) {
    if (current.value) {
      const node = current.value;
      
      // Check if parent is a JSX element
      if (node.type === 'JSXElement' && node.openingElement) {
        const parentName = node.openingElement.name?.name;
        if (parentName) {
          const name = parentName.toLowerCase();
          // Check if this parent is HelperText
          if (name.includes('helpertext') || name.includes('helper-text')) {
            hasHelperText = true;
            const helperTextProps = node.openingElement.attributes || [];
            helperTextState = extractHelperTextState(helperTextProps);
            // Found HelperText parent, return early
            return { hasHelperText, helperTextState };
          }
        }
      }
    }
    
    current = current.parent;
    depth++;
  }
  
  // CASE 2: Check if HelperText is a sibling in the same parent container
  // Find the parent JSXElement that contains this component
  let parentElement = null;
  current = path.parent;
  depth = 0;
  
  while (current && depth < maxDepth && !parentElement) {
    if (current.value && current.value.type === 'JSXElement') {
      parentElement = current.value;
      break;
    }
    current = current.parent;
    depth++;
  }
  
  if (parentElement && parentElement.children) {
    // Look through siblings for HelperText component
    parentElement.children.forEach(child => {
      if (child.type === 'JSXElement' && child.openingElement) {
        const childName = child.openingElement.name?.name;
        if (childName) {
          const name = childName.toLowerCase();
          // Check for HelperText component (sibling)
          if (name.includes('helpertext') || name.includes('helper-text')) {
            hasHelperText = true;
            const helperTextProps = child.openingElement.attributes || [];
            helperTextState = extractHelperTextState(helperTextProps);
            // Found HelperText sibling, stop looking
            return;
          }
        }
      }
    });
  }
  
  return { hasHelperText, helperTextState };
}

/**
 * Analyze DualListSelector children to infer variants (with-tooltips, with-search, with-actions, multiple-drop-zones)
 * Traverses the AST to find search inputs, action menus, tooltips, and multiple drop zones
 */
function analyzeDualListSelectorChildren(j, path) {
  let hasTooltips = false;
  let hasSearch = false;
  let hasActions = false;
  let hasMultipleDropZones = false;
  
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
    return { hasTooltips: false, hasSearch: false, hasActions: false, hasMultipleDropZones: false };
  }
  
  let dropZoneCount = 0;
  
  // Look through children for search, actions, tooltips, and drop zones
  parentElement.children.forEach(child => {
    if (child.type === 'JSXElement' && child.openingElement) {
      const childName = child.openingElement.name?.name;
      if (childName) {
        const name = childName.toLowerCase();
        // Check for search/filter components
        if (name.includes('search') || name.includes('filter') || name.includes('input')) {
          hasSearch = true;
        }
        // Check for action menus (kebab, menu, actions)
        if (name.includes('kebab') || name.includes('menutoggle') || name.includes('actionmenu') || 
            name.includes('actions')) {
          hasActions = true;
        }
        // Check for tooltips
        if (name.includes('tooltip')) {
          hasTooltips = true;
        }
        // Check for drop zones (Droppable components)
        if (name.includes('droppable')) {
          dropZoneCount++;
        }
      }
    }
  });
  
  hasMultipleDropZones = dropZoneCount > 1;
  
  return { hasTooltips, hasSearch, hasActions, hasMultipleDropZones };
}

/**
 * Create semantic data attributes
 * Only adds attributes when we can infer meaningful values (not null)
 * parentContext can be a string (context) or an object { context, purpose } for Form parents
 */
function createSemanticAttributes(j, componentName, props, parentContext, path = null) {
  const role = inferRole(componentName);
  const purpose = inferPurpose(componentName, props);
  
  // Extract parent context and purpose if parentContext is an object (Form case)
  let parentContextValue = null;
  let parentPurpose = null;
  if (typeof parentContext === 'object' && parentContext !== null) {
    parentContextValue = parentContext.context;
    parentPurpose = parentContext.purpose;
  } else {
    parentContextValue = parentContext;
  }
  
  // For ActionList, analyze children to infer grouping variant
  // For Breadcrumb, analyze children to detect dropdown/heading variants
  // For ClipboardCopy, analyze children to detect content type variants (array, json-object)
  // For DualListSelector, analyze children to detect sub-variants (with-tooltips, with-search, with-actions, multiple-drop-zones)
  // For form inputs (TextInput, TextArea, Select, etc.), check for HelperText as parent wrapper or sibling
  // For InlineEdit, detect if it's in a table row context (row-editing variant)
  // For InputGroup, analyze children to detect variant (with-button-left, with-button-right, with-buttons-both, with-icon-before, with-icon-after, with-text-prefix, with-text-suffix, search)
  // For List, analyze children to detect icon variants (with-icons, small-icons, big-icons)
  // For LoginForm, analyze children to detect variant (show-hide-password, customized-header-utilities)
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
  } else if ((componentName.toLowerCase().includes('textinput') || 
              componentName.toLowerCase().includes('textarea') || 
              componentName.toLowerCase().includes('select') ||
              componentName.toLowerCase().includes('checkbox') ||
              componentName.toLowerCase().includes('radio') ||
              componentName.toLowerCase().includes('switch')) && 
             path) {
    // Form inputs with HelperText (parent wrapper or sibling) get "with-helper-text" variant
    const helperTextInfo = checkForHelperText(j, path);
    const baseVariant = inferVariant(componentName, props);
    if (helperTextInfo.hasHelperText) {
      const variantParts = baseVariant ? baseVariant.split('-') : [];
      if (!variantParts.includes('with-helper-text')) {
        variantParts.push('with-helper-text');
      }
      variant = variantParts.length > 0 ? variantParts.join('-') : 'with-helper-text';
    } else {
      variant = baseVariant;
    }
  } else if (componentName.toLowerCase().includes('inlineedit') && 
             !componentName.toLowerCase().includes('inlineedittoggle') && 
             !componentName.toLowerCase().includes('inlineeditactiongroup') && 
             !componentName.toLowerCase().includes('inlineeditinput') && 
             path) {
    // Detect if InlineEdit is in a table row context (row-editing variant)
    // Traverse up the AST to find if parent is a table row (Tr)
    let isInTableRow = false;
    let current = path.parent;
    let depth = 0;
    const maxDepth = 10;
    
    while (current && depth < maxDepth) {
      if (current.value) {
        const node = current.value;
        if (node.type === 'JSXElement' && node.openingElement) {
          const parentName = node.openingElement.name?.name;
          if (parentName) {
            const parentNameLower = parentName.toLowerCase();
            // Check if parent is a table row (Tr)
            if (parentNameLower === 'tr' || parentNameLower.includes('tablerow')) {
              isInTableRow = true;
              break;
            }
            // If we hit a table or tbody, we're in table context but not necessarily a row
            // Continue searching for Tr
            if (parentNameLower.includes('table') || parentNameLower.includes('tbody') || 
                parentNameLower.includes('thead')) {
              // Continue searching
            } else if (!parentNameLower.includes('td') && !parentNameLower.includes('th')) {
              // If we hit something that's not a table-related component, stop searching
              break;
            }
          }
        }
      }
      current = current.parent;
      depth++;
    }
    
    const baseVariant = inferVariant(componentName, props);
    // If in table row context and no explicit variant, set to row-editing
    if (isInTableRow && !baseVariant) {
      variant = 'row-editing';
    } else {
      variant = baseVariant;
    }
  } else if (componentName.toLowerCase().includes('inputgroup') && path) {
    const childrenInfo = analyzeInputGroupChildren(j, path);
    const baseVariant = inferVariant(componentName, props);
    
    // Determine variant based on children analysis
    if (childrenInfo.hasSearch) {
      variant = 'search';
    } else if (childrenInfo.hasButtonLeft && childrenInfo.hasButtonRight) {
      variant = 'with-buttons-both';
    } else if (childrenInfo.hasButtonLeft) {
      variant = 'with-button-left';
    } else if (childrenInfo.hasButtonRight) {
      variant = 'with-button-right';
    } else if (childrenInfo.hasIconLeft) {
      variant = 'with-icon-before';
    } else if (childrenInfo.hasIconRight) {
      variant = 'with-icon-after';
    } else if (childrenInfo.hasTextLeft) {
      variant = 'with-text-prefix';
    } else if (childrenInfo.hasTextRight) {
      variant = 'with-text-suffix';
    } else {
      variant = baseVariant;
    }
  } else if (componentName.toLowerCase().includes('list') && 
             !componentName.toLowerCase().includes('listitem') &&
             !componentName.toLowerCase().includes('datalist') &&
             !componentName.toLowerCase().includes('actionlist') &&
             !componentName.toLowerCase().includes('duallistselector') &&
             path) {
    const childrenInfo = analyzeListChildren(j, path);
    const baseVariant = inferVariant(componentName, props);
    
    // Add icon variants if detected
    const variantParts = baseVariant ? baseVariant.split('-') : [];
    if (childrenInfo.hasIcons) {
      if (childrenInfo.hasBigIcons && !variantParts.includes('big-icons')) {
        variantParts.push('big-icons');
      } else if (childrenInfo.hasSmallIcons && !variantParts.includes('small-icons')) {
        variantParts.push('small-icons');
      } else if (!variantParts.includes('with-icons')) {
        variantParts.push('with-icons');
      }
    }
    
    variant = variantParts.length > 0 ? variantParts.join('-') : baseVariant;
  } else if (componentName.toLowerCase().includes('loginform') && path) {
    const childrenInfo = analyzeLoginFormChildren(j, path);
    const baseVariant = inferVariant(componentName, props);
    
    // Determine variant based on children analysis
    if (childrenInfo.hasCustomizedHeaderUtilities) {
      variant = 'customized-header-utilities';
    } else if (childrenInfo.hasShowHidePassword) {
      variant = 'show-hide-password';
    } else if (baseVariant) {
      variant = baseVariant;
    } else {
      // Default to basic
      variant = 'basic';
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
  } else if (componentName.toLowerCase().includes('duallistselector') && 
             !componentName.toLowerCase().includes('duallistselectorpane') && 
             !componentName.toLowerCase().includes('duallistselectorlist') && 
             !componentName.toLowerCase().includes('duallistselectorlistitem') && 
             path) {
    const childrenInfo = analyzeDualListSelectorChildren(j, path);
    const baseVariant = inferVariant(componentName, props);
    // Add sub-variants if detected via children analysis
    const variantParts = baseVariant ? baseVariant.split('-') : ['basic'];
    if (childrenInfo.hasTooltips && !variantParts.includes('with-tooltips')) {
      variantParts.push('with-tooltips');
    }
    if (childrenInfo.hasSearch && !variantParts.includes('with-search')) {
      variantParts.push('with-search');
    }
    if (childrenInfo.hasActions && !variantParts.includes('with-actions')) {
      variantParts.push('with-actions');
    }
    if (childrenInfo.hasMultipleDropZones && variantParts.includes('draggable') && 
        !variantParts.includes('multiple-drop-zones')) {
      variantParts.push('multiple-drop-zones');
    }
    variant = variantParts.join('-');
  } else {
    variant = inferVariant(componentName, props);
  }
  
  const context = inferContext(componentName, props, parentContextValue, parentPurpose);
  
  // For form inputs, check if HelperText state should be incorporated into the input's state
  let state = inferState(componentName, props);
  if ((componentName.toLowerCase().includes('textinput') || 
       componentName.toLowerCase().includes('textarea') || 
       componentName.toLowerCase().includes('select') ||
       componentName.toLowerCase().includes('checkbox') ||
       componentName.toLowerCase().includes('radio') ||
       componentName.toLowerCase().includes('switch')) && 
      path) {
    const helperTextInfo = checkForHelperText(j, path);
    // HelperText state (error, warning, success) should be reflected in the input's state
    if (helperTextInfo.hasHelperText && helperTextInfo.helperTextState) {
      // Only add meaningful states (not indeterminate)
      if (helperTextInfo.helperTextState !== 'indeterminate') {
        // Combine states: if input already has a state, combine them; otherwise use helper text state
        if (state) {
          // Combine existing state with helper text state (e.g., "disabled error")
          state = `${state} ${helperTextInfo.helperTextState}`;
        } else {
          state = helperTextInfo.helperTextState;
        }
      }
    }
  }
  
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
      'modalcontent', 'modalheader', 'modalfooter', 'modalbody',
      // Modal structural children - ModalContent, ModalHeader, ModalFooter, ModalBody are structural
      'datalistaction', // Only DataListAction is skipped, other DataList children get attributes
      // DescriptionList children are NOT skipped - they have meaningful variants/states
      // Droppable and Draggable are NOT skipped - they get all attributes except role (handled by parent)
      'drawermain', 'drawerpanel', 'drawercontent', 'drawerbody', 
      'drawerhead', 'draweractions', 'drawersection', 'drawersectiongroup',
      // Drawer structural children - role and purpose handled by parent Drawer
      'duallistselectorlist', // DualListSelectorList is purely structural - skipped
      // DualListSelectorPane and DualListSelectorListItem get attributes (they have meaningful variants/states)
      'emptystateheader', 'emptystateicon', 'emptystatebody', 
      'emptystatefooter', 'emptystateactions',
      // EmptyState structural children - role and purpose handled by parent EmptyState
      // Structural children: EmptyStateHeader, EmptyStateIcon, EmptyStateBody, EmptyStateFooter, EmptyStateActions
      // Note: Nested components like Button and Spinner are NOT skipped - they get their own attributes
      // (they are independent components used within EmptyState, not structural children)
      'expandablesectiontoggle', 'expandablesectioncontent',
      // ExpandableSection structural children - role and purpose handled by parent ExpandableSection
      // Structural children: ExpandableSectionToggle, ExpandableSectionContent
      'helpertext', 'helper-text',
      // HelperText is a structural child of form inputs - its state is reflected in the input's variant/state
      'mastheadbrand',
      // MastheadBrand is a structural wrapper for Brand component - skipped
      'menulist', 'menugroup', 'menusearch', 'menusearchinput',
      // Menu structural children - MenuList, MenuGroup, MenuSearch, MenuSearchInput are structural
      'selectoptiongroup',
      // SelectOptionGroup is a structural wrapper for grouping select options
      'notificationdrawerheader', 'notificationdrawerbody',
      // NotificationDrawer structural children - NotificationDrawerHeader, NotificationDrawerBody are structural
      'overflowmenucontent',
      // OverflowMenuContent is a structural wrapper for menu items
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

