'use client';

import FilterSelect from '@/app/ui/mensajes/filter-select';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { AdjustmentsHorizontalIcon, PlusCircleIcon } from '@heroicons/react/24/solid';

import {load_all_survey} from '@/app/lib/database';
import { Encuesta } from '@/app/lib/types';

import EncuestaList from '@/app/ui/encuesta/encuesta-list';

export default function Page(){
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [estadoFilter, setEstadoFilter] = useState('all');
    const [encuestas, setEncuestas] = useState<Encuesta[]>([]);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const resetFilters = () => {
        setEstadoFilter('all');
    };

    useEffect(() => {
        const fetchEncuestas = async () => {
            try {
                const data = await load_all_survey(0,1, estadoFilter);
                setEncuestas(data);
            } catch (error) {
                console.error('Error fetching encuestas:', error);
            }
        };

        fetchEncuestas();
    }, [estadoFilter]);

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
                            { value: 'responded', label: 'Publicado' },
                            { value: 'not-responded', label: 'Programado' },
                        ]}
                        value={estadoFilter}
                        onChange={setEstadoFilter}
                    />

                    <div className="flex-1 h-15 mx-1 flex justify-center items-center">
                        <button
                            className="flex items-center text-[#BD181E] underline px-4 py-2 hover:text-black border-none"
                            onClick={resetFilters}
                        >
                            {/* <XMarkIcon className="h-5 w-5 mr-2" /> */}
                            <div>Limpiar Todo</div>
                        </button>
                    </div>
                </div>
            )}
            {/* Encuestas */}
            <EncuestaList 
                initialEncuestas={encuestas} 
                estadoFilter={estadoFilter} 
            />
        </main>
    )
}