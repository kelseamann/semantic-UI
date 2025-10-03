import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SemanticContextType {
  contextStack: string[];
  addContext: (context: string) => void;
  removeContext: () => void;
  getContextualName: (baseName: string) => string;
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

  const getContextualName = (baseName: string): string => {
    if (contextStack.length === 0) {
      return baseName;
    }
    
    // Join all context levels with spaces
    const contextPrefix = contextStack.join(' ');
    return `${contextPrefix} ${baseName}`;
  };

  return (
    <SemanticContext.Provider
      value={{
        contextStack,
        addContext,
        removeContext,
        getContextualName,
        clearContext,
      }}
    >
      {children}
    </SemanticContext.Provider>
  );
};
