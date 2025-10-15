import React from 'react';
import { Td as PFTd } from '@patternfly/react-table';
import { SemanticComponentProps } from '../../types';

export interface TdProps extends Omit<React.ComponentProps<typeof PFTd>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic purpose of this table cell (auto-inferred from props if not provided) */
  purpose?: 'data-cell' | 'action-cell' | 'selectable-cell' | 'status-cell';
  /** The data type this cell contains (auto-inferred from content if not provided) */
  dataType?: 'text' | 'number' | 'date' | 'boolean' | 'action' | 'mixed';
}

/** Td - PatternFly Table Data wrapper with semantic metadata for AI tooling */
export const Td: React.FC<TdProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  dataType,
  children,
  ...props
}) => {
  // Auto-infer semantic properties from PatternFly props and content
  const inferredPurpose = purpose || (React.Children.toArray(children).some(child => 
    React.isValidElement(child) && child.type?.toString().includes('Button')) ? 'action-cell' :
    React.Children.toArray(children).some(child => 
      React.isValidElement(child) && child.type?.toString().includes('Checkbox')) ? 'selectable-cell' :
    children?.toString().toLowerCase().includes('status') ? 'status-cell' : 'data-cell');
  
  // Simple data type inference based on content
  const inferredDataType = dataType || (typeof children === 'number' ? 'number' :
                                       children?.toString().match(/^\d{4}-\d{2}-\d{2}/) ? 'date' :
                                       children?.toString().toLowerCase() === 'true' || 
                                       children?.toString().toLowerCase() === 'false' ? 'boolean' :
                                       React.Children.toArray(children).some(child => 
                                         React.isValidElement(child) && child.type?.toString().includes('Button')) ? 'action' : 'text');
  
  // Generate semantic role and AI metadata
  const role = semanticRole || `table-cell-${inferredPurpose}-${inferredDataType}`;
  const metadata = aiMetadata || {
    description: `${inferredPurpose} containing ${inferredDataType} data`,
    category: 'data-display',
    complexity: 'simple',
    usage: [`table-${inferredPurpose}`, 'data-presentation', 'row-content']
  };

  // Default semantic name if not provided
  const defaultSemanticName = semanticName || 'Row Item';

  return (
    <PFTd
      {...props}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
      data-data-type={inferredDataType}
    >
      {children}
    </PFTd>
  );
};

export default Td;
