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
export declare const Link: React.FC<LinkProps>;
export default Link;
//# sourceMappingURL=Link.d.ts.map