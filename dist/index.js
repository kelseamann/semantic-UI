'use strict';

var jsxRuntime = require('react/jsx-runtime');
var reactCore = require('@patternfly/react-core');
var React = require('react');
var reactTable = require('@patternfly/react-table');

/**
 * Inference utilities for automatically determining semantic properties
 * from PatternFly component props
 */
/**
 * Infer button action from PatternFly variant and props
 */
const inferButtonAction = (variant, href, onClick, target) => {
    switch (variant) {
        case 'primary':
            return 'primary';
        case 'danger':
            return 'destructive';
        case 'link':
            // Check what the link actually does
            if (href?.startsWith('http'))
                return 'external';
            if (target === '_blank')
                return 'external';
            if (onClick && !href)
                return 'action';
            if (href?.startsWith('/'))
                return 'navigation';
            return 'navigation';
        case 'control':
            return 'toggle';
        case 'secondary':
        case 'tertiary':
        case 'plain':
        default:
            return 'secondary';
    }
};
/**
 * Infer input purpose from type
 */
const inferInputPurpose = (type) => {
    switch (type) {
        case 'email':
            return 'email-input';
        case 'password':
            return 'password-input';
        case 'search':
            return 'search-input';
        case 'tel':
            return 'phone-input';
        case 'url':
            return 'url-input';
        case 'number':
            return 'numeric-input';
        case 'date':
        case 'datetime-local':
        case 'time':
            return 'date-time-input';
        case 'text':
        default:
            return 'text-input';
    }
};
/**
 * Infer alert severity
 */
const inferAlertSeverity = (variant) => {
    switch (variant) {
        case 'success':
            return 'success';
        case 'danger':
            return 'error';
        case 'warning':
            return 'warning';
        case 'info':
        case 'default':
        default:
            return 'info';
    }
};
/**
 * Infer context from parent or usage
 */
const inferContext = (props) => {
    if (props.onClick || props.onSubmit)
        return 'active';
    if (props.isDisabled)
        return 'disabled';
    if (props.isReadOnly)
        return 'readonly';
    return 'default';
};
/**
 * Infer card purpose from props
 */
const inferCardPurpose = (props) => {
    if (props.isSelectable || props.isClickable)
        return 'action-panel';
    if (props.isCompact)
        return 'data-summary';
    return 'content-display';
};
/**
 * Infer modal purpose from props
 */
const inferModalPurpose = (props) => {
    if (props.variant === 'small')
        return 'confirmation';
    if (props.variant === 'large')
        return 'form';
    return 'information';
};
/**
 * Infer accessibility features from props
 */
const inferAccessibilityFeatures = (props) => {
    const features = ['keyboard-navigable'];
    if (props['aria-label'] || props['aria-labelledby']) {
        features.push('screen-reader-friendly');
    }
    if (props.autoFocus) {
        features.push('auto-focus');
    }
    if (props.role) {
        features.push('semantic-role');
    }
    return features;
};
/**
 * Infer usage patterns from component type and props
 */
const inferUsagePatterns = (componentType, props) => {
    const patterns = ['user-interface'];
    // Component-specific patterns
    switch (componentType.toLowerCase()) {
        case 'button':
            if (props.type === 'submit')
                patterns.push('form-submission');
            if (props.onClick)
                patterns.push('user-interaction');
            break;
        case 'textinput':
        case 'textarea':
            patterns.push('data-entry', 'form-input');
            if (props.validated === 'error')
                patterns.push('validation');
            break;
        case 'select':
            patterns.push('data-entry', 'selection');
            break;
        case 'checkbox':
        case 'radio':
            patterns.push('user-selection', 'form-input');
            break;
        case 'modal':
            patterns.push('user-interaction', 'workflow-step');
            break;
        case 'card':
            patterns.push('content-organization', 'data-presentation');
            break;
    }
    return patterns;
};
/**
 * Generate comprehensive metadata from props
 */
const generateMetadataFromProps = (componentName, props) => {
    return {
        description: `${componentName} component`,
        category: inferCategory(componentName),
        accessibility: inferAccessibilityFeatures(props),
        usage: inferUsagePatterns(componentName, props)
    };
};
/**
 * Infer card content type
 */
const inferCardContentType = () => {
    return 'mixed'; // Default to mixed, can be enhanced with children analysis
};
/**
 * Infer modal interaction type
 */
const inferModalInteractionType = (isOpen) => {
    return isOpen ? 'blocking' : 'non-blocking';
};
/**
 * Infer select purpose
 */
const inferSelectPurpose = () => {
    return 'data-entry';
};
/**
 * Infer select selection type
 */
const inferSelectSelectionType = (variant) => {
    return variant === 'typeahead' ? 'typeahead' : 'single';
};
/**
 * Infer radio purpose
 */
const inferRadioPurpose = () => {
    return 'option-selection';
};
/**
 * Infer radio group context
 */
const inferRadioGroupContext = (name) => {
    return name || 'unknown-group';
};
/**
 * Infer switch purpose
 */
const inferSwitchPurpose = () => {
    return 'setting';
};
/**
 * Infer switch toggle target
 */
const inferSwitchToggleTarget = () => {
    return 'feature';
};
/**
 * Infer textarea purpose
 */
const inferTextAreaPurpose = () => {
    return 'content';
};
/**
 * Infer textarea content type
 */
const inferTextAreaContentType = () => {
    return 'plain-text';
};
/**
 * Infer checkbox purpose
 */
const inferCheckboxPurpose = (isChecked) => {
    return isChecked !== undefined ? 'selection' : 'form-input';
};
/**
 * Infer link purpose
 */
const inferLinkPurpose = (href, children) => {
    if (href?.startsWith('http'))
        return 'external';
    if (href === '#')
        return 'action';
    if (href?.includes('download'))
        return 'download';
    if (children?.toString().toLowerCase().includes('launch'))
        return 'launch';
    return 'navigation';
};
/**
 * Infer star icon purpose
 */
const inferStarIconPurpose = (isFavorited) => {
    return isFavorited !== undefined ? 'favorite-toggle' : 'rating';
};
/**
 * Infer validation context
 */
const inferValidationContext = (isRequired) => {
    return isRequired ? 'required' : 'optional';
};
/**
 * Infer form context (default for most form components)
 */
const inferFormContext = () => {
    return 'form';
};
/**
 * Infer settings context (default for switches)
 */
const inferSettingsContext = () => {
    return 'settings';
};
/**
 * Infer status badge type from content
 */
const inferStatusBadgeType = (content) => {
    const lower = content?.toLowerCase() || '';
    if (lower.includes('ready'))
        return 'ready';
    if (lower.includes('success'))
        return 'success';
    if (lower.includes('warning'))
        return 'warning';
    if (lower.includes('error') || lower.includes('fail'))
        return 'error';
    if (lower.includes('pending'))
        return 'pending';
    return 'info';
};
/**
 * Infer status badge purpose
 */
const inferStatusBadgePurpose = () => {
    return 'status-indicator';
};
/**
 * Infer category from component name and action
 */
const inferCategory = (componentName, action) => {
    const name = componentName.toLowerCase();
    // If action is provided, let it override the default category
    if (action === 'navigation' || action === 'external') {
        return 'navigation';
    }
    if (action === 'destructive' || action === 'primary' || action === 'secondary') {
        return 'forms';
    }
    // Default categorization by component type
    if (['button', 'textinput', 'textarea', 'select', 'radio', 'checkbox', 'switch'].includes(name)) {
        return 'forms';
    }
    if (['nav', 'breadcrumb', 'tabs', 'pagination', 'masthead'].includes(name)) {
        return 'navigation';
    }
    if (['card', 'table', 'datalist', 'label', 'badge'].includes(name)) {
        return 'data-display';
    }
    if (['alert', 'banner', 'toast', 'progress', 'spinner'].includes(name)) {
        return 'feedback';
    }
    if (['modal', 'drawer', 'popover', 'tooltip'].includes(name)) {
        return 'overlay';
    }
    if (['flex', 'grid', 'stack', 'panel'].includes(name)) {
        return 'layout';
    }
    return 'data-display';
};

const SemanticContext = React.createContext(undefined);
const useSemanticContext = () => {
    const context = React.useContext(SemanticContext);
    if (!context) {
        throw new Error('useSemanticContext must be used within a SemanticProvider');
    }
    return context;
};
const SemanticProvider = ({ children }) => {
    const [contextStack, setContextStack] = React.useState([]);
    const addContext = (context) => {
        setContextStack(prev => [...prev, context]);
    };
    const removeContext = () => {
        setContextStack(prev => prev.slice(0, -1));
    };
    const clearContext = () => {
        setContextStack([]);
    };
    const getHierarchy = () => ({
        parents: [...contextStack],
        depth: contextStack.length,
        path: contextStack.length > 0 ? contextStack.join(' > ') : ''
    });
    return (jsxRuntime.jsx(SemanticContext.Provider, { value: {
            contextStack,
            addContext,
            removeContext,
            getHierarchy,
            clearContext,
        }, children: children }));
};

/** Button - PatternFly Button wrapper with semantic metadata for AI tooling */
const Button = ({ semanticRole, aiMetadata, action, context, target, semanticName, children, variant, onClick, isDisabled, ...props }) => {
    // Get hierarchy from context (optional - gracefully handles no provider)
    let hierarchy;
    try {
        const semanticContext = useSemanticContext();
        hierarchy = semanticContext.getHierarchy();
    }
    catch {
        hierarchy = { parents: [], depth: 0, path: '' };
    }
    // Auto-infer semantic properties from PatternFly props
    const inferredAction = action || inferButtonAction(variant, props.href, onClick, target);
    const inferredContext = context || inferContext({ onClick, isDisabled, ...props });
    const componentName = semanticName || 'Button';
    // Generate semantic role and AI metadata with hierarchy
    const role = semanticRole || `button-${inferredAction}-${inferredContext}`;
    const metadata = aiMetadata || {
        description: `${inferredAction} action button for ${inferredContext} context`,
        category: inferCategory('Button', inferredAction),
        usage: [`${inferredContext}-${inferredAction}`, 'user-interaction'],
        hierarchy,
        action: {
            type: inferredAction,
            target: target || 'default',
            consequence: inferredAction === 'destructive' ? 'destructive-permanent' : 'safe',
            affectsParent: target === 'parent-modal' || target === 'parent-form'
        }
    };
    return (jsxRuntime.jsx(reactCore.Button, { ...props, variant: variant, onClick: onClick, isDisabled: isDisabled, "data-semantic-name": componentName, "data-semantic-path": hierarchy.path ? `${hierarchy.path} > ${componentName}` : componentName, "data-semantic-hierarchy": JSON.stringify(hierarchy.parents), "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-action": inferredAction, "data-target": target || 'default', "data-context": inferredContext, children: children }));
};

/** Link - HTML anchor wrapper with semantic metadata for AI tooling */
const Link = ({ semanticName, semanticRole, aiMetadata, purpose, context, target, htmlTarget, children, href, onClick, ...props }) => {
    // Get hierarchy from context (optional - gracefully handles no provider)
    let hierarchy;
    try {
        const semanticContext = useSemanticContext();
        hierarchy = semanticContext.getHierarchy();
    }
    catch {
        hierarchy = { parents: [], depth: 0, path: '' };
    }
    // Auto-infer semantic properties from props
    const inferredPurpose = purpose || inferLinkPurpose(href, children);
    const inferredContext = context || (onClick ? inferContext({ onClick }) : 'content');
    const componentName = semanticName || 'Link';
    // Generate semantic role and AI metadata
    const role = semanticRole || `link-${inferredPurpose}-${inferredContext}`;
    const metadata = aiMetadata || {
        description: `${inferredPurpose} link for ${inferredContext} context`,
        category: inferCategory('Link'),
        usage: [`${inferredContext}-${inferredPurpose}`, 'user-interaction'],
        hierarchy,
        action: {
            type: inferredPurpose,
            target: target || 'default'
        }
    };
    return (jsxRuntime.jsx("a", { ...props, href: href, onClick: onClick, target: htmlTarget, "data-semantic-name": componentName, "data-semantic-path": hierarchy.path ? `${hierarchy.path} > ${componentName}` : componentName, "data-semantic-hierarchy": JSON.stringify(hierarchy.parents), "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-target": target || 'default', "data-context": inferredContext, children: children }));
};

/** StarIcon - HTML span wrapper with semantic metadata for AI tooling */
const StarIcon = ({ semanticName, semanticRole, aiMetadata, purpose, context, children, isFavorited, onClick, ...props }) => {
    // Auto-infer semantic properties from props
    const inferredPurpose = purpose || inferStarIconPurpose(isFavorited);
    const inferredContext = context || (onClick ? inferContext({ onClick }) : 'display');
    // Generate semantic role and AI metadata
    const role = semanticRole || `star-icon-${inferredPurpose}-${inferredContext}`;
    const metadata = aiMetadata || {
        description: `${inferredPurpose} star icon for ${inferredContext} context`,
        category: 'forms',
        complexity: 'simple',
        usage: [`${inferredContext}-${inferredPurpose}`, 'user-interaction']
    };
    // Default semantic name if not provided
    const defaultSemanticName = semanticName || 'Row Item';
    return (jsxRuntime.jsx("span", { ...props, onClick: onClick, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-context": inferredContext, "data-is-favorited": isFavorited, children: children }));
};

/** Checkbox - PatternFly Checkbox wrapper with semantic metadata for AI tooling */
const Checkbox = ({ semanticName, semanticRole, aiMetadata, purpose, context, children, isChecked, onChange, id, ...props }) => {
    // Auto-infer semantic properties from PatternFly props
    const inferredPurpose = purpose || inferCheckboxPurpose(isChecked);
    const inferredContext = context || (onChange ? inferContext({ onChange }) : inferFormContext());
    // Generate semantic role and AI metadata
    const role = semanticRole || `checkbox-${inferredPurpose}-${inferredContext}`;
    const metadata = aiMetadata || {
        description: `${inferredPurpose} checkbox for ${inferredContext} context`,
        category: inferCategory('Checkbox'),
        usage: [`${inferredContext}-${inferredPurpose}`, 'user-interaction']
    };
    // Default semantic name if not provided
    const defaultSemanticName = semanticName || 'Row Item';
    return (jsxRuntime.jsx(reactCore.Checkbox, { ...props, id: id, isChecked: isChecked, onChange: onChange, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-context": inferredContext, children: children }));
};

/**
 * TextInput - PatternFly TextInput wrapper with semantic metadata for AI tooling
 *
 * @example
 * ```tsx
 * <TextInput
 *   type="email"
 *   purpose="email-input"
 *   context="form"
 *   placeholder="Enter your email"
 *   value={email}
 *   onChange={handleChange}
 * />
 * ```
 */
const TextInput = React.forwardRef(({ semanticName, semanticRole, aiMetadata, purpose, context, validationContext, type = 'text', validated, isRequired, ...props }, ref) => {
    // 1. Auto-infer semantic properties from PatternFly props
    const inferredPurpose = purpose || inferInputPurpose(type);
    const inferredContext = context || inferFormContext();
    const inferredValidation = validationContext || inferValidationContext(isRequired);
    // 2. Generate semantic role and AI metadata
    const role = semanticRole || `textinput-${inferredPurpose}-${inferredContext}`;
    const metadata = aiMetadata || {
        ...generateMetadataFromProps('TextInput', { type, validated, isRequired, ...props }),
        description: `${inferredPurpose} for ${inferredContext} context`,
        usage: ['data-entry', 'form-input', 'user-interaction']
    };
    // 3. Default semantic name
    const defaultSemanticName = semanticName || 'TextInput';
    // 4. Render PatternFly component with semantic data attributes
    return (jsxRuntime.jsx(reactCore.TextInput, { ...props, ref: ref, type: type, validated: validated, isRequired: isRequired, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-context": inferredContext, "data-validation-context": inferredValidation }));
});
TextInput.displayName = 'TextInput';

/**
 * TextArea - PatternFly TextArea wrapper with semantic metadata for AI tooling
 *
 * @example
 * ```tsx
 * <TextArea
 *   purpose="comment"
 *   context="comment-section"
 *   placeholder="Add your comment..."
 *   value={comment}
 *   onChange={handleChange}
 *   resizeOrientation="vertical"
 * />
 * ```
 */
const TextArea = React.forwardRef(({ semanticName, semanticRole, aiMetadata, purpose, context, contentType, validated, isRequired, ...props }, ref) => {
    // 1. Auto-infer semantic properties
    const inferredPurpose = purpose || inferTextAreaPurpose();
    const inferredContext = context || inferFormContext();
    const inferredContentType = contentType || inferTextAreaContentType();
    // 2. Generate semantic role and AI metadata
    const role = semanticRole || `textarea-${inferredPurpose}-${inferredContext}`;
    const metadata = aiMetadata || {
        ...generateMetadataFromProps('TextArea', { validated, isRequired, ...props }),
        description: `${inferredPurpose} textarea for ${inferredContext} containing ${inferredContentType}`,
        usage: ['data-entry', 'long-form-input', 'user-interaction']
    };
    // 3. Default semantic name
    const defaultSemanticName = semanticName || 'TextArea';
    // 4. Render PatternFly component with semantic data attributes
    return (jsxRuntime.jsx(reactCore.TextArea, { ...props, ref: ref, validated: validated, isRequired: isRequired, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-context": inferredContext, "data-content-type": inferredContentType }));
});
TextArea.displayName = 'TextArea';

/**
 * Select - PatternFly Select wrapper with semantic metadata for AI tooling
 *
 * @example
 * ```tsx
 * <Select
 *   purpose="category-selection"
 *   context="form"
 *   isOpen={isOpen}
 *   onToggle={handleToggle}
 *   selections={selected}
 *   onSelect={handleSelect}
 * >
 *   <SelectOption value="option1" />
 *   <SelectOption value="option2" />
 * </Select>
 * ```
 */
const Select = ({ semanticName, semanticRole, aiMetadata, purpose, context, selectionType, variant, children, ...props }) => {
    // 1. Auto-infer semantic properties
    const inferredPurpose = purpose || inferSelectPurpose();
    const inferredContext = context || inferFormContext();
    const inferredSelectionType = selectionType || inferSelectSelectionType(variant);
    // 2. Generate semantic role and AI metadata
    const role = semanticRole || `select-${inferredPurpose}-${inferredContext}`;
    const metadata = aiMetadata || {
        ...generateMetadataFromProps('Select', { variant, ...props }),
        description: `${inferredPurpose} select with ${inferredSelectionType} selection for ${inferredContext}`,
        usage: ['data-entry', 'user-selection', 'user-interaction']
    };
    // 3. Default semantic name
    const defaultSemanticName = semanticName || 'Select';
    // 4. Render PatternFly component with semantic data attributes
    return (jsxRuntime.jsx(reactCore.Select, { ...props, variant: variant, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-context": inferredContext, "data-selection-type": inferredSelectionType, children: children }));
};

/**
 * Radio - PatternFly Radio wrapper with semantic metadata for AI tooling
 *
 * @example
 * ```tsx
 * <Radio
 *   purpose="preference"
 *   context="settings"
 *   groupContext="theme-selection"
 *   name="theme"
 *   id="theme-light"
 *   label="Light Theme"
 *   isChecked={theme === 'light'}
 *   onChange={handleChange}
 * />
 * ```
 */
const Radio = ({ semanticName, semanticRole, aiMetadata, purpose, context, groupContext, name, isChecked, isDisabled, children, ...props }) => {
    // 1. Auto-infer semantic properties
    const inferredPurpose = purpose || inferRadioPurpose();
    const inferredContext = context || inferFormContext();
    const inferredGroupContext = groupContext || inferRadioGroupContext(name);
    // 2. Generate semantic role and AI metadata
    const role = semanticRole || `radio-${inferredPurpose}-${inferredContext}`;
    const metadata = aiMetadata || {
        ...generateMetadataFromProps('Radio', { name, isChecked, isDisabled, ...props }),
        description: `${inferredPurpose} radio button in ${inferredGroupContext} group for ${inferredContext}`,
        usage: ['user-selection', 'form-input', 'user-interaction']
    };
    // 3. Default semantic name
    const defaultSemanticName = semanticName || 'Radio';
    // 4. Render PatternFly component with semantic data attributes
    return (jsxRuntime.jsx(reactCore.Radio, { ...props, name: name, isChecked: isChecked, isDisabled: isDisabled, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-context": inferredContext, "data-group-context": inferredGroupContext, children: children }));
};

/**
 * Switch - PatternFly Switch wrapper with semantic metadata for AI tooling
 *
 * @example
 * ```tsx
 * <Switch
 *   purpose="feature-toggle"
 *   context="settings"
 *   toggleTarget="feature"
 *   id="notifications"
 *   label="Enable notifications"
 *   isChecked={notificationsEnabled}
 *   onChange={handleToggle}
 * />
 * ```
 */
const Switch = ({ semanticName, semanticRole, aiMetadata, purpose, context, toggleTarget, isChecked, isDisabled, children, ...props }) => {
    // 1. Auto-infer semantic properties
    const inferredPurpose = purpose || inferSwitchPurpose();
    const inferredContext = context || inferSettingsContext();
    const inferredToggleTarget = toggleTarget || inferSwitchToggleTarget();
    // 2. Generate semantic role and AI metadata
    const role = semanticRole || `switch-${inferredPurpose}-${inferredContext}`;
    const metadata = aiMetadata || {
        ...generateMetadataFromProps('Switch', { isChecked, isDisabled, ...props }),
        description: `${inferredPurpose} switch for toggling ${inferredToggleTarget} in ${inferredContext}`,
        usage: ['user-interaction', 'toggle-control', 'settings-control']
    };
    // 3. Default semantic name
    const defaultSemanticName = semanticName || 'Switch';
    // 4. Render PatternFly component with semantic data attributes
    return (jsxRuntime.jsx(reactCore.Switch, { ...props, isChecked: isChecked, isDisabled: isDisabled, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-context": inferredContext, "data-toggle-target": inferredToggleTarget, children: children }));
};

/** Card - PatternFly Card wrapper with semantic metadata for AI tooling */
const Card = ({ semanticName, semanticRole, aiMetadata, purpose, contentType, children, isSelectable, isClickable, ...props }) => {
    // Auto-infer semantic properties from PatternFly props and children
    const inferredPurpose = purpose || inferCardPurpose({ isSelectable, isClickable });
    const inferredContentType = contentType || inferCardContentType();
    // Generate semantic role and AI metadata
    const role = semanticRole || `card-${inferredPurpose}-${inferredContentType}`;
    const metadata = aiMetadata || {
        description: `${inferredPurpose} card containing ${inferredContentType} content`,
        category: inferCategory('Card'),
        usage: [`${inferredPurpose}-display`, 'content-organization']
    };
    // Default semantic name if not provided
    const defaultSemanticName = semanticName || 'Card';
    return (jsxRuntime.jsx(reactCore.Card, { ...props, isSelectable: isSelectable, isClickable: isClickable, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-content-type": inferredContentType, children: children }));
};

/** StatusBadge - HTML span wrapper with semantic metadata for AI tooling */
const StatusBadge = ({ semanticName, semanticRole, aiMetadata, purpose, statusType, children, ...props }) => {
    // Auto-infer semantic properties from content
    const content = children?.toString();
    const inferredStatusType = statusType || inferStatusBadgeType(content);
    const inferredPurpose = purpose || inferStatusBadgePurpose();
    // Generate semantic role and AI metadata
    const role = semanticRole || `status-badge-${inferredPurpose}-${inferredStatusType}`;
    const metadata = aiMetadata || {
        description: `${inferredPurpose} showing ${inferredStatusType} status`,
        category: 'data-display',
        complexity: 'simple',
        usage: [`${inferredPurpose}`, 'status-display', 'state-indication']
    };
    // Default semantic name if not provided
    const defaultSemanticName = semanticName || 'Row Item';
    return (jsxRuntime.jsx("span", { ...props, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-status-type": inferredStatusType, children: children }));
};

/** Tbody - PatternFly Table Body wrapper with semantic metadata for AI tooling */
const Tbody = ({ semanticName, semanticRole, aiMetadata, purpose, children, ...props }) => {
    // Auto-infer semantic properties from children content
    const inferredPurpose = purpose || (React.Children.toArray(children).some(child => React.isValidElement(child) && React.Children.toArray(child.props?.children).some(cell => React.isValidElement(cell) && cell.props?.children?.toString().toLowerCase().includes('select'))) ? 'selectable-rows' :
        React.Children.toArray(children).some(child => React.isValidElement(child) && React.Children.toArray(child.props?.children).some(cell => React.isValidElement(cell) && cell.props?.children?.toString().toLowerCase().includes('action'))) ? 'action-rows' :
            React.Children.toArray(children).some(child => React.isValidElement(child) && React.Children.toArray(child.props?.children).some(cell => React.isValidElement(cell) && typeof cell.props?.children === 'object')) ? 'mixed-content' : 'data-rows');
    // Generate semantic role and AI metadata
    const role = semanticRole || `table-body-section-${inferredPurpose}`;
    const metadata = aiMetadata || {
        description: `Table body section with ${inferredPurpose}`,
        category: 'data-display',
        complexity: 'moderate',
        usage: [`table-${inferredPurpose}`, 'data-presentation', 'row-content']
    };
    // Default semantic name if not provided
    const defaultSemanticName = semanticName || 'Body Section';
    return (jsxRuntime.jsx(reactTable.Tbody, { ...props, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, children: children }));
};

/** Td - PatternFly Table Data wrapper with semantic metadata for AI tooling */
const Td = ({ semanticName, semanticRole, aiMetadata, purpose, dataType, children, ...props }) => {
    // Auto-infer semantic properties from PatternFly props and content
    const inferredPurpose = purpose || (React.Children.toArray(children).some(child => React.isValidElement(child) && child.type?.toString().includes('Button')) ? 'action-cell' :
        React.Children.toArray(children).some(child => React.isValidElement(child) && child.type?.toString().includes('Checkbox')) ? 'selectable-cell' :
            children?.toString().toLowerCase().includes('status') ? 'status-cell' : 'data-cell');
    // Simple data type inference based on content
    const inferredDataType = dataType || (typeof children === 'number' ? 'number' :
        children?.toString().match(/^\d{4}-\d{2}-\d{2}/) ? 'date' :
            children?.toString().toLowerCase() === 'true' ||
                children?.toString().toLowerCase() === 'false' ? 'boolean' :
                React.Children.toArray(children).some(child => React.isValidElement(child) && child.type?.toString().includes('Button')) ? 'action' : 'text');
    // Generate semantic role and AI metadata
    const role = semanticRole || `table-cell-${inferredPurpose}-${inferredDataType}`;
    const metadata = aiMetadata || {
        description: `${inferredPurpose} containing ${inferredDataType} data`,
        category: 'data-display',
        complexity: 'simple',
        usage: [`table-${inferredPurpose}`, 'data-presentation', 'row-content']
    };
    // Default semantic name if not provided
    const defaultSemanticName = semanticName || 'Row Item';
    return (jsxRuntime.jsx(reactTable.Td, { ...props, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-data-type": inferredDataType, children: children }));
};

/** Th - PatternFly Table Header wrapper with semantic metadata for AI tooling */
const Th = ({ semanticName, semanticRole, aiMetadata, purpose, dataType, children, sort, ...props }) => {
    // Auto-infer semantic properties from PatternFly props
    const inferredPurpose = purpose || (sort ? 'sortable-header' :
        children?.toString().toLowerCase().includes('select') ? 'selectable-header' :
            children?.toString().toLowerCase().includes('action') ? 'action-header' : 'column-header');
    // Simple data type inference based on content
    const inferredDataType = dataType || (children?.toString().toLowerCase().includes('date') ? 'date' :
        children?.toString().toLowerCase().includes('id') ||
            children?.toString().toLowerCase().includes('count') ? 'number' :
            children?.toString().toLowerCase().includes('action') ? 'action' : 'text');
    // Generate semantic role and AI metadata
    const role = semanticRole || `table-header-${inferredPurpose}-${inferredDataType}`;
    const metadata = aiMetadata || {
        description: `${inferredPurpose} for ${inferredDataType} data`,
        category: 'data-display',
        complexity: 'simple',
        usage: [`table-${inferredPurpose}`, 'data-organization', 'column-definition']
    };
    // Always use 'Th' for component type identification (for validation)
    // Store custom semantic name separately as instance name
    const componentType = 'Th';
    const instanceName = semanticName;
    return (jsxRuntime.jsx(reactTable.Th, { ...props, sort: sort, "data-semantic-name": componentType, "data-instance-name": instanceName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-data-type": inferredDataType, children: children }));
};

/** Thead - PatternFly Table Header wrapper with semantic metadata for AI tooling */
const Thead = ({ semanticName, semanticRole, aiMetadata, purpose, children, ...props }) => {
    // Auto-infer semantic properties from children content
    const inferredPurpose = purpose || (React.Children.toArray(children).some(child => React.isValidElement(child) && child.props?.sort) ? 'sortable-headers' :
        React.Children.toArray(children).some(child => React.isValidElement(child) && child.props?.children?.toString().toLowerCase().includes('select')) ? 'selectable-headers' :
            React.Children.toArray(children).some(child => React.isValidElement(child) && child.props?.children?.toString().toLowerCase().includes('action')) ? 'action-headers' : 'column-definition');
    // Generate semantic role and AI metadata
    const role = semanticRole || `table-header-section-${inferredPurpose}`;
    const metadata = aiMetadata || {
        description: `Table header section with ${inferredPurpose}`,
        category: 'data-display',
        complexity: 'moderate',
        usage: [`table-${inferredPurpose}`, 'data-organization', 'column-structure']
    };
    // Default semantic name if not provided
    const defaultSemanticName = semanticName || 'Header Section';
    return (jsxRuntime.jsx(reactTable.Thead, { ...props, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, children: children }));
};

/** Tr - PatternFly Table Row wrapper with semantic metadata for AI tooling */
const Tr = ({ semanticName, semanticRole, aiMetadata, purpose, interactionType, rowState, children, isClickable, isSelectable, isExpanded, isStriped, ...props }) => {
    // Auto-infer semantic properties from PatternFly props and content
    const inferredPurpose = purpose || (React.Children.toArray(children).some(child => React.isValidElement(child) &&
        React.Children.toArray(child.props?.children).some(cell => React.isValidElement(cell) && cell.type?.toString().includes('Th'))) ? 'header-row' :
        React.Children.toArray(children).some(child => React.isValidElement(child) &&
            React.Children.toArray(child.props?.children).some(cell => React.isValidElement(cell) && cell.type?.toString().includes('Checkbox'))) ? 'selectable-row' :
            isExpanded ? 'expandable-row' :
                React.Children.toArray(children).some(child => React.isValidElement(child) &&
                    React.Children.toArray(child.props?.children).some(cell => React.isValidElement(cell) && cell.type?.toString().includes('Button'))) ? 'action-row' : 'data-row');
    const inferredInteractionType = interactionType || (isClickable ? 'clickable' :
        isSelectable ? 'selectable' :
            isExpanded !== undefined ? 'expandable' :
                'static');
    const inferredRowState = rowState || (isExpanded ? 'expanded' :
        isSelectable ? 'selected' :
            isStriped ? 'highlighted' :
                'normal');
    // Generate semantic role and AI metadata
    const role = semanticRole || `table-row-${inferredPurpose}-${inferredInteractionType}`;
    const metadata = aiMetadata || {
        description: `${inferredPurpose} with ${inferredInteractionType} interaction`,
        category: 'data-display',
        complexity: inferredInteractionType === 'static' ? 'simple' : 'medium',
        usage: [`table-${inferredPurpose}`, 'row-interaction', 'data-presentation'],
        interactionType: inferredInteractionType,
        rowState: inferredRowState,
        isStriped: isStriped || false
    };
    // Default semantic name if not provided
    const defaultSemanticName = semanticName || 'Table Row';
    return (jsxRuntime.jsx(reactTable.Tr, { ...props, isClickable: isClickable, isSelectable: isSelectable, isExpanded: isExpanded, isStriped: isStriped, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-interaction-type": inferredInteractionType, "data-row-state": inferredRowState, children: children }));
};

/** Flex - PatternFly Flex wrapper with semantic metadata for AI tooling */
const Flex = ({ semanticName, semanticRole, aiMetadata, purpose, layoutType, alignmentContext, children, direction, justifyContent, alignItems, alignSelf, flex, spaceItems, gap, columnGap, rowGap, order, component, display, ...props }) => {
    // Auto-infer semantic properties from PatternFly props
    const inferredPurpose = purpose || (justifyContent?.default === 'justifyContentSpaceBetween' ? 'toolbar' :
        justifyContent?.default === 'justifyContentCenter' ? 'content' :
            spaceItems ? 'action-group' :
                'layout');
    const inferredLayoutType = layoutType || (direction?.default === 'column' ? 'column' :
        direction?.lg ? 'responsive' :
            'row');
    const inferredAlignmentContext = alignmentContext || (alignItems?.default === 'alignItemsCenter' ? 'center' :
        alignItems?.default === 'alignItemsFlexEnd' ? 'end' :
            alignItems?.default === 'alignItemsFlexStart' ? 'start' :
                alignItems?.default === 'alignItemsStretch' ? 'stretch' :
                    alignItems?.default === 'alignItemsBaseline' ? 'baseline' :
                        'start');
    // Generate semantic role and AI metadata
    const role = semanticRole || `flex-${inferredPurpose}-${inferredLayoutType}`;
    const metadata = aiMetadata || {
        description: `${inferredPurpose} flex container with ${inferredLayoutType} layout`,
        category: 'layout',
        complexity: inferredLayoutType === 'responsive' ? 'medium' : 'simple',
        usage: [`${inferredPurpose}-layout`, `${inferredLayoutType}-container`, 'responsive-design'],
        alignment: inferredAlignmentContext,
        layoutDirection: direction?.default || 'row'
    };
    // Default semantic name if not provided
    const defaultSemanticName = semanticName || 'Flex Container';
    return (jsxRuntime.jsx(reactCore.Flex, { ...props, direction: direction, justifyContent: justifyContent, alignItems: alignItems, alignSelf: alignSelf, flex: flex, spaceItems: spaceItems, gap: gap, columnGap: columnGap, rowGap: rowGap, order: order, component: component, display: display, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-layout-type": inferredLayoutType, "data-alignment-context": inferredAlignmentContext, children: children }));
};

/** FlexItem - PatternFly FlexItem wrapper with semantic metadata for AI tooling */
const FlexItem = ({ semanticName, semanticRole, aiMetadata, contentType, positioningContext, sizingBehavior, children, flex, align, alignSelf, spacer, order, component, ...props }) => {
    // Auto-infer semantic properties from PatternFly props
    const inferredContentType = contentType || (React.Children.toArray(children).some(child => React.isValidElement(child) &&
        (child.type?.toString().includes('Button') ||
            child.props?.variant === 'primary' ||
            child.props?.variant === 'secondary')) ? 'button' :
        React.Children.toArray(children).some(child => React.isValidElement(child) &&
            child.type?.toString().includes('Icon')) ? 'icon' :
            React.Children.toArray(children).some(child => React.isValidElement(child) &&
                (child.type?.toString().includes('Input') ||
                    child.type?.toString().includes('Select') ||
                    child.type?.toString().includes('Checkbox'))) ? 'form-control' :
                React.Children.toArray(children).some(child => React.isValidElement(child) &&
                    (child.type?.toString().includes('img') ||
                        child.type?.toString().includes('Image'))) ? 'media' :
                    React.Children.toArray(children).some(child => React.isValidElement(child) &&
                        child.type?.toString().includes('Link')) ? 'navigation' :
                        'text');
    const inferredPositioningContext = positioningContext || (align?.default === 'alignRight' ? 'end' :
        align?.default === 'alignLeft' ? 'start' :
            align?.default === 'alignCenter' ? 'center' :
                alignSelf?.default === 'alignSelfFlexEnd' ? 'end' :
                    alignSelf?.default === 'alignSelfFlexStart' ? 'start' :
                        alignSelf?.default === 'alignSelfCenter' ? 'center' :
                            alignSelf?.default === 'alignSelfStretch' ? 'stretch' :
                                alignSelf?.default === 'alignSelfBaseline' ? 'baseline' :
                                    'auto');
    const inferredSizingBehavior = sizingBehavior || (flex?.default === 'flex_1' ? 'flexible' :
        flex?.default === 'flex_2' ? 'grow' :
            flex?.default === 'flex_3' ? 'grow' :
                flex?.default === 'flexNone' ? 'fixed' :
                    flex?.default === 'flexDefault' ? 'auto' :
                        flex?.default === 'flex_4' ? 'auto' :
                            'auto');
    // Generate semantic role and AI metadata
    const role = semanticRole || `flex-item-${inferredContentType}-${inferredSizingBehavior}`;
    const metadata = aiMetadata || {
        description: `${inferredContentType} flex item with ${inferredSizingBehavior} sizing`,
        category: 'layout',
        complexity: 'simple',
        usage: [`${inferredContentType}-item`, `${inferredSizingBehavior}-sizing`, 'flex-layout'],
        positioning: inferredPositioningContext,
        sizing: inferredSizingBehavior,
        spacing: spacer?.default || 'none'
    };
    // Default semantic name if not provided
    const defaultSemanticName = semanticName || 'Flex Item';
    return (jsxRuntime.jsx(reactCore.FlexItem, { ...props, flex: flex, align: align, alignSelf: alignSelf, spacer: spacer, order: order, component: component, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-content-type": inferredContentType, "data-positioning-context": inferredPositioningContext, "data-sizing-behavior": inferredSizingBehavior, children: children }));
};

/** Modal - PatternFly Modal wrapper with semantic metadata for AI tooling */
const Modal = React.forwardRef(({ semanticName, semanticRole, aiMetadata, purpose, interactionType, children, variant, isOpen, ...props }, ref) => {
    // Auto-infer semantic properties from PatternFly props
    const inferredPurpose = purpose || inferModalPurpose({ variant });
    const inferredInteractionType = interactionType || inferModalInteractionType(isOpen);
    // Generate semantic role and AI metadata
    const role = semanticRole || `modal-${inferredPurpose}-${inferredInteractionType}`;
    const metadata = aiMetadata || {
        description: `${inferredPurpose} modal with ${inferredInteractionType} interaction`,
        category: inferCategory('Modal'),
        usage: [`${inferredPurpose}-dialog`, 'user-interaction', 'workflow-step']
    };
    // Default semantic name if not provided
    const defaultSemanticName = semanticName || 'Modal';
    return (jsxRuntime.jsx(reactCore.Modal, { ...props, ref: ref, variant: variant, isOpen: isOpen, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-interaction-type": inferredInteractionType, children: children }));
});

const MenuToggle = ({ semanticName, semanticRole, aiMetadata, target, children, ...props }) => {
    // Get hierarchy from context (optional)
    let hierarchy;
    try {
        const semanticContext = useSemanticContext();
        const { addContext, removeContext, getHierarchy } = semanticContext;
        // Add "menu" context when this component mounts/renders
        React.useEffect(() => {
            addContext('Menu');
            return () => removeContext();
        }, [addContext, removeContext]);
        hierarchy = getHierarchy();
    }
    catch {
        hierarchy = { parents: [], depth: 0, path: '' };
    }
    const componentName = semanticName || 'Toggle';
    const metadata = aiMetadata || {
        hierarchy,
        action: {
            type: 'toggle',
            target: target || 'menu'
        }
    };
    return (jsxRuntime.jsx(reactCore.MenuToggle, { ...props, "data-semantic-name": componentName, "data-semantic-path": hierarchy.path ? `${hierarchy.path} > ${componentName}` : componentName, "data-semantic-hierarchy": JSON.stringify(hierarchy.parents), "data-semantic-role": semanticRole || 'menu-trigger', "data-ai-metadata": JSON.stringify(metadata), "data-target": target || 'menu', children: children }));
};

const DropdownItem = ({ semanticName, semanticRole, aiMetadata, target, children, ...props }) => {
    // Get hierarchy from context (optional)
    let hierarchy;
    try {
        const semanticContext = useSemanticContext();
        hierarchy = semanticContext.getHierarchy();
    }
    catch {
        hierarchy = { parents: [], depth: 0, path: '' };
    }
    const componentName = semanticName || 'Action';
    const metadata = aiMetadata || {
        hierarchy,
        action: {
            type: 'menu-action',
            target: target || 'default'
        }
    };
    return (jsxRuntime.jsx(reactCore.DropdownItem, { ...props, "data-semantic-name": componentName, "data-semantic-path": hierarchy.path ? `${hierarchy.path} > ${componentName}` : componentName, "data-semantic-hierarchy": JSON.stringify(hierarchy.parents), "data-semantic-role": semanticRole || 'menu-item', "data-ai-metadata": JSON.stringify(metadata), "data-target": target || 'default', children: children }));
};

/**
 * Utility functions for managing component metadata
 */
/**
 * Generates default metadata for a component based on its type and props
 */
const generateComponentMetadata = (componentName, props = {}) => {
    const baseMetadata = {
        name: componentName,
        description: `Semantic wrapper for ${componentName}`,
        category: 'data-display',
        accessibility: ['keyboard-navigable'],
        usage: ['user-interface'],
        props: props
    };
    // Customize based on component type
    switch (componentName.toLowerCase()) {
        case 'button':
            return {
                ...baseMetadata,
                category: 'forms',
                description: 'Interactive button with semantic meaning',
                usage: ['user-interaction', 'form-submission', 'navigation']
            };
        case 'card':
            return {
                ...baseMetadata,
                category: 'data-display',
                description: 'Content container with semantic purpose',
                usage: ['content-organization', 'data-presentation']
            };
        case 'modal':
            return {
                ...baseMetadata,
                category: 'overlay',
                description: 'Overlay dialog with semantic purpose',
                accessibility: ['keyboard-navigable', 'focus-management', 'screen-reader-friendly'],
                usage: ['user-interaction', 'workflow-step', 'confirmation']
            };
        default:
            return baseMetadata;
    }
};
/**
 * Validates component metadata
 */
const validateMetadata = (metadata) => {
    return !!(metadata.name &&
        metadata.description &&
        metadata.category &&
        Array.isArray(metadata.accessibility) &&
        Array.isArray(metadata.usage));
};
/**
 * Merges user-provided metadata with defaults
 */
const mergeMetadata = (userMetadata, defaultMetadata) => {
    return {
        ...defaultMetadata,
        ...userMetadata,
        accessibility: [...defaultMetadata.accessibility, ...(userMetadata.accessibility || [])],
        usage: [...defaultMetadata.usage, ...(userMetadata.usage || [])]
    };
};

/**
 * Accessibility utility functions
 */
/**
 * Generates ARIA attributes based on component context
 */
const generateAriaAttributes = (componentType) => {
    const baseAttributes = {};
    switch (componentType.toLowerCase()) {
        case 'button':
            return {
                ...baseAttributes,
                role: 'button',
                tabIndex: '0'
            };
        case 'card':
            return {
                ...baseAttributes,
                role: 'region',
                tabIndex: '0'
            };
        case 'modal':
            return {
                ...baseAttributes,
                role: 'dialog',
                'aria-modal': 'true',
                tabIndex: '-1'
            };
        default:
            return baseAttributes;
    }
};
/**
 * Validates accessibility requirements
 */
const validateAccessibility = (componentType, props) => {
    const issues = [];
    // Check for required ARIA attributes
    if (componentType === 'button' && !props['aria-label'] && !props.children) {
        issues.push('Button should have aria-label or visible text content');
    }
    if (componentType === 'modal' && !props['aria-labelledby'] && !props.title) {
        issues.push('Modal should have aria-labelledby or title');
    }
    return issues;
};
/**
 * Generates keyboard shortcuts metadata
 */
const generateKeyboardShortcuts = (componentType, context = {}) => {
    const shortcuts = [];
    switch (componentType.toLowerCase()) {
        case 'button':
            shortcuts.push('Enter', 'Space');
            if (context.action === 'close') {
                shortcuts.push('Escape');
            }
            break;
        case 'modal':
            shortcuts.push('Escape', 'Tab', 'Shift+Tab');
            break;
        case 'card':
            if (context.interactive) {
                shortcuts.push('Enter', 'Space');
            }
            break;
    }
    return shortcuts;
};

/**
 * Semantic UI Layer Validation Utility
 *
 * This utility helps developers identify when they're using native HTML elements
 * instead of semantic-ui-layer components, which prevents semantic metadata from being applied.
 */
/**
 * Maps semantic component names to their native HTML equivalents
 * This is used to detect when semantic components are being used
 */
const SEMANTIC_TO_NATIVE = {
    'Button': 'button',
    'Tr': 'tr',
    'Td': 'td',
    'Th': 'th',
    'Thead': 'thead',
    'Tbody': 'tbody',
    'Checkbox': 'input', // for type="checkbox"
    'Card': 'div',
    'Modal': 'div',
    'Flex': 'div',
    'FlexItem': 'span',
    'Link': 'a',
    'StatusBadge': 'span',
    'StarIcon': 'span',
};
/**
 * Semantic components that should be detected
 */
const SEMANTIC_COMPONENTS = Object.keys(SEMANTIC_TO_NATIVE);
/**
 * Validates the current DOM for semantic-ui-layer components being used
 * This detects when semantic components are being used and shows their semantic names
 */
const validateSemanticUsage = () => {
    const warnings = [];
    // Get all elements in the document
    const allElements = document.querySelectorAll('*');
    // Count elements
    const totalElements = allElements.length;
    // Find elements that have semantic metadata (data-semantic-name attribute)
    const semanticElements = document.querySelectorAll('[data-semantic-name]');
    const semanticElementsCount = semanticElements.length;
    // Check each semantic element and create validation entries
    semanticElements.forEach(element => {
        const htmlElement = element;
        const semanticName = htmlElement.getAttribute('data-semantic-name');
        if (semanticName && SEMANTIC_COMPONENTS.includes(semanticName)) {
            const nativeEquivalent = SEMANTIC_TO_NATIVE[semanticName];
            warnings.push({
                element: semanticName,
                tagName: htmlElement.tagName.toUpperCase(),
                suggestion: `✅ Using semantic <${semanticName}> component (renders as <${nativeEquivalent}>)`,
                location: getElementLocation(htmlElement),
                elementRef: htmlElement,
                semanticAlternative: semanticName,
                canAutoReplace: true
            });
        }
    });
    const nativeElementsCount = totalElements - semanticElementsCount;
    return {
        warnings,
        summary: {
            totalElements,
            semanticElements: semanticElementsCount,
            nativeElements: nativeElementsCount,
            warningsCount: warnings.length
        }
    };
};
/**
 * Attempts to determine the location of an element for debugging
 */
const getElementLocation = (element) => {
    // Try to get line number from source maps or other debugging info
    if (element.hasAttribute('data-line')) {
        return `line ${element.getAttribute('data-line')}`;
    }
    // Get a basic selector for the element
    const tagName = element.tagName.toLowerCase();
    const className = element.className ? `.${element.className.split(' ').join('.')}` : '';
    const id = element.id ? `#${element.id}` : '';
    return `${tagName}${id}${className}`;
};
/**
 * Highlights elements that have validation warnings
 */
const highlightValidationWarnings = (warnings) => {
    // Remove any existing highlights
    clearValidationHighlights();
    warnings.forEach((warning, index) => {
        if (warning.elementRef) {
            // Use green outline for semantic components (success)
            warning.elementRef.style.outline = '2px solid #28a745';
            warning.elementRef.style.outlineOffset = '2px';
            warning.elementRef.setAttribute('data-validation-warning', index.toString());
            // Add a temporary title with the suggestion
            const originalTitle = warning.elementRef.getAttribute('title') || '';
            warning.elementRef.setAttribute('title', `${originalTitle}\n✅ ${warning.suggestion}`.trim());
        }
    });
};
/**
 * Removes validation highlights from all elements
 */
const clearValidationHighlights = () => {
    const highlightedElements = document.querySelectorAll('[data-validation-warning]');
    highlightedElements.forEach(element => {
        const htmlElement = element;
        htmlElement.style.outline = '';
        htmlElement.style.outlineOffset = '';
        htmlElement.removeAttribute('data-validation-warning');
        // Restore original title (remove our added warning)
        const title = htmlElement.getAttribute('title') || '';
        if (title.includes('✅')) {
            const originalTitle = title.split('\n✅')[0].trim();
            htmlElement.setAttribute('title', originalTitle);
        }
    });
};
/**
 * Logs validation results to the console with helpful formatting
 */
const logValidationResults = (result) => {
    console.group('🔍 Semantic UI Layer Validation Results');
    console.log(`📊 Summary:`, result.summary);
    if (result.warnings.length > 0) {
        console.log(`✅ Found ${result.warnings.length} semantic components being used:`);
        result.warnings.forEach((warning, index) => {
            console.log(`${index + 1}. <${warning.element}> at ${warning.location}`);
            console.log(`   💡 ${warning.suggestion}`);
            if (warning.elementRef) {
                console.log(`   🔗 Element:`, warning.elementRef);
            }
        });
        console.log(`\n🎯 This demonstrates the semantic naming capability - components are using semantic names instead of native HTML names`);
        console.log(`💡 Tip: Use the refresh button to highlight these semantic components in the UI`);
    }
    else {
        console.log('ℹ️ No semantic components detected. This page may not be using semantic-ui-layer components yet.');
    }
    console.groupEnd();
};
/**
 * Main validation function that runs the complete validation process
 */
const runSemanticValidation = (highlightWarnings = true) => {
    console.log('🔍 Running semantic-ui-layer validation...');
    const result = validateSemanticUsage();
    if (highlightWarnings && result.warnings.length > 0) {
        highlightValidationWarnings(result.warnings);
    }
    logValidationResults(result);
    return result;
};

/**
 * Hook for managing semantic metadata for components
 */
const useSemanticMetadata = (componentName, userMetadata, props = {}) => {
    const [metadata, setMetadata] = React.useState(() => {
        const defaultMetadata = generateComponentMetadata(componentName, props);
        return userMetadata ? mergeMetadata(userMetadata, defaultMetadata) : defaultMetadata;
    });
    React.useEffect(() => {
        const defaultMetadata = generateComponentMetadata(componentName, props);
        const mergedMetadata = userMetadata ? mergeMetadata(userMetadata, defaultMetadata) : defaultMetadata;
        setMetadata(mergedMetadata);
    }, [componentName, userMetadata, props]);
    const updateMetadata = (updates) => {
        setMetadata(prev => ({ ...prev, ...updates }));
    };
    return {
        metadata,
        updateMetadata
    };
};

/**
 * Hook for managing accessibility features
 */
const useAccessibility = (componentType, props = {}, context = {}) => {
    const ariaAttributes = React.useMemo(() => generateAriaAttributes(componentType), [componentType]);
    const keyboardShortcuts = React.useMemo(() => generateKeyboardShortcuts(componentType, context), [componentType, context]);
    const accessibilityIssues = React.useMemo(() => validateAccessibility(componentType, props), [componentType, props]);
    const enhancedProps = React.useMemo(() => ({
        ...props,
        ...ariaAttributes,
        'data-keyboard-shortcuts': keyboardShortcuts.join(','),
        'data-accessibility-issues': accessibilityIssues.join(',')
    }), [props, ariaAttributes, keyboardShortcuts, accessibilityIssues]);
    return {
        ariaAttributes,
        keyboardShortcuts,
        accessibilityIssues,
        enhancedProps
    };
};

exports.Button = Button;
exports.Card = Card;
exports.Checkbox = Checkbox;
exports.DropdownItem = DropdownItem;
exports.Flex = Flex;
exports.FlexItem = FlexItem;
exports.Link = Link;
exports.MenuToggle = MenuToggle;
exports.Modal = Modal;
exports.Radio = Radio;
exports.Select = Select;
exports.SemanticProvider = SemanticProvider;
exports.StarIcon = StarIcon;
exports.StatusBadge = StatusBadge;
exports.Switch = Switch;
exports.Tbody = Tbody;
exports.Td = Td;
exports.TextArea = TextArea;
exports.TextInput = TextInput;
exports.Th = Th;
exports.Thead = Thead;
exports.Tr = Tr;
exports.clearValidationHighlights = clearValidationHighlights;
exports.generateAriaAttributes = generateAriaAttributes;
exports.generateComponentMetadata = generateComponentMetadata;
exports.generateKeyboardShortcuts = generateKeyboardShortcuts;
exports.generateMetadataFromProps = generateMetadataFromProps;
exports.highlightValidationWarnings = highlightValidationWarnings;
exports.inferAccessibilityFeatures = inferAccessibilityFeatures;
exports.inferAlertSeverity = inferAlertSeverity;
exports.inferButtonAction = inferButtonAction;
exports.inferCardContentType = inferCardContentType;
exports.inferCardPurpose = inferCardPurpose;
exports.inferCategory = inferCategory;
exports.inferCheckboxPurpose = inferCheckboxPurpose;
exports.inferContext = inferContext;
exports.inferFormContext = inferFormContext;
exports.inferInputPurpose = inferInputPurpose;
exports.inferLinkPurpose = inferLinkPurpose;
exports.inferModalInteractionType = inferModalInteractionType;
exports.inferModalPurpose = inferModalPurpose;
exports.inferRadioGroupContext = inferRadioGroupContext;
exports.inferRadioPurpose = inferRadioPurpose;
exports.inferSelectPurpose = inferSelectPurpose;
exports.inferSelectSelectionType = inferSelectSelectionType;
exports.inferSettingsContext = inferSettingsContext;
exports.inferStarIconPurpose = inferStarIconPurpose;
exports.inferStatusBadgePurpose = inferStatusBadgePurpose;
exports.inferStatusBadgeType = inferStatusBadgeType;
exports.inferSwitchPurpose = inferSwitchPurpose;
exports.inferSwitchToggleTarget = inferSwitchToggleTarget;
exports.inferTextAreaContentType = inferTextAreaContentType;
exports.inferTextAreaPurpose = inferTextAreaPurpose;
exports.inferUsagePatterns = inferUsagePatterns;
exports.inferValidationContext = inferValidationContext;
exports.logValidationResults = logValidationResults;
exports.mergeMetadata = mergeMetadata;
exports.runSemanticValidation = runSemanticValidation;
exports.useAccessibility = useAccessibility;
exports.useSemanticContext = useSemanticContext;
exports.useSemanticMetadata = useSemanticMetadata;
exports.validateAccessibility = validateAccessibility;
exports.validateMetadata = validateMetadata;
exports.validateSemanticUsage = validateSemanticUsage;
//# sourceMappingURL=index.js.map
