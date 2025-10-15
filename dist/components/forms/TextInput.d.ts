import React from 'react';
import { TextInput as PFTextInput } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
export interface TextInputProps extends Omit<React.ComponentProps<typeof PFTextInput>, 'children'>, SemanticComponentProps {
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
export declare const TextInput: React.ForwardRefExoticComponent<Omit<TextInputProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
export default TextInput;
//# sourceMappingURL=TextInput.d.ts.map