import React from 'react';
import { Switch as PFSwitch } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
export interface SwitchProps extends Omit<React.ComponentProps<typeof PFSwitch>, 'children' | 'ref'>, SemanticComponentProps {
    children?: React.ReactNode;
    /** The semantic purpose of this switch */
    purpose?: 'feature-toggle' | 'setting' | 'preference' | 'filter' | 'mode-switch';
    /** The context where this switch is used */
    context?: 'settings' | 'toolbar' | 'card' | 'table-row' | 'form';
    /** What is being toggled */
    toggleTarget?: 'feature' | 'visibility' | 'mode' | 'status' | 'permission';
}
/**
 * Switch - PatternFly Switch wrapper with semantic metadata for AI tooling
 *
 * @example
 * ```tsx
 * <Switch
 *   purpose="feature-toggle"
 *   context="settings"
 *   toggleTarget="feature"
 *   id="notifications"
 *   label="Enable notifications"
 *   isChecked={notificationsEnabled}
 *   onChange={handleToggle}
 * />
 * ```
 */
export declare const Switch: React.FC<SwitchProps>;
export default Switch;
//# sourceMappingURL=Switch.d.ts.map