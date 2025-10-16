import React from 'react';
import { DropdownItem as PFDropdownItem } from '@patternfly/react-core';
import { useSemanticContext } from '../../context/SemanticContext';
import { SemanticComponentProps } from '../../types';

interface DropdownItemProps extends SemanticComponentProps, React.ComponentProps<typeof PFDropdownItem> {
  // PatternFly DropdownItem props are inherited
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ 
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
    hierarchy = semanticContext.getHierarchy();
  } catch {
    hierarchy = { fullPath: '', qualifiedParents: [], wrappers: [], immediateParent: '', immediateWrapper: '', depth: 0 };
  }

  const componentName = semanticName || 'Action';
  const metadata = aiMetadata || {
    hierarchy,
    action: {
      type: 'menu-action',
      target: target || 'default'
    }
  };

  return (
    <PFDropdownItem
      {...props}
      data-semantic-name={componentName}
      data-semantic-path={hierarchy.fullPath ? `${hierarchy.fullPath} > ${componentName}` : componentName}
      data-parent={hierarchy.immediateParent || 'none'}
      data-wrapper={hierarchy.immediateWrapper || 'none'}
      data-num-parents={hierarchy.depth}
      data-semantic-role={semanticRole || 'menu-item'}
      data-ai-metadata={JSON.stringify(metadata)}
      data-target={target || 'default'}
    >
      {children}
    </PFDropdownItem>
  );
};
