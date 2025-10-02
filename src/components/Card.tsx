import React from 'react';
import { Card as PFCard } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';

export interface CardProps extends Omit<React.ComponentProps<typeof PFCard>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic purpose of this card */
  purpose?: 'content-display' | 'data-summary' | 'action-panel' | 'information' | 'navigation';
  /** The type of content this card contains */
  contentType?: 'text' | 'data' | 'media' | 'mixed' | 'interactive';
}

/** Card - PatternFly Card wrapper with semantic metadata for AI tooling */
export const Card: React.FC<CardProps> = ({
  semanticRole,
  aiMetadata,
  purpose = 'content-display',
  contentType = 'mixed',
  children,
  ...props
}) => {
  // Generate semantic role and AI metadata if not provided
  const role = semanticRole || `card-${purpose}-${contentType}`;
  const metadata = aiMetadata || {
    description: `${purpose} card containing ${contentType} content`,
    category: 'data-display',
    complexity: 'moderate',
    accessibility: ['keyboard-navigable', 'screen-reader-friendly'],
    usage: [`${purpose}-display`, 'content-organization']
  };

  return (
    <PFCard
      {...props}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={purpose}
      data-content-type={contentType}
    >
      {children}
    </PFCard>
  );
};

export default Card;
