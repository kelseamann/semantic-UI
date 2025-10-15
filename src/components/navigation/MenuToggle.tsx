import React from 'react';
import { MenuToggle as PFMenuToggle } from '@patternfly/react-core';
import { useSemanticContext } from '../../context/SemanticContext';
import { SemanticComponentProps } from '../../types';

interface MenuToggleProps extends SemanticComponentProps, React.ComponentProps<typeof PFMenuToggle> {
  // PatternFly MenuToggle props are inherited
}

export const MenuToggle: React.FC<MenuToggleProps> = ({ 
  semanticName,
  semanticRole,
  aiMetadata,
  target,
  children,
  ...props 
}) => {
  // Get hierarchy from context (optional)
  let hierarchy;
  try {
    const semanticContext = useSemanticContext();
    const { addContext, removeContext, getHierarchy } = semanticContext;
    
    // Add "menu" context when this component mounts/renders
    React.useEffect(() => {
      addContext('Menu');
      return () => removeContext();
    }, [addContext, removeContext]);
    
    hierarchy = getHierarchy();
  } catch {
    hierarchy = { parents: [], depth: 0, path: '' };
  }

  const componentName = semanticName || 'Toggle';
  const metadata = aiMetadata || {
    hierarchy,
    action: {
      type: 'toggle',
      target: target || 'menu'
    }
  };

  return (
    <PFMenuToggle
      {...props}
      data-semantic-name={componentName}
      data-semantic-path={hierarchy.path ? `${hierarchy.path} > ${componentName}` : componentName}
      data-semantic-hierarchy={JSON.stringify(hierarchy.parents)}
      data-semantic-role={semanticRole || 'menu-trigger'}
      data-ai-metadata={JSON.stringify(metadata)}
      data-target={target || 'menu'}
    >
      {children}
    </PFMenuToggle>
  );
};
