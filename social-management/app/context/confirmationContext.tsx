'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ConfirmationContextType {
  message: string | null;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
  showConfirmation: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
  showAlert: (message: string, onConfirm: () => void) => void;
  hideConfirmation: () => void;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export function ConfirmationProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);
  const [onCancel, setOnCancel] = useState<(() => void) | null>(null);

  const showConfirmation = (message: string, onConfirm: () => void, onCancel?: () => void) => {
    setMessage(message);
    setOnConfirm(() => onConfirm);
    setOnCancel(() => onCancel || hideConfirmation);
  };

  const showAlert = (message: string, onConfirm: () => void) => {
    setMessage(message);
    setOnConfirm(() => onConfirm);
    setOnCancel(null);
  };

  const hideConfirmation = () => {
    setMessage(null);
    setOnConfirm(null);
    setOnCancel(null);
  };

  return (
    <ConfirmationContext.Provider value={{ message, onConfirm, onCancel, showConfirmation, showAlert, hideConfirmation }}>
      {children}
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation() {
  const context = useContext(ConfirmationContext);
  if (context === undefined) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
}