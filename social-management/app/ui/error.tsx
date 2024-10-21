import React from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';

interface ErrorProps {
  message: string;
}

const Error: React.FC<ErrorProps> = ({ message }) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    setVisible(true); // Reset visibility when message changes
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-600 bg-opacity-50 text-white text-center py-2 z-50 flex items-center justify-center">
      <XCircleIcon className="h-5 w-5 mr-2" />
      <p>{message}</p>
    </div>
  );
};

export default Error;