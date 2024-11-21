'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PlusCircleIcon, DocumentArrowUpIcon } from '@heroicons/react/24/solid';

import EncuestaHeader from '@/app/ui/encuesta/encuesta-header';
import EncuestaNode from '@/app/ui/encuesta/encuesta-node';

import { Encuesta, Question } from '@/app/lib/types';
import { load_survey_by_id } from '@/app/lib/database';
import { upload_survey } from '@/app/lib/database';

function EncuestaPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    
    const [encuesta, setEncuesta] = useState<Encuesta | null>(null);

    useEffect(() => {
        const fetchEncuesta = async () => {
            if (!id) {
                setEncuesta({
                    id: '',
                    title: '',
                    status: 'activo',
                    start_date: '',
                    end_date: '',
                    creator_id: '', 
                    questions: []
                });
                return;
            }
            try {
                const data = await load_survey_by_id(id,false);
                //console.log('Encuesta:', data);
                setEncuesta(data);
            } catch (error) {
                throw new Error('Error fetching encuesta:');
            }
        };

        fetchEncuesta();
    }, [id]);

    function handleSave() {
        //console.log('Guardando encuesta...');
    }

    function handleAddQuestion() {
        if (encuesta) {
            const updatedQuestions = [
                ...(encuesta.questions || []),
                {
                    id: `${Date.now()}`, // Generate a unique ID for the new question
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
            //console.log('Submitting encuesta:', JSON.stringify(encuesta));
            
            if (encuesta) {
                await upload_survey(encuesta);
                
                router.push('/pages/preferencias-de-clientes/encuestas');
            }
            // Perform any necessary actions, such as sending data to an API
        } catch (error) {
            throw new Error('Error guardando la encuesta');
        }
    }

    return (
        <main>            
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Detalle de la Encuesta</h1>

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
                        type="button" // Prevent form validation
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