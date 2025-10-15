import React from 'react';
import { Button as PFButton } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
export interface ButtonProps extends Omit<React.ComponentProps<typeof PFButton>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic action this button performs (auto-inferred from variant if not provided) */
    action?: 'primary' | 'secondary' | 'destructive' | 'navigation' | 'toggle';
    /** Context of where this button is used (auto-inferred from props if not provided) */
    context?: 'form' | 'toolbar' | 'modal' | 'card' | 'navigation' | 'table' | 'alert';
}
/** Button - PatternFly Button wrapper with semantic metadata for AI tooling */
export declare const Button: React.FC<ButtonProps>;
export default Button;
//# sourceMappingURL=Button.d.ts.map