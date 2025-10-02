import { ComponentMetadata } from '../types';
/**
 * Utility functions for managing component metadata
 */
/**
 * Generates default metadata for a component based on its type and props
 */
export declare const generateComponentMetadata: (componentName: string, props?: Record<string, unknown>) => ComponentMetadata;
/**
 * Validates component metadata
 */
export declare const validateMetadata: (metadata: ComponentMetadata) => boolean;
/**
 * Merges user-provided metadata with defaults
 */
export declare const mergeMetadata: (userMetadata: Partial<ComponentMetadata>, defaultMetadata: ComponentMetadata) => ComponentMetadata;
//# sourceMappingURL=metadata.d.ts.map