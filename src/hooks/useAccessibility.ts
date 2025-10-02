import { useMemo } from 'react';
import { generateAriaAttributes, validateAccessibility, generateKeyboardShortcuts } from '../utils/accessibility';

/**
 * Hook for managing accessibility features
 */
export const useAccessibility = (
  componentType: string,
  props: Record<string, unknown> = {},
  context: Record<string, unknown> = {}
) => {
  const ariaAttributes = useMemo(() => 
    generateAriaAttributes(componentType),
    [componentType]
  );

  const keyboardShortcuts = useMemo(() => 
    generateKeyboardShortcuts(componentType, context),
    [componentType, context]
  );

  const accessibilityIssues = useMemo(() => 
    validateAccessibility(componentType, props),
    [componentType, props]
  );

  const enhancedProps = useMemo(() => ({
    ...props,
    ...ariaAttributes,
    'data-keyboard-shortcuts': keyboardShortcuts.join(','),
    'data-accessibility-issues': accessibilityIssues.join(',')
  }), [props, ariaAttributes, keyboardShortcuts, accessibilityIssues]);

  return {
    ariaAttributes,
    keyboardShortcuts,
    accessibilityIssues,
    enhancedProps
  };
};
