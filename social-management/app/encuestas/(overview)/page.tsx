'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

import EncuestaHeader from '../encuesta-header';
import EncuestaNode from '../encuesta-node';

import { Encuesta, Question, Response,Answer } from '@/app/lib/types';
import { is_survey_available, load_survey_by_id } from '@/app/lib/database';
import { submit_survey_response } from '@/app/lib/database';
import { check_survey_response } from '@/app/lib/database';
import { useError } from '@/app/context/errorContext';

function EncuestaPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();

    const [encuesta, setEncuesta] = useState<Encuesta>();
    const [response, setResponse] = useState<Response>();
    const [isSubmitting, setIsSubmitting] = useState(false); // Add state variable for submission status
    const { showError } = useError();

    const [ip, setIp] = useState<string>('');

    useEffect(() => {
        const fetchClientIp = async () => {
          try {
            const response = await fetch('/api/getClientIp');
            const data = await response.json();
            setIp(data.ip);
            //console.log('Client IP:', data.ip);
          } catch (error) {
            showError('Error fetching client IP:'+ error);
            router.push('/encuestas/error'); 
          }
        };
    
        fetchClientIp();
      }, []);

    useEffect(() => {
        const fetchEncuesta = async () => {
            if (!id) {
                router.push('/404');
                return;
            }else{
                try {
                    if (await check_survey_response(id, ip)) {
                        return router.push('/encuestas/respondido');   
                    }else{
                        
                        if ( await is_survey_available(id)){
                            const data = await load_survey_by_id(id, false);
                            setEncuesta(data);
                            //console.log("data: ", data)
                        }else{
                            return router.push('/encuestas/error'); 
                        }
                    }

                } catch (error:any) {
                    showError('Error fetching encuesta: '+ error.message);
                }
            }
        };

        fetchEncuesta();
    }, [ip]);

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

        }
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
        event.preventDefault(); // Prevent form submission

        try {
            //console.log('Submitting response:', response);

            if (encuesta && response) { // Add null check for 'response'
                response.ip = ip;
                setIsSubmitting(true); // Set submission status to true
                await submit_survey_response(encuesta.id, response);
                router.push('/encuestas/gracias');
            }
            // Perform any necessary actions, such as sending data to an API
        } catch (error:any) {
            showError('Error guardando la encuesta: ' + error.message);
        } finally {
            setIsSubmitting(false); // Reset submission status to false
        }
    }

    return (
        <main>            
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
                        <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                        Enviar la respuesta
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