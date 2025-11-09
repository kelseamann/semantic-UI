/**
 * Static Inference Utilities for Codemod
 * 
 * These functions work with static code analysis (no runtime dependencies)
 * They infer semantic properties from JSX props that we can see in the source code.
 */

/**
 * PatternFly package prefixes we recognize
 */
const PF_PACKAGES = [
  '@patternfly/react-core',
  '@patternfly/react-table',
  '@patternfly/react-icons',
  '@patternfly/react-charts',
  '@patternfly/react-topology',
];

/**
 * Standardized data-* attributes we add to all PF components
 * These will appear on the rendered DOM elements in the browser
 */
const STANDARD_ATTRIBUTES = [
  'data-role',        // What the component IS (button, card, input, etc.)
  'data-purpose',     // What it DOES (action, display, input, navigation, etc.)
  'data-variant',     // How it LOOKS (primary, danger, secondary, etc.)
  'data-context',     // Where it's USED (form, modal, toolbar, etc.)
  'data-state',       // Current STATE (active, disabled, readonly, etc.)
  'data-action-type', // Type of action (destructive, confirmation, navigation, edit, cancel)
  'data-size',        // Size/spacing (compact, default, large)
];

/**
 * Infer semantic role from component name
 */
function inferRole(componentName) {
  const name = componentName.toLowerCase();
  
  // Direct mappings
  const roleMap = {
    'button': 'button',
    'card': 'card',
    'cardbody': 'card-body',
    'cardheader': 'card-header',
    'cardtitle': 'card-title',
    'modal': 'modal',
    'modalcontent': 'modal-content',
    'modalheader': 'modal-header',
    'textinput': 'text-input',
    'textarea': 'text-area',
    'select': 'select',
    'checkbox': 'checkbox',
    'radio': 'radio',
    'switch': 'switch',
    'form': 'form',
    'flex': 'flex',
    'flexitem': 'flex-item',
    'tr': 'table-row',
    'td': 'table-cell',
    'th': 'table-header',
    'thead': 'table-head',
    'tbody': 'table-body',
    'link': 'link',
    'drawer': 'drawer',
    'menutoggle': 'menu-toggle',
    'dropdownitem': 'dropdown-item',
  };
  
  return roleMap[name] || name;
}

/**
 * Infer purpose from component name and props (static analysis)
 */
function inferPurpose(componentName, props) {
  const name = componentName.toLowerCase();
  const propsMap = propsToMap(props);
  
  // Buttons and Links - check for interactive props
  if (name.includes('button') || name.includes('link')) {
    if (propsMap.has('onClick') || propsMap.has('onSubmit')) {
      return 'action';
    }
    // Button without onClick is likely disabled or read-only (handled by state)
    // But purpose should still be 'action' since it's a button
    if (name.includes('button')) {
      return 'action';
    }
  }
  
  // Links with href are navigation
  if (propsMap.has('href')) {
    return 'navigation';
  }
  
  // Cards - can be selectable, clickable, both, or neither
  if (name.includes('card')) {
    const isSelectable = propsMap.has('isSelectable') || propsMap.has('isSelectableRaised');
    const isClickable = propsMap.has('isClickable') || propsMap.has('onClick');
    
    if (isSelectable && isClickable) {
      return 'clickable and selectable';
    }
    if (isSelectable) {
      return 'selectable';
    }
    if (isClickable) {
      return 'clickable';
    }
    // Card without interactive props is display (state will indicate disabled/read-only if applicable)
    return 'display';
  }
  
  // Component-specific purposes
  if (name.includes('input') || name.includes('textarea') || name.includes('select')) {
    return 'input';
  }
  
  if (name.includes('modal') || name.includes('drawer')) {
    return 'overlay';
  }
  
  if (name.includes('form')) {
    return 'form-container';
  }
  
  if (name.includes('table') || name.includes('tr') || name.includes('td') || name.includes('th')) {
    return 'data-display';
  }
  
  if (name.includes('flex') || name.includes('grid')) {
    return 'layout';
  }
  
  return 'display';
}

/**
 * Infer variant from props (static analysis)
 */
function inferVariant(componentName, props) {
  const propsMap = propsToMap(props);
  const name = componentName.toLowerCase();
  
  // Check variant prop (most common)
  if (propsMap.has('variant')) {
    const variantValue = propsMap.get('variant');
    if (typeof variantValue === 'string') {
      // Handle special link variants
      if (variantValue === 'link') {
        // Check for inline link (has isInline prop or inline styling)
        if (propsMap.has('isInline') || propsMap.has('inline')) {
          return 'inline-link';
        }
        // Check for danger link (danger variant on link)
        if (propsMap.has('isDanger') || propsMap.has('danger')) {
          return 'danger-link';
        }
      }
      // Return the variant value (includes 'warning' if set)
      return variantValue;
    }
  }
  
  // Check for warning variant (when not set via variant prop)
  if (propsMap.has('isWarning') || propsMap.has('warning')) {
    return 'warning';
  }
  
  // Check for stateful variant (buttons that change appearance based on data state)
  if (propsMap.has('variant') && propsMap.get('variant') === 'stateful') {
    return 'stateful';
  }
  if (propsMap.has('isRead') || propsMap.has('read') || 
      propsMap.has('isUnread') || propsMap.has('unread') ||
      propsMap.has('isAttention') || propsMap.has('attention') || propsMap.has('needsAttention')) {
    return 'stateful';
  }
  
  // Check type prop for inputs
  if (propsMap.has('type')) {
    const typeValue = propsMap.get('type');
    if (typeof typeValue === 'string') {
      return typeValue;
    }
  }
  
  // Check danger/destructive patterns
  if (propsMap.has('isDanger') || propsMap.has('danger')) {
    // If it's a link component, return danger-link
    if (name.includes('link')) {
      return 'danger-link';
    }
    return 'danger';
  }
  
  // Default to primary for buttons without variant (PatternFly default)
  if (name.includes('button') && !propsMap.has('variant')) {
    return 'primary';
  }
  
  // If we can't detect variant from props, return null (attribute won't be added)
  return null;
}

/**
 * Infer context from props and parent analysis
 */
function inferContext(componentName, props, parentContext = null) {
  const propsMap = propsToMap(props);
  const name = componentName.toLowerCase();
  
  // Explicit context prop
  if (propsMap.has('context')) {
    const contextValue = propsMap.get('context');
    if (typeof contextValue === 'string') {
      return contextValue;
    }
  }
  
  // Inherit from parent if available
  if (parentContext) {
    return parentContext;
  }
  
  // Infer from component type and props
  if (name.includes('form') || (name.includes('input') && propsMap.has('form'))) {
    return 'form';
  }
  
  if (name.includes('modal') || name.includes('drawer')) {
    return 'modal';
  }
  
  if (name.includes('table') || name.includes('tr') || name.includes('td') || name.includes('th')) {
    return 'table';
  }
  
  if (name.includes('toolbar') || propsMap.has('toolbar')) {
    return 'toolbar';
  }
  
  if (propsMap.has('navigation') || name.includes('nav') || name.includes('menu') || name.includes('breadcrumb')) {
    return 'navigation';
  }
  
  // Layout components are containers
  if (name.includes('flex') || name.includes('grid') || name.includes('stack') || name.includes('card')) {
    return 'container';
  }
  
  // Display components are typically on the page
  if (name.includes('alert') || name.includes('badge') || name.includes('title') || name.includes('heading')) {
    return 'page';
  }
  
  // If we can't infer a meaningful context, return null (attribute won't be added)
  return null;
}

/**
 * Infer state from props (static analysis)
 */
function inferState(componentName, props) {
  const propsMap = propsToMap(props);
  const name = componentName.toLowerCase();
  
  // Check explicit state props first
  if (propsMap.has('isDisabled') || propsMap.has('disabled') || propsMap.has('isAriaDisabled')) {
    return 'disabled';
  }
  
  if (propsMap.has('isReadOnly') || propsMap.has('readOnly')) {
    return 'readonly';
  }
  
  if (propsMap.has('isSelected') || propsMap.has('selected')) {
    return 'selected';
  }
  
  if (propsMap.has('isExpanded') || propsMap.has('expanded')) {
    return 'expanded';
  }
  
  if (propsMap.has('isOpen') || propsMap.has('open')) {
    return 'open';
  }
  
  if (propsMap.has('isChecked') || propsMap.has('checked')) {
    return 'checked';
  }
  
  // Check for stateful button states (these work with stateful variant)
  if (propsMap.has('isRead') || propsMap.has('read')) {
    return 'read';
  }
  
  if (propsMap.has('isUnread') || propsMap.has('unread')) {
    return 'unread';
  }
  
  if (propsMap.has('isAttention') || propsMap.has('attention') || propsMap.has('needsAttention')) {
    return 'attention';
  }
  
  // Buttons without onClick are likely disabled or read-only
  // (explicit isDisabled/isReadOnly props are already handled above)
  if (name.includes('button') && !propsMap.has('onClick') && !propsMap.has('onSubmit')) {
    // Button without onClick and no explicit state props - likely disabled
    // (buttons are interactive by nature, so no onClick suggests disabled)
    return 'disabled';
  }
  
  // Cards without interactive props are likely disabled or read-only
  // (explicit isDisabled/isReadOnly props are already handled above)
  if (name.includes('card')) {
    const hasInteractiveProps = propsMap.has('isClickable') || 
                                propsMap.has('isSelectable') || 
                                propsMap.has('isSelectableRaised') ||
                                propsMap.has('onClick');
    if (!hasInteractiveProps) {
      // Card without interactive props and no explicit state - likely read-only
      // (cards can be display-only, so no interactive props suggests read-only rather than disabled)
      return 'readonly';
    }
  }
  
  // Check for interactive props (implies active)
  if (propsMap.has('onClick') || propsMap.has('onSubmit') || propsMap.has('onChange')) {
    return 'active';
  }
  
  // If we can't infer a meaningful state, return null (attribute won't be added)
  return null;
}

/**
 * Infer action type from component and props (static analysis)
 * Helps LLMs understand the nature and consequences of actions
 */
function inferActionType(componentName, props) {
  const propsMap = propsToMap(props);
  const name = componentName.toLowerCase();
  
  // Check for destructive actions (danger variant, delete-related props)
  if (propsMap.has('variant') && propsMap.get('variant') === 'danger') {
    return 'destructive';
  }
  if (propsMap.has('isDanger') || propsMap.has('danger')) {
    return 'destructive';
  }
  
  // Check for navigation (links with href)
  if (propsMap.has('href')) {
    return 'navigation';
  }
  
  // Check for cancel actions (link variant buttons, often in modals)
  // PatternFly uses link buttons for cancel actions in modals
  if (name.includes('button') && propsMap.has('variant') && propsMap.get('variant') === 'link') {
    // Could be cancel, but we can't be 100% sure without text analysis
    // Return null for now - can enhance with text analysis later
  }
  
  // Check for confirmation actions (primary buttons in modals - future enhancement)
  // Would need parent context analysis to detect modal context
  
  // If we can't detect action type from props, return null (attribute won't be added)
  return null;
}

/**
 * Infer size from props (static analysis)
 * Helps LLMs understand component density and spacing
 */
function inferSize(componentName, props) {
  const propsMap = propsToMap(props);
  
  // Check for explicit size prop
  if (propsMap.has('size')) {
    const sizeValue = propsMap.get('size');
    if (typeof sizeValue === 'string') {
      return sizeValue;
    }
  }
  
  // Check for compact prop (common in tables, cards)
  if (propsMap.has('isCompact') || propsMap.has('compact')) {
    return 'compact';
  }
  
  // Check for large prop
  if (propsMap.has('isLarge') || propsMap.has('large')) {
    return 'large';
  }
  
  // PatternFly tables use isCompact for compact spacing
  const name = componentName.toLowerCase();
  if (name.includes('table') && propsMap.has('isCompact')) {
    return 'compact';
  }
  
  // If we can't detect size from props, return null (attribute won't be added)
  return null;
}

/**
 * Convert props array to Map for easier lookup
 */
function propsToMap(props) {
  const map = new Map();
  if (!props || !Array.isArray(props)) return map;
  
  props.forEach(prop => {
    if (prop.type === 'JSXAttribute' && prop.name) {
      const name = prop.name.name;
      let value = null;
      
      if (prop.value) {
        if (prop.value.type === 'StringLiteral') {
          value = prop.value.value;
        } else if (prop.value.type === 'JSXExpressionContainer') {
          // For expressions like {true}, {false}, {variable}
          if (prop.value.expression) {
            if (prop.value.expression.type === 'BooleanLiteral') {
              value = prop.value.expression.value;
            } else if (prop.value.expression.type === 'StringLiteral') {
              value = prop.value.expression.value;
            } else if (prop.value.expression.type === 'NumericLiteral') {
              value = prop.value.expression.value;
            }
            // For variables/expressions, we can't determine value statically
            // So we just mark that the prop exists
          }
        } else if (prop.value.type === 'BooleanLiteral') {
          value = prop.value.value;
        }
      } else {
        // Boolean shorthand: <Component prop /> means prop={true}
        value = true;
      }
      
      map.set(name, value);
    }
  });
  
  return map;
}

/**
 * Check if a component name is from PatternFly
 */
function isPatternFlyComponent(componentName, imports) {
  if (!componentName || !imports || imports.length === 0) {
    return false;
  }
  
  // Check if component is imported from PatternFly packages
  for (const imp of imports) {
    if (!imp.source || !imp.source.value) {
      continue;
    }
    
    const source = imp.source.value;
    const isPFPackage = PF_PACKAGES.some(pkg => source.includes(pkg));
    
    if (!isPFPackage) {
      continue;
    }
    
    // Check named imports
    if (imp.specifiers && imp.specifiers.length > 0) {
      for (const spec of imp.specifiers) {
        if (spec.type === 'ImportSpecifier') {
          const imported = spec.imported?.name || spec.imported?.value;
          const local = spec.local?.name || spec.local?.value;
          
          // Check if component name matches imported or local name
          if (imported === componentName || local === componentName) {
            return true;
          }
        } else if (spec.type === 'ImportDefaultSpecifier') {
          // Default import - component name might match
          const local = spec.local?.name || spec.local?.value;
          if (local === componentName) {
            return true;
          }
        }
      }
    } else {
      // No specifiers means default import - check if component name matches
      // This is less reliable, but we'll try
      if (source.includes('@patternfly')) {
        // For default imports, we can't be 100% sure, but if it's from PF package
        // and matches common PF component names, assume it's PF
        const commonPFComponents = [
          'button', 'card', 'modal', 'form', 'input', 'select', 'checkbox',
          'radio', 'switch', 'textarea', 'flex', 'table', 'tr', 'td', 'th'
        ];
        if (commonPFComponents.includes(componentName.toLowerCase())) {
          return true;
        }
      }
    }
  }
  
  return false;
}

module.exports = {
  STANDARD_ATTRIBUTES,
  PF_PACKAGES,
  inferRole,
  inferPurpose,
  inferVariant,
  inferContext,
  inferState,
  inferActionType,
  inferSize,
  propsToMap,
  isPatternFlyComponent,
};

