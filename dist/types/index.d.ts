import React from 'react';
export interface SemanticComponentProps {
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
export interface ComponentMetadata {
    name: string;
    description: string;
    category: 'layout' | 'navigation' | 'forms' | 'data-display' | 'feedback' | 'overlay';
    complexity: 'simple' | 'moderate' | 'complex';
    accessibility: string[];
    usage: string[];
    props: Record<string, unknown>;
}
export type SemanticComponent<T = Record<string, unknown>> = React.ComponentType<T & SemanticComponentProps>;
//# sourceMappingURL=index.d.ts.map