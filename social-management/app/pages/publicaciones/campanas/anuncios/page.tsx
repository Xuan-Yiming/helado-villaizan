'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from "next/navigation";


import { AdjustmentsHorizontalIcon, PlusCircleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

import { Ad } from '@/app/lib/types';

import FilterSelect from '@/app/ui/interacciones/filter-select';

import { load_ad_by_campaign, load_all_campaigns } from '@/app/lib/data';
import { useError } from '@/app/context/errorContext';
import AdCard from '@/app/ui/anuncios/anuncios-card';
import Link from 'next/link';

const NUMBER_OF_POSTS_TO_FETCH = 20;


export default function Page(){
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [estadoFilter, setEstadoFilter] = useState('all');
    const [ads, setAds] = useState<Ad[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const hasLoaded = useRef(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("id");
    const { showError } = useError();

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const resetFilters = () => {
        setEstadoFilter('all');
    };


    const loadMoreCampaigns = async () => {
        setIsLoading(true);
        try {
            if (!id) {
                router.push('/pages/publicaciones/campanas');
                return;
            }
            var apiAds = await load_ad_by_campaign(id);
            if (Array.isArray(apiAds)) {
                setAds(apiAds);
            } else {
                showError('Error: apiEncuestas is not an array' + apiAds);
            }
        } catch (error) {
            showError('Error loading more encuestas:' + error);
            
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        loadMoreCampaigns();
    }, [id]);

    async function reset(){
        setAds([]);
    }

    const handleAplicarFiltro  = async () => {
        await reset();
        await loadMoreCampaigns();
    };


    return (
        <main>
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Anucios de la campaña</h1>
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
                    href={`/pages/publicaciones/campanas/anuncios/crear?campaign_id=${id}`}
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
                        id="status-filter"
                        options={[
                            { value: 'all', label: 'Ver todo' },
                            { value: 'activo', label: 'Activo' },
                            { value: 'desactivo', label: 'Desactivo' },
                        ]}
                        value={estadoFilter}
                        onChange={setEstadoFilter}
                    />
                    <FilterSelect
                        label="Meta de optimización"
                        id="optimization-filter"
                        options={[
                            { value: 'all', label: 'Ver todo' },
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
                            className="flex items-center bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 border-none"
                            onClick={handleAplicarFiltro}
                        >
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            <div>Aplicar filtro</div>
                        </button>
                    </div>
                </div>
            )}

            <ul className="mt-6 flex flex-col gap-2 list-none p-0 min-w-full">
                <Suspense fallback={<div>Loading...</div>}>
                    {ads.map(ad => (
                        <AdCard key={ad.id} ad={ad} />
                    ))}
                </Suspense>
            </ul>
        </main>
    )
}