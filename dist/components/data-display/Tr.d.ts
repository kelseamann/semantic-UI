import React from 'react';
import { Tr as PFTr } from '@patternfly/react-table';
import { SemanticComponentProps } from '../../types';
export interface TrProps extends Omit<React.ComponentProps<typeof PFTr>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this table row (auto-inferred from props if not provided) */
    purpose?: 'data-row' | 'header-row' | 'selectable-row' | 'expandable-row' | 'action-row';
    /** The interaction type for this row (auto-inferred from props if not provided) */
    interactionType?: 'clickable' | 'selectable' | 'expandable' | 'static';
    /** The row state (auto-inferred from props if not provided) */
    rowState?: 'normal' | 'selected' | 'expanded' | 'disabled' | 'highlighted';
}
/** Tr - PatternFly Table Row wrapper with semantic metadata for AI tooling */
export declare const Tr: React.FC<TrProps>;
export default Tr;
//# sourceMappingURL=Tr.d.ts.map