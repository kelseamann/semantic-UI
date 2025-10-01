import React from 'react';
import { Modal as PFModal, ModalProps as PFModalProps } from '@patternfly/react-core';
import { SemanticComponentProps } from '../types';

export interface SemanticModalProps extends PFModalProps, SemanticComponentProps {
  /** The semantic purpose of this modal */
  purpose?: 'confirmation' | 'form' | 'information' | 'selection' | 'workflow';
  /** The type of interaction this modal facilitates */
  interactionType?: 'blocking' | 'non-blocking' | 'progressive' | 'multi-step';
}

/**
 * SemanticModal - A PatternFly Modal wrapped with semantic meaning and AI metadata
 * 
 * This component enhances PatternFly's Modal with:
 * - Semantic purpose identification for AI tooling
 * - Interaction type metadata for better UX understanding
 * - Automatic accessibility enhancements
 * - AI-friendly component descriptions
 */
export const SemanticModal: React.FC<SemanticModalProps> = ({
  semanticRole,
  aiMetadata,
  accessibility,
  purpose = 'information',
  interactionType = 'blocking',
  children,
  ...props
}) => {
  // Generate semantic role if not provided
  const role = semanticRole || `modal-${purpose}-${interactionType}`;
  
  // Generate AI metadata if not provided
  const metadata = aiMetadata || {
    description: `${purpose} modal with ${interactionType} interaction`,
    category: 'overlay',
    complexity: 'complex',
    accessibility: ['keyboard-navigable', 'screen-reader-friendly', 'focus-management'],
    usage: [`${purpose}-dialog`, 'user-interaction', 'workflow-step']
  };

  // Enhanced accessibility props
  const enhancedAccessibility = {
    'aria-label': accessibility?.ariaLabel || `${purpose} modal`,
    'aria-describedby': accessibility?.ariaDescription,
    'aria-modal': true,
    ...props
  };

  return (
    <PFModal
      {...enhancedAccessibility}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={purpose}
      data-interaction-type={interactionType}
      {...props}
    >
      {children}
    </PFModal>
  );
};

export default SemanticModal;
