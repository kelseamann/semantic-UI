import React, { ReactNode } from 'react';
export interface HierarchyData {
    parents: string[];
    depth: number;
    path: string;
}
interface SemanticContextType {
    contextStack: string[];
    addContext: (context: string) => void;
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