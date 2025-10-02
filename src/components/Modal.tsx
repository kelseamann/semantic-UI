import React from 'react';
import { Modal as PFModal } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';

export interface ModalProps extends Omit<React.ComponentProps<typeof PFModal>, 'children'>, SemanticComponentProps {
  children?: React.ReactNode;
  /** The semantic purpose of this modal (auto-inferred from variant if not provided) */
  purpose?: 'confirmation' | 'form' | 'information' | 'selection' | 'workflow';
  /** The type of interaction this modal facilitates (auto-inferred from props if not provided) */
  interactionType?: 'blocking' | 'non-blocking' | 'progressive' | 'multi-step';
}

/** Modal - PatternFly Modal wrapper with semantic metadata for AI tooling */
export const Modal = React.forwardRef<any, ModalProps>(({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  interactionType,
  children,
  variant,
  isOpen,
  ...props
}, ref) => {
  // Auto-infer semantic properties from PatternFly props
  const inferredPurpose = purpose || (variant === 'small' ? 'confirmation' : 
                                     variant === 'large' ? 'form' : 'information');
  
  const inferredInteractionType = interactionType || (isOpen ? 'blocking' : 'non-blocking');
  
  // Generate semantic role and AI metadata
  const role = semanticRole || `modal-${inferredPurpose}-${inferredInteractionType}`;
  const metadata = aiMetadata || {
    description: `${inferredPurpose} modal with ${inferredInteractionType} interaction`,
    category: 'overlay',
    complexity: 'complex',
    usage: [`${inferredPurpose}-dialog`, 'user-interaction', 'workflow-step']
  };

  // Default semantic name if not provided
  const defaultSemanticName = semanticName || 'Modal';

  return (
    <PFModal
      {...props}
      ref={ref}
      variant={variant}
      isOpen={isOpen}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
      data-interaction-type={inferredInteractionType}
    >
      {children}
    </PFModal>
  );
});

export default Modal;
