'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlusCircleIcon, DocumentArrowUpIcon } from '@heroicons/react/24/solid';

import EncuestaHeader from '@/app/ui/encuesta/encuesta-header';
import EncuestaNode from '@/app/ui/encuesta/encuesta-node';

import { Encuesta } from '@/app/lib/types';
import { load_survey_by_id } from '@/app/lib/data';

export default function Page() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [isActive, setIsActive] = useState(false);
    const [encuesta, setEncuesta] = useState<Encuesta | null>(null);

    useEffect(() => {
        const fetchEncuesta = async () => {
            if (!id) {
                return;
            }
            try {
                const data = await load_survey_by_id(id);
                setEncuesta(data);
            } catch (error) {
                console.error('Error fetching encuesta:', error);
            }
        };

        fetchEncuesta();
    }, [id]);

    function handleSave() {
        console.log('Guardando encuesta...');
    }

    function handleAddQuestion() {
        if (encuesta) {
            const updatedQuestions = [
                ...(encuesta.questions || []),
                {
                    title: '',
                    type: 'open_text',
                },
            ];
            setEncuesta({ ...encuesta, questions: updatedQuestions });
        }
    }

    return (
        <main>
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Detalle de la Encuesta</h1>

                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`flex items-center ml-5 rounded px-4 py-2 ${isActive ? 'bg-black text-white' : 'border border-black bg-transparent text-black'}`}
                >
                    {isActive ? 'Desactivar' : 'Activar'}
                </button>
            </div>

            <form className="p-4 mx-auto">
                <EncuestaHeader encuesta={encuesta} />

                {encuesta?.questions?.map((question, index) => (
                    <EncuestaNode key={index} question={question} />
                ))}
            </form>
            <div className="flex justify-center mt-4">
                <button
                    className="flex items-center ml-5 rounded px-4 py-2 bg-black text-white"
                    onClick={handleAddQuestion}
                >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Nueva Pregunta
                </button>

                <button
                    className="flex items-center ml-5 rounded px-4 py-2 bg-[#BD181E] text-white"
                    onClick={handleSave}
                >
                    <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                    Guardar
                </button>
            </div>
        </main>
    );
}