'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';


import { AdjustmentsHorizontalIcon, PlusCircleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

import { Campage } from '@/app/lib/types';

import FilterSelect from '@/app/ui/interacciones/filter-select';
import EncuestaList from '@/app/ui/encuesta/encuesta-list';
import EncuestaCard from '@/app/ui/encuesta/encuesta-card';

import {load_all_survey} from '@/app/lib/database';
import CampanasCard from '@/app/ui/campanas/campanas-card';

const NUMBER_OF_POSTS_TO_FETCH = 20;

enum special_ad_categories {APP_INSTALLS, BRAND_AWARENESS, CONVERSIONS, EVENT_RESPONSES, LEAD_GENERATION, LINK_CLICKS, LOCAL_AWARENESS, MESSAGES, OFFER_CLAIMS, OUTCOME_APP_PROMOTION, OUTCOME_AWARENESS, OUTCOME_ENGAGEMENT, OUTCOME_LEADS, OUTCOME_SALES, OUTCOME_TRAFFIC, PAGE_LIKES, POST_ENGAGEMENT, PRODUCT_CATALOG_SALES, REACH, STORE_VISITS, VIDEO_VIEWS}



export default function Page(){
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [estadoFilter, setEstadoFilter] = useState('all');
    const [campages, setCampages] = useState<Campage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const hasLoaded = useRef(false);


    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const resetFilters = () => {
        setEstadoFilter('all');
    };


    const loadMoreCampages = async (_offset: number) => {
        setIsLoading(true);
        try {
            var apiCampages;
            if (Array.isArray(apiCampages)) {
                setCampages(apiCampages);
            } else {
                console.error('Error: apiEncuestas is not an array', apiCampages);
            }
        } catch (error) {
            console.error('Error loading more encuestas:', error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        if (!hasLoaded.current) {
            loadMoreCampages(0);
            hasLoaded.current = true;
        }
    }, []);

    async function reset(){
        setCampages([]);
    }

    const handleAplicarFiltro  = async () => {
        await reset();
        await loadMoreCampages(0);
    };


    return (
        <main>
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Todas las campañas</h1>
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
                        label="Categoria"
                        id="category-filter"
                        options={[
                            { value: 'all', label: 'Ver todo' },
                            { value: 'app_installs', label: 'Instalaciones de aplicaciones' },
                            { value: 'brand_awareness', label: 'Reconocimiento de marca' },
                            { value: 'conversions', label: 'Conversiones' },
                            { value: 'event_responses', label: 'Respuestas a eventos' },
                            { value: 'lead_generation', label: 'Generación de leads' },
                            { value: 'link_clicks', label: 'Clics en enlaces' },
                            { value: 'local_awareness', label: 'Conciencia local' },
                            { value: 'messages', label: 'Mensajes' },
                            { value: 'offer_claims', label: 'Reclamaciones de ofertas' },
                            { value: 'outcome_app_promotion', label: 'Promoción de aplicaciones' },
                            { value: 'outcome_awareness', label: 'Conciencia de resultados' },
                            { value: 'outcome_engagement', label: 'Compromiso de resultados' },
                            { value: 'outcome_leads', label: 'Leads de resultados' },
                            { value: 'outcome_sales', label: 'Ventas de resultados' },
                            { value: 'outcome_traffic', label: 'Tráfico de resultados' },
                            { value: 'page_likes', label: 'Me gusta en la página' },
                            { value: 'post_engagement', label: 'Compromiso con la publicación' },
                            { value: 'product_catalog_sales', label: 'Ventas de catálogo de productos' },
                            { value: 'reach', label: 'Alcance' },
                            { value: 'store_visits', label: 'Visitas a la tienda' },
                            { value: 'video_views', label: 'Vistas de video' }
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

            <ul className="mt-6 flex flex-col gap-2 list-none p-0 min-w-full">
                {campages.map(campage => (
                    <CampanasCard key={campage.id} campage={campage} />
                ))}
            </ul>
        </main>
    )
}