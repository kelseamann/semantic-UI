import React from 'react';
import { Tbody as PFTbody } from '@patternfly/react-table';
import { SemanticComponentProps } from '../types';

export interface TbodyProps extends Omit<React.ComponentProps<typeof PFTbody>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic purpose of this table body section (auto-inferred from props if not provided) */
  purpose?: 'data-rows' | 'selectable-rows' | 'action-rows' | 'mixed-content';
}

/** Tbody - PatternFly Table Body wrapper with semantic metadata for AI tooling */
export const Tbody: React.FC<TbodyProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  children,
  ...props
}) => {
  // Auto-infer semantic properties from children content
  const inferredPurpose = purpose || (React.Children.toArray(children).some(child => 
    React.isValidElement(child) && React.Children.toArray(child.props?.children).some(cell => 
      React.isValidElement(cell) && cell.props?.children?.toString().toLowerCase().includes('select'))) ? 'selectable-rows' :
    React.Children.toArray(children).some(child => 
      React.isValidElement(child) && React.Children.toArray(child.props?.children).some(cell => 
        React.isValidElement(cell) && cell.props?.children?.toString().toLowerCase().includes('action'))) ? 'action-rows' :
    React.Children.toArray(children).some(child => 
      React.isValidElement(child) && React.Children.toArray(child.props?.children).some(cell => 
        React.isValidElement(cell) && typeof cell.props?.children === 'object')) ? 'mixed-content' : 'data-rows');
  
  // Generate semantic role and AI metadata
  const role = semanticRole || `table-body-section-${inferredPurpose}`;
  const metadata = aiMetadata || {
    description: `Table body section with ${inferredPurpose}`,
    category: 'data-display',
    complexity: 'moderate',
    usage: [`table-${inferredPurpose}`, 'data-presentation', 'row-content']
  };

  // Default semantic name if not provided
  const defaultSemanticName = semanticName || 'Body Section';

  return (
    <PFTbody
      {...props}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
    >
      {children}
    </PFTbody>
  );
};

export default Tbody;
