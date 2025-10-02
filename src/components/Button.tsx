import React from 'react';
import { Button as PFButton } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';

export interface ButtonProps extends Omit<React.ComponentProps<typeof PFButton>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic action this button performs (auto-inferred from variant if not provided) */
  action?: 'primary' | 'secondary' | 'destructive' | 'navigation' | 'toggle';
  /** Context of where this button is used (auto-inferred from props if not provided) */
  context?: 'form' | 'toolbar' | 'modal' | 'card' | 'navigation' | 'table' | 'alert';
}

/** Button - PatternFly Button wrapper with semantic metadata for AI tooling */
export const Button: React.FC<ButtonProps> = ({
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

  return (
    <PFButton
      {...props}
      variant={variant}
      onClick={onClick}
      isDisabled={isDisabled}
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
