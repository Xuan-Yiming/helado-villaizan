'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { Encuesta, Question, Response,Answer } from '@/app/lib/types';
import { load_survey_by_id } from '@/app/lib/data';

import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';

import Error from '@/app/ui/error'; 

import EncuestaHeader from '@/app/ui/encuesta/resultado-header';
import EncuestaNode from '@/app/ui/encuesta/resultado-node';

async function ResultadoPage(){
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();

    const [encuesta, setEncuesta] = useState<Encuesta>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message
    const [csvContent, setCsvContent] = useState<string>('');

    useEffect(() => {
        if(encuesta){
            const csv = convertToCSV(encuesta);
            setCsvContent(csv);
        }
    }, [encuesta]);

    const convertToCSV = (encuesta: Encuesta): string => {
        if (!encuesta.responses || !encuesta.questions) return '';
      
        // First row: 'idResponse, Question.title1, Question.title2, ...'
        const headers = [
          'idResponse',
          ...encuesta.questions.map((question) => question.title),
        ];
      
        // Next rows: 'id, answer1, answer2, ...'
        const rows = encuesta.responses.map((response) => {
          const answersMap = new Map(
            response.answers.map((answer) => [
                answer.question_id,
                answer.answer.replace(/,/g, '.'), // Replace commas with periods in answers
              ])
          );
          return [
            response.id,
            ...(encuesta.questions ? encuesta.questions.map((question) => answersMap.get(question.id) || '') : []),
          ];
        });
      
        const csvContent = [headers, ...rows]
          .map((row) => row.join(','))
          .join('\n');
      
        return csvContent;
      };
      
      // Function to trigger download of the CSV file
      const downloadCSV = (csvContent: string, filename: string) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.click();
      };
    
    useEffect(() => {
        const fetchEncuesta = async () => {
            if (!id) {
                router.push('/pages/preferencias-de-clientes/encuestas');
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

    function handleDescagarDatos(){
        downloadCSV(csvContent, 'encuesta.csv');
    };

    return (
        <main>
            {errorMessage && <Error key={errorMessage} message={errorMessage} />} {/* Display the Error component */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Resultados de la Encuesta</h1>

                <button
                        type="button"
                        className="flex items-center ml-5 rounded px-4 py-2 bg-[#BD181E] text-white"
                        onClick={handleDescagarDatos}
                    >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Descargar Resultado
                </button>
            </div>

            <form className="p-4 mx-auto sm:w-full lg:w-1/2">
                {encuesta && (
                    <EncuestaHeader encuesta={encuesta} />
                )}

                {encuesta?.questions?.map((question, index) => {
                    const answers = encuesta.responses
                        ?.flatMap(response => response.answers)
                        .filter(answer => answer.question_id === question.id)
                        .map(answer => answer.answer);
                    
                    return <EncuestaNode question={question} answers={answers} />;
                })}

            </form>
        </main>
    )
}


export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResultadoPage />
        </Suspense>
    );
}