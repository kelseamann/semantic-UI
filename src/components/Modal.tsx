import React from 'react';
import { Modal as PFModal } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';

export interface ModalProps extends React.ComponentProps<typeof PFModal>, SemanticComponentProps {
  /** The semantic purpose of this modal */
  purpose?: 'confirmation' | 'form' | 'information' | 'selection' | 'workflow';
  /** The type of interaction this modal facilitates */
  interactionType?: 'blocking' | 'non-blocking' | 'progressive' | 'multi-step';
}

/** Modal - PatternFly Modal wrapper with semantic metadata for AI tooling */
export const Modal = React.forwardRef<any, ModalProps>(({
  semanticRole,
  aiMetadata,
  purpose = 'information',
  interactionType = 'blocking',
  children,
  ...props
}, ref) => {
  // Generate semantic role and AI metadata if not provided
  const role = semanticRole || `modal-${purpose}-${interactionType}`;
  const metadata = aiMetadata || {
    description: `${purpose} modal with ${interactionType} interaction`,
    category: 'overlay',
    complexity: 'complex',
    accessibility: ['keyboard-navigable', 'screen-reader-friendly', 'focus-management'],
    usage: [`${purpose}-dialog`, 'user-interaction', 'workflow-step']
  };

  return (
    <PFModal
      {...props}
      ref={ref}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={purpose}
      data-interaction-type={interactionType}
    >
      {children}
    </PFModal>
  );
});

export default Modal;
