'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var reactCore = require('@patternfly/react-core');
var reactTable = require('@patternfly/react-table');

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
    const getContextualName = (baseName) => {
        if (contextStack.length === 0) {
            return baseName;
        }
        // Join all context levels with spaces
        const contextPrefix = contextStack.join(' ');
        return `${contextPrefix} ${baseName}`;
    };
    return (jsxRuntime.jsx(SemanticContext.Provider, { value: {
            contextStack,
            addContext,
            removeContext,
            getContextualName,
            clearContext,
        }, children: children }));
};

/** Button - PatternFly Button wrapper with semantic metadata for AI tooling */
const Button = ({ semanticName, semanticRole, aiMetadata, action, context, children, variant, onClick, isDisabled, ...props }) => {
    const { getContextualName } = useSemanticContext();
    // Auto-infer semantic properties from PatternFly props
    const inferredAction = action || (variant === 'primary' ? 'primary' :
        variant === 'danger' ? 'destructive' :
            variant === 'link' ? 'navigation' : 'secondary');
    const inferredContext = context || (onClick ? 'interactive' : 'form');
    // Generate semantic role and AI metadata
    const role = semanticRole || `button-${inferredAction}-${inferredContext}`;
    const metadata = aiMetadata || {
        description: `${inferredAction} action button for ${inferredContext} context`,
        category: 'forms',
        complexity: 'simple',
        usage: [`${inferredContext}-${inferredAction}`, 'user-interaction']
    };
    // Get contextual name - if no semanticName provided, use default "Button"
    // This will automatically become "menu Button" when inside a MenuToggle context
    const contextualName = getContextualName(semanticName || 'Button');
    return (jsxRuntime.jsx(reactCore.Button, { ...props, variant: variant, onClick: onClick, isDisabled: isDisabled, "data-semantic-name": contextualName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-action": inferredAction, "data-context": inferredContext, children: children }));
};

/** Card - PatternFly Card wrapper with semantic metadata for AI tooling */
const Card = ({ semanticName, semanticRole, aiMetadata, purpose, contentType, children, isSelectable, isClickable, ...props }) => {
    // Auto-infer semantic properties from PatternFly props and children
    const inferredPurpose = purpose || (isSelectable || isClickable ? 'action-panel' : 'content-display');
    // Simple content type inference based on children
    const inferredContentType = contentType || 'mixed';
    // Generate semantic role and AI metadata
    const role = semanticRole || `card-${inferredPurpose}-${inferredContentType}`;
    const metadata = aiMetadata || {
        description: `${inferredPurpose} card containing ${inferredContentType} content`,
        category: 'data-display',
        complexity: 'moderate',
        usage: [`${inferredPurpose}-display`, 'content-organization']
    };
    // Default semantic name if not provided
    const defaultSemanticName = semanticName || 'Card';
    return (jsxRuntime.jsx(reactCore.Card, { ...props, isSelectable: isSelectable, isClickable: isClickable, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-content-type": inferredContentType, children: children }));
};

/** Modal - PatternFly Modal wrapper with semantic metadata for AI tooling */
const Modal = React.forwardRef(({ semanticName, semanticRole, aiMetadata, purpose, interactionType, children, variant, isOpen, ...props }, ref) => {
    // Auto-infer semantic properties from PatternFly props
    const inferredPurpose = purpose || (variant === 'small' ? 'confirmation' :
        variant === 'large' ? 'form' : 'information');
    const inferredInteractionType = interactionType || (isOpen ? 'blocking' : 'non-blocking');
    // Generate semantic role and AI metadata
    const role = semanticRole || `modal-${inferredPurpose}-${inferredInteractionType}`;
    const metadata = aiMetadata || {
        description: `${inferredPurpose} modal with ${inferredInteractionType} interaction`,
        category: 'overlay',
        complexity: 'complex',
        usage: [`${inferredPurpose}-dialog`, 'user-interaction', 'workflow-step']
    };
    // Default semantic name if not provided
    const defaultSemanticName = semanticName || 'Modal';
    return (jsxRuntime.jsx(reactCore.Modal, { ...props, ref: ref, variant: variant, isOpen: isOpen, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-interaction-type": inferredInteractionType, children: children }));
});

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
    // Default semantic name if not provided
    const defaultSemanticName = semanticName || 'Header';
    return (jsxRuntime.jsx(reactTable.Th, { ...props, sort: sort, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-data-type": inferredDataType, children: children }));
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

/** Checkbox - PatternFly Checkbox wrapper with semantic metadata for AI tooling */
const Checkbox = ({ semanticName, semanticRole, aiMetadata, purpose, context, children, isChecked, onChange, id, ...props }) => {
    // Auto-infer semantic properties from PatternFly props
    const inferredPurpose = purpose || (isChecked !== undefined ? 'selection' : 'form-input');
    const inferredContext = context || (onChange ? 'interactive' : 'form');
    // Generate semantic role and AI metadata
    const role = semanticRole || `checkbox-${inferredPurpose}-${inferredContext}`;
    const metadata = aiMetadata || {
        description: `${inferredPurpose} checkbox for ${inferredContext} context`,
        category: 'forms',
        complexity: 'simple',
        usage: [`${inferredContext}-${inferredPurpose}`, 'user-interaction']
    };
    // Default semantic name if not provided
    const defaultSemanticName = semanticName || 'Row Item';
    return (jsxRuntime.jsx(reactCore.Checkbox, { ...props, id: id, isChecked: isChecked, onChange: onChange, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-context": inferredContext, children: children }));
};

/** Link - HTML anchor wrapper with semantic metadata for AI tooling */
const Link = ({ semanticName, semanticRole, aiMetadata, purpose, context, children, href, onClick, ...props }) => {
    // Auto-infer semantic properties from props
    const inferredPurpose = purpose || (href?.startsWith('http') ? 'external' :
        href === '#' ? 'action' :
            href?.includes('download') ? 'download' :
                children?.toString().toLowerCase().includes('launch') ? 'launch' : 'navigation');
    const inferredContext = context || (onClick ? 'interactive' : 'content');
    // Generate semantic role and AI metadata
    const role = semanticRole || `link-${inferredPurpose}-${inferredContext}`;
    const metadata = aiMetadata || {
        description: `${inferredPurpose} link for ${inferredContext} context`,
        category: 'navigation',
        complexity: 'simple',
        usage: [`${inferredContext}-${inferredPurpose}`, 'user-interaction']
    };
    // Default semantic name if not provided
    const defaultSemanticName = semanticName || 'Row Item';
    return (jsxRuntime.jsx("a", { ...props, href: href, onClick: onClick, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-context": inferredContext, children: children }));
};

/** StatusBadge - HTML span wrapper with semantic metadata for AI tooling */
const StatusBadge = ({ semanticName, semanticRole, aiMetadata, purpose, statusType, children, ...props }) => {
    // Auto-infer semantic properties from content
    const content = children?.toString().toLowerCase() || '';
    const inferredStatusType = statusType || (content.includes('ready') ? 'ready' :
        content.includes('success') ? 'success' :
            content.includes('warning') ? 'warning' :
                content.includes('error') ? 'error' :
                    content.includes('pending') ? 'pending' : 'info');
    const inferredPurpose = purpose || 'status-indicator';
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

/** StarIcon - HTML span wrapper with semantic metadata for AI tooling */
const StarIcon = ({ semanticName, semanticRole, aiMetadata, purpose, context, children, isFavorited, onClick, ...props }) => {
    // Auto-infer semantic properties from props
    const inferredPurpose = purpose || (isFavorited !== undefined ? 'favorite-toggle' : 'rating');
    const inferredContext = context || (onClick ? 'interactive' : 'display');
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

const MenuToggle = ({ semanticName, semanticRole, aiMetadata, children, ...props }) => {
    const { addContext, removeContext, getContextualName } = useSemanticContext();
    // Add "menu" context when this component mounts/renders
    React.useEffect(() => {
        addContext('menu');
        return () => removeContext();
    }, [addContext, removeContext]);
    // Get contextual name - if no semanticName provided, use default "Toggle"
    const contextualName = getContextualName(semanticName || 'Toggle');
    return (jsxRuntime.jsx(reactCore.MenuToggle, { ...props, "data-semantic-name": contextualName, "data-semantic-role": semanticRole || 'menu-trigger', "data-ai-metadata": JSON.stringify(aiMetadata || {}), children: children }));
};

const DropdownItem = ({ semanticName, semanticRole, aiMetadata, children, ...props }) => {
    const { getContextualName } = useSemanticContext();
    // Get contextual name - if no semanticName provided, use default "Action"
    // This will automatically become "menu Action" when inside a MenuToggle context
    const contextualName = getContextualName(semanticName || 'Action');
    return (jsxRuntime.jsx(reactCore.DropdownItem, { ...props, "data-semantic-name": contextualName, "data-semantic-role": semanticRole || 'menu-item', "data-ai-metadata": JSON.stringify(aiMetadata || {}), children: children }));
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
        complexity: 'simple',
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
                complexity: 'complex',
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
        metadata.complexity &&
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
exports.Link = Link;
exports.MenuToggle = MenuToggle;
exports.Modal = Modal;
exports.SemanticProvider = SemanticProvider;
exports.StarIcon = StarIcon;
exports.StatusBadge = StatusBadge;
exports.Tbody = Tbody;
exports.Td = Td;
exports.Th = Th;
exports.Thead = Thead;
exports.generateAriaAttributes = generateAriaAttributes;
exports.generateComponentMetadata = generateComponentMetadata;
exports.generateKeyboardShortcuts = generateKeyboardShortcuts;
exports.mergeMetadata = mergeMetadata;
exports.useAccessibility = useAccessibility;
exports.useSemanticContext = useSemanticContext;
exports.useSemanticMetadata = useSemanticMetadata;
exports.validateAccessibility = validateAccessibility;
exports.validateMetadata = validateMetadata;
//# sourceMappingURL=index.js.map
