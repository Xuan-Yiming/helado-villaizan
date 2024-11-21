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
import { Campaign } from "@/app/lib/types";
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
  campaign: Campaign;
}

export default function CampanasCard({ campaign }: CampanasCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(campaign.status === "ACTIVE");
  const { showError } = useError();
  const { showConfirmation } = useConfirmation();
  const { showSuccess } = useSuccess();

  const handleDelete = async () => {
    showConfirmation(
      "Are you sure you want to delete this survey?",
      async () => {
        setIsLoading(true);
        try {
          await delete_survey(campaign.id);
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

  const handleToggle = async () => {

  
    showConfirmation(
      `Are you sure you want to ${isActive ? "deactivate" : "activate"} this user?`,
      async () => {
        try {
          if (isActive) {
            showSuccess("User deactivated successfully!");
          } else {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Activo";
      default:
        return "Pausado";
    }
  };

  return (
    <li className="min-w-full border rounded border-gray-300 p-4 m-1 rounded-xl bg-white mx-auto flex flex-col md:flex-row justify-between w-full md:w-3/4">
      <div className="flex justify-between w-full md:w-auto">
        <div className="flex items-center">
          <div className="flex items-center space-x-2 w-[100px]">
            <div
              className={`w-3 h-3 rounded-full ${getStatusColor(
                campaign.status
              )}`}
            ></div>{" "}
            {/* Bolita de estado */}
            <span className="text-xs font-semibold text-gray-700">
              {getStatusLabel(campaign.status)}
            </span>
          </div>
          <div className="w-10 text-black md:w-10">
            <MegaphoneIcon />
          </div>
          <div className="flex flex-col justify-between w-full md:w-auto">
            <p className="p-2 pb-0 space-x-4">{campaign.name}</p>
            <p className="p-2 pb-0 text-xs text-gray-700">
              {campaign.objective}
            </p>
            <p className="p-2 pb-0 text-xs text-gray-700">
              {" "}
              PEN {campaign.budget}
            </p>
            <div className="p-2 pt-0 text-xs text-gray-700">
              {campaign.start_date &&
                new Date(campaign.start_date).toLocaleString()}
              {" - "}
              {campaign.end_date && new Date(campaign.end_date).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Link
          href={`/pages/publicaciones/campanas/anuncios?id=${campaign.id}`}
          className="flex items-center text-black-500 hover:text-blue-700 ml-5"
        >
          <EyeIcon className="h-5 w-5 mr-2" />
          <div>Ver Anuncios</div>
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
