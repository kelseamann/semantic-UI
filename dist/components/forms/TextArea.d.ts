import React from 'react';
import { TextArea as PFTextArea } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
export interface TextAreaProps extends Omit<React.ComponentProps<typeof PFTextArea>, 'children'>, SemanticComponentProps {
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
export declare const TextArea: React.ForwardRefExoticComponent<Omit<TextAreaProps, "ref"> & React.RefAttributes<HTMLTextAreaElement>>;
export default TextArea;
//# sourceMappingURL=TextArea.d.ts.map