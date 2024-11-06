'use client';

import React from 'react';
import { useConfirmation } from '@/app/context/confirmationContext';

const ConfirmationAlert: React.FC = () => {
  const { message, onConfirm, onCancel, hideConfirmation } = useConfirmation();

  if (!message) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <p>{message}</p>
        <div className="mt-4 flex justify-end space-x-2">
          {onCancel && (
            <button onClick={hideConfirmation || onCancel} className="p-2 bg-gray-500 text-white rounded">
              Cancel
            </button>
          )}
          <button onClick={onConfirm ?? undefined} className="p-2 bg-blue-500 text-white rounded">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationAlert;