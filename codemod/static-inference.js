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
  
  // Direct mappings - roles should be MORE informative than just component names
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
    // Accordion components - more descriptive roles
    'accordion': 'accordion',
    'accordionitem': 'accordion-section',      // A section/item within an accordion
    'accordioncontent': 'accordion-panel',     // The content panel that expands/collapses
    'accordiontoggle': 'accordion-header',     // The clickable header that toggles the panel
    // ActionList components - more descriptive roles
    'actionlist': 'action-group',             // Container for grouping action buttons
    'actionlistitem': 'action-item',           // Individual action item within the group
    // Alert components
    'alert': 'alert',                         // Alert notification
    'alertgroup': 'alert-group',              // Container for multiple alerts
    // Avatar component
    'avatar': 'avatar',                       // User representation
    // Banner component
    'banner': 'banner',                       // Status/notification banner
    // Breadcrumb components
    'breadcrumb': 'breadcrumb',               // Navigation breadcrumb
    'breadcrumbitem': 'breadcrumb-item',      // Individual breadcrumb item
    'breadcrumbheading': 'breadcrumb-heading', // Breadcrumb heading
    // ClipboardCopy component
    'clipboardcopy': 'clipboard-copy',         // Copy to clipboard component
    // CodeBlock component
    'codeblock': 'code-block',                 // Code block display component
    // Content component
    'content': 'content',                      // Typography/content component
    // DataList component - roles should be meaningful, not redundant
    'datalist': 'data-list',                   // Data list container
    'datalistitem': 'row',                     // Individual row/item in data list
    'datalistcell': 'cell',                    // Cell within a data list row
    'datalistcheck': 'checkbox',               // Checkbox for selecting rows
    'datalistcontent': 'content-panel',        // Content area in data list (expandable)
    'datalistcontrol': 'control',              // Control element in data list
    'datalisttoggle': 'toggle',                // Toggle for expandable rows
    // Date and Time components
    'calendarmonth': 'calendar',               // Calendar month component
    'datepicker': 'date-picker',                // Date picker component
    'timepicker': 'time-picker',                // Time picker component
    // DescriptionList component - roles should be meaningful, not redundant
    'descriptionlist': 'description-list',      // List of term/definition pairs
    'descriptionlistgroup': 'description-group', // Group within description list
    'descriptionlistterm': 'description-label',  // Term/label in description list
    'descriptionlistitem': 'description-pair',    // Container for term/description pair
    'descriptionlistdescription': 'description-value', // Description/value for a term
    // Divider component
    'divider': 'divider',                        // Visual separator component
    // Drag and Drop components
    'dragdropcontainer': 'drag-drop-container',  // Container for drag and drop
    'dragdropsort': 'drag-drop-sort',           // Sortable drag and drop
    // Droppable and Draggable don't get roles - they're structural children, role handled by parent
    // DualListSelector components
    'duallistselector': 'dual-list-selector',    // Main dual list selector container
    // DualListSelectorPane and DualListSelectorListItem don't get roles - they're structural children
    // DualListSelectorList is purely structural - skipped
  };
  
  // Droppable and Draggable don't get roles - they're structural children, role handled by parent
  if (name.includes('droppable') || name.includes('draggable')) {
    return null;
  }
  
  // DualListSelectorPane and DualListSelectorListItem don't get roles - they're structural children
  if (name.includes('duallistselectorpane') || name.includes('duallistselectorlistitem')) {
    return null;
  }
  
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
  
  // DualListSelector components - check before generic input check
  if (name.includes('duallistselector')) {
    if (name.includes('duallistselectorpane')) {
      return 'selection-pane';
    }
    if (name.includes('duallistselectorlistitem')) {
      return 'selectable-item';
    }
    // Main DualListSelector container
    return 'select-from-options';
  }
  
  // Component-specific purposes
  if (name.includes('input') || name.includes('textarea') || name.includes('select')) {
    return 'input';
  }
  
  if (name.includes('modal')) {
    return 'overlay';
  }
  
  // Drawer purpose - can be overlay, details, navigation, filter, form, settings
  if (name.includes('drawer')) {
    // Check for explicit purpose-related props or infer from context
    // For now, default to 'overlay' (can be enhanced with context analysis)
    return 'overlay';
  }
  
  if (name.includes('form')) {
    return 'form-container';
  }
  
  // Date and Time components - check BEFORE table (CalendarMonth contains "table")
  if (name.includes('calendarmonth') || name.includes('datepicker')) {
    return 'date-input';
  }
  if (name.includes('timepicker')) {
    return 'time-input';
  }
  
  // DescriptionList - displays term/description pairs
  if (name.includes('descriptionlist')) {
    if (name.includes('descriptionlistterm')) {
      return 'term-label';
    }
    if (name.includes('descriptionlistdescription')) {
      return 'term-value';
    }
    if (name.includes('descriptionlistitem')) {
      return 'term-pair';
    }
    if (name.includes('descriptionlistgroup')) {
      return 'term-group';
    }
    // DescriptionList container
    return 'data-display';
  }
  
  // Divider - visual separator
  if (name.includes('divider')) {
    return 'separator';
  }
  
  // Drag and Drop components
  if (name.includes('dragdropcontainer')) {
    return 'drag-drop-management';
  }
  if (name.includes('droppable')) {
    return 'drop-target';
  }
  if (name.includes('draggable')) {
    return 'drag-source';
  }
  if (name.includes('dragdropsort')) {
    return 'sort-management';
  }
  
  if (name.includes('table') || name.includes('tr') || name.includes('td') || name.includes('th')) {
    return 'data-display';
  }
  
  if (name.includes('flex') || name.includes('grid')) {
    return 'layout';
  }
  
  // Accordion - collapsible content sections
  if (name.includes('accordion')) {
    return 'collapsible-content';
  }
  
  // ActionList - container for grouping action buttons with proper spacing
  if (name.includes('actionlist')) {
    return 'action-group';
  }
  
  // Alert - communicates information/feedback to users
  if (name.includes('alert')) {
    return 'notification';
  }
  
  // Avatar - represents a user
  if (name.includes('avatar')) {
    return 'user-representation';
  }
  
  // Banner - basic (generic) or status (conveys severity/status)
  if (name.includes('banner')) {
    // Check if banner has a status color/variant (blue, red, green, gold, or info, danger, success, warning)
    const statusColors = ['blue', 'red', 'green', 'gold'];
    const statusVariants = ['info', 'danger', 'success', 'warning'];
    
    if (propsMap.has('color')) {
      const colorValue = propsMap.get('color');
      if (typeof colorValue === 'string' && statusColors.includes(colorValue.toLowerCase())) {
        return 'status';
      }
    }
    
    if (propsMap.has('variant')) {
      const variantValue = propsMap.get('variant');
      if (typeof variantValue === 'string') {
        const val = variantValue.toLowerCase();
        if (statusColors.includes(val) || statusVariants.includes(val)) {
          return 'status';
        }
      }
    }
    
    // Default to 'basic' if no status color/variant
    return 'basic';
  }
  
  // Breadcrumb - navigation component
  if (name.includes('breadcrumb')) {
    return 'navigation';
  }
  
  // ClipboardCopy - allows users to copy content to clipboard
  if (name.includes('clipboardcopy')) {
    return 'copy-action';
  }
  
  // CodeBlock - displays code snippets
  if (name.includes('codeblock')) {
    return 'code-display';
  }
  
  // Content - typography/text content component
  if (name.includes('content') && name !== 'accordioncontent' && name !== 'modalcontent' && name !== 'datalistcontent') {
    return 'text-display';
  }
  
  // DataList - displays structured data in list format
  if (name.includes('datalist') && name !== 'datalistaction') {
    // DataList container
    if (name === 'datalist') {
      return 'data-display';
    }
    // DataList children
    if (name.includes('datalistitem')) {
      return 'data-row';
    }
    if (name.includes('datalistcell')) {
      return 'data-cell';
    }
    if (name.includes('datalistcheck')) {
      return 'selection-control';
    }
    if (name.includes('datalistcontent')) {
      return 'data-content';
    }
    if (name.includes('datalistcontrol')) {
      return 'data-control';
    }
    if (name.includes('datalisttoggle')) {
      return 'expand-toggle';
    }
    // Default for DataList container
    return 'data-display';
  }
  
  return 'display';
}

/**
 * Infer variant from props (static analysis)
 */
function inferVariant(componentName, props) {
  const propsMap = propsToMap(props);
  const name = componentName.toLowerCase();
  
  // Alert variants - severity only (default, info, warning, critical, success)
  // Placement (toast/inline/plain) goes to data-size instead
  if (name.includes('alert') && name !== 'alertgroup') {
    // Severity variant (default, info, warning, critical, success)
    if (propsMap.has('variant')) {
      const variantValue = propsMap.get('variant');
      if (typeof variantValue === 'string') {
        return variantValue;
      }
    }
    // Default to 'default' if no variant specified
    return 'default';
  }
  
  // Banner variants - color types (default, blue, red, green, gold)
  // Purpose (basic/status) is determined by whether variant conveys status
  if (name.includes('banner')) {
    // Check for color prop first
    if (propsMap.has('color')) {
      const colorValue = propsMap.get('color');
      if (typeof colorValue === 'string') {
        return colorValue.toLowerCase();
      }
    }
    // Check for variant prop
    if (propsMap.has('variant')) {
      const variantValue = propsMap.get('variant');
      if (typeof variantValue === 'string') {
        const val = variantValue.toLowerCase();
        // If variant is a semantic value (info, danger, etc.), map to color
        const semanticToColor = {
          'info': 'blue',
          'danger': 'red',
          'success': 'green',
          'warning': 'gold',
        };
        // Return color if it's a semantic variant, otherwise return as-is
        return semanticToColor[val] || val;
      }
    }
    // Default to 'default' if no variant/color specified
    return 'default';
  }
  
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
  
  // Accordion variants - single expand vs multiple expand, bordered, heading level
  if (name.includes('accordion')) {
    const variants = [];
    
    // Check for single expand behavior (only one section open at a time)
    // This only applies to the parent Accordion component
    if (name === 'accordion' && (propsMap.has('isSingleExpand') || propsMap.has('singleExpand') || 
        propsMap.has('isExclusiveExpand') || propsMap.has('exclusiveExpand'))) {
      variants.push('single-expand');
    } else if (name === 'accordion') {
      // Multiple expand is the default for parent Accordion
      variants.push('multiple-expand');
    }
    
    // Check for bordered variant (applies to parent Accordion)
    if (name === 'accordion' && (propsMap.has('isBordered') || propsMap.has('bordered'))) {
      variants.push('bordered');
    }
    
    // Check for heading level (applies to parent Accordion, part of variant)
    if (name === 'accordion' && (propsMap.has('headingLevel') || propsMap.has('heading'))) {
      const headingLevel = propsMap.get('headingLevel') || propsMap.get('heading');
      if (typeof headingLevel === 'string' && headingLevel.match(/^h[1-6]$/i)) {
        variants.push(headingLevel.toLowerCase());
      } else if (typeof headingLevel === 'number' && headingLevel >= 1 && headingLevel <= 6) {
        variants.push(`h${headingLevel}`);
      }
    }
    
    // Check for fixed variant (only applies to children: AccordionItem, AccordionContent, AccordionToggle)
    if (name !== 'accordion' && (propsMap.has('isFixed') || propsMap.has('fixed'))) {
      variants.push('fixed');
    }
    
    // Return combined variant or just the expand behavior if no other variants
    if (variants.length > 1) {
      return variants.join('-');
    }
    if (variants.length === 1) {
      return variants[0];
    }
    // For accordion children without variants, return null
    return null;
  }
  
  // Avatar variants - bordered
  if (name.includes('avatar')) {
    // Check for bordered variant (similar to Accordion)
    if (propsMap.has('isBordered') || propsMap.has('bordered')) {
      return 'bordered';
    }
    // No variant if not bordered
    return null;
  }
  
  // Breadcrumb variants - basic, without-home-link, with-heading, with-dropdown
  // Variant detection will be enhanced by children analysis in transform.js
  if (name.includes('breadcrumb') && name !== 'breadcrumbitem' && name !== 'breadcrumbheading') {
    // Check for explicit variant prop
    if (propsMap.has('variant')) {
      const variantValue = propsMap.get('variant');
      if (typeof variantValue === 'string') {
        const val = variantValue.toLowerCase();
        if (['basic', 'without-home-link', 'with-heading', 'with-dropdown'].includes(val)) {
          return val;
        }
      }
    }
    // Check for props that indicate variants
    if (propsMap.has('showHome') && propsMap.get('showHome') === false) {
      return 'without-home-link';
    }
    if (propsMap.has('hideHome') || propsMap.has('isHomeHidden')) {
      return 'without-home-link';
    }
    if (propsMap.has('heading') || propsMap.has('hasHeading')) {
      return 'with-heading';
    }
    // Dropdown variant will be detected via children analysis in transform.js
    // For now, default to basic
    return 'basic';
  }
  
  // ClipboardCopy variants - many combinations possible
  // Variants: editable, read-only, expandable, inline-compact, code, with-array, json-object, 
  //          with-additional-action, with-truncation, expanded-by-default
  // Variant detection will be enhanced by children analysis in transform.js for content types
  if (name.includes('clipboardcopy')) {
    const variants = [];
    
    // Check for inline-compact variant
    if (propsMap.has('isInline') || propsMap.has('inline') || 
        (propsMap.has('variant') && propsMap.get('variant') === 'inline-compact')) {
      variants.push('inline-compact');
    }
    
    // Check for code variant (inline-compact-code)
    if (propsMap.has('code') || propsMap.has('isCode')) {
      variants.push('code');
    }
    
    // Check for truncation (inline-compact-with-truncation)
    if (propsMap.has('isTruncated') || propsMap.has('truncated') || propsMap.has('truncate')) {
      variants.push('with-truncation');
    }
    
    // Check for additional actions (inline-compact-with-additional-action)
    if (propsMap.has('additionalActions') || propsMap.has('additionalAction')) {
      variants.push('with-additional-action');
    }
    
    // Check for expandable variant (has expandable functionality)
    // Note: isExpanded is a state prop, but its presence indicates expandable capability
    // defaultExpanded also indicates expandable capability
    if (propsMap.has('expandable') || propsMap.has('isExpandable') || 
        propsMap.has('isExpanded') || propsMap.has('defaultExpanded')) {
      variants.push('expandable');
      // Check if expanded by default (only defaultExpanded prop, not isExpanded)
      if (propsMap.has('defaultExpanded') && propsMap.get('defaultExpanded') === true) {
        variants.push('expanded-by-default');
      }
    }
    
    // Check for content type variants (array, json-object)
    // These will be detected via children analysis in transform.js
    // For now, check if there's a hint in props
    if (propsMap.has('code')) {
      const codeValue = propsMap.get('code');
      if (typeof codeValue === 'string') {
        if (codeValue.toLowerCase() === 'json') {
          variants.push('json-object');
        }
      }
    }
    
    // Check for read-only variant
    if (propsMap.has('isReadOnly') || propsMap.has('readOnly') || propsMap.has('readonly')) {
      variants.push('read-only');
    } else if (!variants.includes('inline-compact')) {
      // If not read-only and not inline-compact, it's editable (default)
      // Inline-compact can be editable or read-only, so we don't add editable here
      variants.push('editable');
    }
    
    // Return combined variant or just the main one
    if (variants.length > 1) {
      // Combine all variants with hyphens
      return variants.join('-');
    }
    if (variants.length === 1) {
      return variants[0];
    }
    // Default to editable if no variant specified
    return 'editable';
  }
  
  // CodeBlock variants - default (basic) or expandable
  if (name.includes('codeblock')) {
    // Check for expandable variant
    if (propsMap.has('isExpanded') || propsMap.has('expandable') || propsMap.has('isExpandable')) {
      return 'expandable';
    }
    // Default variant - no variant attribute needed (null)
    return null;
  }
  
  // Content variants - body, heading, editorial
  // Note: Content component should NOT have nested components - use component prop instead
  if (name.includes('content') && name !== 'accordioncontent' && name !== 'modalcontent' && name !== 'datalistcontent') {
    // Check for component prop (h1, h2, h3, etc. for headings, p for body, etc.)
    if (propsMap.has('component')) {
      const componentValue = propsMap.get('component');
      if (typeof componentValue === 'string') {
        const comp = componentValue.toLowerCase();
        // Heading variants
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(comp)) {
          return comp; // e.g., 'h1', 'h2'
        }
        // Body content (p, div, span, etc.)
        if (comp === 'p' || comp === 'div' || comp === 'span') {
          return 'body';
        }
      }
    }
    // Check for explicit variant prop
    if (propsMap.has('variant')) {
      const variantValue = propsMap.get('variant');
      if (typeof variantValue === 'string') {
        const val = variantValue.toLowerCase();
        if (['body', 'heading', 'editorial'].includes(val)) {
          return val;
        }
      }
    }
    // Default to body if no variant specified
    return 'body';
  }
  
  // DataList variants - compact, default, selectable, clickable, expandable, draggable
  if (name.includes('datalist') && name !== 'datalistaction') {
    // DataList container variants
    if (name === 'datalist') {
      const variants = [];
      
      // Check for spacing variant (compact or default)
      if (propsMap.has('isCompact') || propsMap.has('compact')) {
        variants.push('compact');
      } else {
        variants.push('default'); // Default spacing
      }
      
      // Check for capabilities
      if (propsMap.has('onSelect') || propsMap.has('selectable') || propsMap.has('isSelectable')) {
        variants.push('selectable');
      }
      if (propsMap.has('onRowClick') || propsMap.has('onClick') || propsMap.has('clickable') || propsMap.has('isClickable')) {
        variants.push('clickable');
      }
      if (propsMap.has('onDrag') || propsMap.has('draggable') || propsMap.has('isDraggable')) {
        variants.push('draggable');
      }
      if (propsMap.has('isExpanded') || propsMap.has('expandable') || propsMap.has('isExpandable')) {
        variants.push('expandable');
      }
      
      // Return combined variant
      if (variants.length > 1) {
        return variants.join('-');
      }
      if (variants.length === 1) {
        return variants[0];
      }
      // Default to default spacing
      return 'default';
    }
    
    // DataListItem variants - can be clickable, selectable, draggable
    if (name.includes('datalistitem')) {
      const variants = [];
      if (propsMap.has('onClick') || propsMap.has('clickable') || propsMap.has('isClickable')) {
        variants.push('clickable');
      }
      if (propsMap.has('onSelect') || propsMap.has('selectable') || propsMap.has('isSelectable')) {
        variants.push('selectable');
      }
      if (propsMap.has('onDrag') || propsMap.has('draggable') || propsMap.has('isDraggable')) {
        variants.push('draggable');
      }
      if (propsMap.has('isExpanded') || propsMap.has('expandable') || propsMap.has('isExpandable')) {
        variants.push('expandable');
      }
      if (variants.length > 0) {
        return variants.join('-');
      }
      return null;
    }
    
    // DataListToggle variants - expanded/collapsed state
    if (name.includes('datalisttoggle')) {
      if (propsMap.has('isExpanded') || propsMap.has('expanded')) {
        const expandedValue = propsMap.has('isExpanded') 
          ? propsMap.get('isExpanded') 
          : propsMap.get('expanded');
        if (expandedValue === false) {
          return 'collapsed';
        }
        return 'expanded';
      }
      return null;
    }
    
    // Other DataList children don't have variants
    return null;
  }
  
  // Date and Time picker variants
  // DatePicker variants - single, range, with-time
  if (name.includes('datepicker')) {
    // Check for range selection (two date pickers used together)
    if (propsMap.has('rangeStart') || propsMap.has('rangeEnd') || 
        propsMap.has('isRange') || propsMap.has('range')) {
      // Check if combined with time picker
      if (propsMap.has('includeTime') || propsMap.has('withTime') || 
          propsMap.has('timePicker')) {
        return 'range-with-time';
      }
      return 'range';
    }
    // Check if combined with time picker (single date + time)
    if (propsMap.has('includeTime') || propsMap.has('withTime') || 
        propsMap.has('timePicker')) {
      return 'with-time';
    }
    // Default to single date selection
    return 'single';
  }
  
  // TimePicker variants - 12-hour, 24-hour
  if (name.includes('timepicker')) {
    if (propsMap.has('is24Hour') || propsMap.has('use24Hour') || 
        propsMap.has('format') && propsMap.get('format') === '24') {
      return '24-hour';
    }
    // Default to 12-hour format
    return '12-hour';
  }
  
  // CalendarMonth variants - inline, popover
  if (name.includes('calendarmonth')) {
    if (propsMap.has('isInline') || propsMap.has('inline')) {
      return 'inline';
    }
    // Default to popover (used within DatePicker)
    return 'popover';
  }
  
  // DescriptionList variants - default (vertical), horizontal, with-columns
  if (name.includes('descriptionlist')) {
    // DescriptionList container variants
    if (name === 'descriptionlist' || (name.includes('descriptionlist') && 
        !name.includes('descriptionlistgroup') && !name.includes('descriptionlistterm') && 
        !name.includes('descriptionlistitem') && !name.includes('descriptionlistdescription'))) {
      const variants = [];
      
      // Check for horizontal variant
      if (propsMap.has('isHorizontal') || propsMap.has('horizontal') || 
          propsMap.has('orientation') && propsMap.get('orientation') === 'horizontal') {
        variants.push('horizontal');
      } else {
        variants.push('vertical'); // Default is vertical
      }
      
      // Check for columns
      if (propsMap.has('columnModifier') || propsMap.has('columns') || 
          propsMap.has('columnCount') || propsMap.has('cols')) {
        variants.push('with-columns');
      }
      
      // Return combined variant or just the main one
      if (variants.length > 1) {
        return variants.join('-');
      }
      if (variants.length === 1) {
        return variants[0];
      }
      // Default to vertical
      return 'vertical';
    }
    
    // DescriptionListTerm variants - can have help text (popover)
    if (name.includes('descriptionlistterm')) {
      if (propsMap.has('helpText') || propsMap.has('popover') || propsMap.has('hasHelp')) {
        return 'with-help-text';
      }
      return null;
    }
    
    // DescriptionListDescription variants - can be editable or link
    if (name.includes('descriptionlistdescription')) {
      if (propsMap.has('isEditable') || propsMap.has('editable') || propsMap.has('onEdit')) {
        return 'editable';
      }
      if (propsMap.has('href') || propsMap.has('to') || propsMap.has('link')) {
        return 'link';
      }
      return null;
    }
    
    // Other DescriptionList children don't have variants
    return null;
  }
  
  // Drawer variants - overlay (default) or inline
  if (name.includes('drawer')) {
    if (propsMap.has('isInline') || propsMap.has('inline')) {
      return 'inline';
    }
    if (propsMap.has('isStaticDrawer') || propsMap.has('staticDrawer')) {
      return 'static';
    }
    // Default to overlay
    return 'overlay';
  }
  
  // DualListSelector variants - handled via children analysis in transform.js
  // Base variants: basic, with-tree, draggable
  // Sub-variants detected from children: with-tooltips, with-search, with-actions, multiple-drop-zones
  if (name.includes('duallistselector') && !name.includes('duallistselectorpane') && 
      !name.includes('duallistselectorlist') && !name.includes('duallistselectorlistitem')) {
    // Main DualListSelector - variant will be determined by children analysis
    // Base variant detection
    const variants = [];
    if (propsMap.has('isTree') || propsMap.has('tree') || propsMap.has('isExpandable')) {
      variants.push('with-tree');
    }
    if (propsMap.has('isDraggable') || propsMap.has('draggable') || propsMap.has('onDrag')) {
      variants.push('draggable');
    }
    // Default to basic if no variants detected
    return variants.length > 0 ? variants.join('-') : 'basic';
  }
  
  // DualListSelectorPane variants - available or chosen
  if (name.includes('duallistselectorpane')) {
    const variants = [];
    // Check for available vs chosen (status prop or similar)
    if (propsMap.has('status')) {
      const statusValue = propsMap.get('status');
      if (typeof statusValue === 'string') {
        variants.push(statusValue.toLowerCase()); // available or chosen
      }
    }
    // Check for sub-variants
    if (propsMap.has('hasSearch') || propsMap.has('search') || propsMap.has('onFilter')) {
      variants.push('with-search');
    }
    if (propsMap.has('hasActions') || propsMap.has('actions') || propsMap.has('onAction')) {
      variants.push('with-actions');
    }
    if (propsMap.has('hasSort') || propsMap.has('sort') || propsMap.has('onSort')) {
      variants.push('with-sort');
    }
    return variants.length > 0 ? variants.join('-') : null;
  }
  
  // DualListSelectorListItem variants - folder (if it's a folder/group in tree view)
  if (name.includes('duallistselectorlistitem')) {
    if (propsMap.has('isFolder') || propsMap.has('folder') || propsMap.has('hasChildren')) {
      return 'folder';
    }
    return null;
  }
  
  // Divider variants - horizontal (default) or vertical
  if (name.includes('divider')) {
    if (propsMap.has('isVertical') || propsMap.has('vertical') || 
        propsMap.has('orientation') && propsMap.get('orientation') === 'vertical') {
      return 'vertical';
    }
    // Default to horizontal
    return 'horizontal';
  }
  
  // Drag and Drop variants - variant prop indicates the type of component being dragged/dropped
  // Variant is most commonly on DragDropContainer and Droppable, less common on Draggable/DragDropSort
  if (name.includes('dragdropcontainer') || name.includes('droppable')) {
    // The variant prop indicates what type of component is being dragged (e.g., "DataList", "Card", etc.)
    if (propsMap.has('variant')) {
      const variantValue = propsMap.get('variant');
      if (variantValue && typeof variantValue === 'string') {
        return variantValue.toLowerCase();
      }
    }
    return null; // No variant specified
  }
  // Draggable and DragDropSort rarely have variant props - return null if not found
  if (name.includes('draggable') || name.includes('dragdropsort')) {
    if (propsMap.has('variant')) {
      const variantValue = propsMap.get('variant');
      if (variantValue && typeof variantValue === 'string') {
        return variantValue.toLowerCase();
      }
    }
    return null; // Variant unlikely on these components
  }
  
  // ActionList variants - handled separately via children analysis
  // See inferActionListVariant() function below
  
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
  
  // Modal and Drawer are both overlay components (large pop-ups/overlays)
  if (name.includes('modal') || name.includes('drawer')) {
    return 'overlay';
  }
  
  if (name.includes('table') || name.includes('tr') || name.includes('td') || name.includes('th')) {
    return 'table';
  }
  
  if (name.includes('toolbar') || propsMap.has('toolbar')) {
    return 'toolbar';
  }
  
  if (propsMap.has('navigation') || name.includes('nav') || name.includes('menu')) {
    return 'navigation';
  }
  
  // Breadcrumb context - typically at page level (under masthead)
  if (name.includes('breadcrumb')) {
    return 'page';
  }
  
  // ActionList context - where it's used (modal, wizard, toolbar, form, etc.)
  // This is typically inferred from parent components, but we can also check props
  if (name.includes('actionlist')) {
    // Context is usually inferred from parent (modal, wizard, toolbar, form)
    // But if we can't infer from parent, we can check if it's in a specific context
    // For now, let parent context detection handle this
  }
  
  // Layout components are containers
  if (name.includes('flex') || name.includes('grid') || name.includes('stack') || name.includes('card')) {
    return 'container';
  }
  
  // Alert context - where alerts are used (form, modal, page, alert-group, etc.)
  // This is typically inferred from parent components, but we can also check props
  if (name.includes('alert')) {
    if (name === 'alertgroup') {
      return 'alert-group';
    }
    // Alerts within AlertGroup have alert-group context
    // (parent context detection will handle this, but we can also check for actionLinks)
    // Toast alerts are typically at page level (upper-right corner)
    if (propsMap.has('isToast') || propsMap.has('toast')) {
      return 'page';
    }
    // Alerts with actionLinks might be in modals or forms
    if (propsMap.has('actionLinks') || propsMap.has('actionLink')) {
      // Could be modal or form context - let parent context detection handle this
      // But we know it has interactive elements
    }
    // Inline alerts can be in forms, modals, or page content
    // Context is usually inferred from parent components
    // For now, let parent context detection handle this
  }
  
  // Banner context - typically at page level (top or bottom of page)
  if (name.includes('banner')) {
    // Banners are typically placed at top/bottom of page or above/below main content
    // They're always at page level, not nested in forms/modals
    return 'page';
  }
  
  // Display components are typically on the page
  if (name.includes('badge') || name.includes('title') || name.includes('heading')) {
    return 'page';
  }
  
  // Date and Time pickers - can be in forms, toolbars, or modals
  // Context is typically inferred from parent, but we can check for explicit props
  if (name.includes('datepicker') || name.includes('timepicker') || name.includes('calendarmonth')) {
    // Context is usually inferred from parent (form, toolbar, modal)
    // But if we can't infer from parent, we can check if it's in a specific context
    // For now, let parent context detection handle this
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
    // Check both props explicitly (can't use || because false is falsy)
    const expandedValue = propsMap.has('isExpanded') 
      ? propsMap.get('isExpanded') 
      : propsMap.get('expanded');
    // Check if it's explicitly false (collapsed)
    if (expandedValue === false) {
      return 'collapsed';
    }
    // Otherwise it's expanded (true or truthy)
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
  
  // Alert states - expandable alerts can be expanded/collapsed, transient alerts, dismissible alerts
  if (name.includes('alert') && name !== 'alertgroup') {
    // Expandable alerts
    if (propsMap.has('isExpandable') || propsMap.has('expandable')) {
      if (propsMap.has('isExpanded') || propsMap.has('expanded')) {
        const expandedValue = propsMap.has('isExpanded') 
          ? propsMap.get('isExpanded') 
          : propsMap.get('expanded');
        if (expandedValue === false) {
          return 'collapsed';
        }
        return 'expanded';
      }
      // Default to collapsed if expandable but no explicit state
      return 'collapsed';
    }
    // Dismissible alerts (can be closed by user)
    if (propsMap.has('onClose') || propsMap.has('isDismissible') || propsMap.has('dismissible') ||
        propsMap.has('isToast') || propsMap.has('toast')) {
      return 'dismissible';
    }
    // Transient alerts (show only once, auto-dismiss) - detected via timeout or hover handlers
    if (propsMap.has('timeout') || propsMap.has('onTimeout') || 
        propsMap.has('onMouseEnter') || propsMap.has('onMouseLeave')) {
      return 'transient';
    }
    // Non-expandable alerts don't have a state (they're just visible)
    return null;
  }
  
  // ClipboardCopy states - expandable clipboard copy can be expanded/collapsed
  if (name.includes('clipboardcopy')) {
    // Expandable clipboard copy
    if (propsMap.has('isExpanded') || propsMap.has('expanded')) {
      const expandedValue = propsMap.has('isExpanded') 
        ? propsMap.get('isExpanded') 
        : propsMap.get('expanded');
      if (expandedValue === false) {
        return 'collapsed';
      }
      return 'expanded';
    }
    // Non-expandable clipboard copy doesn't have a state
    return null;
  }
  
  // CodeBlock states - expandable code block can be expanded/collapsed
  if (name.includes('codeblock')) {
    // Expandable code block
    if (propsMap.has('isExpanded') || propsMap.has('expanded')) {
      const expandedValue = propsMap.has('isExpanded') 
        ? propsMap.get('isExpanded') 
        : propsMap.get('expanded');
      if (expandedValue === false) {
        return 'collapsed';
      }
      return 'expanded';
    }
    // Non-expandable code block doesn't have a state
    return null;
  }
  
  // DataList states - items can be selected, expanded, dragged
  if (name.includes('datalist') && name !== 'datalistaction') {
    // DataListItem states
    if (name.includes('datalistitem')) {
      if (propsMap.has('isSelected') || propsMap.has('selected')) {
        return 'selected';
      }
      if (propsMap.has('isExpanded') || propsMap.has('expanded')) {
        const expandedValue = propsMap.has('isExpanded') 
          ? propsMap.get('isExpanded') 
          : propsMap.get('expanded');
        if (expandedValue === false) {
          return 'collapsed';
        }
        return 'expanded';
      }
      return null;
    }
    // DataListCheck states
    if (name.includes('datalistcheck')) {
      if (propsMap.has('isChecked') || propsMap.has('checked')) {
        return 'checked';
      }
      return null;
    }
    // DataListContent states
    if (name.includes('datalistcontent')) {
      if (propsMap.has('isExpanded') || propsMap.has('expanded')) {
        const expandedValue = propsMap.has('isExpanded') 
          ? propsMap.get('isExpanded') 
          : propsMap.get('expanded');
        if (expandedValue === false) {
          return 'collapsed';
        }
        return 'expanded';
      }
      return null;
    }
    // Other DataList children don't have states
    return null;
  }
  
  // Date and Time picker states
  // DatePicker states - open/closed (popover), disabled, invalid
  if (name.includes('datepicker')) {
    if (propsMap.has('isOpen') || propsMap.has('open')) {
      const openValue = propsMap.has('isOpen') 
        ? propsMap.get('isOpen') 
        : propsMap.get('open');
      if (openValue === false) {
        return 'closed';
      }
      return 'open';
    }
    if (propsMap.has('isInvalid') || propsMap.has('invalid') || 
        propsMap.has('validated') && propsMap.get('validated') === 'error') {
      return 'invalid';
    }
    // Disabled state is handled by generic check above
    return null;
  }
  
  // TimePicker states - open/closed (popover), disabled, invalid
  if (name.includes('timepicker')) {
    if (propsMap.has('isOpen') || propsMap.has('open')) {
      const openValue = propsMap.has('isOpen') 
        ? propsMap.get('isOpen') 
        : propsMap.get('open');
      if (openValue === false) {
        return 'closed';
      }
      return 'open';
    }
    if (propsMap.has('isInvalid') || propsMap.has('invalid') || 
        propsMap.has('validated') && propsMap.get('validated') === 'error') {
      return 'invalid';
    }
    return null;
  }
  
  // CalendarMonth states - selected date, today, disabled dates
  if (name.includes('calendarmonth')) {
    // Selected state is typically on individual date cells, not the calendar itself
    // But we can check if calendar has a selected date
    if (propsMap.has('selectedDate') || propsMap.has('value')) {
      return 'has-selection';
    }
    return null;
  }
  
  // DescriptionList states
  // DescriptionListDescription states - can be editing (inline edit)
  if (name.includes('descriptionlistdescription')) {
    if (propsMap.has('isEditing') || propsMap.has('editing') || propsMap.has('editMode')) {
      return 'editing';
    }
    return null;
  }
  
  // DualListSelector states
  if (name.includes('duallistselectorlistitem')) {
    // List items can be selected
    if (propsMap.has('isSelected') || propsMap.has('selected')) {
      return 'selected';
    }
    // Items can be expanded/collapsed if they're folders
    if (propsMap.has('isExpanded') || propsMap.has('expanded')) {
      const expandedValue = propsMap.has('isExpanded') 
        ? propsMap.get('isExpanded') 
        : propsMap.get('expanded');
      if (expandedValue === false) {
        return 'collapsed';
      }
      return 'expanded';
    }
    return null;
  }
  if (name.includes('duallistselectorpane')) {
    // Panes can be disabled
    if (propsMap.has('isDisabled') || propsMap.has('disabled')) {
      return 'disabled';
    }
    return null;
  }
  
  // Drag and Drop states - items can be dragging, being dragged over, etc.
  // Note: We don't detect "active" states for drag operations (too dynamic for static analysis)
  if (name.includes('draggable')) {
    // Draggable items don't typically have static state props
    return null;
  }
  if (name.includes('droppable')) {
    // Droppable can be disabled
    if (propsMap.has('isDisabled') || propsMap.has('disabled')) {
      return 'disabled';
    }
    return null;
  }
  if (name.includes('dragdropcontainer') || name.includes('dragdropsort')) {
    // Containers don't have meaningful static states
    return null;
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
  
  // Alert action types - alerts with actionLinks are actionable (not navigation)
  // Note: dismissible is handled as a state, not an action-type
  if (name.includes('alert') && name !== 'alertgroup') {
    // Alerts with actionLinks are actionable (have interactive elements for user actions)
    // These are not navigation - they're for taking actions related to the alert
    if (propsMap.has('actionLinks') || propsMap.has('actionLink')) {
      return 'actionable';
    }
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
  const name = componentName.toLowerCase();

  // Avatar size - small (sm), medium (md), large (lg), extra large (xl)
  // Must be checked BEFORE generic size check to normalize values
  if (name.includes('avatar')) {
    if (propsMap.has('size')) {
      const sizeValue = propsMap.get('size');
      if (typeof sizeValue === 'string') {
        // Normalize size values (sm -> small, md -> medium, lg -> large, xl -> extra-large)
        const sizeMap = {
          'sm': 'small',
          'md': 'medium',
          'lg': 'large',
          'xl': 'extra-large',
          'small': 'small',
          'medium': 'medium',
          'large': 'large',
          'extra-large': 'extra-large',
          'extralarge': 'extra-large',
        };
        return sizeMap[sizeValue.toLowerCase()] || sizeValue.toLowerCase();
      }
    }
    // Default to small if no size specified (PatternFly default)
    return 'small';
  }

  // Check for explicit size prop (generic)
  if (propsMap.has('size')) {
    const sizeValue = propsMap.get('size');
    if (typeof sizeValue === 'string') {
      return sizeValue;
    }
  }

  // Drawer placement - right (default), left, bottom
  if (name.includes('drawer')) {
    if (propsMap.has('position')) {
      const positionValue = propsMap.get('position');
      if (typeof positionValue === 'string') {
        return positionValue.toLowerCase(); // right, left, bottom
      }
    }
    // Default to right if no position specified (PatternFly default)
    return 'right';
  }
  
  // Check for displaySize prop (used in Accordion)
  if (propsMap.has('displaySize')) {
    const displaySizeValue = propsMap.get('displaySize');
    if (typeof displaySizeValue === 'string') {
      return displaySizeValue;
    }
  }

  // Alert size - placement type (toast, inline, plain)
  // These indicate placement/size rather than visual style
  if (name.includes('alert') && name !== 'alertgroup') {
    if (propsMap.has('isToast') || propsMap.has('toast')) {
      return 'toast';
    }
    if (propsMap.has('isPlain') || propsMap.has('plain')) {
      return 'plain';
    }
    if (propsMap.has('isInline') || propsMap.has('inline')) {
      return 'inline';
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

/**
 * Infer ActionList variant from children analysis
 * Analyzes what types of actions are in the list (primary button, secondary button, icon, etc.)
 * Icons are overflow when 2+ buttons are present; single icon-only cases are valid.
 */
function inferActionListVariant(children) {
  if (!children || children.length === 0) {
    return 'button-group'; // Default
  }
  
  const hasPrimary = children.some(c => c === 'primary');
  const hasSecondary = children.some(c => c === 'secondary' || c === 'button');
  const hasDanger = children.some(c => c === 'danger');
  
  // Count icons (kebab, menu toggle, or other icon buttons)
  const icons = children.filter(c => c === 'kebab' || c === 'icon');
  const iconCount = icons.length;
  const hasIcons = iconCount > 0;
  
  // Count buttons (non-icon actions)
  const buttonCount = children.filter(c => c !== 'kebab' && c !== 'icon').length;
  const hasMultipleButtons = buttonCount >= 2;
  
  // Icons are overflow when 2+ buttons present (primary + secondary mix)
  if (hasMultipleButtons && hasIcons && hasPrimary && hasSecondary) {
    return iconCount >= 2 ? 'primary-secondary-icons' : 'primary-secondary-icon';
  }
  
  // Button-only cases (ActionList only used for multiple buttons)
  if (hasPrimary && hasSecondary) {
    return 'primary-secondary';
  }
  
  // Icon-only cases (ActionList only used for multiple icons)
  if (hasIcons && buttonCount === 0 && iconCount >= 2) {
    return 'icons-only';
  }
  
  if (hasDanger) {
    return 'danger-group';
  }
  
  return 'button-group'; // Default fallback
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
  inferActionListVariant,
  propsToMap,
  isPatternFlyComponent,
};

