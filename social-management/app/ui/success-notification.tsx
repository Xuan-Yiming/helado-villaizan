'use client';

import React, { useEffect } from 'react';
import { useSuccess } from '@/app/context/successContext';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

const SuccessNotification: React.FC = () => {
  const { success, hideSuccess } = useSuccess();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        hideSuccess();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, hideSuccess]);

  if (!success) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-center py-2 px-4 rounded-lg shadow-lg z-50 flex items-center justify-between max-w-sm w-full">
      <div className="flex items-center">
        <CheckCircleIcon className="h-5 w-5 mr-2" />
        <p>{success}</p>
      </div>
      <button title='close' onClick={hideSuccess} className="ml-4 text-white">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SuccessNotification;