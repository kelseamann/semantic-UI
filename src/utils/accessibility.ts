/**
 * Accessibility utility functions
 */

/**
 * Generates ARIA attributes based on component context
 */
export const generateAriaAttributes = (
  componentType: string
): Record<string, string> => {
  const baseAttributes: Record<string, string> = {};

  switch (componentType.toLowerCase()) {
    case 'button':
      return {
        ...baseAttributes,
        role: 'button',
        tabIndex: '0'
      };
    case 'card':
      return {
        ...baseAttributes,
        role: 'region',
        tabIndex: '0'
      };
    case 'modal':
      return {
        ...baseAttributes,
        role: 'dialog',
        'aria-modal': 'true',
        tabIndex: '-1'
      };
    default:
      return baseAttributes;
  }
};

/**
 * Validates accessibility requirements
 */
export const validateAccessibility = (
  componentType: string,
  props: Record<string, unknown>
): string[] => {
  const issues: string[] = [];

  // Check for required ARIA attributes
  if (componentType === 'button' && !props['aria-label'] && !props.children) {
    issues.push('Button should have aria-label or visible text content');
  }

  if (componentType === 'modal' && !props['aria-labelledby'] && !props.title) {
    issues.push('Modal should have aria-labelledby or title');
  }

  return issues;
};

/**
 * Generates keyboard shortcuts metadata
 */
export const generateKeyboardShortcuts = (
  componentType: string,
  context: Record<string, unknown> = {}
): string[] => {
  const shortcuts: string[] = [];

  switch (componentType.toLowerCase()) {
    case 'button':
      shortcuts.push('Enter', 'Space');
      if (context.action === 'close') {
        shortcuts.push('Escape');
      }
      break;
    case 'modal':
      shortcuts.push('Escape', 'Tab', 'Shift+Tab');
      break;
    case 'card':
      if (context.interactive) {
        shortcuts.push('Enter', 'Space');
      }
      break;
  }

  return shortcuts;
};
