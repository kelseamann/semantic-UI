import React from 'react';
import { Form as PFForm } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
export interface FormProps extends Omit<React.ComponentProps<typeof PFForm>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this form */
    purpose?: 'create' | 'edit' | 'search' | 'filter' | 'settings';
}
/** Form - PatternFly Form wrapper with semantic metadata for AI tooling */
export declare const Form: React.FC<FormProps>;
export default Form;
//# sourceMappingURL=Form.d.ts.map