/**
 * Template for creating new semantic component wrappers
 * 
 * Usage: Copy this template and replace:
 * - {{ComponentName}} - PascalCase component name (e.g., TextInput)
 * - {{componentName}} - camelCase component name (e.g., textInput)
 * - {{CATEGORY}} - Component category (forms, navigation, data-display, feedback, layout, overlay)
 * - {{COMPLEXITY}} - simple | moderate | complex
 * - {{SEMANTIC_PROPS}} - Component-specific semantic props
 */

import React from 'react';
import { {{ComponentName}} as PF{{ComponentName}} } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';

export interface {{ComponentName}}Props 
  extends Omit<React.ComponentProps<typeof PF{{ComponentName}}>, 'children'>, 
  SemanticComponentProps {
  children?: React.ReactNode;
  
  // Add semantic-specific props here
  // Example:
  // /** The semantic purpose of this component */
  // purpose?: 'purpose1' | 'purpose2' | 'purpose3';
  // /** The context where this component is used */
  // context?: 'context1' | 'context2' | 'context3';
}

/**
 * {{ComponentName}} - PatternFly {{ComponentName}} wrapper with semantic metadata for AI tooling
 * 
 * @example
 * ```tsx
 * <{{ComponentName}} purpose="purpose1" context="context1">
 *   Content here
 * </{{ComponentName}}>
 * ```
 */
export const {{ComponentName}}: React.FC<{{ComponentName}}Props> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  // Add semantic props destructuring here
  // purpose,
  // context,
  children,
  ...props
}) => {
  // 1. Auto-infer semantic properties from PatternFly props
  // const inferredPurpose = purpose || inferFromProps(props);
  // const inferredContext = context || 'default';
  
  // 2. Generate semantic role and AI metadata
  const role = semanticRole || `{{componentName}}`;
  const metadata = aiMetadata || {
    description: `{{ComponentName}} component`,
    category: '{{CATEGORY}}',
    complexity: '{{COMPLEXITY}}',
    accessibility: ['keyboard-navigable'],
    usage: ['user-interface']
  };
  
  // 3. Default semantic name
  const defaultSemanticName = semanticName || '{{ComponentName}}';
  
  // 4. Render PatternFly component with semantic data attributes
  return (
    <PF{{ComponentName}}
      {...props}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
    >
      {children}
    </PF{{ComponentName}}>
  );
};

export default {{ComponentName}};

