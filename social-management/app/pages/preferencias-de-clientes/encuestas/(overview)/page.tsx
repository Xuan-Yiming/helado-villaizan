'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';


import { AdjustmentsHorizontalIcon, PlusCircleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

import { Encuesta } from '@/app/lib/types';

import FilterSelect from '@/app/ui/mensajes/filter-select';
import EncuestaList from '@/app/ui/encuesta/encuesta-list';
import EncuestaCard from '@/app/ui/encuesta/encuesta-card';

import {load_all_survey} from '@/app/lib/database';

const NUMBER_OF_POSTS_TO_FETCH = 20;


export default function Page(){
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [estadoFilter, setEstadoFilter] = useState('all');
    const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const hasLoaded = useRef(false);


    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const resetFilters = () => {
        setEstadoFilter('all');
    };


    const loadMoreEncuestas = async (_offset: number) => {
        setIsLoading(true);
        try {
            const apiEncuestas = await load_all_survey(
                _offset,
                NUMBER_OF_POSTS_TO_FETCH,
                estadoFilter,
                false,
                false
            );
            if (Array.isArray(apiEncuestas)) {
                setEncuestas(encuestas => [...encuestas, ...apiEncuestas]);
                setOffset(offset => _offset + NUMBER_OF_POSTS_TO_FETCH);
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
        if (!hasLoaded.current) {
            loadMoreEncuestas(0);
            hasLoaded.current = true;
        }
    }, []);

    async function reset(){
        setEncuestas([]);
    }

    const handleAplicarFiltro  = async () => {
        await reset();
        await loadMoreEncuestas(0);
    };


    return (
        <main>
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Todas las publicaciones</h1>
                <div className="flex items-center">
                <button
                    onClick={toggleFilters}
                    className={`flex items-center ml-5 rounded px-4 py-2 ${filtersVisible ? 'bg-black text-white' : 'border border-black bg-transparent text-black'
                        }`}
                >
                    <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                    <div>Filtrar</div>
                </button>

                <Link
                    href="/pages/preferencias-de-clientes/encuestas/crear"
                    className={`flex items-center ml-5 rounded px-4 py-2 ${filtersVisible ? 'bg-[#BD181E] text-white' : 'border border-black bg-transparent text-black'
                        }`}
                >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    <div>Nuevo</div>
                </Link>

                </div>

            </div>
                
            {/* Filtros */} 
            {filtersVisible && (
                <div className="flex justify-between mt-4">
                    <FilterSelect
                        label="Estado"
                        id="response-filter"
                        options={[
                            { value: 'all', label: 'Ver todo' },
                            { value: 'activo', label: 'Activo' },
                            { value: 'desactivo', label: 'Desactivo' },
                        ]}
                        value={estadoFilter}
                        onChange={setEstadoFilter}
                    />

                    <div className="flex-1 h-15 mx-1 flex justify-center items-center">
                        <button
                            className="flex items-center text-[#BD181E] underline px-4 py-2 hover:text-black border-none"
                            onClick={resetFilters}
                        >
                            <XMarkIcon className="h-5 w-5 mr-2" />
                            <div>Limpiar Filtro</div>
                        </button>
                    </div>

                    <div className="flex-1 h-15 mx-1 flex justify-center items-center">
                        <button
                            className="flex items-center text-blue-500 underline px-4 py-2 hover:text-black border-none"
                            onClick={handleAplicarFiltro}
                        >
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            <div>Aplicar el Filtro</div>
                        </button>
                    </div>
                </div>
            )}
            {/* Encuestas */}
            {/* <EncuestaList 
                initialEncuestas={encuestas} 
                estadoFilter={estadoFilter} 
            /> */}

            <ul className="mt-6 flex flex-col gap-2 list-none p-0 min-w-full">
                {encuestas.map(encuesta => (
                    <EncuestaCard key={encuesta.id} encuesta={encuesta} />
                ))}
            </ul>
            <div className="flex justify-center mt-10">
                <button
                    onClick={() => loadMoreEncuestas(offset)}
                    className="px-4 py-2 text-[#BD181E] "
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Cargar Mas'}
                </button>
            </div>
        </main>
    )
}