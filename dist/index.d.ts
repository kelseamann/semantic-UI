import React$1, { ReactNode } from 'react';
import { Button as Button$1, Checkbox as Checkbox$1, TextInput as TextInput$1, TextArea as TextArea$1, Select as Select$1, Radio as Radio$1, Switch as Switch$1, Card as Card$1, Flex as Flex$1, FlexItem as FlexItem$1, Modal as Modal$1, MenuToggle as MenuToggle$1, DropdownItem as DropdownItem$1 } from '@patternfly/react-core';
import { Tbody as Tbody$1, Td as Td$1, Th as Th$1, Thead as Thead$1, Tr as Tr$1 } from '@patternfly/react-table';

interface HierarchyMetadata {
    parents: string[];
    depth: number;
    path: string;
}
interface ActionMetadata {
    type: string;
    target?: string;
    consequence?: string;
    affectsParent?: boolean;
}
interface SemanticComponentProps {
    /** Human-readable semantic name for the component instance */
    semanticName?: string;
    /** Semantic role or purpose of the component */
    semanticRole?: string;
    /** What this component acts upon */
    target?: string;
    /** Additional metadata for AI tooling */
    aiMetadata?: {
        description?: string;
        category?: string;
        accessibility?: string[];
        usage?: string[];
        hierarchy?: HierarchyMetadata;
        action?: ActionMetadata;
    };
    /** Accessibility enhancements */
    accessibility?: {
        ariaLabel?: string;
        ariaDescription?: string;
        keyboardShortcuts?: string[];
    };
}
interface ComponentMetadata {
    name: string;
    description: string;
    category: 'layout' | 'navigation' | 'forms' | 'data-display' | 'feedback' | 'overlay';
    accessibility: string[];
    usage: string[];
    props: Record<string, unknown>;
    hierarchy?: HierarchyMetadata;
    action?: ActionMetadata;
}
type SemanticComponent<T = Record<string, unknown>> = React$1.ComponentType<T & SemanticComponentProps>;

interface ButtonProps extends Omit<React$1.ComponentProps<typeof Button$1>, 'children'>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** The semantic action this button performs (auto-inferred from variant if not provided) */
    action?: 'primary' | 'secondary' | 'destructive' | 'navigation' | 'toggle';
    /** Context of where this button is used (auto-inferred from props if not provided) */
    context?: 'form' | 'toolbar' | 'modal' | 'card' | 'navigation' | 'table' | 'alert';
}
/** Button - PatternFly Button wrapper with semantic metadata for AI tooling */
declare const Button: React$1.FC<ButtonProps>;

interface LinkProps extends Omit<React$1.AnchorHTMLAttributes<HTMLAnchorElement>, 'target'>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** The semantic purpose of this link (auto-inferred from props if not provided) */
    purpose?: 'navigation' | 'action' | 'download' | 'external' | 'launch';
    /** The context where this link is used (auto-inferred from props if not provided) */
    context?: 'table' | 'card' | 'navigation' | 'content';
    /** HTML target attribute (_blank, _self, etc) */
    htmlTarget?: string;
}
/** Link - HTML anchor wrapper with semantic metadata for AI tooling */
declare const Link: React$1.FC<LinkProps>;

interface StarIconProps extends React$1.HTMLAttributes<HTMLSpanElement>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** Whether this star is favorited/active */
    isFavorited?: boolean;
    /** The semantic purpose of this star icon (auto-inferred from props if not provided) */
    purpose?: 'favorite-toggle' | 'rating' | 'bookmark' | 'highlight';
    /** The context where this star is used (auto-inferred from props if not provided) */
    context?: 'table' | 'card' | 'list' | 'content';
}
/** StarIcon - HTML span wrapper with semantic metadata for AI tooling */
declare const StarIcon: React$1.FC<StarIconProps>;

interface CheckboxProps extends Omit<React$1.ComponentProps<typeof Checkbox$1>, 'children'>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** The semantic purpose of this checkbox (auto-inferred from props if not provided) */
    purpose?: 'selection' | 'toggle' | 'form-input' | 'filter';
    /** The context where this checkbox is used (auto-inferred from props if not provided) */
    context?: 'table' | 'form' | 'filter' | 'settings';
    /** Required id for PatternFly Checkbox */
    id: string;
}
/** Checkbox - PatternFly Checkbox wrapper with semantic metadata for AI tooling */
declare const Checkbox: React$1.FC<CheckboxProps>;

interface TextInputProps extends Omit<React$1.ComponentProps<typeof TextInput$1>, 'children'>, SemanticComponentProps {
    /** The semantic purpose of this input field */
    purpose?: 'text-input' | 'email-input' | 'password-input' | 'search-input' | 'phone-input' | 'url-input' | 'numeric-input';
    /** The context where this input is used */
    context?: 'form' | 'search' | 'filter' | 'inline-edit' | 'settings';
    /** Validation context for semantic understanding */
    validationContext?: 'required' | 'optional' | 'conditional';
}
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
declare const TextInput: React$1.ForwardRefExoticComponent<Omit<TextInputProps, "ref"> & React$1.RefAttributes<HTMLInputElement>>;

interface TextAreaProps extends Omit<React$1.ComponentProps<typeof TextArea$1>, 'children'>, SemanticComponentProps {
    /** The semantic purpose of this textarea */
    purpose?: 'comment' | 'description' | 'note' | 'message' | 'feedback' | 'content';
    /** The context where this textarea is used */
    context?: 'form' | 'comment-section' | 'message-box' | 'editor' | 'settings';
    /** Expected content type */
    contentType?: 'plain-text' | 'formatted-text' | 'code' | 'markdown';
}
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
declare const TextArea: React$1.ForwardRefExoticComponent<Omit<TextAreaProps, "ref"> & React$1.RefAttributes<HTMLTextAreaElement>>;

interface SelectProps extends Omit<React$1.ComponentProps<typeof Select$1>, 'children'>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** The semantic purpose of this select */
    purpose?: 'category-selection' | 'filter' | 'setting' | 'navigation' | 'data-entry';
    /** The context where this select is used */
    context?: 'form' | 'toolbar' | 'filter-bar' | 'settings' | 'navigation';
    /** Selection behavior */
    selectionType?: 'single' | 'multiple' | 'typeahead';
}
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
declare const Select: React$1.FC<SelectProps>;

interface RadioProps extends Omit<React$1.ComponentProps<typeof Radio$1>, 'children' | 'ref'>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** The semantic purpose of this radio button */
    purpose?: 'option-selection' | 'preference' | 'setting' | 'filter' | 'answer';
    /** The context where this radio is used */
    context?: 'form' | 'settings' | 'filter' | 'survey' | 'quiz';
    /** The group this radio belongs to */
    groupContext?: string;
}
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
declare const Radio: React$1.FC<RadioProps>;

interface SwitchProps extends Omit<React$1.ComponentProps<typeof Switch$1>, 'children' | 'ref'>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** The semantic purpose of this switch */
    purpose?: 'feature-toggle' | 'setting' | 'preference' | 'filter' | 'mode-switch';
    /** The context where this switch is used */
    context?: 'settings' | 'toolbar' | 'card' | 'table-row' | 'form';
    /** What is being toggled */
    toggleTarget?: 'feature' | 'visibility' | 'mode' | 'status' | 'permission';
}
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
declare const Switch: React$1.FC<SwitchProps>;

interface CardProps extends Omit<React$1.ComponentProps<typeof Card$1>, 'children'>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** The semantic purpose of this card (auto-inferred from props if not provided) */
    purpose?: 'content-display' | 'data-summary' | 'action-panel' | 'information' | 'navigation';
    /** The type of content this card contains (auto-inferred from children if not provided) */
    contentType?: 'text' | 'data' | 'media' | 'mixed' | 'interactive';
}
/** Card - PatternFly Card wrapper with semantic metadata for AI tooling */
declare const Card: React$1.FC<CardProps>;

interface StatusBadgeProps extends React$1.HTMLAttributes<HTMLSpanElement>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** The semantic purpose of this status badge (auto-inferred from content if not provided) */
    purpose?: 'status-indicator' | 'progress-indicator' | 'state-display' | 'alert-indicator';
    /** The status type (auto-inferred from content if not provided) */
    statusType?: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'ready';
}
/** StatusBadge - HTML span wrapper with semantic metadata for AI tooling */
declare const StatusBadge: React$1.FC<StatusBadgeProps>;

interface TbodyProps extends Omit<React$1.ComponentProps<typeof Tbody$1>, 'children'>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** The semantic purpose of this table body section (auto-inferred from props if not provided) */
    purpose?: 'data-rows' | 'selectable-rows' | 'action-rows' | 'mixed-content';
}
/** Tbody - PatternFly Table Body wrapper with semantic metadata for AI tooling */
declare const Tbody: React$1.FC<TbodyProps>;

interface TdProps extends Omit<React$1.ComponentProps<typeof Td$1>, 'children'>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** The semantic purpose of this table cell (auto-inferred from props if not provided) */
    purpose?: 'data-cell' | 'action-cell' | 'selectable-cell' | 'status-cell';
    /** The data type this cell contains (auto-inferred from content if not provided) */
    dataType?: 'text' | 'number' | 'date' | 'boolean' | 'action' | 'mixed';
}
/** Td - PatternFly Table Data wrapper with semantic metadata for AI tooling */
declare const Td: React$1.FC<TdProps>;

interface ThProps extends Omit<React$1.ComponentProps<typeof Th$1>, 'children'>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** The semantic purpose of this table header (auto-inferred from props if not provided) */
    purpose?: 'column-header' | 'sortable-header' | 'selectable-header' | 'action-header';
    /** The data type this header represents (auto-inferred from content if not provided) */
    dataType?: 'text' | 'number' | 'date' | 'boolean' | 'action' | 'mixed';
}
/** Th - PatternFly Table Header wrapper with semantic metadata for AI tooling */
declare const Th: React$1.FC<ThProps>;

interface TheadProps extends Omit<React$1.ComponentProps<typeof Thead$1>, 'children'>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** The semantic purpose of this table header section (auto-inferred from props if not provided) */
    purpose?: 'column-definition' | 'sortable-headers' | 'selectable-headers' | 'action-headers';
}
/** Thead - PatternFly Table Header wrapper with semantic metadata for AI tooling */
declare const Thead: React$1.FC<TheadProps>;

interface TrProps extends Omit<React$1.ComponentProps<typeof Tr$1>, 'children'>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** The semantic purpose of this table row (auto-inferred from props if not provided) */
    purpose?: 'data-row' | 'header-row' | 'selectable-row' | 'expandable-row' | 'action-row';
    /** The interaction type for this row (auto-inferred from props if not provided) */
    interactionType?: 'clickable' | 'selectable' | 'expandable' | 'static';
    /** The row state (auto-inferred from props if not provided) */
    rowState?: 'normal' | 'selected' | 'expanded' | 'disabled' | 'highlighted';
}
/** Tr - PatternFly Table Row wrapper with semantic metadata for AI tooling */
declare const Tr: React$1.FC<TrProps>;

interface FlexProps extends Omit<React$1.ComponentProps<typeof Flex$1>, 'children'>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** The layout purpose of this flex container (auto-inferred from props if not provided) */
    purpose?: 'layout' | 'navigation' | 'toolbar' | 'form' | 'content' | 'action-group';
    /** The layout type (auto-inferred from direction if not provided) */
    layoutType?: 'row' | 'column' | 'responsive';
    /** The alignment context (auto-inferred from props if not provided) */
    alignmentContext?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
}
/** Flex - PatternFly Flex wrapper with semantic metadata for AI tooling */
declare const Flex: React$1.FC<FlexProps>;

interface FlexItemProps extends Omit<React$1.ComponentProps<typeof FlexItem$1>, 'children'>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** The content type of this flex item (auto-inferred from props if not provided) */
    contentType?: 'text' | 'button' | 'icon' | 'form-control' | 'media' | 'navigation' | 'action';
    /** The positioning context (auto-inferred from props if not provided) */
    positioningContext?: 'start' | 'center' | 'end' | 'stretch' | 'baseline' | 'auto';
    /** The sizing behavior (auto-inferred from flex prop if not provided) */
    sizingBehavior?: 'fixed' | 'flexible' | 'grow' | 'shrink' | 'auto';
}
/** FlexItem - PatternFly FlexItem wrapper with semantic metadata for AI tooling */
declare const FlexItem: React$1.FC<FlexItemProps>;

interface ModalProps extends Omit<React$1.ComponentProps<typeof Modal$1>, 'children'>, SemanticComponentProps {
    children?: React$1.ReactNode;
    /** The semantic purpose of this modal (auto-inferred from variant if not provided) */
    purpose?: 'confirmation' | 'form' | 'information' | 'selection' | 'workflow';
    /** The type of interaction this modal facilitates (auto-inferred from props if not provided) */
    interactionType?: 'blocking' | 'non-blocking' | 'progressive' | 'multi-step';
}
/** Modal - PatternFly Modal wrapper with semantic metadata for AI tooling */
declare const Modal: React$1.ForwardRefExoticComponent<Omit<ModalProps, "ref"> & React$1.RefAttributes<any>>;

interface MenuToggleProps extends SemanticComponentProps, React$1.ComponentProps<typeof MenuToggle$1> {
}
declare const MenuToggle: React$1.FC<MenuToggleProps>;

interface DropdownItemProps extends SemanticComponentProps, React$1.ComponentProps<typeof DropdownItem$1> {
}
declare const DropdownItem: React$1.FC<DropdownItemProps>;

/**
 * Utility functions for managing component metadata
 */
/**
 * Generates default metadata for a component based on its type and props
 */
declare const generateComponentMetadata: (componentName: string, props?: Record<string, unknown>) => ComponentMetadata;
/**
 * Validates component metadata
 */
declare const validateMetadata: (metadata: ComponentMetadata) => boolean;
/**
 * Merges user-provided metadata with defaults
 */
declare const mergeMetadata: (userMetadata: Partial<ComponentMetadata>, defaultMetadata: ComponentMetadata) => ComponentMetadata;

/**
 * Accessibility utility functions
 */
/**
 * Generates ARIA attributes based on component context
 */
declare const generateAriaAttributes: (componentType: string) => Record<string, string>;
/**
 * Validates accessibility requirements
 */
declare const validateAccessibility: (componentType: string, props: Record<string, unknown>) => string[];
/**
 * Generates keyboard shortcuts metadata
 */
declare const generateKeyboardShortcuts: (componentType: string, context?: Record<string, unknown>) => string[];

/**
 * Semantic UI Layer Validation Utility
 *
 * This utility helps developers identify when they're using native HTML elements
 * instead of semantic-ui-layer components, which prevents semantic metadata from being applied.
 */
interface ValidationWarning {
    element: string;
    tagName: string;
    suggestion: string;
    location?: string;
    elementRef?: HTMLElement;
    semanticAlternative?: string;
    canAutoReplace?: boolean;
}
interface ValidationResult {
    warnings: ValidationWarning[];
    summary: {
        totalElements: number;
        semanticElements: number;
        nativeElements: number;
        warningsCount: number;
    };
}
/**
 * Validates the current DOM for semantic-ui-layer components being used
 * This detects when semantic components are being used and shows their semantic names
 */
declare const validateSemanticUsage: () => ValidationResult;
/**
 * Highlights elements that have validation warnings
 */
declare const highlightValidationWarnings: (warnings: ValidationWarning[]) => void;
/**
 * Removes validation highlights from all elements
 */
declare const clearValidationHighlights: () => void;
/**
 * Logs validation results to the console with helpful formatting
 */
declare const logValidationResults: (result: ValidationResult) => void;
/**
 * Main validation function that runs the complete validation process
 */
declare const runSemanticValidation: (highlightWarnings?: boolean) => ValidationResult;

/**
 * Inference utilities for automatically determining semantic properties
 * from PatternFly component props
 */
/**
 * Determine if a component is a visual parent (requires user action to see contents)
 * vs a wrapper/structure (always visible)
 */
declare const isVisualParent: (componentName: string) => boolean;
/**
 * Infer button action from PatternFly variant and props
 * Returns both behavior (what it does) and styling (how it looks)
 */
declare const inferButtonAction: (variant?: string, href?: string, onClick?: unknown, target?: string) => {
    type: string;
    variant: string;
};
/**
 * Infer input purpose from type
 */
declare const inferInputPurpose: (type?: string) => string;
/**
 * Infer alert severity
 */
declare const inferAlertSeverity: (variant?: string) => string;
/**
 * Infer context from parent or usage
 */
declare const inferContext: (props: Record<string, unknown>) => string;
/**
 * Infer card purpose from props
 */
declare const inferCardPurpose: (props: Record<string, unknown>) => string;
/**
 * Infer modal purpose from props
 */
declare const inferModalPurpose: (props: Record<string, unknown>) => string;
/**
 * Infer accessibility features from props
 */
declare const inferAccessibilityFeatures: (props: Record<string, unknown>) => string[];
/**
 * Infer usage patterns from component type and props
 */
declare const inferUsagePatterns: (componentType: string, props: Record<string, unknown>) => string[];
/**
 * Generate comprehensive metadata from props
 */
declare const generateMetadataFromProps: (componentName: string, props: Record<string, unknown>) => {
    description: string;
    category: string;
    accessibility: string[];
    usage: string[];
};
/**
 * Infer card content type
 */
declare const inferCardContentType: () => string;
/**
 * Infer modal interaction type
 */
declare const inferModalInteractionType: (isOpen?: boolean) => string;
/**
 * Infer select purpose
 */
declare const inferSelectPurpose: () => string;
/**
 * Infer select selection type
 */
declare const inferSelectSelectionType: (variant?: string) => string;
/**
 * Infer radio purpose
 */
declare const inferRadioPurpose: () => string;
/**
 * Infer radio group context
 */
declare const inferRadioGroupContext: (name?: string) => string;
/**
 * Infer switch purpose
 */
declare const inferSwitchPurpose: () => string;
/**
 * Infer switch toggle target
 */
declare const inferSwitchToggleTarget: () => string;
/**
 * Infer textarea purpose
 */
declare const inferTextAreaPurpose: () => string;
/**
 * Infer textarea content type
 */
declare const inferTextAreaContentType: () => string;
/**
 * Infer checkbox purpose
 */
declare const inferCheckboxPurpose: (isChecked?: boolean) => string;
/**
 * Infer link purpose
 */
declare const inferLinkPurpose: (href?: string, children?: React.ReactNode) => string;
/**
 * Infer star icon purpose
 */
declare const inferStarIconPurpose: (isFavorited?: boolean) => string;
/**
 * Infer validation context
 */
declare const inferValidationContext: (isRequired?: boolean) => string;
/**
 * Infer form context (default for most form components)
 */
declare const inferFormContext: () => string;
/**
 * Infer settings context (default for switches)
 */
declare const inferSettingsContext: () => string;
/**
 * Infer status badge type from content
 */
declare const inferStatusBadgeType: (content?: string) => string;
/**
 * Infer status badge purpose
 */
declare const inferStatusBadgePurpose: () => string;
/**
 * Infer category from component name
 * Category describes WHAT the component IS, not what it DOES (that's the action)
 */
declare const inferCategory: (componentName: string) => string;

/**
 * Hook for managing semantic metadata for components
 */
declare const useSemanticMetadata: (componentName: string, userMetadata?: Partial<ComponentMetadata>, props?: Record<string, unknown>) => {
    metadata: ComponentMetadata;
    updateMetadata: (updates: Partial<ComponentMetadata>) => void;
};

/**
 * Hook for managing accessibility features
 */
declare const useAccessibility: (componentType: string, props?: Record<string, unknown>, context?: Record<string, unknown>) => {
    ariaAttributes: Record<string, string>;
    keyboardShortcuts: string[];
    accessibilityIssues: string[];
    enhancedProps: {
        'data-keyboard-shortcuts': string;
        'data-accessibility-issues': string;
    };
};

interface HierarchyData {
    fullPath: string;
    qualifiedParents: string[];
    wrappers: string[];
    immediateParent: string;
    immediateWrapper: string;
    depth: number;
}
interface ContextItem {
    name: string;
    isQualified: boolean;
}
interface SemanticContextType {
    contextStack: ContextItem[];
    addContext: (context: string, isQualified?: boolean) => void;
    removeContext: () => void;
    getHierarchy: () => HierarchyData;
    clearContext: () => void;
}
declare const useSemanticContext: () => SemanticContextType;
interface SemanticProviderProps {
    children: ReactNode;
}
declare const SemanticProvider: React$1.FC<SemanticProviderProps>;

export { ActionMetadata, Button, ButtonProps, Card, CardProps, Checkbox, CheckboxProps, ComponentMetadata, DropdownItem, Flex, FlexItem, FlexItemProps, FlexProps, HierarchyData, HierarchyMetadata, Link, LinkProps, MenuToggle, Modal, ModalProps, Radio, RadioProps, Select, SelectProps, SemanticComponent, SemanticComponentProps, SemanticProvider, StarIcon, StarIconProps, StatusBadge, StatusBadgeProps, Switch, SwitchProps, Tbody, TbodyProps, Td, TdProps, TextArea, TextAreaProps, TextInput, TextInputProps, Th, ThProps, Thead, TheadProps, Tr, TrProps, ValidationResult, ValidationWarning, clearValidationHighlights, generateAriaAttributes, generateComponentMetadata, generateKeyboardShortcuts, generateMetadataFromProps, highlightValidationWarnings, inferAccessibilityFeatures, inferAlertSeverity, inferButtonAction, inferCardContentType, inferCardPurpose, inferCategory, inferCheckboxPurpose, inferContext, inferFormContext, inferInputPurpose, inferLinkPurpose, inferModalInteractionType, inferModalPurpose, inferRadioGroupContext, inferRadioPurpose, inferSelectPurpose, inferSelectSelectionType, inferSettingsContext, inferStarIconPurpose, inferStatusBadgePurpose, inferStatusBadgeType, inferSwitchPurpose, inferSwitchToggleTarget, inferTextAreaContentType, inferTextAreaPurpose, inferUsagePatterns, inferValidationContext, isVisualParent, logValidationResults, mergeMetadata, runSemanticValidation, useAccessibility, useSemanticContext, useSemanticMetadata, validateAccessibility, validateMetadata, validateSemanticUsage };
