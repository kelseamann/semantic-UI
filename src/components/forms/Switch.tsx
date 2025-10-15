import React from 'react';
import { Switch as PFSwitch } from '@patternfly/react-core';
import { SemanticComponentProps } from '../../types';
import { 
  inferSwitchPurpose,
  inferSwitchToggleTarget,
  inferSettingsContext,
  generateMetadataFromProps 
} from '../../utils/inference';

export interface SwitchProps 
  extends Omit<React.ComponentProps<typeof PFSwitch>, 'children' | 'ref'>, 
  SemanticComponentProps {
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
export const Switch: React.FC<SwitchProps> = ({
  semanticName,
  semanticRole,
  aiMetadata,
  purpose,
  context,
  toggleTarget,
  isChecked,
  isDisabled,
  children,
  ...props
}) => {
  // 1. Auto-infer semantic properties
  const inferredPurpose = purpose || inferSwitchPurpose();
  const inferredContext = context || inferSettingsContext();
  const inferredToggleTarget = toggleTarget || inferSwitchToggleTarget();
  
  // 2. Generate semantic role and AI metadata
  const role = semanticRole || `switch-${inferredPurpose}-${inferredContext}`;
  const metadata = aiMetadata || {
    ...generateMetadataFromProps('Switch', { isChecked, isDisabled, ...props }),
    description: `${inferredPurpose} switch for toggling ${inferredToggleTarget} in ${inferredContext}`,
    usage: ['user-interaction', 'toggle-control', 'settings-control']
  };
  
  // 3. Default semantic name
  const defaultSemanticName = semanticName || 'Switch';
  
  // 4. Render PatternFly component with semantic data attributes
  return (
    <PFSwitch
      {...props}
      isChecked={isChecked}
      isDisabled={isDisabled}
      data-semantic-name={defaultSemanticName}
      data-semantic-role={role}
      data-ai-metadata={JSON.stringify(metadata)}
      data-purpose={inferredPurpose}
      data-context={inferredContext}
      data-toggle-target={inferredToggleTarget}
    >
      {children}
    </PFSwitch>
  );
};

export default Switch;

