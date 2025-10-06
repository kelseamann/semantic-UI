import React from 'react';
import { MenuToggle as PFMenuToggle } from '@patternfly/react-core';
import { useSemanticContext } from '../context/SemanticContext';
import { SemanticComponentProps } from '../types';

interface MenuToggleProps extends SemanticComponentProps, React.ComponentProps<typeof PFMenuToggle> {
  // PatternFly MenuToggle props are inherited
}

export const MenuToggle: React.FC<MenuToggleProps> = ({ 
  semanticName,
  semanticRole,
  aiMetadata,
  children,
  ...props 
}) => {
  const { addContext, removeContext, getContextualName } = useSemanticContext();

  // Add "menu" context when this component mounts/renders
  React.useEffect(() => {
    addContext('menu');
    return () => removeContext();
  }, [addContext, removeContext]);

  // Get contextual name - if no semanticName provided, use default "Toggle"
  const contextualName = getContextualName(semanticName || 'Toggle');

  return (
    <PFMenuToggle
      {...props}
      data-semantic-name={contextualName}
      data-semantic-role={semanticRole || 'menu-trigger'}
      data-ai-metadata={JSON.stringify(aiMetadata || {})}
    >
      {children}
    </PFMenuToggle>
  );
};
