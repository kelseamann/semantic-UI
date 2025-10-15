import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  const [contextStack, setContextStack] = useState<string[]>([]);

  const addContext = (context: string) => {
    setContextStack(prev => [...prev, context]);
  };

  const removeContext = () => {
    setContextStack(prev => prev.slice(0, -1));
  };

  const clearContext = () => {
    setContextStack([]);
  };

  const getHierarchy = (): HierarchyData => ({
    parents: [...contextStack],
    depth: contextStack.length,
    path: contextStack.length > 0 ? contextStack.join(' > ') : ''
  });

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
