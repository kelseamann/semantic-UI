import { ComponentMetadata } from '../types';

/**
 * Utility functions for managing component metadata
 */

/**
 * Generates default metadata for a component based on its type and props
 */
export const generateComponentMetadata = (
  componentName: string,
  props: Record<string, unknown> = {}
): ComponentMetadata => {
  const baseMetadata: ComponentMetadata = {
    name: componentName,
    description: `Semantic wrapper for ${componentName}`,
    category: 'data-display',
    complexity: 'simple',
    accessibility: ['keyboard-navigable'],
    usage: ['user-interface'],
    props: props
  };

  // Customize based on component type
  switch (componentName.toLowerCase()) {
    case 'button':
      return {
        ...baseMetadata,
        category: 'forms',
        description: 'Interactive button with semantic meaning',
        usage: ['user-interaction', 'form-submission', 'navigation']
      };
    case 'card':
      return {
        ...baseMetadata,
        category: 'data-display',
        description: 'Content container with semantic purpose',
        usage: ['content-organization', 'data-presentation']
      };
    case 'modal':
      return {
        ...baseMetadata,
        category: 'overlay',
        complexity: 'complex',
        description: 'Overlay dialog with semantic purpose',
        accessibility: ['keyboard-navigable', 'focus-management', 'screen-reader-friendly'],
        usage: ['user-interaction', 'workflow-step', 'confirmation']
      };
    default:
      return baseMetadata;
  }
};

/**
 * Validates component metadata
 */
export const validateMetadata = (metadata: ComponentMetadata): boolean => {
  return !!(
    metadata.name &&
    metadata.description &&
    metadata.category &&
    metadata.complexity &&
    Array.isArray(metadata.accessibility) &&
    Array.isArray(metadata.usage)
  );
};

/**
 * Merges user-provided metadata with defaults
 */
export const mergeMetadata = (
  userMetadata: Partial<ComponentMetadata>,
  defaultMetadata: ComponentMetadata
): ComponentMetadata => {
  return {
    ...defaultMetadata,
    ...userMetadata,
    accessibility: [...defaultMetadata.accessibility, ...(userMetadata.accessibility || [])],
    usage: [...defaultMetadata.usage, ...(userMetadata.usage || [])]
  };
};
