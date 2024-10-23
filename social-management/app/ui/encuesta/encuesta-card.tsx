
import { DocumentTextIcon, PencilSquareIcon, EyeIcon} from "@heroicons/react/24/solid";
import React from "react";
import Link from "next/link";
import { Encuesta } from "@/app/lib/types";
import { inter } from "../fonts";

interface EncuestaCardProps {
    encuesta: Encuesta
}

export default function EncuestaCard( {encuesta}: EncuestaCardProps){
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
                    </div>
                    
                </div>
            </div>
            <div className="flex items-center">
                <Link 
                href={`/pages/preferencias-de-clientes/encuestas/resultado?id=${encuesta.id}`}
                className="flex items-center text-blue-500 hover:text-blue-700 ml-5"
                >
                        <EyeIcon className="h-5 w-5 mr-2" />
                        <div>Resultado</div>
                </Link>
                <Link 
                href={`/pages/preferencias-de-clientes/encuestas/crear?id=${encuesta.id}`}
                className="flex items-center text-blue-500 hover:text-blue-700 ml-5"
                >
                        <PencilSquareIcon className="h-5 w-5 mr-2" />
                        <div>Editar</div>
                </Link>
            </div>
        </li>
    )
}