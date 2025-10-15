import React from 'react';
import { Select as PFSelect } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
import { 
  inferSelectPurpose,
  inferSelectSelectionType,
  inferFormContext,
  generateMetadataFromProps 
} from '../../utils/inference';

export interface SelectProps 
  extends Omit<React.ComponentProps<typeof PFSelect>, 'children'>, 
  SemanticComponentProps {
  children?: React.ReactNode;
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
export const Select: React.FC<SelectProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  context,
  selectionType,
  variant,
  children,
  ...props
}) => {
  // 1. Auto-infer semantic properties
  const inferredPurpose = purpose || inferSelectPurpose();
  const inferredContext = context || inferFormContext();
  const inferredSelectionType = selectionType || inferSelectSelectionType(variant);
  
  // 2. Generate semantic role and AI metadata
  const role = semanticRole || `select-${inferredPurpose}-${inferredContext}`;
  const metadata = aiMetadata || {
    ...generateMetadataFromProps('Select', { variant, ...props }),
    description: `${inferredPurpose} select with ${inferredSelectionType} selection for ${inferredContext}`,
    usage: ['data-entry', 'user-selection', 'user-interaction']
  };
  
  // 3. Default semantic name
  const defaultSemanticName = semanticName || 'Select';
  
  // 4. Render PatternFly component with semantic data attributes
  return (
    <PFSelect
      {...props}
      variant={variant}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
      data-context={inferredContext}
      data-selection-type={inferredSelectionType}
    >
      {children}
    </PFSelect>
  );
};

export default Select;

