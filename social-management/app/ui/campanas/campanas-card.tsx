import {
  MegaphoneIcon,
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
import { Campage } from "@/app/lib/types";
import { inter } from "../fonts";
import { useState } from "react";

import {
  delete_survey,
  disable_survey,
  activate_survey,
} from "@/app/lib/database";
import { useError } from "@/app/context/errorContext";
import { useConfirmation } from "@/app/context/confirmationContext";
import { useSuccess } from "@/app/context/successContext";

interface CampanasCardProps {
  campage: Campage;
}

export default function CampanasCard({ campage }: CampanasCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(campage.status === "ACTIVE");
  const { showError } = useError();
  const { showConfirmation } = useConfirmation();
  const { showSuccess } = useSuccess();

  const handleDelete = async () => {
    showConfirmation(
      "Are you sure you want to delete this survey?",
      async () => {
        setIsLoading(true);
        try {
          await delete_survey(campage.id);
          showSuccess("Survey deleted successfully!");
          window.location.reload();
        } catch (error) {
          showError("Error deleting survey: " + error);
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  return (
    <li className="min-w-full border rounded border-gray-300 p-4 m-1 rounded-xl bg-white mx-auto flex flex-col md:flex-row justify-between w-full md:w-3/4">
      <div className="flex justify-between w-full md:w-auto">
        <div className="flex items-center">
          <div className="w-10 text-black md:w-10">
            <MegaphoneIcon />
          </div>
          <div className="flex flex-col justify-between w-full md:w-auto">
            <p className="p-2 pb-0 space-x-4">{campage.name}</p>
            <p className="p-2 pb-0 text-xs text-gray-700">{campage.objective}</p>
            <div className="p-2 pt-0 text-xs text-gray-700">
              {campage.start_date &&
                new Date(campage.start_date).toLocaleString()}
              {" - "}
              {campage.end_date && new Date(campage.end_date).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Link
          href={`/pages/preferencias-de-clientes/encuestas/resultado?id=${campage.id}`}
          className="flex items-center text-black-500 hover:text-blue-700 ml-5"
        >
          <EyeIcon className="h-5 w-5 mr-2" />
          <div>Ver Anuncios</div>
        </Link>

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
