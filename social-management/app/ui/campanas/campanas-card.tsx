import {
  MegaphoneIcon,
  EyeIcon,
  TrashIcon,
  HandRaisedIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";
import Link from "next/link";
import { Campaign } from "@/app/lib/types";
import { useError } from "@/app/context/errorContext";
import { useConfirmation } from "@/app/context/confirmationContext";
import { useSuccess } from "@/app/context/successContext";
import { update_campaign_status } from "@/app/lib/data";

interface CampanasCardProps {
  campaign: Campaign;
  onActivate: () => Promise<void>;
  onPause: () => Promise<void>;
}

export default function CampanasCard({
  campaign,
  onActivate,
  onPause,
}: CampanasCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useError();
  const { showConfirmation } = useConfirmation();
  const { showSuccess } = useSuccess();

  const handleToggleStatus = async () => {
    showConfirmation(
      `¿Estás seguro de que deseas ${
        campaign.status === "ACTIVE" ? "pausar" : "activar"
      } esta campaña?`,
      async () => {
        setIsLoading(true);
        try {
          if (campaign.status === "ACTIVE") {
            await onPause(); // Llama a la función pasada como prop
            showSuccess("Campaña pausada exitosamente.");
          } else {
            await onActivate(); // Llama a la función pasada como prop
            showSuccess("Campaña activada exitosamente.");
          }
        } catch (error) {
          showError(
            `Error al ${
              campaign.status === "ACTIVE" ? "pausar" : "activar"
            } la campaña: ${error}`
          );
        } finally {
          setIsLoading(false);
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
            ></div>
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
            <div className="p-2 pt-0 text-xs text-gray-700">
              {campaign.start_time &&
                new Date(campaign.start_time).toLocaleString()}
              {" - "}
              {campaign.stop_time &&
                new Date(campaign.stop_time).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Link
          href={`/pages/publicaciones/campanas/addsets?id=${campaign.id}`}
          className="flex items-center text-black-500 hover:text-blue-700 ml-5"
        >
          <EyeIcon className="h-5 w-5 mr-2" />
          <div>Ver Addsets</div>
        </Link>

        <button
          onClick={handleToggleStatus}
          className={`flex items-center ${
            campaign.status === "ACTIVE"
              ? "text-red-500 hover:text-red-700"
              : "text-green-500 hover:text-green-700"
          } ml-5`}
          disabled={isLoading}
        >
          <HandRaisedIcon className="h-5 w-5 mr-2" />
          {campaign.status === "ACTIVE" ? "Pausar" : "Activar"}
        </button>
      </div>
    </li>
  );
}
