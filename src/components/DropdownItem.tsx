import React from 'react';
import { DropdownItem as PFDropdownItem } from '@patternfly/react-core';
import { useSemanticContext } from '../context/SemanticContext';
import { SemanticComponentProps } from '../types';

interface DropdownItemProps extends SemanticComponentProps, React.ComponentProps<typeof PFDropdownItem> {
  // PatternFly DropdownItem props are inherited
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ 
  semanticName,
  semanticRole,
  aiMetadata,
  children,
  ...props 
}) => {
  const { getContextualName } = useSemanticContext();

  // Get contextual name - if no semanticName provided, use default "Action"
  // This will automatically become "menu Action" when inside a MenuToggle context
  const contextualName = getContextualName(semanticName || 'Action');

  return (
    <PFDropdownItem
      {...props}
      data-semantic-name={contextualName}
      data-semantic-role={semanticRole || 'menu-item'}
      data-ai-metadata={JSON.stringify(aiMetadata || {})}
    >
      {children}
    </PFDropdownItem>
  );
};
