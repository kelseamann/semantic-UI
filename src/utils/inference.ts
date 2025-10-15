/**
 * Inference utilities for automatically determining semantic properties
 * from PatternFly component props
 */

/**
 * Infer button action from PatternFly variant and props
 */
export const inferButtonAction = (
  variant?: string,
  href?: string,
  onClick?: unknown,
  target?: string
): string => {
  switch (variant) {
    case 'primary':
      return 'primary';
    case 'danger':
      return 'destructive';
    case 'link':
      // Check what the link actually does
      if (href?.startsWith('http')) return 'external';
      if (target === '_blank') return 'external';
      if (onClick && !href) return 'action';
      if (href?.startsWith('/')) return 'navigation';
      return 'navigation';
    case 'control':
      return 'toggle';
    case 'secondary':
    case 'tertiary':
    case 'plain':
    default:
      return 'secondary';
  }
};

/**
 * Infer input purpose from type
 */
export const inferInputPurpose = (type?: string): string => {
  switch (type) {
    case 'email':
      return 'email-input';
    case 'password':
      return 'password-input';
    case 'search':
      return 'search-input';
    case 'tel':
      return 'phone-input';
    case 'url':
      return 'url-input';
    case 'number':
      return 'numeric-input';
    case 'date':
    case 'datetime-local':
    case 'time':
      return 'date-time-input';
    case 'text':
    default:
      return 'text-input';
  }
};

/**
 * Infer alert severity
 */
export const inferAlertSeverity = (variant?: string): string => {
  switch (variant) {
    case 'success':
      return 'success';
    case 'danger':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
    case 'default':
    default:
      return 'info';
  }
};

/**
 * Infer context from parent or usage
 */
export const inferContext = (props: Record<string, unknown>): string => {
  if (props.onClick || props.onSubmit) return 'active';
  if (props.isDisabled) return 'disabled';
  if (props.isReadOnly) return 'readonly';
  return 'default';
};

/**
 * Infer card purpose from props
 */
export const inferCardPurpose = (props: Record<string, unknown>): string => {
  if (props.isSelectable || props.isClickable) return 'action-panel';
  if (props.isCompact) return 'data-summary';
  return 'content-display';
};

/**
 * Infer modal purpose from props
 */
export const inferModalPurpose = (props: Record<string, unknown>): string => {
  if (props.variant === 'small') return 'confirmation';
  if (props.variant === 'large') return 'form';
  return 'information';
};

/**
 * Infer accessibility features from props
 */
export const inferAccessibilityFeatures = (props: Record<string, unknown>): string[] => {
  const features: string[] = ['keyboard-navigable'];
  
  if (props['aria-label'] || props['aria-labelledby']) {
    features.push('screen-reader-friendly');
  }
  
  if (props.autoFocus) {
    features.push('auto-focus');
  }
  
  if (props.role) {
    features.push('semantic-role');
  }
  
  return features;
};

/**
 * Infer usage patterns from component type and props
 */
export const inferUsagePatterns = (
  componentType: string,
  props: Record<string, unknown>
): string[] => {
  const patterns: string[] = ['user-interface'];
  
  // Component-specific patterns
  switch (componentType.toLowerCase()) {
    case 'button':
      if (props.type === 'submit') patterns.push('form-submission');
      if (props.onClick) patterns.push('user-interaction');
      break;
    case 'textinput':
    case 'textarea':
      patterns.push('data-entry', 'form-input');
      if (props.validated === 'error') patterns.push('validation');
      break;
    case 'select':
      patterns.push('data-entry', 'selection');
      break;
    case 'checkbox':
    case 'radio':
      patterns.push('user-selection', 'form-input');
      break;
    case 'modal':
      patterns.push('user-interaction', 'workflow-step');
      break;
    case 'card':
      patterns.push('content-organization', 'data-presentation');
      break;
  }
  
  return patterns;
};

/**
 * Generate comprehensive metadata from props
 */
export const generateMetadataFromProps = (
  componentName: string,
  props: Record<string, unknown>
): {
  description: string;
  category: string;
  accessibility: string[];
  usage: string[];
} => {
  return {
    description: `${componentName} component`,
    category: inferCategory(componentName),
    accessibility: inferAccessibilityFeatures(props),
    usage: inferUsagePatterns(componentName, props)
  };
};

/**
 * Infer card content type
 */
export const inferCardContentType = (): string => {
  return 'mixed'; // Default to mixed, can be enhanced with children analysis
};

/**
 * Infer modal interaction type
 */
export const inferModalInteractionType = (isOpen?: boolean): string => {
  return isOpen ? 'blocking' : 'non-blocking';
};

/**
 * Infer select purpose
 */
export const inferSelectPurpose = (): string => {
  return 'data-entry';
};

/**
 * Infer select selection type
 */
export const inferSelectSelectionType = (variant?: string): string => {
  return variant === 'typeahead' ? 'typeahead' : 'single';
};

/**
 * Infer radio purpose
 */
export const inferRadioPurpose = (): string => {
  return 'option-selection';
};

/**
 * Infer radio group context
 */
export const inferRadioGroupContext = (name?: string): string => {
  return name || 'unknown-group';
};

/**
 * Infer switch purpose
 */
export const inferSwitchPurpose = (): string => {
  return 'setting';
};

/**
 * Infer switch toggle target
 */
export const inferSwitchToggleTarget = (): string => {
  return 'feature';
};

/**
 * Infer textarea purpose
 */
export const inferTextAreaPurpose = (): string => {
  return 'content';
};

/**
 * Infer textarea content type
 */
export const inferTextAreaContentType = (): string => {
  return 'plain-text';
};

/**
 * Infer checkbox purpose
 */
export const inferCheckboxPurpose = (isChecked?: boolean): string => {
  return isChecked !== undefined ? 'selection' : 'form-input';
};

/**
 * Infer link purpose
 */
export const inferLinkPurpose = (href?: string, children?: React.ReactNode): string => {
  if (href?.startsWith('http')) return 'external';
  if (href === '#') return 'action';
  if (href?.includes('download')) return 'download';
  if (children?.toString().toLowerCase().includes('launch')) return 'launch';
  return 'navigation';
};

/**
 * Infer star icon purpose
 */
export const inferStarIconPurpose = (isFavorited?: boolean): string => {
  return isFavorited !== undefined ? 'favorite-toggle' : 'rating';
};

/**
 * Infer validation context
 */
export const inferValidationContext = (isRequired?: boolean): string => {
  return isRequired ? 'required' : 'optional';
};

/**
 * Infer form context (default for most form components)
 */
export const inferFormContext = (): string => {
  return 'form';
};

/**
 * Infer settings context (default for switches)
 */
export const inferSettingsContext = (): string => {
  return 'settings';
};

/**
 * Infer status badge type from content
 */
export const inferStatusBadgeType = (content?: string): string => {
  const lower = content?.toLowerCase() || '';
  if (lower.includes('ready')) return 'ready';
  if (lower.includes('success')) return 'success';
  if (lower.includes('warning')) return 'warning';
  if (lower.includes('error') || lower.includes('fail')) return 'error';
  if (lower.includes('pending')) return 'pending';
  return 'info';
};

/**
 * Infer status badge purpose
 */
export const inferStatusBadgePurpose = (): string => {
  return 'status-indicator';
};

/**
 * Infer category from component name and action
 * 
 * TODO: Current implementation hardcodes action → category mappings.
 * Need a more extensible solution that doesn't require adding new if statements
 * for every action type. Consider a mapping system or pattern-based approach.
 */
export const inferCategory = (componentName: string, action?: string): string => {
  const name = componentName.toLowerCase();
  
  // If action is provided, let it override the default category
  // NOTE: This is hardcoded and not ideal - needs refactoring
  if (action === 'navigation' || action === 'external') {
    return 'navigation';
  }
  if (action === 'destructive' || action === 'primary' || action === 'secondary') {
    return 'forms';
  }
  
  // Default categorization by component type
  if (['button', 'textinput', 'textarea', 'select', 'radio', 'checkbox', 'switch'].includes(name)) {
    return 'forms';
  }
  if (['nav', 'breadcrumb', 'tabs', 'pagination', 'masthead'].includes(name)) {
    return 'navigation';
  }
  if (['card', 'table', 'datalist', 'label', 'badge'].includes(name)) {
    return 'data-display';
  }
  if (['alert', 'banner', 'toast', 'progress', 'spinner'].includes(name)) {
    return 'feedback';
  }
  if (['modal', 'drawer', 'popover', 'tooltip'].includes(name)) {
    return 'overlay';
  }
  if (['flex', 'grid', 'stack', 'panel'].includes(name)) {
    return 'layout';
  }
  
  return 'data-display';
};

