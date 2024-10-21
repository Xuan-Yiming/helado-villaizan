import { useState, useEffect } from 'react';
import { Encuesta } from "@/app/lib/types";

interface EncuestaHeaderProps {
    encuesta: Encuesta | null;
    onUpdate: (updatedEncuesta: Encuesta) => void; // Add onUpdate callback
}

export default function EncuestaHeader({ encuesta, onUpdate }: EncuestaHeaderProps) {
    const [title, setTitle] = useState(encuesta?.title || '');
    const [description, setDescription] = useState(encuesta?.description || '');
    const [startDate, setStartDate] = useState(encuesta?.start_date || '');
    const [endDate, setEndDate] = useState(encuesta?.end_date || '');

    useEffect(() => {
        onUpdate({
            ...encuesta,
            title,
            description,
            start_date: startDate,
            end_date: endDate,
        } as Encuesta);
    }, [title, description, startDate, endDate]);

    return (
        <div className="p-4 mx-auto">
            <div className="card bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Información Basica</h2>
                <input
                    type="text"
                    placeholder="Título"
                    className="w-full p-2 mb-4 font-bold text-xl border-b-2"
                    required
                    defaultValue={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Descripción"
                    className="w-full p-2 mb-4 border-b-2"
                    defaultValue={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex justify-between mb-4">
                    <p className="font-bold"> Fecha de encuesta </p>
                    <div className="flex items-center">
                        <input
                            type="date"
                            placeholder="Start Date"
                            className="w-1/2 p-2 mr-2"
                            required
                            defaultValue={startDate ? new Date(startDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <p> a </p>
                        <input
                            type="date"
                            placeholder="End Date"
                            className="w-1/2 p-2 ml-2"
                            required
                            defaultValue={endDate ? new Date(endDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}