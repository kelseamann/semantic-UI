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
      addContext('Menu');  // Auto-detected as non-qualified (wrapper)
      return () => removeContext();
    }, [addContext, removeContext]);
    
    hierarchy = getHierarchy();
  } catch {
    hierarchy = { fullPath: '', qualifiedParents: [], wrappers: [], immediateParent: '', immediateWrapper: '', depth: 0 };
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
      data-semantic-path={hierarchy.fullPath ? `${hierarchy.fullPath} > ${componentName}` : componentName}
      data-parent={hierarchy.immediateParent || 'none'}
      data-wrapper={hierarchy.immediateWrapper || 'none'}
      data-num-parents={hierarchy.depth}
      data-semantic-role={semanticRole || 'menu-trigger'}
      data-ai-metadata={JSON.stringify(metadata)}
      data-target={target || 'menu'}
    >
      {children}
    </PFMenuToggle>
  );
};
