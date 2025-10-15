import React from 'react';
import { Radio as PFRadio } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
import { 
  inferRadioPurpose,
  inferRadioGroupContext,
  inferFormContext,
  generateMetadataFromProps 
} from '../../utils/inference';

export interface RadioProps 
  extends Omit<React.ComponentProps<typeof PFRadio>, 'children' | 'ref'>, 
  SemanticComponentProps {
  children?: React.ReactNode;
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
export const Radio: React.FC<RadioProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  context,
  groupContext,
  name,
  isChecked,
  isDisabled,
  children,
  ...props
}) => {
  // 1. Auto-infer semantic properties
  const inferredPurpose = purpose || inferRadioPurpose();
  const inferredContext = context || inferFormContext();
  const inferredGroupContext = groupContext || inferRadioGroupContext(name);
  
  // 2. Generate semantic role and AI metadata
  const role = semanticRole || `radio-${inferredPurpose}-${inferredContext}`;
  const metadata = aiMetadata || {
    ...generateMetadataFromProps('Radio', { name, isChecked, isDisabled, ...props }),
    description: `${inferredPurpose} radio button in ${inferredGroupContext} group for ${inferredContext}`,
    usage: ['user-selection', 'form-input', 'user-interaction']
  };
  
  // 3. Default semantic name
  const defaultSemanticName = semanticName || 'Radio';
  
  // 4. Render PatternFly component with semantic data attributes
  return (
    <PFRadio
      {...props}
      name={name}
      isChecked={isChecked}
      isDisabled={isDisabled}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
      data-context={inferredContext}
      data-group-context={inferredGroupContext}
    >
      {children}
    </PFRadio>
  );
};

export default Radio;

