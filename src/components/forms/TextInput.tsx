import React from 'react';
import { TextInput as PFTextInput } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
import { 
  inferInputPurpose, 
  inferFormContext, 
  inferValidationContext,
  generateMetadataFromProps 
} from '../../utils/inference';

export interface TextInputProps 
  extends Omit<React.ComponentProps<typeof PFTextInput>, 'children'>, 
  SemanticComponentProps {
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
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  context,
  validationContext,
  type = 'text',
  validated,
  isRequired,
  ...props
}, ref) => {
  // 1. Auto-infer semantic properties from PatternFly props
  const inferredPurpose = purpose || inferInputPurpose(type);
  const inferredContext = context || inferFormContext();
  const inferredValidation = validationContext || inferValidationContext(isRequired);
  
  // 2. Generate semantic role and AI metadata
  const role = semanticRole || `textinput-${inferredPurpose}-${inferredContext}`;
  const metadata = aiMetadata || {
    ...generateMetadataFromProps('TextInput', { type, validated, isRequired, ...props }),
    description: `${inferredPurpose} for ${inferredContext} context`,
    usage: ['data-entry', 'form-input', 'user-interaction']
  };
  
  // 3. Default semantic name
  const defaultSemanticName = semanticName || 'TextInput';
  
  // 4. Render PatternFly component with semantic data attributes
  return (
    <PFTextInput
      {...props}
      ref={ref}
      type={type}
      validated={validated}
      isRequired={isRequired}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
      data-context={inferredContext}
      data-validation-context={inferredValidation}
    />
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;

