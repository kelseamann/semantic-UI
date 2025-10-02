import React from 'react';
import { Thead as PFThead } from '@patternfly/react-table';
import { SemanticComponentProps } from '../types';

export interface TheadProps extends Omit<React.ComponentProps<typeof PFThead>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic purpose of this table header section (auto-inferred from props if not provided) */
  purpose?: 'column-definition' | 'sortable-headers' | 'selectable-headers' | 'action-headers';
}

/** Thead - PatternFly Table Header wrapper with semantic metadata for AI tooling */
export const Thead: React.FC<TheadProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  children,
  ...props
}) => {
  // Auto-infer semantic properties from children content
  const inferredPurpose = purpose || (React.Children.toArray(children).some(child => 
    React.isValidElement(child) && child.props?.sort) ? 'sortable-headers' :
    React.Children.toArray(children).some(child => 
      React.isValidElement(child) && child.props?.children?.toString().toLowerCase().includes('select')) ? 'selectable-headers' :
    React.Children.toArray(children).some(child => 
      React.isValidElement(child) && child.props?.children?.toString().toLowerCase().includes('action')) ? 'action-headers' : 'column-definition');
  
  // Generate semantic role and AI metadata
  const role = semanticRole || `table-header-section-${inferredPurpose}`;
  const metadata = aiMetadata || {
    description: `Table header section with ${inferredPurpose}`,
    category: 'data-display',
    complexity: 'moderate',
    usage: [`table-${inferredPurpose}`, 'data-organization', 'column-structure']
  };

  // Default semantic name if not provided
  const defaultSemanticName = semanticName || 'Table Header Section';

  return (
    <PFThead
      {...props}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
    >
      {children}
    </PFThead>
  );
};

export default Thead;
