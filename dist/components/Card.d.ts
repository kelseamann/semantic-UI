import React from 'react';
import { Card as PFCard } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';
export interface CardProps extends Omit<React.ComponentProps<typeof PFCard>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this card */
    purpose?: 'content-display' | 'data-summary' | 'action-panel' | 'information' | 'navigation';
    /** The type of content this card contains */
    contentType?: 'text' | 'data' | 'media' | 'mixed' | 'interactive';
}
/** Card - PatternFly Card wrapper with semantic metadata for AI tooling */
export declare const Card: React.FC<CardProps>;
export default Card;
//# sourceMappingURL=Card.d.ts.map