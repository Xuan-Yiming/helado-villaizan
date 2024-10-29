import {
  DocumentTextIcon,
  PencilSquareIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  HandRaisedIcon,
  LinkIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import Link from "next/link";
import { UserAccount } from "@/app/lib/types";
import { useState } from "react";
import Image from "next/image";

import {
  delete_user,
  deactivate_user,
  activate_user,
} from "@/app/lib/database";

interface CuentasCardProps {
  user: UserAccount;
}

export default function CuentasCard({ user }: CuentasCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(user.active);

  const handleToggle = async () => {
    try {
      if (isActive) {
        await deactivate_user(user.id);
        console.log("Survey disabled successfully");
      } else {
        await activate_user(user.id);
        console.log("Survey activated successfully");
      }
      setIsActive(!isActive);
    } catch (error) {
      console.error(
        `Error ${isActive ? "disabling" : "activating"} survey:`,
        error
      );
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await delete_user(user.id);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting survey:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="min-w-full border rounded border-gray-300 p-4 m-1 rounded-xl bg-white mx-auto flex flex-col md:flex-row justify-between w-full md:w-3/4">
      {/* info */}
      <div className="flex flex-row justify-between ">
        <div className="flex justify-between w-full md:w-auto">
          <div className="flex items-center">
            {user.photo && (
              <Image
                src={user.photo}
                alt="Post image"
                className="mt-4 md:mt-0 md:ml-4 border rounded-md"
                width={50}
                height={50}
                loader={({ src }) => src} // Load image from URL
              />
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between w-full md:w-auto">
          <p className="p-2 pb-0 space-x-4 font-bold">
            {user.nombre}, {user.apellido} 
          </p>
          <div className="p-2 pt-0 text-xs text-gray-700">
            {user.username} - {user.role}
          </div>
        </div>
      </div>

{/* buttons */}
      <div className="flex items-center">
        <button
          onClick={handleToggle}
          className={`flex items-center ${
            !isActive
              ? "text-green-500 hover:text-green-700"
              : "text-red-500 hover:text-red-700"
          } ml-5`}
        >
          <HandRaisedIcon className="h-5 w-5 mr-2" />
          {isActive ? <div>Desactivar</div> : <div>Activar</div>}
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center text-red-500 hover:text-red-700 ml-5"
        >
          <TrashIcon className="h-5 w-5 mr-2" />
          {isLoading ? <div>Eliminando...</div> : <div>Eliminar</div>}
        </button>
      </div>
    </li>
  );
}
