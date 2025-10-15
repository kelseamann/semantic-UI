import React from 'react';
import { Tbody as PFTbody } from '@patternfly/react-table';
import { SemanticComponentProps } from '../../types';
export interface TbodyProps extends Omit<React.ComponentProps<typeof PFTbody>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this table body section (auto-inferred from props if not provided) */
    purpose?: 'data-rows' | 'selectable-rows' | 'action-rows' | 'mixed-content';
}
/** Tbody - PatternFly Table Body wrapper with semantic metadata for AI tooling */
export declare const Tbody: React.FC<TbodyProps>;
export default Tbody;
//# sourceMappingURL=Tbody.d.ts.map