import React from 'react';
import { Encuesta } from '@/app/lib/types';
import EncuestaCard from './encuesta-card';
import { useEffect, useState } from 'react';

import { load_all_survey } from '@/app/lib/database';

interface EncuestaListProps {
    initialEncuestas: Encuesta[];
    estadoFilter: string;
}

const NUMBER_OF_POSTS_TO_FETCH = 20;

export default function EncuestaList({
    initialEncuestas,
    estadoFilter
}: EncuestaListProps) {
    const [offset, setOffset] = useState(0);
    const [encuestas, setEncuestas] = useState<Encuesta[]>(initialEncuestas);
    const [isLoading, setIsLoading] = useState(false);

    const loadMoreEncuestas = async () => {
        setIsLoading(true);
        try {
            const apiEncuestas = await load_all_survey(
                offset,
                NUMBER_OF_POSTS_TO_FETCH,
                estadoFilter,
                false,
                false
            );
            if (Array.isArray(apiEncuestas)) {
                setEncuestas(encuestas => [...encuestas, ...apiEncuestas]);
                setOffset(offset => offset + NUMBER_OF_POSTS_TO_FETCH);
            } else {
                console.error('Error: apiEncuestas is not an array', apiEncuestas);
            }
        } catch (error) {
            console.error('Error loading more encuestas:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Clear encuestas and reset offset when estadoFilter changes
        setEncuestas([]);
        setOffset(0);
        loadMoreEncuestas();
    }, [estadoFilter]);

    return (
        <div>
            <ul className="mt-6 flex flex-col gap-2 list-none p-0 min-w-full">
                {encuestas.map(encuesta => (
                    <EncuestaCard key={encuesta.id} encuesta={encuesta} />
                ))}
            </ul>
            <div className="flex justify-center mt-10">
                <button
                    onClick={loadMoreEncuestas}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Load More'}
                </button>
            </div>
        </div>
    );
}