import React from 'react';
import { Th as PFTh } from '@patternfly/react-table';
import { SemanticComponentProps } from '../types';

export interface ThProps extends Omit<React.ComponentProps<typeof PFTh>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic purpose of this table header (auto-inferred from props if not provided) */
  purpose?: 'column-header' | 'sortable-header' | 'selectable-header' | 'action-header';
  /** The data type this header represents (auto-inferred from content if not provided) */
  dataType?: 'text' | 'number' | 'date' | 'boolean' | 'action' | 'mixed';
}

/** Th - PatternFly Table Header wrapper with semantic metadata for AI tooling */
export const Th: React.FC<ThProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  dataType,
  children,
  sort,
  ...props
}) => {
  // Auto-infer semantic properties from PatternFly props
  const inferredPurpose = purpose || (sort ? 'sortable-header' : 
                                     children?.toString().toLowerCase().includes('select') ? 'selectable-header' :
                                     children?.toString().toLowerCase().includes('action') ? 'action-header' : 'column-header');
  
  // Simple data type inference based on content
  const inferredDataType = dataType || (children?.toString().toLowerCase().includes('date') ? 'date' :
                                       children?.toString().toLowerCase().includes('id') || 
                                       children?.toString().toLowerCase().includes('count') ? 'number' :
                                       children?.toString().toLowerCase().includes('action') ? 'action' : 'text');
  
  // Generate semantic role and AI metadata
  const role = semanticRole || `table-header-${inferredPurpose}-${inferredDataType}`;
  const metadata = aiMetadata || {
    description: `${inferredPurpose} for ${inferredDataType} data`,
    category: 'data-display',
    complexity: 'simple',
    usage: [`table-${inferredPurpose}`, 'data-organization', 'column-definition']
  };

  // Default semantic name if not provided
  const defaultSemanticName = semanticName || 'Header';

  return (
    <PFTh
      {...props}
      sort={sort}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
      data-data-type={inferredDataType}
    >
      {children}
    </PFTh>
  );
};

export default Th;
