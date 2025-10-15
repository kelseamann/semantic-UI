import React from 'react';
import { Modal as PFModal } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
export interface ModalProps extends Omit<React.ComponentProps<typeof PFModal>, 'children'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this modal (auto-inferred from variant if not provided) */
    purpose?: 'confirmation' | 'form' | 'information' | 'selection' | 'workflow';
    /** The type of interaction this modal facilitates (auto-inferred from props if not provided) */
    interactionType?: 'blocking' | 'non-blocking' | 'progressive' | 'multi-step';
}
/** Modal - PatternFly Modal wrapper with semantic metadata for AI tooling */
export declare const Modal: React.ForwardRefExoticComponent<Omit<ModalProps, "ref"> & React.RefAttributes<any>>;
export default Modal;
//# sourceMappingURL=Modal.d.ts.map