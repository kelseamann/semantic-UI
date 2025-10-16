import React, { createContext, useContext, useState, ReactNode } from 'react';
import { isVisualParent } from '../utils/inference';

export interface HierarchyData {
  fullPath: string;              // All components: "Modal > Form > Card"
  qualifiedParents: string[];    // Only visual parents: ["Modal"]
  wrappers: string[];            // Only wrapper components: ["Form", "Card"]
  immediateParent: string;       // Last qualified parent: "Modal"
  immediateWrapper: string;      // Last wrapper: "Card"
  depth: number;                 // Count of visual parents: 1
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

const SemanticContext = createContext<SemanticContextType | undefined>(undefined);

export const useSemanticContext = () => {
  const context = useContext(SemanticContext);
  if (!context) {
    throw new Error('useSemanticContext must be used within a SemanticProvider');
  }
  return context;
};

interface SemanticProviderProps {
  children: ReactNode;
}

export const SemanticProvider: React.FC<SemanticProviderProps> = ({ children }) => {
  const [contextStack, setContextStack] = useState<ContextItem[]>([]);

  const addContext = (context: string, isQualified?: boolean) => {
    // Auto-detect if not specified
    const qualified = isQualified !== undefined ? isQualified : isVisualParent(context);
    setContextStack(prev => [...prev, { name: context, isQualified: qualified }]);
  };

  const removeContext = () => {
    setContextStack(prev => prev.slice(0, -1));
  };

  const clearContext = () => {
    setContextStack([]);
  };

  const getHierarchy = (): HierarchyData => {
    const allNames = contextStack.map(c => c.name);
    const qualifiedOnly = contextStack.filter(c => c.isQualified).map(c => c.name);
    const wrappersOnly = contextStack.filter(c => !c.isQualified).map(c => c.name);
    
    return {
      fullPath: allNames.length > 0 ? allNames.join(' > ') : '',
      qualifiedParents: qualifiedOnly,
      wrappers: wrappersOnly,
      immediateParent: qualifiedOnly.length > 0 ? qualifiedOnly[qualifiedOnly.length - 1] : '',
      immediateWrapper: wrappersOnly.length > 0 ? wrappersOnly[wrappersOnly.length - 1] : '',
      depth: qualifiedOnly.length
    };
  };

  return (
    <SemanticContext.Provider
      value={{
        contextStack,
        addContext,
        removeContext,
        getHierarchy,
        clearContext,
      }}
    >
      {children}
    </SemanticContext.Provider>
  );
};
