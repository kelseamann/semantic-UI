import React from 'react';
import { Button as PFButton } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';

export interface ButtonProps extends React.ComponentProps<typeof PFButton>, SemanticComponentProps {
  /** The semantic action this button performs */
  action?: 'primary' | 'secondary' | 'destructive' | 'navigation' | 'toggle';
  /** Context of where this button is used */
  context?: 'form' | 'toolbar' | 'modal' | 'card' | 'navigation' | 'table' | 'alert';
}

/** Button - PatternFly Button wrapper with semantic metadata for AI tooling */
export const Button: React.FC<ButtonProps> = ({
  semanticRole,
  aiMetadata,
  action = 'primary',
  context = 'form',
  children,
  ...props
}) => {
  // Generate semantic role and AI metadata if not provided
  const role = semanticRole || `button-${action}-${context}`;
  const metadata = aiMetadata || {
    description: `${action} action button for ${context} context`,
    category: 'forms',
    complexity: 'simple',
    accessibility: ['keyboard-navigable', 'screen-reader-friendly'],
    usage: [`${context}-${action}`, 'user-interaction']
  };

  return (
    <PFButton
      {...props}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-action={action}
      data-context={context}
    >
      {children}
    </PFButton>
  );
};

export default Button;
