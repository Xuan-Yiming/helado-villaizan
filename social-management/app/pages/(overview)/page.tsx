'use client';

import { useEffect } from 'react';
import { useError } from "@/app/context/errorContext";
import { useConfirmation } from "@/app/context/confirmationContext";
import { useSuccess } from "@/app/context/successContext";
import Image from 'next/image';

export default function Page() {
  const { showError } = useError();
  const { showConfirmation, showAlert } = useConfirmation();
  const { showSuccess } = useSuccess();

  const handleClick = () => {
    showError("An error occurred! Please try again.");
  };

  const handleDelete = () => {
    showConfirmation(
      "Are you sure you want to delete this item?",
      () => {
        // Handle confirm action
        console.log("Item deleted");
        showSuccess("Item successfully deleted!");
      },
      () => {
        // Handle cancel action
        console.log("Deletion cancelled");
      }
    );
  };

  const handleAlert = () => {
    showAlert(
      "This is an alert with a single confirmation button.",
      () => {
        // Handle confirm action
        console.log("Alert confirmed");
      }
    );
  };

  useEffect(() => {
    // This ensures that the error state is only managed on the client side
  }, []);

  return (
    <main className='bg-white'>
      <h1 className="font-bold text-4xl">Bienvenido a Social Hub</h1>
      <button onClick={handleClick}>Trigger Error</button>
      <button onClick={handleDelete}>Trigger Confirmation</button>
      <button onClick={handleAlert}>Trigger Alert</button>
      <div className="flex justify-center mt-4">
        <Image
          src="/images/Community-Management.jpg"
          alt="Social Dashboard"
          width={500}
          height={500}
        />
      </div>
    </main>
  );
}