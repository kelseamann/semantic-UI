import React from 'react';
import { Card as PFCard } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
import { inferCardPurpose, inferCardContentType, inferCategory } from '../../utils/inference';
import { useSemanticContext } from '../../context/SemanticContext';

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
  // Register as wrapper (not a visual parent) in semantic context
  const { addContext, removeContext } = useSemanticContext();
  
  React.useEffect(() => {
    addContext('Card', false);  // false = wrapper (always visible)
    return () => removeContext();
  }, [addContext, removeContext]);

  // Get hierarchy from context
  let hierarchy;
  try {
    const semanticContext = useSemanticContext();
    hierarchy = semanticContext.getHierarchy();
  } catch {
    hierarchy = { fullPath: '', qualifiedParents: [], wrappers: [], immediateParent: '', immediateWrapper: '', depth: 0 };
  }

  // Auto-infer semantic properties from PatternFly props and children
  const inferredPurpose = purpose || inferCardPurpose({ isSelectable, isClickable });
  const inferredContentType = contentType || inferCardContentType();
  
  // Generate semantic role
  const role = semanticRole || `card-${inferredPurpose}-${inferredContentType}`;

  // Default semantic name if not provided
  const componentName = semanticName || 'Card';

  return (
    <PFCard
      {...props}
      isSelectable={isSelectable}
      isClickable={isClickable}
      data-semantic-name={componentName}
      data-semantic-path={hierarchy.fullPath ? `${hierarchy.fullPath} > ${componentName}` : componentName}
      data-parent={hierarchy.immediateParent || 'none'}
      data-wrapper={hierarchy.immediateWrapper || 'none'}
      data-num-parents={hierarchy.depth}
      data-semantic-role={role}
      data-purpose={inferredPurpose}
      data-content-type={inferredContentType}
    >
      {children}
    </PFCard>
  );
};

export default Card;
