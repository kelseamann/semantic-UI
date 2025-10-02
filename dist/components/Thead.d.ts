import React from 'react';
import { Thead as PFThead } from '@patternfly/react-table';
import { SemanticComponentProps } from '../types';
export interface TheadProps extends Omit<React.ComponentProps<typeof PFThead>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this table header section (auto-inferred from props if not provided) */
    purpose?: 'column-definition' | 'sortable-headers' | 'selectable-headers' | 'action-headers';
}
/** Thead - PatternFly Table Header wrapper with semantic metadata for AI tooling */
export declare const Thead: React.FC<TheadProps>;
export default Thead;
//# sourceMappingURL=Thead.d.ts.map