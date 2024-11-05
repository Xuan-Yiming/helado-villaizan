'use client';

import { useEffect } from 'react';
import { useError } from "@/app/context/errorContext";

export default function Page() {
  const { showError } = useError();

  const handleClick = () => {
    showError("An error occurred! Please try again.");
  };

  useEffect(() => {
    // This ensures that the error state is only managed on the client side
  }, []);

  return (
    <main>
      <h1 className="font-bold text-4xl">Bienvenido a Social Hub</h1>
      <button onClick={handleClick}>Trigger Error</button>
    </main>
  );
}