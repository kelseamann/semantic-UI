import React from 'react';
import { Flex as PFFlex } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
export interface FlexProps extends Omit<React.ComponentProps<typeof PFFlex>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The layout purpose of this flex container (auto-inferred from props if not provided) */
    purpose?: 'layout' | 'navigation' | 'toolbar' | 'form' | 'content' | 'action-group';
    /** The layout type (auto-inferred from direction if not provided) */
    layoutType?: 'row' | 'column' | 'responsive';
    /** The alignment context (auto-inferred from props if not provided) */
    alignmentContext?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
}
/** Flex - PatternFly Flex wrapper with semantic metadata for AI tooling */
export declare const Flex: React.FC<FlexProps>;
export default Flex;
//# sourceMappingURL=Flex.d.ts.map