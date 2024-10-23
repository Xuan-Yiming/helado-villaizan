import { useState, useEffect } from 'react';
import { Encuesta } from "@/app/lib/types";

interface EncuestaHeaderProps {
    encuesta: Encuesta | null;
}

export default function EncuestaHeader({ encuesta }: EncuestaHeaderProps) {

    return (
        <div className="p-4 mx-auto">
            <div className="card bg-white shadow-md rounded-lg p-6">
                <input
                    type="text"
                    placeholder="Título"
                    className="w-full p-2 mb-4 font-bold text-xl border-b-2"
                    required
                    defaultValue={encuesta?.title}
                    disabled
                />
                <textarea
                    placeholder="Descripción"
                    className="w-full p-2 mb-4 border-b-2"
                    defaultValue={encuesta?.description}
                    disabled
                />
                <div className="flex justify-between mb-4">
                    <p className="font-bold"> Fecha de encuesta </p>
                    <div className="flex items-center">
                        <input
                            type="date"
                            placeholder="Start Date"
                            className="w-1/2 p-2 mr-2"
                            required
                            defaultValue={encuesta?.start_date ? new Date(encuesta?.start_date).toISOString().split('T')[0] : ''}
                            disabled
                        />
                        <p> a </p>
                        <input
                            type="date"
                            placeholder="End Date"
                            className="w-1/2 p-2 ml-2"
                            required
                            defaultValue={encuesta?.end_date ? new Date(encuesta?.end_date).toISOString().split('T')[0] : ''}
                            disabled
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}