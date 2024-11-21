'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';


import { AdjustmentsHorizontalIcon, PlusCircleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

import { UserAccount } from '@/app/lib/types';

import FilterSelect from '@/app/ui/interacciones/filter-select';

import {load_all_users} from '@/app/lib/database';
import CuentasCard from '@/app/ui/cuentas/cuentas-card';
import { useError } from "@/app/context/errorContext";

const NUMBER_OF_POSTS_TO_FETCH = 20;


export default function Page(){
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [estadoFilter, setEstadoFilter] = useState('all');
    const [rolFilter, setRolFilter] = useState('all');

    const [users, setUsers] = useState<UserAccount[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const hasLoaded = useRef(false);
    const { showError } = useError();

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const resetFilters = () => {
        setEstadoFilter('all');
    };


    const loadMoreUsers = async (_offset: number) => {
        setIsLoading(true);
        try {
            const apiUsers = await load_all_users(
                _offset,
                NUMBER_OF_POSTS_TO_FETCH,
                rolFilter,
                estadoFilter,
            );
            if (Array.isArray(apiUsers)) {
                setUsers(users => [...users, ...apiUsers]);
                setOffset(offset => _offset + NUMBER_OF_POSTS_TO_FETCH);

                //console.log('Loaded users:', apiUsers);
            } else {
                // console.error('Error: apiUsers is not an array', apiUsers);
                showError('No se puede cargar los usuarios');
            }
        } catch (error:any) {
            showError('No se puede cargar los usuarios: '+ error.message);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        if (!hasLoaded.current) {
            loadMoreUsers(0);
            hasLoaded.current = true;
        }
    }, []);

    async function reset(){
        setUsers([]);
    }

    const handleAplicarFiltro  = async () => {
        await reset();
        await loadMoreUsers(0);
    };


    return (
        <main>
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Cuentas de empleados</h1>
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
                    href="/pages/cuentas/empleados/crear"
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
                    <FilterSelect
                        label="Rol"
                        id="response-filter"
                        options={[
                            { value: 'all', label: 'Ver todo' },
                            { value: 'admin', label: 'Admin' },
                            { value: 'user', label: 'Usurio Normal' },
                            { value: 'survy_creator', label: 'Creator De Encuestas' },
                            { value: 'moderator', label: 'Analista' },
                        ]}
                        value={rolFilter}
                        onChange={setRolFilter}
                    />

                    <div className="flex-1 h-15 mx-1 flex justify-center items-center">
                        <button
                            className="flex items-center text-[#BD181E] underline px-4 py-2 hover:text-black border-none"
                            onClick={resetFilters}
                        >
                            <XMarkIcon className="h-5 w-5 mr-2" />
                            <div>Limpiar filtro</div>
                        </button>
                    </div>

                    <div className="flex-1 h-15 mx-1 flex justify-center items-center">
                    <button
                            className="flex items-center bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 border-none"
                            onClick={handleAplicarFiltro}
                        >
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            <div>Aplicar filtro</div>
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
                {users.map(user => (
                    <CuentasCard key={user.id} user={user} />
                ))}
            </ul>
            <div className="flex justify-center mt-10">
                <button
                    onClick={() => loadMoreUsers(offset)}
                    className="px-4 py-2 text-[#BD181E] "
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Cargar más'}
                </button>
            </div>
        </main>
    )
}