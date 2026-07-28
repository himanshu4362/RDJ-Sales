import React, { createContext, useContext, useState } from 'react';

interface NavigationContextValue {
  lastPath: string | null;
  setLastPath: (path: string | null) => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastPath, setLastPath] = useState<string | null>(null);

  return (
    <NavigationContext.Provider value={{ lastPath, setLastPath }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within NavigationProvider');
  return context;
};