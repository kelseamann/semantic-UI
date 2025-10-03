import React from 'react';
import { ComponentMetadata } from '../types';
import { generateComponentMetadata, mergeMetadata } from '../utils/metadata';

/**
 * Hook for managing semantic metadata for components
 */
export const useSemanticMetadata = (
  componentName: string,
  userMetadata?: Partial<ComponentMetadata>,
  props: Record<string, unknown> = {}
) => {
  const [metadata, setMetadata] = React.useState<ComponentMetadata>(() => {
    const defaultMetadata = generateComponentMetadata(componentName, props);
    return userMetadata ? mergeMetadata(userMetadata, defaultMetadata) : defaultMetadata;
  });

  React.useEffect(() => {
    const defaultMetadata = generateComponentMetadata(componentName, props);
    const mergedMetadata = userMetadata ? mergeMetadata(userMetadata, defaultMetadata) : defaultMetadata;
    setMetadata(mergedMetadata);
  }, [componentName, userMetadata, props]);

  const updateMetadata = (updates: Partial<ComponentMetadata>) => {
    setMetadata(prev => ({ ...prev, ...updates }));
  };

  return {
    metadata,
    updateMetadata
  };
};
