import { ComponentMetadata } from '../types';
/**
 * Hook for managing semantic metadata for components
 */
export declare const useSemanticMetadata: (componentName: string, userMetadata?: Partial<ComponentMetadata>, props?: Record<string, unknown>) => {
    metadata: ComponentMetadata;
    updateMetadata: (updates: Partial<ComponentMetadata>) => void;
};
//# sourceMappingURL=useSemanticMetadata.d.ts.map