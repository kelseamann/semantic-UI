import React from 'react';
import { TextArea as PFTextArea } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
import { 
  inferTextAreaPurpose,
  inferTextAreaContentType,
  inferFormContext,
  generateMetadataFromProps 
} from '../../utils/inference';

export interface TextAreaProps 
  extends Omit<React.ComponentProps<typeof PFTextArea>, 'children'>, 
  SemanticComponentProps {
  /** The semantic purpose of this textarea */
  purpose?: 'comment' | 'description' | 'note' | 'message' | 'feedback' | 'content';
  /** The context where this textarea is used */
  context?: 'form' | 'comment-section' | 'message-box' | 'editor' | 'settings';
  /** Expected content type */
  contentType?: 'plain-text' | 'formatted-text' | 'code' | 'markdown';
}

/**
 * TextArea - PatternFly TextArea wrapper with semantic metadata for AI tooling
 * 
 * @example
 * ```tsx
 * <TextArea
 *   purpose="comment"
 *   context="comment-section"
 *   placeholder="Add your comment..."
 *   value={comment}
 *   onChange={handleChange}
 *   resizeOrientation="vertical"
 * />
 * ```
 */
export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  context,
  contentType,
  validated,
  isRequired,
  ...props
}, ref) => {
  // 1. Auto-infer semantic properties
  const inferredPurpose = purpose || inferTextAreaPurpose();
  const inferredContext = context || inferFormContext();
  const inferredContentType = contentType || inferTextAreaContentType();
  
  // 2. Generate semantic role and AI metadata
  const role = semanticRole || `textarea-${inferredPurpose}-${inferredContext}`;
  const metadata = aiMetadata || {
    ...generateMetadataFromProps('TextArea', { validated, isRequired, ...props }),
    description: `${inferredPurpose} textarea for ${inferredContext} containing ${inferredContentType}`,
    usage: ['data-entry', 'long-form-input', 'user-interaction']
  };
  
  // 3. Default semantic name
  const defaultSemanticName = semanticName || 'TextArea';
  
  // 4. Render PatternFly component with semantic data attributes
  return (
    <PFTextArea
      {...props}
      ref={ref}
      validated={validated}
      isRequired={isRequired}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
      data-context={inferredContext}
      data-content-type={inferredContentType}
    />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;

