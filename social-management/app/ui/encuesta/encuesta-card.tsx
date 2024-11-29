
import { DocumentTextIcon, PencilSquareIcon, EyeIcon, DocumentDuplicateIcon, TrashIcon, HandRaisedIcon, LinkIcon} from "@heroicons/react/24/solid";
import React from "react";
import Link from "next/link";
import { Encuesta } from "@/app/lib/types";
import { inter } from "../fonts";
import { useState } from 'react';

import { delete_survey, disable_survey, activate_survey } from "@/app/lib/database";
import { useError } from "@/app/context/errorContext";
import { useConfirmation } from "@/app/context/confirmationContext";
import { useSuccess } from "@/app/context/successContext";

interface EncuestaCardProps {
    encuesta: Encuesta
}

export default function EncuestaCard( {encuesta}: EncuestaCardProps){
    const [isLoading, setIsLoading] = useState(false);
    const [isActive, setIsActive] = useState(encuesta.status === 'activo');
    const { showError } = useError();
    const { showConfirmation } = useConfirmation();
    const { showSuccess } = useSuccess();

    const handleToggle = async () => {
      showConfirmation(
        `¿Está seguro que desea ${isActive ? "desactivar" : "activar"} esta encuesta?`,
        async () => {
          try {
            if (isActive) {
              await disable_survey(encuesta.id);
              showSuccess("Encuesta desactivada exitosamente!");
            } else {
              await activate_survey(encuesta.id);
              showSuccess("Encuesta activada exitosamente!");
            }
            setIsActive(!isActive);
          } catch (error) {
            showError(
              `Error ${isActive ? "disabling" : "activating"} survey: ` + error
            );
          }
        }
      );
    };

    const handleDelete = async () => {
      showConfirmation(
        "¿Está seguro que desea eliminar esta encuesta?",
        async () => {
          setIsLoading(true);
          try {
            await delete_survey(encuesta.id);
            showSuccess("Encuesta eliminada exitosamente!");
            window.location.reload();
          } catch (error) {
            showError("Error deleting survey: " + error);
          } finally {
            setIsLoading(false);
          }
        }
      );
    };

    return(
        <li className="min-w-full border rounded border-gray-300 p-4 m-1 rounded-xl bg-white mx-auto flex flex-col md:flex-row justify-between w-full md:w-3/4">
            
            <div className="flex justify-between w-full md:w-auto">
                <div className="flex items-center">
                    <div className="w-10 text-black md:w-10">
                        <DocumentTextIcon />
                    </div>
                    <div className="flex flex-col justify-between w-full md:w-auto">
                        <p className="p-2 pb-0 space-x-4">
                            {encuesta.title}
                        </p>
                        <div className="p-2 pt-0 text-xs text-gray-700">
                            {encuesta.start_date && new Date(encuesta.start_date).toLocaleString()}
                            {' - '}
                            {encuesta.end_date && new Date(encuesta.end_date).toLocaleString()}
                        </div>
                        <div className="p-2 pt-0 text-xs text-gray-700">
                        <Link href={`https://helado-villaizan.vercel.app/encuestas?id=${encuesta.id}`} className="text-blue-500 hover:text-blue-700">
                           {`https://helado-villaizan.vercel.app/encuestas?id=${encuesta.id}`}
                        </Link>
                    </div>
                    </div>

                </div>
            </div>
            <div className="flex items-center">
                <Link 
                href={`/pages/preferencias-de-clientes/encuestas/resultado?id=${encuesta.id}`}
                className="flex items-center text-black-500 hover:text-blue-700 ml-5"
                >
                        <EyeIcon className="h-5 w-5 mr-2" />
                        <div>Resultado</div>
                </Link>
                <Link 
                href={`/pages/preferencias-de-clientes/encuestas/crear?id=${encuesta.id}`}
                className="flex items-center text-black-500 hover:text-blue-700 ml-5"
                >
                        <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
                        <div>Duplicar</div>
                </Link>

                <button
                    onClick={handleToggle}
                    className={`flex items-center ${!isActive ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'} ml-5`}
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
    )
}