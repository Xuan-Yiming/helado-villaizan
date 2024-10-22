'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PlusCircleIcon, DocumentArrowUpIcon } from '@heroicons/react/24/solid';

import EncuestaHeader from './encuesta-header';
import EncuestaNode from './encuesta-node';
import Error from '@/app/ui/error'; // Import the Error component

import { Encuesta, Question, Response,Answer } from '@/app/lib/types';
import { load_survey_by_id } from '@/app/lib/data';
import { submit_survey_response } from '@/app/lib/data';

function EncuestaPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();

    const [encuesta, setEncuesta] = useState<Encuesta>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message
    const [response, setResponse] = useState<Response>();

    useEffect(() => {
        const fetchEncuesta = async () => {
            if (!id) {
                router.push('/404');
                return;
            }else{
                try {
                    const data = await load_survey_by_id(id);
                    setEncuesta(data);
                } catch (error) {
                    console.error('Error fetching encuesta:', error);
                    setErrorMessage('Error fetching encuesta');
                }
            }
        };

        fetchEncuesta();
    }, [id]);

    useEffect(() => {
        if (encuesta) {
            initializeResponse();
        }
    }, [encuesta]);

    async function initializeResponse() {
        if (encuesta) {
            setResponse({
                id: '',
                date: new Date().toISOString(),
                answers: encuesta?.questions?.map((question) => ({
                    question_id: question.id,
                    answer: ''
                })) as Answer[] // Add type assertion here
            });

            console.log('Initializing response:', response);
        }
        console.log('Encuesta:', encuesta);
    }

    function handleUpdateAnswer(updatedAnswer: Answer) {
        if (response) {
            const updatedAnswers = response.answers.map((answer) => {
                if (answer.question_id === updatedAnswer.question_id) {
                    return updatedAnswer;
                }
                return answer;
            });
            setResponse({
                ...response,
                answers: updatedAnswers
            });
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            console.log('Submitting response:', response);
            
            if (encuesta && response) { // Add null check for 'response'
                await submit_survey_response(encuesta.id, response);
            }
            // Perform any necessary actions, such as sending data to an API
        } catch (error) {
            console.error('Error guardando la encuesta:', error);
            setErrorMessage('Error guardando la encuesta');
        }
    }

    return (
        <main>
            {errorMessage && <Error key={errorMessage} message={errorMessage} />} {/* Display the Error component */}
            
            <form className="p-4 mx-auto sm:w-full lg:w-1/2" onSubmit={handleSubmit}>
                {encuesta && (
                    <EncuestaHeader encuesta={encuesta} />
                )}

                {encuesta?.questions?.map((question, index) => (
                    <EncuestaNode
                        key={index}
                        question={question}
                        onUpdate={handleUpdateAnswer}
                    />
                ))}

                <div className="flex justify-center mt-4">

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