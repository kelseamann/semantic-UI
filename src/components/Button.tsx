import React from 'react';
import { Button as PFButton } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';
import { useSemanticContext } from '../context/SemanticContext';

export interface ButtonProps extends Omit<React.ComponentProps<typeof PFButton>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic action this button performs (auto-inferred from variant if not provided) */
  action?: 'primary' | 'secondary' | 'destructive' | 'navigation' | 'toggle';
  /** Context of where this button is used (auto-inferred from props if not provided) */
  context?: 'form' | 'toolbar' | 'modal' | 'card' | 'navigation' | 'table' | 'alert';
}

/** Button - PatternFly Button wrapper with semantic metadata for AI tooling */
export const Button: React.FC<ButtonProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  action,
  context,
  children,
  variant,
  onClick,
  isDisabled,
  ...props
}) => {
  const { getContextualName } = useSemanticContext();

  // Auto-infer semantic properties from PatternFly props
  const inferredAction = action || (variant === 'primary' ? 'primary' : 
                                   variant === 'danger' ? 'destructive' : 
                                   variant === 'link' ? 'navigation' : 'secondary');
  
  const inferredContext = context || (onClick ? 'interactive' : 'form');
  
  // Generate semantic role and AI metadata
  const role = semanticRole || `button-${inferredAction}-${inferredContext}`;
  const metadata = aiMetadata || {
    description: `${inferredAction} action button for ${inferredContext} context`,
    category: 'forms',
    complexity: 'simple',
    usage: [`${inferredContext}-${inferredAction}`, 'user-interaction']
  };

  // Get contextual name - if no semanticName provided, use default "Button"
  // This will automatically become "menu Button" when inside a MenuToggle context
  const contextualName = getContextualName(semanticName || 'Button');

  return (
    <PFButton
      {...props}
      variant={variant}
      onClick={onClick}
      isDisabled={isDisabled}
      data-semantic-name={contextualName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-action={inferredAction}
      data-context={inferredContext}
    >
      {children}
    </PFButton>
  );
};

export default Button;
