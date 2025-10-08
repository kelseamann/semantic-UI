import React from 'react';
import { Tr as PFTr } from '@patternfly/react-table';
import { SemanticComponentProps } from '../types';

export interface TrProps extends Omit<React.ComponentProps<typeof PFTr>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic purpose of this table row (auto-inferred from props if not provided) */
  purpose?: 'data-row' | 'header-row' | 'selectable-row' | 'expandable-row' | 'action-row';
  /** The interaction type for this row (auto-inferred from props if not provided) */
  interactionType?: 'clickable' | 'selectable' | 'expandable' | 'static';
  /** The row state (auto-inferred from props if not provided) */
  rowState?: 'normal' | 'selected' | 'expanded' | 'disabled' | 'highlighted';
}

/** Tr - PatternFly Table Row wrapper with semantic metadata for AI tooling */
export const Tr: React.FC<TrProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  interactionType,
  rowState,
  children,
  isClickable,
  isSelectable,
  isExpanded,
  isDisabled,
  isStriped,
  ...props
}) => {
  // Auto-infer semantic properties from PatternFly props and content
  const inferredPurpose = purpose || (
    React.Children.toArray(children).some(child =>
      React.isValidElement(child) && 
      React.Children.toArray(child.props?.children).some(cell =>
        React.isValidElement(cell) && cell.type?.toString().includes('Th')
      )
    ) ? 'header-row' :
    React.Children.toArray(children).some(child =>
      React.isValidElement(child) && 
      React.Children.toArray(child.props?.children).some(cell =>
        React.isValidElement(cell) && cell.type?.toString().includes('Checkbox')
      )
    ) ? 'selectable-row' :
    isExpanded ? 'expandable-row' :
    React.Children.toArray(children).some(child =>
      React.isValidElement(child) && 
      React.Children.toArray(child.props?.children).some(cell =>
        React.isValidElement(cell) && cell.type?.toString().includes('Button')
      )
    ) ? 'action-row' : 'data-row'
  );
  
  const inferredInteractionType = interactionType || (
    isClickable ? 'clickable' :
    isSelectable ? 'selectable' :
    isExpanded !== undefined ? 'expandable' :
    'static'
  );
  
  const inferredRowState = rowState || (
    isDisabled ? 'disabled' :
    isExpanded ? 'expanded' :
    isSelectable ? 'selected' :
    isStriped ? 'highlighted' :
    'normal'
  );
  
  // Generate semantic role and AI metadata
  const role = semanticRole || `table-row-${inferredPurpose}-${inferredInteractionType}`;
  const metadata = aiMetadata || {
    description: `${inferredPurpose} with ${inferredInteractionType} interaction`,
    category: 'data-display',
    complexity: inferredInteractionType === 'static' ? 'simple' : 'medium',
    usage: [`table-${inferredPurpose}`, 'row-interaction', 'data-presentation'],
    interactionType: inferredInteractionType,
    rowState: inferredRowState,
    isStriped: isStriped || false
  };

  // Default semantic name if not provided
  const defaultSemanticName = semanticName || 'Table Row';

  return (
    <PFTr
      {...props}
      isClickable={isClickable}
      isSelectable={isSelectable}
      isExpanded={isExpanded}
      isDisabled={isDisabled}
      isStriped={isStriped}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
      data-interaction-type={inferredInteractionType}
      data-row-state={inferredRowState}
    >
      {children}
    </PFTr>
  );
};

export default Tr;



