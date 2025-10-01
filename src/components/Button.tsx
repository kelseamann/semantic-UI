import React from 'react';
import { Button as PFButton, ButtonProps as PFButtonProps } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';

export interface SemanticButtonProps extends PFButtonProps, SemanticComponentProps {
  /** The semantic action this button performs */
  action?: 'primary' | 'secondary' | 'destructive' | 'navigation' | 'toggle';
  /** Context of where this button is used */
  context?: 'form' | 'toolbar' | 'modal' | 'card' | 'navigation';
}

/**
 * SemanticButton - A PatternFly Button wrapped with semantic meaning and AI metadata
 * 
 * This component enhances PatternFly's Button with:
 * - Semantic role identification for AI tooling
 * - Automatic accessibility enhancements
 * - Usage context metadata
 * - AI-friendly component descriptions
 */
export const SemanticButton: React.FC<SemanticButtonProps> = ({
  semanticRole,
  aiMetadata,
  accessibility,
  action = 'primary',
  context = 'form',
  children,
  ...props
}) => {
  // Generate semantic role if not provided
  const role = semanticRole || `button-${action}-${context}`;
  
  // Generate AI metadata if not provided
  const metadata = aiMetadata || {
    description: `${action} action button for ${context} context`,
    category: 'forms',
    complexity: 'simple',
    accessibility: ['keyboard-navigable', 'screen-reader-friendly'],
    usage: [`${context}-${action}`, 'user-interaction']
  };

  // Enhanced accessibility props
  const enhancedAccessibility = {
    'aria-label': accessibility?.ariaLabel || `${action} button`,
    'aria-describedby': accessibility?.ariaDescription,
    ...props
  };

  return (
    <PFButton
      {...enhancedAccessibility}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-action={action}
      data-context={context}
      {...props}
    >
      {children}
    </PFButton>
  );
};

export default SemanticButton;
