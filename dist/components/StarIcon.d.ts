import React from 'react';
import { SemanticComponentProps } from '../types';
export interface StarIconProps extends React.HTMLAttributes<HTMLButtonElement>, SemanticComponentProps {
    children?: React.ReactNode;
    /** Whether this star is favorited/active */
    isFavorited?: boolean;
    /** The semantic purpose of this star icon (auto-inferred from props if not provided) */
    purpose?: 'favorite-toggle' | 'rating' | 'bookmark' | 'highlight';
    /** The context where this star is used (auto-inferred from props if not provided) */
    context?: 'table' | 'card' | 'list' | 'content';
}
/** StarIcon - HTML button wrapper with semantic metadata for AI tooling */
export declare const StarIcon: React.FC<StarIconProps>;
export default StarIcon;
//# sourceMappingURL=StarIcon.d.ts.map