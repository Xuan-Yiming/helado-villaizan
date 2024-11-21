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
import { useError } from "@/app/context/errorContext";
import { useConfirmation } from "@/app/context/confirmationContext";
import { useSuccess } from "@/app/context/successContext";

interface CuentasCardProps {
  user: UserAccount;
}

export default function CuentasCard({ user }: CuentasCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(user.active);
  const { showError } = useError();
  const { showConfirmation } = useConfirmation();
  const { showSuccess } = useSuccess();

  const handleToggle = async () => {

  
    showConfirmation(
      `Are you sure you want to ${isActive ? "deactivate" : "activate"} this user?`,
      async () => {
        try {
          if (isActive) {
            await deactivate_user(user.id);
            showSuccess("User deactivated successfully!");
          } else {
            await activate_user(user.id);
            showSuccess("User activated successfully!");
          }
          setIsActive(!isActive);
        } catch (error) {
          showError(
            `Error ${isActive ? "deactivating" : "activating"} user: ` + error
          );
        }
      }
    );
  };

  const handleDelete = async () => {

    showConfirmation(
      "Are you sure you want to delete this user?",
      async () => {
        setIsLoading(true);
        try {
          await delete_user(user.id);
          showSuccess("User deleted successfully!");
          window.location.reload();
        } catch (error) {
          showError("Error deleting user: " + error);
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  return (
    <li className="min-w-full border rounded border-gray-300 p-4 m-1 rounded-xl bg-white mx-auto flex flex-col md:flex-row justify-between w-full md:w-3/4">
      {/* info */}
      <div className="flex flex-row justify-between ">
        <div className="flex justify-between w-full md:w-auto">
          <div className="flex items-center">
            {user.photo && (
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 mr-4">
                <Image
                  src={user.photo}
                  alt="User Photo"
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                  loader={({ src }) => src}
                />
                </div>
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
        <Link href={`/pages/cuentas/empleados/crear?id=${user.id}`} className="flex items-center text-blue-500 hover:text-blue-700 ml-5">
          <PencilSquareIcon className="h-5 w-5 mr-2" />
          <div>Editar</div>
        </Link>
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
