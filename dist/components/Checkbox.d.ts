import React from 'react';
import { Checkbox as PFCheckbox } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';
export interface CheckboxProps extends Omit<React.ComponentProps<typeof PFCheckbox>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this checkbox (auto-inferred from props if not provided) */
    purpose?: 'selection' | 'toggle' | 'form-input' | 'filter';
    /** The context where this checkbox is used (auto-inferred from props if not provided) */
    context?: 'table' | 'form' | 'filter' | 'settings';
    /** Required id for PatternFly Checkbox */
    id: string;
}
/** Checkbox - PatternFly Checkbox wrapper with semantic metadata for AI tooling */
export declare const Checkbox: React.FC<CheckboxProps>;
export default Checkbox;
//# sourceMappingURL=Checkbox.d.ts.map