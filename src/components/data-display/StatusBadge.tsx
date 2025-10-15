import React from 'react';
import { SemanticComponentProps } from '../../types';
import { inferStatusBadgeType, inferStatusBadgePurpose } from '../../utils/inference';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic purpose of this status badge (auto-inferred from content if not provided) */
  purpose?: 'status-indicator' | 'progress-indicator' | 'state-display' | 'alert-indicator';
  /** The status type (auto-inferred from content if not provided) */
  statusType?: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'ready';
}

/** StatusBadge - HTML span wrapper with semantic metadata for AI tooling */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  statusType,
  children,
  ...props
}) => {
  // Auto-infer semantic properties from content
  const content = children?.toString();
  const inferredStatusType = statusType || inferStatusBadgeType(content);
  const inferredPurpose = purpose || inferStatusBadgePurpose();

  // Generate semantic role and AI metadata
  const role = semanticRole || `status-badge-${inferredPurpose}-${inferredStatusType}`;
  const metadata = aiMetadata || {
    description: `${inferredPurpose} showing ${inferredStatusType} status`,
    category: 'data-display',
    complexity: 'simple',
    usage: [`${inferredPurpose}`, 'status-display', 'state-indication']
  };

  // Default semantic name if not provided
  const defaultSemanticName = semanticName || 'Row Item';

  return (
    <span
      {...props}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
      data-status-type={inferredStatusType}
    >
      {children}
    </span>
  );
};

export default StatusBadge;
