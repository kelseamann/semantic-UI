import React from 'react';
import { Radio as PFRadio } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
export interface RadioProps extends Omit<React.ComponentProps<typeof PFRadio>, 'children' | 'ref'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this radio button */
    purpose?: 'option-selection' | 'preference' | 'setting' | 'filter' | 'answer';
    /** The context where this radio is used */
    context?: 'form' | 'settings' | 'filter' | 'survey' | 'quiz';
    /** The group this radio belongs to */
    groupContext?: string;
}
/**
 * Radio - PatternFly Radio wrapper with semantic metadata for AI tooling
 *
 * @example
 * ```tsx
 * <Radio
 *   purpose="preference"
 *   context="settings"
 *   groupContext="theme-selection"
 *   name="theme"
 *   id="theme-light"
 *   label="Light Theme"
 *   isChecked={theme === 'light'}
 *   onChange={handleChange}
 * />
 * ```
 */
export declare const Radio: React.FC<RadioProps>;
export default Radio;
//# sourceMappingURL=Radio.d.ts.map