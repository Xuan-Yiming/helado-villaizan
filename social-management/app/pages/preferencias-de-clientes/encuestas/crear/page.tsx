'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PlusCircleIcon, DocumentArrowUpIcon } from '@heroicons/react/24/solid';

import EncuestaHeader from '@/app/ui/encuesta/encuesta-header';
import EncuestaNode from '@/app/ui/encuesta/encuesta-node';

import { Encuesta, Question } from '@/app/lib/types';
import { load_survey_by_id, upload_survey } from '@/app/lib/database';
import { getUserIdFromCookies } from '@/app/lib/auth'; // Importa la función para obtener el user_id

function EncuestaPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();

    const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Nuevo estado para el User ID

    useEffect(() => {
        const fetchEncuesta = async () => {
            const userIdFromCookies = getUserIdFromCookies(); // Obtiene el ID dinámico desde las cookies
            setUserId(userIdFromCookies); // Guarda el ID en el estado para mostrarlo en pantalla

            if (!id) {
                setEncuesta({
                    id: '',
                    title: '',
                    status: 'activo',
                    start_date: '',
                    end_date: '',
                    creator_id: userIdFromCookies || '', // Asigna el ID dinámico
                    questions: [],
                });
                return;
            }
            try {
                const data = await load_survey_by_id(id, false);
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
                    id: `${Date.now()}`, // Genera un ID único para la nueva pregunta
                    title: '',
                    type: 'open_text',
                },
            ];
            setEncuesta({ ...encuesta, questions: updatedQuestions });
        }
    }

    function handleDeleteQuestion(questionId: string) {
        if (encuesta) {
            const updatedQuestions = encuesta.questions?.filter(question => question.id !== questionId);
            setEncuesta({ ...encuesta, questions: updatedQuestions });
        }
    }

    function handleUpdateQuestion(updatedQuestion: Question) {
        if (encuesta) {
            const updatedQuestions = encuesta.questions?.map(question =>
                question.id === updatedQuestion.id ? updatedQuestion : question
            );
            setEncuesta({ ...encuesta, questions: updatedQuestions });
        }
    }

    function handleUpdateEncuesta(updatedEncuesta: Encuesta) {
        setEncuesta(updatedEncuesta);
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            if (encuesta) {
                await upload_survey(encuesta);
                router.push('/pages/preferencias-de-clientes/encuestas');
            }
        } catch (error) {
            console.error('Error guardando la encuesta:', error);
        }
    }

    return (
        <main>
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Detalle de la Encuesta</h1>
            </div>

            {/* Muestra el User ID en pantalla */}
            <div className="p-4">
                <p className="text-gray-600">
                    <strong>User ID obtenido de cookies:</strong> {userId || 'No disponible'}
                </p>
            </div>

            <form className="p-4 mx-auto sm:w-full lg:w-1/2" onSubmit={handleSubmit}>
                {encuesta && (
                    <EncuestaHeader encuesta={encuesta} onUpdate={handleUpdateEncuesta} />
                )}

                {encuesta?.questions?.map((question, index) => (
                    <EncuestaNode
                        key={index}
                        question={question}
                        onDelete={handleDeleteQuestion}
                        onUpdate={handleUpdateQuestion}
                        isEditable={true}
                    />
                ))}

                <div className="flex justify-center mt-4">
                    <button
                        type="button"
                        className="flex items-center ml-5 rounded px-4 py-2 bg-black text-white"
                        onClick={handleAddQuestion}
                    >
                        <PlusCircleIcon className="h-5 w-5 mr-2" />
                        Nueva Pregunta
                    </button>

                    <button
                        type="submit"
                        className="flex items-center ml-5 rounded px-4 py-2 bg-[#BD181E] text-white"
                    >
                        <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                        Guardar
                    </button>
                </div>
            </form>
        </main>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EncuestaPage />
        </Suspense>
    );
}
