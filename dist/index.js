'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var reactCore = require('@patternfly/react-core');
var reactTable = require('@patternfly/react-table');

/** Button - PatternFly Button wrapper with semantic metadata for AI tooling */
const Button = ({ semanticName, semanticRole, aiMetadata, action, context, children, variant, onClick, isDisabled, ...props }) => {
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
    // All buttons adopt the semantic name "Button" for consistency
    const defaultSemanticName = 'Button';
    return (jsxRuntime.jsx(reactCore.Button, { ...props, variant: variant, onClick: onClick, isDisabled: isDisabled, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-action": inferredAction, "data-context": inferredContext, children: children }));
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
                    flex?.default === 'flexAuto' ? 'auto' :
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

/** Tr - PatternFly Table Row wrapper with semantic metadata for AI tooling */
const Tr = ({ semanticName, semanticRole, aiMetadata, purpose, interactionType, rowState, children, isClickable, isSelectable, isExpanded, isDisabled, isStriped, ...props }) => {
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
    const inferredRowState = rowState || (isDisabled ? 'disabled' :
        isExpanded ? 'expanded' :
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
    return (jsxRuntime.jsx(reactTable.Tr, { ...props, isClickable: isClickable, isSelectable: isSelectable, isExpanded: isExpanded, isDisabled: isDisabled, isStriped: isStriped, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-interaction-type": inferredInteractionType, "data-row-state": inferredRowState, children: children }));
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
 * Semantic UI Layer Validation Utility
 *
 * This utility helps developers identify when they're using native HTML elements
 * instead of semantic-ui-layer components, which prevents semantic metadata from being applied.
 */
/**
 * Maps native HTML elements to their semantic-ui-layer equivalents
 */
const SEMANTIC_ALTERNATIVES = {
    'tr': 'Tr',
    'td': 'Td',
    'th': 'Th',
    'thead': 'Thead',
    'tbody': 'Tbody',
    'button': 'Button',
    'input': 'Checkbox', // for type="checkbox"
    'div': 'Flex', // when used for layout
    'span': 'FlexItem', // when used for layout
};
/**
 * Validates the current DOM for native HTML elements that should use semantic-ui-layer components
 */
const validateSemanticUsage = () => {
    const warnings = [];
    // Get all elements in the document
    const allElements = document.querySelectorAll('*');
    const semanticElements = document.querySelectorAll('[data-semantic-name]');
    // Count elements
    const totalElements = allElements.length;
    const semanticElementsCount = semanticElements.length;
    // Check for native elements that should be semantic
    Object.keys(SEMANTIC_ALTERNATIVES).forEach(tagName => {
        const nativeElements = document.querySelectorAll(tagName);
        nativeElements.forEach(element => {
            const htmlElement = element;
            // Skip if this element already has semantic metadata
            if (htmlElement.hasAttribute('data-semantic-name')) {
                return;
            }
            // Special cases for specific elements
            if (tagName === 'input') {
                const inputElement = htmlElement;
                if (inputElement.type !== 'checkbox') {
                    return; // Only flag checkbox inputs
                }
            }
            // Skip elements that are likely intentionally native (e.g., form inputs, etc.)
            if (shouldSkipElement(htmlElement)) {
                return;
            }
            warnings.push({
                element: tagName,
                tagName: tagName.toUpperCase(),
                suggestion: `Use <${SEMANTIC_ALTERNATIVES[tagName]}> from semantic-ui-layer instead of native <${tagName}>`,
                location: getElementLocation(htmlElement),
                elementRef: htmlElement
            });
        });
    });
    const nativeElementsCount = warnings.length;
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
 * Determines if an element should be skipped during validation
 */
const shouldSkipElement = (element, tagName) => {
    // Skip elements inside certain containers that might be intentionally native
    const parent = element.parentElement;
    if (parent) {
        // Skip if parent is a form (forms often need native inputs)
        if (parent.tagName === 'FORM') {
            return true;
        }
        // Skip if parent has a specific class indicating it's intentionally native
        if (parent.classList.contains('native-elements') ||
            parent.classList.contains('raw-html')) {
            return true;
        }
    }
    // Skip elements with specific attributes that indicate they're intentionally native
    if (element.hasAttribute('data-native') ||
        element.hasAttribute('data-raw')) {
        return true;
    }
    // Skip elements that are part of third-party libraries
    if (element.closest('[data-testid]') ||
        element.closest('.react-select') ||
        element.closest('.react-datepicker')) {
        return true;
    }
    return false;
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
            warning.elementRef.style.outline = '2px solid #ff6b6b';
            warning.elementRef.style.outlineOffset = '2px';
            warning.elementRef.setAttribute('data-validation-warning', index.toString());
            // Add a temporary title with the suggestion
            const originalTitle = warning.elementRef.getAttribute('title') || '';
            warning.elementRef.setAttribute('title', `${originalTitle}\n⚠️ ${warning.suggestion}`.trim());
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
        if (title.includes('⚠️')) {
            const originalTitle = title.split('\n⚠️')[0].trim();
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
        console.warn(`⚠️ Found ${result.warnings.length} potential issues:`);
        result.warnings.forEach((warning, index) => {
            console.warn(`${index + 1}. <${warning.tagName}> at ${warning.location}`);
            console.warn(`   💡 ${warning.suggestion}`);
            if (warning.elementRef) {
                console.warn(`   🔗 Element:`, warning.elementRef);
            }
        });
        console.log(`\n💡 Tip: Use the refresh button to highlight these elements in the UI`);
    }
    else {
        console.log('✅ No validation issues found! All elements are using semantic-ui-layer components.');
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
exports.SemanticProvider = SemanticProvider;
exports.StarIcon = StarIcon;
exports.StatusBadge = StatusBadge;
exports.Tbody = Tbody;
exports.Td = Td;
exports.Th = Th;
exports.Thead = Thead;
exports.Tr = Tr;
exports.clearValidationHighlights = clearValidationHighlights;
exports.generateAriaAttributes = generateAriaAttributes;
exports.generateComponentMetadata = generateComponentMetadata;
exports.generateKeyboardShortcuts = generateKeyboardShortcuts;
exports.highlightValidationWarnings = highlightValidationWarnings;
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
