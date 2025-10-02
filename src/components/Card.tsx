import React from 'react';
import { Card as PFCard } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';

export interface CardProps extends Omit<React.ComponentProps<typeof PFCard>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic purpose of this card (auto-inferred from props if not provided) */
  purpose?: 'content-display' | 'data-summary' | 'action-panel' | 'information' | 'navigation';
  /** The type of content this card contains (auto-inferred from children if not provided) */
  contentType?: 'text' | 'data' | 'media' | 'mixed' | 'interactive';
}

/** Card - PatternFly Card wrapper with semantic metadata for AI tooling */
export const Card: React.FC<CardProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  contentType,
  children,
  isSelectable,
  isClickable,
  ...props
}) => {
  // Auto-infer semantic properties from PatternFly props and children
  const inferredPurpose = purpose || (isSelectable || isClickable ? 'action-panel' : 'content-display');
  
  // Simple content type inference based on children
  const inferredContentType = contentType || 'mixed';
  
  // Generate semantic role and AI metadata
  const role = semanticRole || `card-${inferredPurpose}-${inferredContentType}`;
  const metadata = aiMetadata || {
    description: `${inferredPurpose} card containing ${inferredContentType} content`,
    category: 'data-display',
    complexity: 'moderate',
    usage: [`${inferredPurpose}-display`, 'content-organization']
  };

  // Default semantic name if not provided
  const defaultSemanticName = semanticName || 'Card';

  return (
    <PFCard
      {...props}
      isSelectable={isSelectable}
      isClickable={isClickable}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
      data-content-type={inferredContentType}
    >
      {children}
    </PFCard>
  );
};

export default Card;
