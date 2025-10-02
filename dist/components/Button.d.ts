import React from 'react';
import { Button as PFButton } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';
export interface ButtonProps extends React.ComponentProps<typeof PFButton>, SemanticComponentProps {
    /** The semantic action this button performs */
    action?: 'primary' | 'secondary' | 'destructive' | 'navigation' | 'toggle';
    /** Context of where this button is used */
    context?: 'form' | 'toolbar' | 'modal' | 'card' | 'navigation' | 'table' | 'alert';
}
/** Button - PatternFly Button wrapper with semantic metadata for AI tooling */
export declare const Button: React.FC<ButtonProps>;
export default Button;
//# sourceMappingURL=Button.d.ts.map