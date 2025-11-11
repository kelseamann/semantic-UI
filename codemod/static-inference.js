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
    'modalclosebutton': 'close-button',
    'modaltogglebutton': 'modal-toggle',
    'modalfooter': 'modal-footer',
    'modalbody': 'modal-body',
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
    // Menu components
    'menu': 'menu',
    'menulist': 'menu-list',
    'menuitem': 'menu-item',
    'menugroup': 'menu-group',
    'menusearch': 'menu-search',
    'menusearchinput': 'menu-search-input',
    'dropdown': 'dropdown',
    'optionsmenu': 'options-menu',
    'optionsmenutoggle': 'options-menu-toggle',
    'applicationlauncher': 'application-launcher',
    'applicationlaunchermenu': 'application-launcher-menu',
    'applicationlauncheritem': 'application-launcher-item',
    'contextselector': 'context-selector',
    'contextselectormenu': 'context-selector-menu',
    'contextselectoritem': 'context-selector-item',
    'select': 'select',
    'selectoption': 'select-option',
    'selectoptiongroup': 'select-option-group',
    'selecttoggle': 'select-toggle',
    // Accordion components - more descriptive roles
    'accordion': 'accordion',
    'accordionitem': 'accordion-section',      // A section/item within an accordion
    'accordioncontent': 'accordion-panel',     // The content panel that expands/collapses
    'accordiontoggle': 'accordion-header',     // The clickable header that toggles the panel
    // ActionList components - more descriptive roles
    'actionlist': 'action-group',             // Container for grouping action buttons
    'actionlistitem': 'action-item',           // Individual action item within the group
    // OverflowMenu components - menu for overflow actions when space is constrained
    'overflowmenu': 'overflow-menu',           // Menu container for overflow actions
    'overflowmenucontent': 'overflow-menu-content', // Content of overflow menu
    'overflowmenuitem': 'overflow-menu-item',  // Individual item in overflow menu
    // Alert components
    'alert': 'alert',                         // Alert notification
    'alertgroup': 'alert-group',              // Container for multiple alerts
    'hint': 'alert',                          // Hint is a variant of Alert (proactive guidance)
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
    // EmptyState component
    'emptystate': 'empty-state',                 // Empty state container
    // EmptyStateHeader, EmptyStateIcon, EmptyStateBody, EmptyStateFooter, EmptyStateActions are structural children - skipped
    // ExpandableSection component
    'expandablesection': 'expandable-section',   // Expandable section container
    // ExpandableSectionToggle and ExpandableSectionContent are structural children - skipped
    // FileUpload components
    'fileupload': 'file-upload',                 // File upload component (single or multiple)
    'multiplefileupload': 'file-upload',         // Multiple file upload (variant of file-upload)
    'fileuploadfield': 'file-upload',            // File upload field (customizable variant)
    // InlineEdit components
    'inlineedit': 'inline-edit',                 // Inline edit container
    'inlineedittoggle': 'edit-trigger',          // Pencil icon that triggers edit mode
    'inlineeditactiongroup': 'button-group',     // Save/cancel action buttons
    'inlineeditinput': 'editable-input',         // Editable input field
    // InputGroup component
    'inputgroup': 'input-group',                  // Container that combines input with buttons/text
    // JumpLinks components
    'jumplinks': 'jump-links',                    // Navigation component for jumping to page sections
    'jumplinksitem': 'jump-link-item',            // Individual jump link item
    // Label components
    'label': 'label',                             // Label/tag component
    'labelgroup': 'label-group',                  // Container for multiple labels
    // List components
    'list': 'list',                               // List container (ordered or unordered)
    'listitem': 'list-item',                      // Individual list item
    // LoginForm component
    'loginform': 'login-form',                    // Authentication/login form
    // Masthead components
    'masthead': 'masthead',                       // Top navigation bar/header
    // MastheadBrand is structural - skipped
    // Brand component - logo/branding
    'brand': 'logo',                              // Logo/brand component (if interactive)
    // Navigation components
    'nav': 'navigation',                          // Main navigation container
    'navlist': 'navigation-list',                 // List container for nav items
    'navitem': 'navigation-item',                 // Individual navigation item/link
    'navgroup': 'navigation-group',               // Grouped navigation items with title
    'navexpandable': 'navigation-expandable',     // Expandable navigation item with children
    'navsection': 'navigation-section',            // Section of navigation
    // Notification components
    'notificationbadge': 'notification-badge',    // Badge in masthead that toggles notification drawer
    'notificationdrawer': 'notification-drawer',  // Drawer that displays notification history
    'notificationdrawerheader': 'notification-drawer-header', // Header of notification drawer
    'notificationdrawerbody': 'notification-drawer-body',     // Body of notification drawer
    'notificationdrawergroup': 'notification-group',           // Group of notifications (for grouped drawer)
    'notificationdrawergrouptoggle': 'notification-group-toggle', // Toggle for notification group
    'notificationdrawerlist': 'notification-list',             // List of notifications
    'notificationdrawerlistitem': 'notification-item',         // Individual notification item
  };
  
  // Droppable and Draggable don't get roles - they're structural children, role handled by parent
  if (name.includes('droppable') || name.includes('draggable')) {
    return null;
  }
  
  // DualListSelectorPane and DualListSelectorListItem don't get roles - they're structural children
  if (name.includes('duallistselectorpane') || name.includes('duallistselectorlistitem')) {
    return null;
  }
  
  // Icon components - all PatternFly icons get role='icon'
  // Icons are typically named like StarIcon, CheckIcon, etc. and imported from @patternfly/react-icons
  if (name.endsWith('icon') && name !== 'menutoggle') {
    return 'icon';
  }
  
  // Brand component - always gets role='logo' (both interactive and decorative)
  if (name === 'brand') {
    return 'logo';
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
  
  // FileUpload components - check before generic checks
  if (name.includes('fileupload')) {
    return 'file-input';
  }
  
  // ExpandableSection component - check before generic checks
  if (name.includes('expandablesection')) {
    return 'collapsible-content';
  }
  
  // EmptyState component - check before generic checks
  if (name.includes('emptystate')) {
    return 'no-content';
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
  
  // InlineEdit components - enable editing of content inline
  if (name.includes('inlineedit')) {
    if (name.includes('inlineedittoggle')) {
      return 'toggle-trigger'; // Pencil icon that toggles edit mode on/off
    }
    if (name.includes('inlineeditactiongroup')) {
      return 'action'; // Save/cancel action buttons
    }
    if (name.includes('inlineeditinput')) {
      return 'input'; // Editable input field
    }
    // Main InlineEdit container
    return 'editing';
  }
  
  // InputGroup - combines input with buttons/text on sides
  if (name.includes('inputgroup')) {
    return 'input';
  }
  
  // JumpLinks - navigation component for jumping to sections within a page
  if (name.includes('jumplink')) {
    if (name.includes('jumplinksitem')) {
      return 'navigation'; // Individual jump link item
    }
    return 'navigation'; // Main jump links container
  }
  
  // Navigation components - hierarchical navigation structure
  if (name.includes('nav') && !name.includes('menutoggle')) {
    if (name.includes('navitem')) {
      return 'navigation'; // Individual navigation link/item
    }
    if (name.includes('navexpandable')) {
      return 'navigation'; // Expandable navigation item
    }
    if (name.includes('navgroup')) {
      return 'grouping'; // Group of navigation items
    }
    if (name.includes('navsection')) {
      return 'grouping'; // Section of navigation
    }
    if (name.includes('navlist')) {
      return 'navigation-container'; // Container for nav items
    }
    // Main Nav component
    return 'navigation';
  }
  
  // Label - can be used for tagging, filtering, status indication, or display
  if (name.includes('label') && !name.includes('descriptionlistterm')) {
    if (name.includes('labelgroup')) {
      return 'tag-group'; // Container for multiple labels
    }
    // Check if it's used for filtering (common use case)
    if (propsMap.has('onClose') || propsMap.has('isDismissible') || propsMap.has('dismissible')) {
      // Dismissible labels are often used in filters
      return 'filter';
    }
    // Check if it's a status label (has status color)
    if (propsMap.has('color')) {
      const colorValue = propsMap.get('color');
      if (typeof colorValue === 'string') {
        const color = colorValue.toLowerCase();
        if (['danger', 'warning', 'success', 'info', 'custom'].includes(color)) {
          return 'status-indicator';
        }
      }
    }
    // Default purpose for labels
    return 'tag';
  }
  
  // List components - organize information in digestible format
  if (name.includes('list') && !name.includes('datalist') && !name.includes('actionlist') && !name.includes('duallistselector')) {
    if (name.includes('listitem')) {
      return 'display'; // Individual list item displays content
    }
    return 'display'; // List container displays organized information
  }
  
  // LoginForm - authentication/login form
  if (name.includes('loginform')) {
    return 'authentication';
  }
  
  // Masthead - top navigation bar
  if (name.includes('masthead')) {
    return 'navigation';
  }
  
  // Menu components - various menu types
  if (name.includes('menu') || name.includes('dropdown') || name.includes('select')) {
    // Application Launcher - switch between applications
    if (name.includes('applicationlauncher')) {
      if (name.includes('applicationlauncheritem')) {
        return 'application-selection';
      }
      return 'application-switching';
    }
    
    // Context Selector - select context/workspace
    if (name.includes('contextselector')) {
      if (name.includes('contextselectoritem')) {
        return 'context-selection';
      }
      return 'context-selection';
    }
    
    // Options Menu - provides optional settings/actions
    if (name.includes('optionsmenu')) {
      if (name.includes('optionsmenutoggle')) {
        return 'toggle-trigger';
      }
      return 'settings';
    }
    
    // Select component - choose from options
    if (name.includes('select') && !name.includes('duallistselector')) {
      if (name.includes('selectoption')) {
        return 'option-selection';
      }
      if (name.includes('selecttoggle')) {
        return 'toggle-trigger';
      }
      return 'option-selection';
    }
    
    // Dropdown - dropdown menu
    if (name.includes('dropdown')) {
      if (name.includes('dropdownitem')) {
        return 'menu-action';
      }
      return 'menu';
    }
    
    // Menu Toggle - opens/closes menu
    if (name.includes('menutoggle')) {
      return 'toggle-trigger';
    }
    
    // Menu Item - individual menu item
    if (name.includes('menuitem')) {
      // Check if it's a navigation item (has href or onClick that navigates)
      if (propsMap.has('href') || propsMap.has('to')) {
        return 'navigation';
      }
      // Check if it's an action item (has onClick)
      if (propsMap.has('onClick')) {
        return 'action';
      }
      // Default to menu action
      return 'menu-action';
    }
    
    // Menu Search - search within menu
    if (name.includes('menusearch')) {
      return 'search';
    }
    
    // Menu Group - groups menu items
    if (name.includes('menugroup')) {
      return 'grouping';
    }
    
    // Menu List - container for menu items
    if (name.includes('menulist')) {
      return 'menu-container';
    }
    
    // Generic Menu - container for menu items
    if (name.includes('menu')) {
      return 'menu';
    }
  }
  
  // Brand component - logo/branding
  // If interactive (has onClick or wrapped in Link), it's navigation
  // Otherwise, it's decorative (display)
  if (name.includes('brand')) {
    // Check if it has onClick (interactive)
    if (propsMap.has('onClick')) {
      return 'navigation';
    }
    // If wrapped in Link, the Link will get navigation purpose
    // Brand itself is decorative
    return 'display';
  }
  
  // Component-specific purposes
  if (name.includes('input') || name.includes('textarea') || name.includes('select')) {
    return 'input';
  }
  
  // Modal components
  if (name.includes('modal')) {
    if (name.includes('modalclosebutton')) {
      return 'close-action';
    }
    if (name.includes('modaltogglebutton')) {
      return 'toggle-trigger';
    }
    if (name.includes('modalfooter')) {
      return 'action';
    }
    if (name.includes('modalbody')) {
      return 'content';
    }
    // Main Modal component
    return 'overlay';
  }
  
  // Drawer purpose - can be overlay, details, navigation, filter, form, settings
  if (name.includes('drawer')) {
    // Check for explicit purpose-related props or infer from context
    // For now, default to 'overlay' (can be enhanced with context analysis)
    return 'overlay';
  }
  
  if (name.includes('form')) {
    // Check for explicit purpose prop (create, edit, search, filter, settings)
    if (propsMap.has('purpose')) {
      const purposeValue = propsMap.get('purpose');
      if (typeof purposeValue === 'string') {
        return purposeValue.toLowerCase();
      }
    }
    // Try to infer from action prop (e.g., action="/api/create" -> "create")
    if (propsMap.has('action')) {
      const actionValue = propsMap.get('action');
      if (typeof actionValue === 'string') {
        const action = actionValue.toLowerCase();
        if (action.includes('create') || action.includes('add') || action.includes('new')) {
          return 'create';
        }
        if (action.includes('edit') || action.includes('update') || action.includes('modify')) {
          return 'edit';
        }
        if (action.includes('search') || action.includes('query') || action.includes('find')) {
          return 'search';
        }
        if (action.includes('filter')) {
          return 'filter';
        }
        if (action.includes('settings') || action.includes('config')) {
          return 'settings';
        }
      }
    }
    // Default to form-container if we can't infer a specific purpose
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
  
  // OverflowMenu - menu for overflow actions when space is constrained
  // Similar to ActionList in purpose (organizing actions) but uses menu pattern for overflow
  if (name.includes('overflowmenu')) {
    if (name.includes('overflowmenuitem')) {
      return 'action'; // Individual action item in overflow menu
    }
    if (name.includes('overflowmenucontent')) {
      return 'menu-container'; // Container for menu items
    }
    // Main OverflowMenu component
    return 'action-group'; // Similar purpose to ActionList - organizing actions
  }
  
  // Notification components - check before Alert
  if (name.includes('notification')) {
    if (name.includes('notificationbadge')) {
      return 'notification-trigger'; // Badge that toggles notification drawer
    }
    if (name.includes('notificationdrawergroup')) {
      return 'grouping'; // Group of notifications
    }
    if (name.includes('notificationdrawergrouptoggle')) {
      return 'toggle-trigger'; // Toggle for notification group
    }
    if (name.includes('notificationdrawerlistitem')) {
      return 'notification'; // Individual notification
    }
    if (name.includes('notificationdrawerlist')) {
      return 'notification-container'; // Container for notifications
    }
    if (name.includes('notificationdrawerbody')) {
      return 'content'; // Body content of drawer
    }
    if (name.includes('notificationdrawerheader')) {
      return 'header'; // Header of drawer
    }
    // Main NotificationDrawer component
    if (name.includes('notificationdrawer')) {
      return 'notification-history'; // History of notifications
    }
  }
  
  // Alert - communicates information/feedback to users
  // Hint - proactive guidance (variant of alert)
  if (name.includes('alert') || name.includes('hint')) {
    // Hint is for proactive guidance, Alert is for reactive feedback
    if (name.includes('hint')) {
      return 'guidance';
    }
    return 'notification';
  }
  
  // Icon components - can be interactive (action) or decorative (display)
  // Icons are typically named like StarIcon, CheckIcon, etc. and imported from @patternfly/react-icons
  if (name.endsWith('icon') && name !== 'menutoggle') {
    // If icon has onClick, it's interactive (action)
    if (propsMap.has('onClick')) {
      return 'action';
    }
    // Otherwise, it's decorative (display)
    return 'display';
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
  // Hint is a variant of Alert (proactive guidance)
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
  
  // Hint is treated as a variant of Alert
  if (name.includes('hint')) {
    return 'hint';
  }
  
  // InputGroup variants - with-button-left, with-button-right, with-buttons-both, with-icon-before, with-icon-after, with-text-prefix, with-text-suffix, search
  // Variant detection will be enhanced by children analysis in transform.js
  if (name.includes('inputgroup')) {
    // Check for explicit variant prop
    if (propsMap.has('variant')) {
      const variantValue = propsMap.get('variant');
      if (typeof variantValue === 'string') {
        const val = variantValue.toLowerCase();
        if (['with-button-left', 'with-button-right', 'with-buttons-both', 'with-icon-before', 'with-icon-after', 'with-text-prefix', 'with-text-suffix', 'search'].includes(val)) {
          return val;
        }
      }
    }
    // Default variant - will be determined by children analysis in transform.js
    return null;
  }
  
  // Label variants - color (status or non-status), filled/outlined, with-icon
  // Efficiently combine overlapping options
  if (name.includes('label') && !name.includes('labelgroup') && !name.includes('descriptionlistterm')) {
    const variants = [];
    
    // Check for color (status or non-status)
    if (propsMap.has('color')) {
      const colorValue = propsMap.get('color');
      if (typeof colorValue === 'string') {
        const color = colorValue.toLowerCase();
        // Status colors
        if (['danger', 'warning', 'success', 'info', 'custom'].includes(color)) {
          variants.push(color);
        } else {
          // Non-status colors
          variants.push(color);
        }
      }
    }
    
    // Check for filled variant (outlined is default, so only add if filled)
    if (propsMap.has('isFilled') || propsMap.has('filled')) {
      const filledValue = propsMap.has('isFilled') ? propsMap.get('isFilled') : propsMap.get('filled');
      if (filledValue !== false) {
        variants.push('filled');
      }
    } else {
      // Status labels are typically filled by default
      if (propsMap.has('color')) {
        const colorValue = propsMap.get('color');
        if (typeof colorValue === 'string') {
          const color = colorValue.toLowerCase();
          if (['danger', 'warning', 'success', 'info', 'custom'].includes(color)) {
            variants.push('filled');
          }
        }
      }
    }
    
    // Check for icon (non-status labels can have icons)
    if (propsMap.has('icon') || propsMap.has('iconComponent')) {
      variants.push('with-icon');
    }
    
    return variants.length > 0 ? variants.join('-') : null;
  }
  
  // LabelGroup variants - horizontal (default), vertical, editable
  if (name.includes('labelgroup')) {
    const variants = [];
    
    // Check for orientation
    if (propsMap.has('orientation')) {
      const orientationValue = propsMap.get('orientation');
      if (typeof orientationValue === 'string' && orientationValue.toLowerCase() === 'vertical') {
        variants.push('vertical');
      }
    }
    
    // Check for editable
    if (propsMap.has('isEditable') || propsMap.has('editable') || propsMap.has('addLabelControl')) {
      variants.push('editable');
    }
    
    return variants.length > 0 ? variants.join('-') : null;
  }
  
  // List variants - ordered, unordered (default), with-icons, horizontal
  // Variant detection will be enhanced by children analysis in transform.js for icon detection
  if (name.includes('list') && !name.includes('listitem') && !name.includes('datalist') && 
      !name.includes('actionlist') && !name.includes('duallistselector')) {
    const variants = [];
    
    // Check for ordered list (numbered)
    if (propsMap.has('isOrdered') || propsMap.has('ordered') || propsMap.has('type') && propsMap.get('type') === 'ol') {
      variants.push('ordered');
    } else {
      // Default to unordered
      variants.push('unordered');
    }
    
    // Check for horizontal orientation
    if (propsMap.has('isHorizontal') || propsMap.has('horizontal') || 
        propsMap.has('orientation') && propsMap.get('orientation') === 'horizontal') {
      variants.push('horizontal');
    }
    
    // Icon detection will be done via children analysis in transform.js
    // For now, check if there's an explicit variant prop
    if (propsMap.has('variant')) {
      const variantValue = propsMap.get('variant');
      if (typeof variantValue === 'string') {
        const val = variantValue.toLowerCase();
        if (val.includes('icon')) {
          variants.push('with-icons');
        }
      }
    }
    
    return variants.length > 0 ? variants.join('-') : null;
  }
  
  // LoginForm variants - basic (default), show-hide-password, customized-header-utilities
  // Variant detection will be enhanced by children analysis in transform.js
  if (name.includes('loginform')) {
    // Check for explicit variant prop
    if (propsMap.has('variant')) {
      const variantValue = propsMap.get('variant');
      if (typeof variantValue === 'string') {
        const val = variantValue.toLowerCase();
        if (['basic', 'show-hide-password', 'customized-header-utilities'].includes(val)) {
          return val;
        }
      }
    }
    // Default variant - will be determined by children analysis in transform.js
    return null;
  }
  
  // Masthead variants - basic (default), with-vertical-nav (has show/hide menu toggle)
  if (name.includes('masthead') && !name.includes('mastheadbrand')) {
    // Check for displaySwitch prop (show/hide menu toggle)
    if (propsMap.has('displaySwitch') || propsMap.has('hasDisplaySwitch')) {
      return 'with-vertical-nav';
    }
    // Default to basic
    return 'basic';
  }
  
  // Modal variants - size and type variants
  if (name.includes('modal') && !name.includes('modalcontent') && !name.includes('modalheader') &&
      !name.includes('modalclosebutton') && !name.includes('modaltogglebutton') &&
      !name.includes('modalfooter') && !name.includes('modalbody')) {
    const variants = [];
    
    // Size variants
    if (propsMap.has('width')) {
      const widthValue = propsMap.get('width');
      if (typeof widthValue === 'string') {
        const width = widthValue.toLowerCase();
        if (['small', 'sm', 'medium', 'md', 'large', 'lg', 'full-width', 'full'].includes(width)) {
          if (width === 'sm' || width === 'small') {
            variants.push('small');
          } else if (width === 'md' || width === 'medium') {
            variants.push('medium');
          } else if (width === 'lg' || width === 'large') {
            variants.push('large');
          } else if (width === 'full' || width === 'full-width') {
            variants.push('full-width');
          }
        }
      }
    }
    
    // Check for variant prop (type variants)
    if (propsMap.has('variant')) {
      const variantValue = propsMap.get('variant');
      if (typeof variantValue === 'string') {
        const val = variantValue.toLowerCase();
        if (['basic', 'with-form', 'with-wizard', 'confirmation', 'information'].includes(val)) {
          variants.push(val);
        }
      }
    }
    
    // Try to infer type from children or props
    // Check for form-related props or children (would need children analysis)
    if (propsMap.has('hasForm') || propsMap.has('isFormModal')) {
      if (!variants.includes('with-form')) {
        variants.push('with-form');
      }
    }
    
    // Check for wizard-related props
    if (propsMap.has('hasWizard') || propsMap.has('isWizardModal')) {
      if (!variants.includes('with-wizard')) {
        variants.push('with-wizard');
      }
    }
    
    // Default to basic if no variants detected
    return variants.length > 0 ? variants.join('-') : 'basic';
  }
  
  // Menu component variants - comprehensive variant detection
  if (name.includes('menu') || name.includes('dropdown') || name.includes('select')) {
    const variants = [];
    
    // Application Launcher variants
    if (name.includes('applicationlauncher')) {
      // Check for grid/list layout
      if (propsMap.has('isGrid')) {
        variants.push('grid');
      } else {
        variants.push('list');
      }
      // Check for favorites
      if (propsMap.has('favorites') || propsMap.has('hasFavorites')) {
        variants.push('with-favorites');
      }
      return variants.length > 0 ? variants.join('-') : 'list';
    }
    
    // Context Selector variants
    if (name.includes('contextselector')) {
      // Check for search
      if (propsMap.has('searchInputValue') || propsMap.has('hasSearch')) {
        variants.push('with-search');
      }
      // Check for toggle text
      if (propsMap.has('toggleText') || propsMap.has('hasToggleText')) {
        variants.push('with-toggle-text');
      }
      return variants.length > 0 ? variants.join('-') : 'basic';
    }
    
    // Options Menu variants
    if (name.includes('optionsmenu')) {
      // Check for plain variant (no toggle button styling)
      if (propsMap.has('isPlain') || propsMap.has('plain')) {
        variants.push('plain');
      }
      // Check for kebab toggle (default for options menu)
      if (propsMap.has('toggle') || propsMap.has('toggleId')) {
        // Check if toggle is kebab icon
        const toggleType = propsMap.get('toggleType') || 'kebab';
        if (toggleType === 'kebab' || !propsMap.has('toggleType')) {
          variants.push('with-kebab-toggle');
        }
      } else {
        variants.push('with-kebab-toggle'); // Default for options menu
      }
      return variants.length > 0 ? variants.join('-') : 'with-kebab-toggle';
    }
    
    // Select component variants
    if (name.includes('select') && !name.includes('duallistselector')) {
      // Check for single/multi select
      if (propsMap.has('variant')) {
        const variantValue = propsMap.get('variant');
        if (typeof variantValue === 'string') {
          const val = variantValue.toLowerCase();
          if (['single', 'checkbox', 'typeahead', 'typeaheadmulti'].includes(val)) {
            variants.push(val);
          }
        }
      } else {
        variants.push('single'); // Default
      }
      
      // Check for typeahead
      if (propsMap.has('typeAheadAriaLabel') || propsMap.has('hasTypeahead')) {
        if (!variants.includes('typeahead')) {
          variants.push('typeahead');
        }
      }
      
      // Check for checkbox (multi-select)
      if (propsMap.has('isCheckboxSelection') || propsMap.has('hasCheckbox')) {
        if (!variants.includes('checkbox')) {
          variants.push('checkbox');
        }
      }
      
      return variants.length > 0 ? variants.join('-') : 'single';
    }
    
    // Dropdown variants
    if (name.includes('dropdown') && !name.includes('dropdownitem')) {
      // Check for kebab toggle
      if (propsMap.has('toggle') || propsMap.has('toggleId')) {
        const toggleType = propsMap.get('toggleType') || propsMap.get('toggle');
        if (typeof toggleType === 'string' && toggleType.toLowerCase().includes('kebab')) {
          variants.push('with-kebab-toggle');
        }
      }
      // Check for split button
      if (propsMap.has('isSplitButton') || propsMap.has('splitButton')) {
        variants.push('split-button');
      }
      // Check for plain variant
      if (propsMap.has('isPlain') || propsMap.has('plain')) {
        variants.push('plain');
      }
      return variants.length > 0 ? variants.join('-') : 'basic';
    }
    
    // Menu variants
    if (name.includes('menu') && !name.includes('menuitem') && !name.includes('menulist') && 
        !name.includes('menugroup') && !name.includes('menusearch') && !name.includes('menutoggle') &&
        !name.includes('optionsmenu') && !name.includes('applicationlauncher') && !name.includes('contextselector')) {
      // Check for plain variant
      if (propsMap.has('isPlain') || propsMap.has('plain')) {
        variants.push('plain');
      }
      // Check for scrollable
      if (propsMap.has('isScrollable') || propsMap.has('scrollable')) {
        variants.push('scrollable');
      }
      // Check for with search
      if (propsMap.has('hasSearch') || propsMap.has('searchInputValue')) {
        variants.push('with-search');
      }
      return variants.length > 0 ? variants.join('-') : 'basic';
    }
    
    // Menu Item variants
    if (name.includes('menuitem') || name.includes('dropdownitem') || 
        name.includes('selectoption') || name.includes('applicationlauncheritem') ||
        name.includes('contextselectoritem')) {
      // Check for checkbox variant
      if (propsMap.has('isCheckbox') || propsMap.has('hasCheckbox')) {
        variants.push('checkbox');
      }
      // Check for radio variant
      if (propsMap.has('isRadio') || propsMap.has('hasRadio')) {
        variants.push('radio');
      }
      // Check for icon variant
      if (propsMap.has('icon') || propsMap.has('iconComponent')) {
        variants.push('with-icon');
      }
      // Check for description
      if (propsMap.has('description') || propsMap.has('hasDescription')) {
        variants.push('with-description');
      }
      // Check for action (has onClick)
      if (propsMap.has('onClick')) {
        variants.push('action');
      }
      // Check for navigation (has href or to)
      if (propsMap.has('href') || propsMap.has('to')) {
        variants.push('navigation');
      }
      return variants.length > 0 ? variants.join('-') : 'basic';
    }
    
    // Menu Toggle variants
    if (name.includes('menutoggle') || name.includes('selecttoggle') || name.includes('optionsmenutoggle')) {
      // Check for kebab variant
      if (propsMap.has('variant')) {
        const variantValue = propsMap.get('variant');
        if (typeof variantValue === 'string') {
          const val = variantValue.toLowerCase();
          if (['kebab', 'plain', 'primary', 'secondary'].includes(val)) {
            variants.push(val);
          }
        }
      }
      // Check for icon variant
      if (propsMap.has('icon') || propsMap.has('iconComponent')) {
        variants.push('with-icon');
      }
      return variants.length > 0 ? variants.join('-') : 'basic';
    }
    
    // Menu Group variants
    if (name.includes('menugroup') || name.includes('selectoptiongroup')) {
      // Check for label
      if (propsMap.has('label') || propsMap.has('groupLabel')) {
        variants.push('with-label');
      }
      return variants.length > 0 ? variants.join('-') : 'basic';
    }
  }
  
  // Navigation variants - orientation and type variants
  if (name.includes('nav') && !name.includes('menutoggle')) {
    const variants = [];
    
    // Main Nav component variants
    if (!name.includes('navitem') && !name.includes('navexpandable') && 
        !name.includes('navgroup') && !name.includes('navsection') && !name.includes('navlist')) {
      // Orientation variants
      if (propsMap.has('orientation')) {
        const orientationValue = propsMap.get('orientation');
        if (typeof orientationValue === 'string') {
          const orient = orientationValue.toLowerCase();
          if (orient === 'horizontal') {
            variants.push('horizontal');
          } else {
            variants.push('vertical'); // Default
          }
        }
      } else {
        // Default to vertical if no orientation specified
        variants.push('vertical');
      }
      
      // Type variants - check for variant prop or infer from structure
      if (propsMap.has('variant')) {
        const variantValue = propsMap.get('variant');
        if (typeof variantValue === 'string') {
          const val = variantValue.toLowerCase();
          if (['simple', 'grouped', 'expandable-2-level', 'expandable-3-level', 'flyout', 'drilldown', 'primary', 'secondary'].includes(val)) {
            variants.push(val);
          }
        }
      }
      
      // Check for theme (primary vs secondary for horizontal nav)
      if (propsMap.has('theme')) {
        const themeValue = propsMap.get('theme');
        if (typeof themeValue === 'string') {
          const theme = themeValue.toLowerCase();
          if (theme === 'primary' || theme === 'secondary') {
            variants.push(theme);
          }
        }
      }
      
      return variants.length > 0 ? variants.join('-') : 'vertical-simple';
    }
    
    // NavExpandable variants - check for level (2-level, 3-level)
    if (name.includes('navexpandable')) {
      // Check for flyout variant
      if (propsMap.has('flyout') || propsMap.has('isFlyout')) {
        variants.push('flyout');
      }
      // Check for drilldown variant
      if (propsMap.has('drilldown') || propsMap.has('isDrilldown')) {
        variants.push('drilldown');
      }
      // Check for level (2 or 3)
      if (propsMap.has('level')) {
        const levelValue = propsMap.get('level');
        if (typeof levelValue === 'number' || (typeof levelValue === 'string' && !isNaN(parseInt(levelValue)))) {
          const level = typeof levelValue === 'number' ? levelValue : parseInt(levelValue);
          if (level === 2) {
            variants.push('2-level');
          } else if (level === 3) {
            variants.push('3-level');
          }
        }
      }
      return variants.length > 0 ? variants.join('-') : 'expandable';
    }
    
    // NavItem variants - check for icon
    if (name.includes('navitem')) {
      if (propsMap.has('icon') || propsMap.has('iconComponent')) {
        variants.push('with-icon');
      }
      return variants.length > 0 ? variants.join('-') : 'basic';
    }
    
    // NavGroup variants - check for title
    if (name.includes('navgroup')) {
      if (propsMap.has('title') || propsMap.has('groupTitle')) {
        variants.push('with-title');
      }
      return variants.length > 0 ? variants.join('-') : 'basic';
    }
    
    // NavList variants - check for scrollable
    if (name.includes('navlist')) {
      if (propsMap.has('isScrollable') || propsMap.has('scrollable')) {
        variants.push('scrollable');
      }
      return variants.length > 0 ? variants.join('-') : 'basic';
    }
  }
  
  // JumpLinks variants - vertical (default), horizontal-links, expandable
  if (name.includes('jumplinks') && !name.includes('jumplinksitem')) {
    // Check for explicit variant prop
    if (propsMap.has('variant')) {
      const variantValue = propsMap.get('variant');
      if (typeof variantValue === 'string') {
        const val = variantValue.toLowerCase();
        // Normalize horizontal to horizontal-links
        if (val === 'horizontal') {
          return 'horizontal-links';
        }
        if (['vertical', 'horizontal-links', 'expandable'].includes(val)) {
          return val;
        }
      }
    }
    // Check if expandable (has isExpanded prop or toggle)
    if (propsMap.has('isExpanded') || propsMap.has('expandable') || propsMap.has('toggleAriaLabel')) {
      return 'expandable';
    }
    // Default to vertical
    return 'vertical';
  }
  
  // InlineEdit variants - field-specific (single field), full-page (multiple fields), row-editing (table row)
  if (name.includes('inlineedit') && !name.includes('inlineedittoggle') && 
      !name.includes('inlineeditactiongroup') && !name.includes('inlineeditinput')) {
    // Check if it's in a table row context (row editing)
    // This will be enhanced by parent context detection in transform.js
    // For now, check for explicit variant prop
    if (propsMap.has('variant')) {
      const variantValue = propsMap.get('variant');
      if (typeof variantValue === 'string') {
        const val = variantValue.toLowerCase();
        if (['field-specific', 'full-page', 'row-editing', 'row', 'field', 'page'].includes(val)) {
          // Normalize variant names
          if (val === 'row' || val === 'row-editing') {
            return 'row-editing';
          }
          if (val === 'field' || val === 'field-specific') {
            return 'field-specific';
          }
          if (val === 'page' || val === 'full-page') {
            return 'full-page';
          }
          return val;
        }
      }
    }
    // Default variant - will be determined by context (table row vs page)
    // Context detection in transform.js will help determine this
    return null;
  }
  
  // Icon variants - extract icon name from component name (e.g., "StarIcon" -> "star", "CheckIcon" -> "check")
  // Icons are typically named like StarIcon, CheckIcon, etc. and imported from @patternfly/react-icons
  // Status colors (danger, warning, success, info) go to data-state, not data-variant
  if (name.endsWith('icon') && name !== 'menutoggle') {
    // Remove "icon" suffix and convert to kebab-case
    // Examples: "StarIcon" -> "star", "CheckCircleIcon" -> "check-circle", "ArrowRightIcon" -> "arrow-right"
    let iconName = name.replace(/icon$/, '');
    
    // Convert camelCase/PascalCase to kebab-case
    // Handle common patterns: "Star" -> "star", "CheckCircle" -> "check-circle"
    iconName = iconName
      .replace(/([a-z])([A-Z])/g, '$1-$2') // Insert hyphen before capital letters
      .toLowerCase();
    
    // Return just the icon name as variant (e.g., "star", "check-circle")
    // Status colors are handled in inferState, not here
    return iconName;
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
  
  // NotificationBadge variants - unread, attention, with-count
  if (name.includes('notificationbadge')) {
    const variants = [];
    // Check for unread state (blue background)
    if (propsMap.has('isUnread') || propsMap.has('unread') || propsMap.has('unreadCount')) {
      variants.push('unread');
    }
    // Check for attention state (red background)
    if (propsMap.has('isAttention') || propsMap.has('attention') || propsMap.has('attentionCount')) {
      variants.push('attention');
    }
    // Check for count display
    if (propsMap.has('count') || propsMap.has('notificationCount') || propsMap.has('badgeCount')) {
      variants.push('with-count');
    }
    return variants.length > 0 ? variants.join('-') : 'basic';
  }
  
  // NotificationDrawer variants - basic, grouped
  if (name.includes('notificationdrawer') && !name.includes('notificationdrawerheader') &&
      !name.includes('notificationdrawerbody') && !name.includes('notificationdrawergroup') &&
      !name.includes('notificationdrawergrouptoggle') && !name.includes('notificationdrawerlist') &&
      !name.includes('notificationdrawerlistitem')) {
    // Check for grouped variant (has groups/categories)
    if (propsMap.has('isGrouped') || propsMap.has('grouped') || propsMap.has('hasGroups')) {
      return 'grouped';
    }
    // Default to basic
    return 'basic';
  }
  
  // Drawer variants - overlay (default) or inline
  // Note: NotificationDrawer is handled above, this is for generic Drawer
  if (name.includes('drawer') && !name.includes('notificationdrawer')) {
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
  
  // FileUpload variants - single (default), multiple, field
  if (name.includes('fileupload')) {
    // MultipleFileUpload component indicates multiple variant
    if (name.includes('multiplefileupload')) {
      return 'multiple';
    }
    // FileUploadField component indicates field variant
    if (name.includes('fileuploadfield')) {
      return 'field';
    }
    // Check for multiple prop on FileUpload
    if (propsMap.has('multiple') || propsMap.has('isMultiple')) {
      return 'multiple';
    }
    // Default to single for FileUpload
    return 'single';
  }
  
  // ExpandableSection variants - disclosure (default), truncate, detached
  if (name.includes('expandablesection')) {
    const variants = [];
    
    // Check for truncate variant (for truncated text expansion)
    if (propsMap.has('isTruncate') || propsMap.has('truncate') || propsMap.has('isTruncated')) {
      variants.push('truncate');
    }
    
    // Check for detached variant (toggle and content are separated)
    if (propsMap.has('isDetached') || propsMap.has('detached')) {
      variants.push('detached');
    }
    
    // Default to disclosure if no variant specified
    return variants.length > 0 ? variants.join('-') : 'disclosure';
  }
  
  // EmptyState variants - size variants (xs, sm, lg, xl, full) and use case variants
  if (name.includes('emptystate')) {
    const variants = [];
    
    // Size variants
    if (propsMap.has('size') || propsMap.has('variant')) {
      const sizeValue = propsMap.get('size') || propsMap.get('variant');
      if (typeof sizeValue === 'string') {
        const size = sizeValue.toLowerCase();
        if (['xs', 'sm', 'lg', 'xl', 'full', 'extra-small', 'small', 'large', 'extra-large'].includes(size)) {
          // Normalize size values
          if (size === 'xs' || size === 'extra-small') {
            variants.push('extra-small');
          } else if (size === 'sm' || size === 'small') {
            variants.push('small');
          } else if (size === 'lg' || size === 'large') {
            variants.push('large');
          } else if (size === 'xl' || size === 'extra-large') {
            variants.push('extra-large');
          } else if (size === 'full') {
            variants.push('full');
          }
        }
      }
    }
    
    // Use case variants - can be inferred from props or context
    // These are semantic variants that describe the use case
    if (propsMap.has('heading') || propsMap.has('title')) {
      const heading = propsMap.get('heading') || propsMap.get('title');
      if (typeof heading === 'string') {
        const headingLower = heading.toLowerCase();
        // Infer use case from heading text (basic pattern matching)
        if (headingLower.includes('welcome') || headingLower.includes('get started')) {
          variants.push('getting-started');
        } else if (headingLower.includes('no results') || headingLower.includes('no data')) {
          variants.push('no-results');
        } else if (headingLower.includes('configure') || headingLower.includes('configuration')) {
          variants.push('required-configuration');
        } else if (headingLower.includes('access') || headingLower.includes('permission')) {
          variants.push('no-access');
        } else if (headingLower.includes('error') || headingLower.includes('unable') || headingLower.includes('failure')) {
          variants.push('back-end-failure');
        } else if (headingLower.includes('success') || headingLower.includes('complete') || headingLower.includes('all set')) {
          variants.push('success');
        } else if (headingLower.includes('create') || headingLower.includes('add') || headingLower.includes('no ') && headingLower.includes('yet')) {
          variants.push('creation');
        }
      }
    }
    
    // Check for card context (if used inside a card)
    if (propsMap.has('isCard') || propsMap.has('card')) {
      variants.push('card');
    }
    
    return variants.length > 0 ? variants.join('-') : null;
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
  
  // OverflowMenu variants - with-kebab-toggle (default), responsive
  if (name.includes('overflowmenu') && !name.includes('overflowmenuitem') && 
      !name.includes('overflowmenucontent')) {
    const variants = [];
    // OverflowMenu always has a kebab toggle
    variants.push('with-kebab-toggle');
    // Check for responsive variant (different behavior on mobile)
    if (propsMap.has('isResponsive') || propsMap.has('responsive') || propsMap.has('breakpoint')) {
      variants.push('responsive');
    }
    return variants.length > 0 ? variants.join('-') : 'with-kebab-toggle';
  }
  
  // OverflowMenuItem variants - check for icon, description
  if (name.includes('overflowmenuitem')) {
    const variants = [];
    // Check for icon
    if (propsMap.has('icon') || propsMap.has('iconComponent')) {
      variants.push('with-icon');
    }
    // Check for description
    if (propsMap.has('description') || propsMap.has('hasDescription')) {
      variants.push('with-description');
    }
    return variants.length > 0 ? variants.join('-') : 'basic';
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
 * parentPurpose is used to inherit Form's purpose (e.g., "create-form", "edit-form")
 */
function inferContext(componentName, props, parentContext = null, parentPurpose = null) {
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
  // If parent is Form and has a purpose, use the purpose directly (e.g., "create", "edit", "search")
  if (parentContext === 'form' && parentPurpose) {
    // If parentPurpose is "form-container", just use "form"
    if (parentPurpose === 'form-container') {
      return 'form';
    }
    // Otherwise, use the purpose directly (e.g., "create", "edit", "search")
    return parentPurpose;
  }
  
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
  
  // LoginForm context - authentication page
  if (name.includes('loginform')) {
    return 'authentication';
  }
  
  // Masthead context - top navigation bar at page level
  if (name.includes('masthead')) {
    return 'page';
  }
  
  // NotificationBadge context - always in masthead
  if (name.includes('notificationbadge')) {
    return 'masthead';
  }
  
  // NotificationDrawer context - overlay (drawer that slides out)
  if (name.includes('notificationdrawer')) {
    return 'overlay';
  }
  
  // Navigation context - can be in drawer/flyout OR page sidebar (between-page navigation)
  // Note: JumpLinks are in-page navigation (scrolling to sections), while Nav is between-page navigation
  // Nav can appear in:
  // 1. Page sidebar (persistent left sidebar) - context: 'page'
  // 2. Drawer/flyout (overlay that slides out) - context: 'overlay' 
  // 3. Masthead (horizontal navigation) - context: 'masthead'
  if (name.includes('nav') && !name.includes('menutoggle')) {
    // Check if it's horizontal navigation (typically in masthead)
    if (propsMap.has('orientation') && propsMap.get('orientation') === 'horizontal') {
      return 'masthead';
    }
    // Vertical navigation can be in a drawer/flyout (overlay) OR page sidebar (page)
    // If parent context is drawer/overlay, use overlay; otherwise it's in a page sidebar
    if (parentContext === 'overlay' || parentContext === 'drawer') {
      return 'overlay';
    }
    // Vertical navigation in page sidebar (persistent left sidebar, not in drawer)
    // This is the default case - Nav in page sidebar like pf-v6-c-page__sidebar
    return 'page';
  }
  
  // JumpLinks context - in-page navigation (scrolling to sections within the same page)
  if (name.includes('jumplink')) {
    return 'page'; // In-page navigation, always at page level
  }
  
  // Menu components context
  if (name.includes('menu') || name.includes('dropdown') || name.includes('select')) {
    // Application Launcher - typically in masthead
    if (name.includes('applicationlauncher')) {
      return 'masthead';
    }
    
    // Context Selector - typically in masthead or page header
    if (name.includes('contextselector')) {
      return 'masthead';
    }
    
    // Options Menu - can be in table rows, cards, toolbars, or page
    if (name.includes('optionsmenu')) {
      // Check parent context (will be handled by parentContext parameter)
      return 'page';
    }
    
    // Select - can be in forms, filters, or page
    if (name.includes('select') && !name.includes('duallistselector')) {
      // Check parent context (will be handled by parentContext parameter)
      if (parentContext === 'form') {
        return 'form';
      }
      return 'page';
    }
    
    // Dropdown - can be in various contexts
    if (name.includes('dropdown')) {
      // Check parent context (will be handled by parentContext parameter)
      return parentContext || 'page';
    }
    
    // Generic Menu - can be in various contexts
    if (name.includes('menu')) {
      // Check parent context (will be handled by parentContext parameter)
      return parentContext || 'page';
    }
  }
  
  // Label context - can be in table, card, filter, or page
  if (name.includes('label') && !name.includes('descriptionlistterm')) {
    // LabelGroup context
    if (name.includes('labelgroup')) {
      // Often used in filters
      if (propsMap.has('addLabelControl') || propsMap.has('isEditable') || propsMap.has('editable')) {
        return 'filter';
      }
      // Default to page context
      return 'page';
    }
    // Individual Label context - infer from common use cases
    // Labels in filters are often dismissible
    if (propsMap.has('onClose') || propsMap.has('isDismissible') || propsMap.has('dismissible')) {
      return 'filter';
    }
    // Default to page context (can be in tables, cards, or general page)
    return 'page';
  }
  
  // InlineEdit context - can be in table rows (row editing) or pages/description lists (field-specific/full-page)
  if (name.includes('inlineedit')) {
    // If parent context is table, it's row editing
    // Otherwise, it's page/description-list context
    // Parent context detection will handle this, but we can also check props
    if (propsMap.has('isTableRow') || propsMap.has('tableRow') || propsMap.has('rowEditing')) {
      return 'table';
    }
    // Default to page context (field-specific or full-page)
    // Parent context detection will refine this
    return 'page';
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
  
  // OverflowMenu context - can be in toolbar, table, card, or page
  // Similar to ActionList, but specifically for overflow scenarios
  if (name.includes('overflowmenu')) {
    // Context is typically inferred from parent (toolbar, table, card)
    // Check parent context first, then default to page
    return parentContext || 'page';
  }
  
  // Layout components are containers
  if (name.includes('flex') || name.includes('grid') || name.includes('stack') || name.includes('card')) {
    return 'container';
  }
  
  // Alert context - where alerts are used (form, modal, page, alert-group, etc.)
  // Hint is treated as a variant of Alert
  // This is typically inferred from parent components, but we can also check props
  if (name.includes('alert') || name.includes('hint')) {
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
  
  // FileUpload states - check before generic isReadOnly check
  // (FileUpload uses isReadOnly to indicate non-editable state, not generic readonly)
  if (name.includes('fileupload')) {
    // Loading state (file is being uploaded) - check first as it's most specific
    if (propsMap.has('isLoading') || propsMap.has('loading') || propsMap.has('isUploading')) {
      return 'loading';
    }
    // Error state (upload failed) - check before editable/non-editable
    if (propsMap.has('isError') || propsMap.has('error') || propsMap.has('hasError')) {
      return 'error';
    }
    // Non-editable state (file uploaded but cannot be edited) - check before editable
    if (propsMap.has('isReadOnly') || propsMap.has('readOnly') || propsMap.has('readonly')) {
      return 'non-editable';
    }
    // Editable state (file uploaded and can be edited)
    if (propsMap.has('isEditable') || propsMap.has('editable')) {
      return 'editable';
    }
    // Default state (no file uploaded yet) - no state
    return null;
  }
  
  // Modal states - open/closed (check before generic state checks)
  if (name.includes('modal') && !name.includes('modalcontent') && !name.includes('modalheader') &&
      !name.includes('modalclosebutton') && !name.includes('modaltogglebutton') &&
      !name.includes('modalfooter') && !name.includes('modalbody')) {
    // Modal open/closed state
    if (propsMap.has('isOpen') || propsMap.has('open')) {
      const openValue = propsMap.has('isOpen') ? propsMap.get('isOpen') : propsMap.get('open');
      if (openValue === false) {
        return 'closed';
      }
      return 'open';
    }
    // If no open prop, check if it's explicitly closed
    if (propsMap.has('isClosed') || propsMap.has('closed')) {
      return 'closed';
    }
  }
  
  // Notification component states - check before generic state checks
  if (name.includes('notification')) {
    // NotificationBadge states - unread, attention
    if (name.includes('notificationbadge')) {
      // Check for unread state (blue background)
      if (propsMap.has('isUnread') || propsMap.has('unread') || propsMap.has('unreadCount')) {
        return 'unread';
      }
      // Check for attention state (red background)
      if (propsMap.has('isAttention') || propsMap.has('attention') || propsMap.has('attentionCount')) {
        return 'attention';
      }
    }
    
    // NotificationDrawer states - open/closed
    if (name.includes('notificationdrawer') && !name.includes('notificationdrawerheader') &&
        !name.includes('notificationdrawerbody') && !name.includes('notificationdrawergroup') &&
        !name.includes('notificationdrawergrouptoggle') && !name.includes('notificationdrawerlist') &&
        !name.includes('notificationdrawerlistitem')) {
      // Drawer open/closed state
      if (propsMap.has('isOpen') || propsMap.has('open') || propsMap.has('isExpanded') || propsMap.has('expanded')) {
        const openValue = propsMap.has('isOpen') ? propsMap.get('isOpen') : 
                         propsMap.has('open') ? propsMap.get('open') :
                         propsMap.has('isExpanded') ? propsMap.get('isExpanded') : propsMap.get('expanded');
        if (openValue === false) {
          return 'closed';
        }
        return 'open';
      }
      // If no open prop, check if it's explicitly closed
      if (propsMap.has('isClosed') || propsMap.has('closed')) {
        return 'closed';
      }
    }
    
    // NotificationDrawerGroup states - expanded/collapsed
    if (name.includes('notificationdrawergroup')) {
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
    
    // NotificationDrawerListItem states - read/unread
    if (name.includes('notificationdrawerlistitem')) {
      // Check for read state
      if (propsMap.has('isRead') || propsMap.has('read')) {
        const readValue = propsMap.has('isRead') ? propsMap.get('isRead') : propsMap.get('read');
        if (readValue === false) {
          return 'unread';
        }
        return 'read';
      }
      // Check for unread state
      if (propsMap.has('isUnread') || propsMap.has('unread')) {
        return 'unread';
      }
      // Default to unread if no explicit state
      return 'unread';
    }
  }
  
  // OverflowMenu states - open/closed (check before generic state checks)
  if (name.includes('overflowmenu') && !name.includes('overflowmenuitem') && 
      !name.includes('overflowmenucontent')) {
    // OverflowMenu open/closed state
    if (propsMap.has('isOpen') || propsMap.has('open') || propsMap.has('isExpanded') || propsMap.has('expanded')) {
      const openValue = propsMap.has('isOpen') ? propsMap.get('isOpen') : 
                       propsMap.has('open') ? propsMap.get('open') :
                       propsMap.has('isExpanded') ? propsMap.get('isExpanded') : propsMap.get('expanded');
      if (openValue === false) {
        return 'closed';
      }
      return 'open';
    }
    // If no open prop, check if it's explicitly closed
    if (propsMap.has('isClosed') || propsMap.has('closed')) {
      return 'closed';
    }
  }
  
  // Navigation component states - check before generic state checks
  if (name.includes('nav') && !name.includes('menutoggle')) {
    // NavItem states - active (current page)
    if (name.includes('navitem')) {
      if (propsMap.has('isActive') || propsMap.has('active') || propsMap.has('aria-current')) {
        return 'active';
      }
      // Check for disabled
      if (propsMap.has('isDisabled') || propsMap.has('disabled') || propsMap.has('isAriaDisabled')) {
        return 'disabled';
      }
    }
    
    // NavExpandable states - expanded/collapsed
    if (name.includes('navexpandable')) {
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
  }
  
  // Menu component states - check before generic state checks
  if (name.includes('menu') || name.includes('dropdown') || name.includes('select')) {
    // Menu/Dropdown/Select open/closed state (check first as it's most specific)
    if (name.includes('menutoggle') || name.includes('selecttoggle') || name.includes('optionsmenutoggle') ||
        name.includes('dropdown') || name.includes('select') || name.includes('optionsmenu') ||
        name.includes('applicationlauncher') || name.includes('contextselector')) {
      if (propsMap.has('isOpen') || propsMap.has('open') || propsMap.has('isExpanded') || propsMap.has('expanded')) {
        const openValue = propsMap.has('isOpen') ? propsMap.get('isOpen') : 
                         propsMap.has('open') ? propsMap.get('open') :
                         propsMap.has('isExpanded') ? propsMap.get('isExpanded') : propsMap.get('expanded');
        if (openValue === false) {
          return 'closed';
        }
        return 'open';
      }
      // If no open prop, check if it's explicitly closed
      if (propsMap.has('isClosed') || propsMap.has('closed')) {
        return 'closed';
      }
    }
    
    // Menu Item states - selected, checked, disabled
    if (name.includes('menuitem') || name.includes('dropdownitem') || 
        name.includes('selectoption') || name.includes('applicationlauncheritem') ||
        name.includes('contextselectoritem')) {
      // Check for selected state (for single-select menus)
      if (propsMap.has('isSelected') || propsMap.has('selected')) {
        return 'selected';
      }
      // Check for checked state (for checkbox/radio menu items)
      if (propsMap.has('isChecked') || propsMap.has('checked')) {
        return 'checked';
      }
      // Check for disabled state
      if (propsMap.has('isDisabled') || propsMap.has('disabled') || propsMap.has('isAriaDisabled')) {
        return 'disabled';
      }
      // Check for favorite state (Application Launcher items)
      if (propsMap.has('isFavorite') || propsMap.has('favorite')) {
        return 'favorite';
      }
    }
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
  
  // Label states - clickable, editable, dismissible, overflow
  if (name.includes('label') && !name.includes('labelgroup') && !name.includes('descriptionlistterm')) {
    // Check for overflow label (isOverflowLabel prop)
    if (propsMap.has('isOverflowLabel') || propsMap.has('overflowLabel')) {
      return 'overflow';
    }
    // Check for editable (isEditable prop or editableProps)
    if (propsMap.has('isEditable') || propsMap.has('editable') || propsMap.has('editableProps')) {
      return 'editable';
    }
    // Check for dismissible (onClose prop or close button)
    if (propsMap.has('onClose') || propsMap.has('isDismissible') || propsMap.has('dismissible') || 
        propsMap.has('closeBtnAriaLabel')) {
      return 'dismissible';
    }
    // Check for clickable (onClick prop or href)
    if (propsMap.has('onClick') || propsMap.has('href')) {
      return 'clickable';
    }
    return null;
  }
  
  // JumpLinks states - expanded/collapsed (for expandable), active (for items)
  if (name.includes('jumplink')) {
    if (name.includes('jumplinksitem')) {
      // JumpLinksItem states - active (selected/current location)
      if (propsMap.has('isActive') || propsMap.has('active') || propsMap.has('aria-current')) {
        return 'active';
      }
      return null;
    }
    // JumpLinks container states - expanded/collapsed (for expandable variant)
    if (propsMap.has('isExpanded') || propsMap.has('expandable')) {
      const expandedValue = propsMap.has('isExpanded') 
        ? propsMap.get('isExpanded') 
        : propsMap.get('expandable');
      if (expandedValue === false) {
        return 'collapsed';
      }
      return 'expanded';
    }
    return null;
  }
  
  // InlineEdit states - read-only (default) or edit (editing mode)
  if (name.includes('inlineedit')) {
    // Check if in edit mode
    if (propsMap.has('isEditable') || propsMap.has('editable') || propsMap.has('isEditing') || 
        propsMap.has('editing') || propsMap.has('isActive') || propsMap.has('active')) {
      const editableValue = propsMap.has('isEditable') ? propsMap.get('isEditable') :
                           propsMap.has('editable') ? propsMap.get('editable') :
                           propsMap.has('isEditing') ? propsMap.get('isEditing') :
                           propsMap.has('editing') ? propsMap.get('editing') :
                           propsMap.has('isActive') ? propsMap.get('isActive') :
                           propsMap.get('active');
      
      if (editableValue === false) {
        return 'read-only';
      }
      
      return 'edit';
    }
    
    // Default to read-only mode
    return 'read-only';
  }
  
  // Icon states - status colors (danger, warning, success, info)
  // Icons are typically named like StarIcon, CheckIcon, etc. and imported from @patternfly/react-icons
  if (name.endsWith('icon') && name !== 'menutoggle') {
    // Check for status color via color prop (could be CSS variable or direct value)
    if (propsMap.has('color')) {
      const colorValue = propsMap.get('color');
      if (typeof colorValue === 'string') {
        const color = colorValue.toLowerCase();
        // PatternFly status colors: danger, warning, success, info
        if (color.includes('danger') || color.includes('error')) {
          return 'danger';
        }
        if (color.includes('warning')) {
          return 'warning';
        }
        if (color.includes('success')) {
          return 'success';
        }
        if (color.includes('info')) {
          return 'info';
        }
      }
    }
    // Icons without status colors don't have a state (they're just visible)
    return null;
  }
  
  // Alert states - expandable alerts can be expanded/collapsed, transient alerts, dismissible alerts
  // Hint is treated as a variant of Alert
  if ((name.includes('alert') && name !== 'alertgroup') || name.includes('hint')) {
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
  
  // ExpandableSection states - can be expanded/collapsed
  if (name.includes('expandablesection')) {
    if (propsMap.has('isExpanded') || propsMap.has('expanded')) {
      const expandedValue = propsMap.has('isExpanded') 
        ? propsMap.get('isExpanded') 
        : propsMap.get('expanded');
      if (expandedValue === false) {
        return 'collapsed';
      }
      return 'expanded';
    }
    // Default to collapsed if no explicit state
    return 'collapsed';
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
  
  // Menu items with destructive actions (delete, remove, etc.)
  if (name.includes('menuitem') || name.includes('dropdownitem') || 
      name.includes('selectoption') || name.includes('applicationlauncheritem') ||
      name.includes('contextselectoritem')) {
    // Check for danger variant
    if (propsMap.has('variant') && propsMap.get('variant') === 'danger') {
      return 'destructive';
    }
    // Check for danger styling
    if (propsMap.has('isDanger') || propsMap.has('danger')) {
      return 'destructive';
    }
    // Check for destructive text in children (would need children analysis, but we can check className or id)
    // For now, rely on variant and danger props
  }
  
  // Check for navigation (links with href)
  if (propsMap.has('href')) {
    return 'navigation';
  }
  
  // Menu items with href are navigation
  if (name.includes('menuitem') || name.includes('dropdownitem') || 
      name.includes('applicationlauncheritem') || name.includes('contextselectoritem')) {
    if (propsMap.has('href') || propsMap.has('to')) {
      return 'navigation';
    }
  }
  
  // Alert action types - alerts with actionLinks are actionable (not navigation)
  // Hint is treated as a variant of Alert
  // Note: dismissible is handled as a state, not an action-type
  if ((name.includes('alert') && name !== 'alertgroup') || name.includes('hint')) {
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

  // Label size - compact (smaller) or default
  // Must be checked BEFORE generic size check
  if (name.includes('label') && !name.includes('labelgroup') && !name.includes('descriptionlistterm')) {
    if (propsMap.has('isCompact') || propsMap.has('compact')) {
      return 'compact';
    }
    // Default size
    return 'default';
  }
  
  // Icon size - sm (0.75rem, 12px), md (0.875rem, 14px), lg (1rem, 16px), xl (1.375rem, 22px), 2xl (3.5rem, 56px), 3xl (6rem, 96px)
  // Icons are typically named like StarIcon, CheckIcon, etc. and imported from @patternfly/react-icons
  // Must be checked BEFORE generic size check to normalize values
  if (name.endsWith('icon') && name !== 'menutoggle') {
    if (propsMap.has('size')) {
      const sizeValue = propsMap.get('size');
      if (typeof sizeValue === 'string') {
        const size = sizeValue.toLowerCase();
        // PatternFly icon sizes: sm, md, lg, xl, 2xl, 3xl
        // Normalize to standard values
        const sizeMap = {
          'sm': 'sm',
          'md': 'md',
          'lg': 'lg',
          'xl': 'xl',
          '2xl': '2xl',
          '3xl': '3xl',
          'small': 'sm',
          'medium': 'md',
          'large': 'lg',
          'extralarge': 'xl',
          'extra-large': 'xl',
        };
        return sizeMap[size] || size;
      }
    }
    // Default to md (medium) if no size specified (PatternFly default - most versatile)
    return 'md';
  }
  
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
  // Hint is treated as a variant of Alert
  // These indicate placement/size rather than visual style
  if ((name.includes('alert') && name !== 'alertgroup') || name.includes('hint')) {
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
        if (prop.value.type === 'StringLiteral' || prop.value.type === 'Literal') {
          value = prop.value.value;
        } else if (prop.value.type === 'JSXExpressionContainer') {
          // For expressions like {true}, {false}, {variable}
          if (prop.value.expression) {
            if (prop.value.expression.type === 'BooleanLiteral') {
              value = prop.value.expression.value;
            } else if (prop.value.expression.type === 'StringLiteral' || prop.value.expression.type === 'Literal') {
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

