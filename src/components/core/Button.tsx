import React from 'react';
import { Button as PFButton } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
import { inferButtonAction, inferContext, inferCategory } from '../../utils/inference';
import { useSemanticContext } from '../../context/SemanticContext';

export interface ButtonProps extends Omit<React.ComponentProps<typeof PFButton>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic action this button performs (auto-inferred from variant if not provided) */
  action?: 'primary' | 'secondary' | 'destructive' | 'navigation' | 'toggle';
  /** Context of where this button is used (auto-inferred from props if not provided) */
  context?: 'form' | 'toolbar' | 'modal' | 'card' | 'navigation' | 'table' | 'alert';
}

/** Button - PatternFly Button wrapper with semantic metadata for AI tooling */
export const Button: React.FC<ButtonProps> = ({
  semanticRole,
  aiMetadata,
  action,
  context,
  target,
  semanticName,
  children,
  variant,
  onClick,
  isDisabled,
  ...props
}) => {
  // Get hierarchy from context (optional - gracefully handles no provider)
  let hierarchy;
  try {
    const semanticContext = useSemanticContext();
    hierarchy = semanticContext.getHierarchy();
  } catch {
    hierarchy = { parents: [], depth: 0, path: '' };
  }

  // Auto-infer semantic properties from PatternFly props
  const inferredAction = inferButtonAction(variant, props.href as string, onClick, target);
  const actionType = action || inferredAction.type;
  const actionVariant = inferredAction.variant;
  const inferredContext = context || inferContext({ onClick, isDisabled, ...props });
  const componentName = semanticName || 'Button';
  
  // Generate semantic role and queryable data attributes
  const role = semanticRole || `button-${actionType}-${inferredContext}`;
  const category = inferCategory('Button');
  const description = `${actionType} action button (${actionVariant} style) for ${inferredContext} context`;
  const consequence = actionVariant === 'destructive' ? 'destructive-permanent' : 'safe';
  const affectsParent = target === 'parent-modal' || target === 'parent-form';

  return (
    <PFButton
      {...props}
      variant={variant}
      onClick={onClick}
      isDisabled={isDisabled}
      data-semantic-name={componentName}
      data-semantic-path={hierarchy.path ? `${hierarchy.path} > ${componentName}` : componentName}
      data-semantic-hierarchy={JSON.stringify(hierarchy.parents)}
      data-hierarchy-depth={hierarchy.depth}
      data-semantic-role={role}
      data-category={category}
      data-description={description}
      data-action-type={actionType}
      data-action-variant={actionVariant}
      data-target={target || 'default'}
      data-consequence={consequence}
      data-affects-parent={affectsParent}
      data-context={inferredContext}
    >
      {children}
    </PFButton>
  );
};

export default Button;
