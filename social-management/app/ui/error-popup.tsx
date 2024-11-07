'use client';
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

import React, { useEffect, useState } from 'react';
import { useError } from '@/app/context/errorContext';

const ErrorPopup: React.FC = () => {
  const { error, hideError } = useError();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        hideError();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, hideError]);

  if (!isClient || !error) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-center py-2 px-4 rounded-lg shadow-lg z-50 flex items-center justify-between max-w-sm w-full">
      <div className="flex items-center">
        <ExclamationCircleIcon className="h-5 w-5 mr-2" />
        <p>{error}</p>
      </div>
      <button title='close' onClick={hideError} className="ml-4 text-white">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ErrorPopup;