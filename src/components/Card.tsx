import React from 'react';
import { Card as PFCard, CardProps as PFCardProps } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';

export interface SemanticCardProps extends PFCardProps, SemanticComponentProps {
  /** The semantic purpose of this card */
  purpose?: 'content-display' | 'data-summary' | 'action-panel' | 'information' | 'navigation';
  /** The type of content this card contains */
  contentType?: 'text' | 'data' | 'media' | 'mixed' | 'interactive';
}

/**
 * SemanticCard - A PatternFly Card wrapped with semantic meaning and AI metadata
 * 
 * This component enhances PatternFly's Card with:
 * - Semantic purpose identification for AI tooling
 * - Content type metadata for better understanding
 * - Automatic accessibility enhancements
 * - AI-friendly component descriptions
 */
export const SemanticCard: React.FC<SemanticCardProps> = ({
  semanticRole,
  aiMetadata,
  accessibility,
  purpose = 'content-display',
  contentType = 'mixed',
  children,
  ...props
}) => {
  // Generate semantic role if not provided
  const role = semanticRole || `card-${purpose}-${contentType}`;
  
  // Generate AI metadata if not provided
  const metadata = aiMetadata || {
    description: `${purpose} card containing ${contentType} content`,
    category: 'data-display',
    complexity: 'moderate',
    accessibility: ['keyboard-navigable', 'screen-reader-friendly'],
    usage: [`${purpose}-display`, 'content-organization']
  };

  // Enhanced accessibility props
  const enhancedAccessibility = {
    'aria-label': accessibility?.ariaLabel || `${purpose} card`,
    'aria-describedby': accessibility?.ariaDescription,
    role: 'region',
    ...props
  };

  return (
    <PFCard
      {...enhancedAccessibility}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={purpose}
      data-content-type={contentType}
      {...props}
    >
      {children}
    </PFCard>
  );
};

export default SemanticCard;
