// Semantic UI Layer Types
export interface SemanticComponentProps {
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
  props: Record<string, any>;
}

export type SemanticComponent<T = {}> = React.ComponentType<T & SemanticComponentProps>;
