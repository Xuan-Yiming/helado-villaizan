
import React from 'react';
import { Encuesta } from '@/app/lib/types';
import EncuestaCard from './encuesta-card';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { load_all_survey } from '@/app/lib/data';

interface EncuestaListProps {
    initialEncuestas: Encuesta[];
    estadoFilter: string;
}

const NUMBER_OF_POSTS_TO_FETCH = 20;

export default function EncuestaList({
    initialEncuestas,
    estadoFilter
}: EncuestaListProps) {
    const [offset, setOffset] = useState(NUMBER_OF_POSTS_TO_FETCH);
    const [encuestas, setEncuestas] = useState<Encuesta[]>(initialEncuestas);
    const { ref, inView } = useInView();

    const loadMoreEncuestas = async () => {
        try {
            const apiEncuestas = await load_all_survey(
                offset,
                offset / NUMBER_OF_POSTS_TO_FETCH + 1,
                estadoFilter
            );
            if (Array.isArray(apiEncuestas)) {
                setEncuestas(encuestas => [...encuestas, ...apiEncuestas]);
                setOffset(offset => offset + NUMBER_OF_POSTS_TO_FETCH);
            } else {
                console.error('Error: apiEncuestas is not an array', apiEncuestas);
            }
        } catch (error) {
            console.error('Error loading more encuestas:', error);
        }
    };

    useEffect(() => {
        if (inView) {
            loadMoreEncuestas();
        }
    }, [inView]);

    return (
        <ul className="mt-6 flex flex-col gap-2 list-none p-0 min-w-full">
            {encuestas.map(encuesta => (
                <EncuestaCard key={encuesta.id} encuesta={encuesta} />
            ))}
            <div ref={ref} className="flex justify-center mt-10">
                Loading...
            </div>
        </ul>
    );
}