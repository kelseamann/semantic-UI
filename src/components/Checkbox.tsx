import React from 'react';
import { Checkbox as PFCheckbox } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';

export interface CheckboxProps extends Omit<React.ComponentProps<typeof PFCheckbox>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic purpose of this checkbox (auto-inferred from props if not provided) */
  purpose?: 'selection' | 'toggle' | 'form-input' | 'filter';
  /** The context where this checkbox is used (auto-inferred from props if not provided) */
  context?: 'table' | 'form' | 'filter' | 'settings';
  /** Required id for PatternFly Checkbox */
  id: string;
}

/** Checkbox - PatternFly Checkbox wrapper with semantic metadata for AI tooling */
export const Checkbox: React.FC<CheckboxProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  context,
  children,
  isChecked,
  onChange,
  id,
  ...props
}) => {
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
  const defaultSemanticName = semanticName || 'Checkbox';

  return (
    <PFCheckbox
      {...props}
      id={id}
      isChecked={isChecked}
      onChange={onChange}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
      data-context={inferredContext}
    >
      {children}
    </PFCheckbox>
  );
};

export default Checkbox;
