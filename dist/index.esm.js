import { jsx } from 'react/jsx-runtime';
import React, { createContext, useContext, useState } from 'react';
import { Button as Button$1, Card as Card$1, Modal as Modal$1, Flex as Flex$1, FlexItem as FlexItem$1, Checkbox as Checkbox$1, MenuToggle as MenuToggle$1, DropdownItem as DropdownItem$1 } from '@patternfly/react-core';
import { Th as Th$1, Td as Td$1, Tr as Tr$1, Thead as Thead$1, Tbody as Tbody$1 } from '@patternfly/react-table';

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
    return (jsx(Button$1, { ...props, variant: variant, onClick: onClick, isDisabled: isDisabled, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-action": inferredAction, "data-context": inferredContext, children: children }));
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
    return (jsx(Card$1, { ...props, isSelectable: isSelectable, isClickable: isClickable, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-content-type": inferredContentType, children: children }));
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
    return (jsx(Modal$1, { ...props, ref: ref, variant: variant, isOpen: isOpen, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-interaction-type": inferredInteractionType, children: children }));
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
    return (jsx(Flex$1, { ...props, direction: direction, justifyContent: justifyContent, alignItems: alignItems, alignSelf: alignSelf, flex: flex, spaceItems: spaceItems, gap: gap, columnGap: columnGap, rowGap: rowGap, order: order, component: component, display: display, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-layout-type": inferredLayoutType, "data-alignment-context": inferredAlignmentContext, children: children }));
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
    return (jsx(FlexItem$1, { ...props, flex: flex, align: align, alignSelf: alignSelf, spacer: spacer, order: order, component: component, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-content-type": inferredContentType, "data-positioning-context": inferredPositioningContext, "data-sizing-behavior": inferredSizingBehavior, children: children }));
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
    return (jsx(Th$1, { ...props, sort: sort, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-data-type": inferredDataType, children: children }));
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
    return (jsx(Td$1, { ...props, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-data-type": inferredDataType, children: children }));
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
    return (jsx(Tr$1, { ...props, isClickable: isClickable, isSelectable: isSelectable, isExpanded: isExpanded, isDisabled: isDisabled, isStriped: isStriped, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-interaction-type": inferredInteractionType, "data-row-state": inferredRowState, children: children }));
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
    return (jsx(Thead$1, { ...props, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, children: children }));
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
    return (jsx(Tbody$1, { ...props, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, children: children }));
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
    return (jsx(Checkbox$1, { ...props, id: id, isChecked: isChecked, onChange: onChange, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-context": inferredContext, children: children }));
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
    return (jsx("a", { ...props, href: href, onClick: onClick, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-context": inferredContext, children: children }));
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
    return (jsx("span", { ...props, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-status-type": inferredStatusType, children: children }));
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
    return (jsx("span", { ...props, onClick: onClick, "data-semantic-name": defaultSemanticName, "data-semantic-role": role, "data-ai-metadata": JSON.stringify(metadata), "data-purpose": inferredPurpose, "data-context": inferredContext, "data-is-favorited": isFavorited, children: children }));
};

const SemanticContext = createContext(undefined);
const useSemanticContext = () => {
    const context = useContext(SemanticContext);
    if (!context) {
        throw new Error('useSemanticContext must be used within a SemanticProvider');
    }
    return context;
};
const SemanticProvider = ({ children }) => {
    const [contextStack, setContextStack] = useState([]);
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
    return (jsx(SemanticContext.Provider, { value: {
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
    return (jsx(MenuToggle$1, { ...props, "data-semantic-name": contextualName, "data-semantic-role": semanticRole || 'menu-trigger', "data-ai-metadata": JSON.stringify(aiMetadata || {}), children: children }));
};

const DropdownItem = ({ semanticName, semanticRole, aiMetadata, children, ...props }) => {
    const { getContextualName } = useSemanticContext();
    // Get contextual name - if no semanticName provided, use default "Action"
    // This will automatically become "menu Action" when inside a MenuToggle context
    const contextualName = getContextualName(semanticName || 'Action');
    return (jsx(DropdownItem$1, { ...props, "data-semantic-name": contextualName, "data-semantic-role": semanticRole || 'menu-item', "data-ai-metadata": JSON.stringify(aiMetadata || {}), children: children }));
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

export { Button, Card, Checkbox, DropdownItem, Flex, FlexItem, Link, MenuToggle, Modal, SemanticProvider, StarIcon, StatusBadge, Tbody, Td, Th, Thead, Tr, clearValidationHighlights, generateAriaAttributes, generateComponentMetadata, generateKeyboardShortcuts, highlightValidationWarnings, logValidationResults, mergeMetadata, runSemanticValidation, useAccessibility, useSemanticContext, useSemanticMetadata, validateAccessibility, validateMetadata, validateSemanticUsage };
//# sourceMappingURL=index.esm.js.map
