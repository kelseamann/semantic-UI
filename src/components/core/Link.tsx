import React from 'react';
import { SemanticComponentProps } from '../../types';
import { inferLinkPurpose, inferContext, inferCategory } from '../../utils/inference';
import { useSemanticContext } from '../../context/SemanticContext';

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'target'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic purpose of this link (auto-inferred from props if not provided) */
  purpose?: 'navigation' | 'action' | 'download' | 'external' | 'launch';
  /** The context where this link is used (auto-inferred from props if not provided) */
  context?: 'table' | 'card' | 'navigation' | 'content';
  /** HTML target attribute (_blank, _self, etc) */
  htmlTarget?: string;
}

/** Link - HTML anchor wrapper with semantic metadata for AI tooling */
export const Link: React.FC<LinkProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  context,
  target,
  htmlTarget,
  children,
  href,
  onClick,
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

  // Auto-infer semantic properties from props
  const inferredPurpose = purpose || inferLinkPurpose(href, children);
  const inferredContext = context || (onClick ? inferContext({ onClick }) : 'content');
  const componentName = semanticName || 'Link';

  // Generate semantic role and AI metadata
  const role = semanticRole || `link-${inferredPurpose}-${inferredContext}`;
  const metadata = aiMetadata || {
    description: `${inferredPurpose} link for ${inferredContext} context`,
    category: inferCategory('Link'),
    usage: [`${inferredContext}-${inferredPurpose}`, 'user-interaction'],
    hierarchy,
    action: {
      type: inferredPurpose,
      target: target || 'default'
    }
  };

  return (
    <a
      {...props}
      href={href}
      onClick={onClick}
      target={htmlTarget}
      data-semantic-name={componentName}
      data-semantic-path={hierarchy.path ? `${hierarchy.path} > ${componentName}` : componentName}
      data-semantic-hierarchy={JSON.stringify(hierarchy.parents)}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
      data-target={target || 'default'}
      data-context={inferredContext}
    >
      {children}
    </a>
  );
};

export default Link;
