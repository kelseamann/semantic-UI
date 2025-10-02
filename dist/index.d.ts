import React from 'react';
import { Button as Button$1, Card as Card$1, Modal as Modal$1, Checkbox as Checkbox$1 } from '@patternfly/react-core';
import { Th as Th$1, Td as Td$1, Thead as Thead$1, Tbody as Tbody$1 } from '@patternfly/react-table';

interface SemanticComponentProps {
    /** Human-readable semantic name for the component instance */
    semanticName?: string;
    /** Semantic role or purpose of the component */
    semanticRole?: string;
    /** Additional metadata for AI tooling */
    aiMetadata?: {
        description?: string;
        category?: string;
        complexity?: 'simple' | 'moderate' | 'complex';
        accessibility?: string[];
        usage?: string[];
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
    complexity: 'simple' | 'moderate' | 'complex';
    accessibility: string[];
    usage: string[];
    props: Record<string, unknown>;
}
type SemanticComponent<T = Record<string, unknown>> = React.ComponentType<T & SemanticComponentProps>;

interface ButtonProps extends Omit<React.ComponentProps<typeof Button$1>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic action this button performs (auto-inferred from variant if not provided) */
    action?: 'primary' | 'secondary' | 'destructive' | 'navigation' | 'toggle';
    /** Context of where this button is used (auto-inferred from props if not provided) */
    context?: 'form' | 'toolbar' | 'modal' | 'card' | 'navigation' | 'table' | 'alert';
}
/** Button - PatternFly Button wrapper with semantic metadata for AI tooling */
declare const Button: React.FC<ButtonProps>;

interface CardProps extends Omit<React.ComponentProps<typeof Card$1>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this card (auto-inferred from props if not provided) */
    purpose?: 'content-display' | 'data-summary' | 'action-panel' | 'information' | 'navigation';
    /** The type of content this card contains (auto-inferred from children if not provided) */
    contentType?: 'text' | 'data' | 'media' | 'mixed' | 'interactive';
}
/** Card - PatternFly Card wrapper with semantic metadata for AI tooling */
declare const Card: React.FC<CardProps>;

interface ModalProps extends Omit<React.ComponentProps<typeof Modal$1>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this modal (auto-inferred from variant if not provided) */
    purpose?: 'confirmation' | 'form' | 'information' | 'selection' | 'workflow';
    /** The type of interaction this modal facilitates (auto-inferred from props if not provided) */
    interactionType?: 'blocking' | 'non-blocking' | 'progressive' | 'multi-step';
}
/** Modal - PatternFly Modal wrapper with semantic metadata for AI tooling */
declare const Modal: React.ForwardRefExoticComponent<Omit<ModalProps, "ref"> & React.RefAttributes<any>>;

interface ThProps extends Omit<React.ComponentProps<typeof Th$1>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this table header (auto-inferred from props if not provided) */
    purpose?: 'column-header' | 'sortable-header' | 'selectable-header' | 'action-header';
    /** The data type this header represents (auto-inferred from content if not provided) */
    dataType?: 'text' | 'number' | 'date' | 'boolean' | 'action' | 'mixed';
}
/** Th - PatternFly Table Header wrapper with semantic metadata for AI tooling */
declare const Th: React.FC<ThProps>;

interface TdProps extends Omit<React.ComponentProps<typeof Td$1>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this table cell (auto-inferred from props if not provided) */
    purpose?: 'data-cell' | 'action-cell' | 'selectable-cell' | 'status-cell';
    /** The data type this cell contains (auto-inferred from content if not provided) */
    dataType?: 'text' | 'number' | 'date' | 'boolean' | 'action' | 'mixed';
}
/** Td - PatternFly Table Data wrapper with semantic metadata for AI tooling */
declare const Td: React.FC<TdProps>;

interface TheadProps extends Omit<React.ComponentProps<typeof Thead$1>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this table header section (auto-inferred from props if not provided) */
    purpose?: 'column-definition' | 'sortable-headers' | 'selectable-headers' | 'action-headers';
}
/** Thead - PatternFly Table Header wrapper with semantic metadata for AI tooling */
declare const Thead: React.FC<TheadProps>;

interface TbodyProps extends Omit<React.ComponentProps<typeof Tbody$1>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this table body section (auto-inferred from props if not provided) */
    purpose?: 'data-rows' | 'selectable-rows' | 'action-rows' | 'mixed-content';
}
/** Tbody - PatternFly Table Body wrapper with semantic metadata for AI tooling */
declare const Tbody: React.FC<TbodyProps>;

interface CheckboxProps extends Omit<React.ComponentProps<typeof Checkbox$1>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this checkbox (auto-inferred from props if not provided) */
    purpose?: 'selection' | 'toggle' | 'form-input' | 'filter';
    /** The context where this checkbox is used (auto-inferred from props if not provided) */
    context?: 'table' | 'form' | 'filter' | 'settings';
    /** Required id for PatternFly Checkbox */
    id: string;
}
/** Checkbox - PatternFly Checkbox wrapper with semantic metadata for AI tooling */
declare const Checkbox: React.FC<CheckboxProps>;

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this link (auto-inferred from props if not provided) */
    purpose?: 'navigation' | 'action' | 'download' | 'external' | 'launch';
    /** The context where this link is used (auto-inferred from props if not provided) */
    context?: 'table' | 'card' | 'navigation' | 'content';
}
/** Link - HTML anchor wrapper with semantic metadata for AI tooling */
declare const Link: React.FC<LinkProps>;

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this status badge (auto-inferred from content if not provided) */
    purpose?: 'status-indicator' | 'progress-indicator' | 'state-display' | 'alert-indicator';
    /** The status type (auto-inferred from content if not provided) */
    statusType?: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'ready';
}
/** StatusBadge - HTML span wrapper with semantic metadata for AI tooling */
declare const StatusBadge: React.FC<StatusBadgeProps>;

interface StarIconProps extends React.HTMLAttributes<HTMLButtonElement>, SemanticComponentProps {
    children?: React.ReactNode;
    /** Whether this star is favorited/active */
    isFavorited?: boolean;
    /** The semantic purpose of this star icon (auto-inferred from props if not provided) */
    purpose?: 'favorite-toggle' | 'rating' | 'bookmark' | 'highlight';
    /** The context where this star is used (auto-inferred from props if not provided) */
    context?: 'table' | 'card' | 'list' | 'content';
}
/** StarIcon - HTML button wrapper with semantic metadata for AI tooling */
declare const StarIcon: React.FC<StarIconProps>;

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

export { Button, Card, Checkbox, ComponentMetadata, Link, Modal, SemanticComponent, SemanticComponentProps, StarIcon, StatusBadge, Tbody, Td, Th, Thead, generateAriaAttributes, generateComponentMetadata, generateKeyboardShortcuts, mergeMetadata, useAccessibility, useSemanticMetadata, validateAccessibility, validateMetadata };
