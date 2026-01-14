import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

// Crear el contexto
const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: () => {},
  showLoader: () => {},
  hideLoader: () => {},
});

// Hook personalizado para usar el contexto
export const useLoading = () => useContext(LoadingContext);

// Proveedor del contexto
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = useCallback(() => setIsLoading(true), []);
  const hideLoader = useCallback(() => setIsLoading(false), []);

  const value = useMemo(() => ({
    isLoading,
    setIsLoading,
    showLoader,
    hideLoader
  }), [isLoading, showLoader, hideLoader]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};
