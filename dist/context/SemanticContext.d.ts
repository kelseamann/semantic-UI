import React, { ReactNode } from 'react';
export interface HierarchyData {
    fullPath: string;
    qualifiedParents: string[];
    wrappers: string[];
    immediateParent: string;
    immediateWrapper: string;
    depth: number;
}
interface ContextItem {
    name: string;
    isQualified: boolean;
}
interface SemanticContextType {
    contextStack: ContextItem[];
    addContext: (context: string, isQualified?: boolean) => void;
    removeContext: () => void;
    getHierarchy: () => HierarchyData;
    clearContext: () => void;
}
export declare const useSemanticContext: () => SemanticContextType;
interface SemanticProviderProps {
    children: ReactNode;
}
export declare const SemanticProvider: React.FC<SemanticProviderProps>;
export {};
//# sourceMappingURL=SemanticContext.d.ts.map