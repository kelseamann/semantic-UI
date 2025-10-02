import React from 'react';
import { Th as PFTh } from '@patternfly/react-table';
import { SemanticComponentProps } from '../types';
export interface ThProps extends Omit<React.ComponentProps<typeof PFTh>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this table header (auto-inferred from props if not provided) */
    purpose?: 'column-header' | 'sortable-header' | 'selectable-header' | 'action-header';
    /** The data type this header represents (auto-inferred from content if not provided) */
    dataType?: 'text' | 'number' | 'date' | 'boolean' | 'action' | 'mixed';
}
/** Th - PatternFly Table Header wrapper with semantic metadata for AI tooling */
export declare const Th: React.FC<ThProps>;
export default Th;
//# sourceMappingURL=Th.d.ts.map