import React from 'react';
import { Td as PFTd } from '@patternfly/react-table';
import { SemanticComponentProps } from '../../types';
export interface TdProps extends Omit<React.ComponentProps<typeof PFTd>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this table cell (auto-inferred from props if not provided) */
    purpose?: 'data-cell' | 'action-cell' | 'selectable-cell' | 'status-cell';
    /** The data type this cell contains (auto-inferred from content if not provided) */
    dataType?: 'text' | 'number' | 'date' | 'boolean' | 'action' | 'mixed';
}
/** Td - PatternFly Table Data wrapper with semantic metadata for AI tooling */
export declare const Td: React.FC<TdProps>;
export default Td;
//# sourceMappingURL=Td.d.ts.map