import React from 'react';
import { SemanticComponentProps } from '../types';

export interface StarIconProps extends React.HTMLAttributes<HTMLButtonElement>, SemanticComponentProps {
  children?: React.ReactNode;
  /** Whether this star is favorited/active */
  isFavorited?: boolean;
  /** The semantic purpose of this star icon (auto-inferred from props if not provided) */
  purpose?: 'favorite-toggle' | 'rating' | 'bookmark' | 'highlight';
  /** The context where this star is used (auto-inferred from props if not provided) */
  context?: 'table' | 'card' | 'list' | 'content';
}

/** StarIcon - HTML button wrapper with semantic metadata for AI tooling */
export const StarIcon: React.FC<StarIconProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  context,
  children,
  isFavorited,
  onClick,
  ...props
}) => {
  // Auto-infer semantic properties from props
  const inferredPurpose = purpose || (isFavorited !== undefined ? 'favorite-toggle' : 'rating');
  
  const inferredContext = context || (onClick ? 'interactive' : 'display');

  // Generate semantic role and AI metadata
  const role = semanticRole || `star-icon-${inferredPurpose}-${inferredContext}`;
  const metadata = aiMetadata || {
    description: `${inferredPurpose} star icon for ${inferredContext} context`,
    category: 'forms',
    complexity: 'simple',
    usage: [`${inferredContext}-${inferredPurpose}`, 'user-interaction']
  };

  // Default semantic name if not provided
  const defaultSemanticName = semanticName || 'Star';

  return (
    <button
      {...props}
      onClick={onClick}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
      data-context={inferredContext}
      data-is-favorited={isFavorited}
    >
      {children}
    </button>
  );
};

export default StarIcon;
