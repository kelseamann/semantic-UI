import React from 'react';
import { SemanticComponentProps } from '../types';
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this status badge (auto-inferred from content if not provided) */
    purpose?: 'status-indicator' | 'progress-indicator' | 'state-display' | 'alert-indicator';
    /** The status type (auto-inferred from content if not provided) */
    statusType?: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'ready';
}
/** StatusBadge - HTML span wrapper with semantic metadata for AI tooling */
export declare const StatusBadge: React.FC<StatusBadgeProps>;
export default StatusBadge;
//# sourceMappingURL=StatusBadge.d.ts.map