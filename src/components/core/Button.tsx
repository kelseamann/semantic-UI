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
    hierarchy = { fullPath: '', qualifiedParents: [], wrappers: [], immediateParent: '', immediateWrapper: '', depth: 0 };
  }

  // Auto-infer semantic properties from PatternFly props
  const inferredAction = inferButtonAction(variant, props.href as string, onClick, target);
  const actionType = action || inferredAction.type;
  const actionVariant = inferredAction.variant;
  const inferredContext = context || inferContext({ onClick, isDisabled, ...props });
  
  // Generate semantic role (combines category, action, context into one)
  const role = semanticRole || `button-${actionType}-${inferredContext}`;
  
  // Generate semantic name: wrapper > parent > action type
  // Button acts on wrapper (if exists), otherwise parent, otherwise standalone
  const componentName = semanticName || (() => {
    // Format action type: "action" → "Action", "navigation" → "Navigation", "external" → "External Link"
    // Treat "default" as "Action"
    let actionLabel;
    if (actionType === 'default') {
      actionLabel = 'Action';
    } else if (actionType === 'external') {
      actionLabel = 'External Link';
    } else {
      actionLabel = actionType.charAt(0).toUpperCase() + actionType.slice(1);
    }
    
    // Priority: wrapper (immediate context) > parent > standalone
    if (hierarchy.immediateWrapper) {
      return `${hierarchy.immediateWrapper} ${actionLabel}`;
    } else if (hierarchy.immediateParent) {
      return `${hierarchy.immediateParent} ${actionLabel}`;
    }
    
    // Otherwise just the action label
    return actionLabel;
  })();
  const description = `${actionType} button (${actionVariant} style) for ${inferredContext} context`;
  const consequence = actionVariant === 'destructive' ? 'destructive-permanent' : 'safe';
  const affectsParent = target === 'parent-modal' || target === 'parent-form';

  return (
    <PFButton
      {...props}
      variant={variant}
      onClick={onClick}
      isDisabled={isDisabled}
      data-semantic-name={componentName}
      data-semantic-path={hierarchy.fullPath ? `${hierarchy.fullPath} > ${componentName}` : componentName}
      data-parent={hierarchy.immediateParent || 'none'}
      data-wrapper={hierarchy.immediateWrapper || 'none'}
      data-num-parents={hierarchy.depth}
      data-semantic-role={role}
      data-description={description}
      data-action-variant={actionVariant}
      data-target={target || 'default'}
      data-consequence={consequence}
      data-affects-parent={affectsParent}
    >
      {children}
    </PFButton>
  );
};

export default Button;
