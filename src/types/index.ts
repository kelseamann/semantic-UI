// Semantic UI Layer Types
import React from 'react';

export interface HierarchyMetadata {
  parents: string[];
  depth: number;
  path: string;
}

export interface ActionMetadata {
  type: string;
  target?: string;
  consequence?: string;
  affectsParent?: boolean;
}

export interface SemanticComponentProps {
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

export interface ComponentMetadata {
  name: string;
  description: string;
  category: 'layout' | 'navigation' | 'forms' | 'data-display' | 'feedback' | 'overlay';
  accessibility: string[];
  usage: string[];
  props: Record<string, unknown>;
  hierarchy?: HierarchyMetadata;
  action?: ActionMetadata;
}

export type SemanticComponent<T = Record<string, unknown>> = React.ComponentType<T & SemanticComponentProps>;
