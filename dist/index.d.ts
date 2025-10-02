import React from 'react';
import { Button as Button$1, Card as Card$1, Modal as Modal$1 } from '@patternfly/react-core';

interface SemanticComponentProps {
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

interface ButtonProps extends React.ComponentProps<typeof Button$1>, SemanticComponentProps {
    /** The semantic action this button performs */
    action?: 'primary' | 'secondary' | 'destructive' | 'navigation' | 'toggle';
    /** Context of where this button is used */
    context?: 'form' | 'toolbar' | 'modal' | 'card' | 'navigation';
}
/** Button - PatternFly Button wrapper with semantic metadata for AI tooling */
declare const Button: React.FC<ButtonProps>;

interface CardProps extends Omit<React.ComponentProps<typeof Card$1>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this card */
    purpose?: 'content-display' | 'data-summary' | 'action-panel' | 'information' | 'navigation';
    /** The type of content this card contains */
    contentType?: 'text' | 'data' | 'media' | 'mixed' | 'interactive';
}
/** Card - PatternFly Card wrapper with semantic metadata for AI tooling */
declare const Card: React.FC<CardProps>;

interface ModalProps extends React.ComponentProps<typeof Modal$1>, SemanticComponentProps {
    /** The semantic purpose of this modal */
    purpose?: 'confirmation' | 'form' | 'information' | 'selection' | 'workflow';
    /** The type of interaction this modal facilitates */
    interactionType?: 'blocking' | 'non-blocking' | 'progressive' | 'multi-step';
}
/** Modal - PatternFly Modal wrapper with semantic metadata for AI tooling */
declare const Modal: React.ForwardRefExoticComponent<Omit<ModalProps, "ref"> & React.RefAttributes<any>>;

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

export { Button, Card, ComponentMetadata, Modal, SemanticComponent, SemanticComponentProps, generateAriaAttributes, generateComponentMetadata, generateKeyboardShortcuts, mergeMetadata, useAccessibility, useSemanticMetadata, validateAccessibility, validateMetadata };
