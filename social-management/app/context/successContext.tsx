'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SuccessContextType {
  success: string | null;
  showSuccess: (message: string) => void;
  hideSuccess: () => void;
}

const SuccessContext = createContext<SuccessContextType | undefined>(undefined);

export function SuccessProvider({ children }: { children: ReactNode }) {
  const [success, setSuccess] = useState<string | null>(null);

  const showSuccess = (message: string) => setSuccess(message);
  const hideSuccess = () => setSuccess(null);

  return (
    <SuccessContext.Provider value={{ success, showSuccess, hideSuccess }}>
      {children}
    </SuccessContext.Provider>
  );
}

export function useSuccess() {
  const context = useContext(SuccessContext);
  if (context === undefined) {
    throw new Error('useSuccess must be used within a SuccessProvider');
  }
  return context;
}