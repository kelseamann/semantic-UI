import React from 'react';
import { SemanticComponentProps } from '../types';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic purpose of this link (auto-inferred from props if not provided) */
  purpose?: 'navigation' | 'action' | 'download' | 'external' | 'launch';
  /** The context where this link is used (auto-inferred from props if not provided) */
  context?: 'table' | 'card' | 'navigation' | 'content';
}

/** Link - HTML anchor wrapper with semantic metadata for AI tooling */
export const Link: React.FC<LinkProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  context,
  children,
  href,
  onClick,
  ...props
}) => {
  // Auto-infer semantic properties from props
  const inferredPurpose = purpose || (href?.startsWith('http') ? 'external' :
                                     href === '#' ? 'action' :
                                     href?.includes('download') ? 'download' :
                                     children?.toString().toLowerCase().includes('launch') ? 'launch' : 'navigation');

  const inferredContext = context || (onClick ? 'interactive' : 'content');

  // Generate semantic role and AI metadata
  const role = semanticRole || `link-${inferredPurpose}-${inferredContext}`;
  const metadata = aiMetadata || {
    description: `${inferredPurpose} link for ${inferredContext} context`,
    category: 'navigation',
    complexity: 'simple',
    usage: [`${inferredContext}-${inferredPurpose}`, 'user-interaction']
  };

  // Default semantic name if not provided
  const defaultSemanticName = semanticName || 'Link';

  return (
    <a
      {...props}
      href={href}
      onClick={onClick}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
      data-context={inferredContext}
    >
      {children}
    </a>
  );
};

export default Link;
