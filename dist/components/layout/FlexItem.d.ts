import React from 'react';
import { FlexItem as PFFlexItem } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
export interface FlexItemProps extends Omit<React.ComponentProps<typeof PFFlexItem>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The content type of this flex item (auto-inferred from props if not provided) */
    contentType?: 'text' | 'button' | 'icon' | 'form-control' | 'media' | 'navigation' | 'action';
    /** The positioning context (auto-inferred from props if not provided) */
    positioningContext?: 'start' | 'center' | 'end' | 'stretch' | 'baseline' | 'auto';
    /** The sizing behavior (auto-inferred from flex prop if not provided) */
    sizingBehavior?: 'fixed' | 'flexible' | 'grow' | 'shrink' | 'auto';
}
/** FlexItem - PatternFly FlexItem wrapper with semantic metadata for AI tooling */
export declare const FlexItem: React.FC<FlexItemProps>;
export default FlexItem;
//# sourceMappingURL=FlexItem.d.ts.map