'use client';

import React, { Suspense, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import {
  AdjustmentsHorizontalIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

import { Ad2 } from '@/app/lib/types';
import FilterSelect from '@/app/ui/interacciones/filter-select';
import AdCard from '@/app/ui/campanas/ad-card'; // Importa el componente AdCard
import { load_ads } from '@/app/lib/data'; // Carga los anuncios desde la API

function AdListContent() {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // Filtro de estado
  const [ads, setAds] = useState<Ad2[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasLoaded = useRef(false);

  const searchParams = useSearchParams();
  const adsetId = searchParams.get('adsetId'); // Obtener adsetId de la URL
  const adcreativeId = searchParams.get('adcreativeId'); // Obtener adcreativeId de la URL

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const resetFilters = () => {
    setStatusFilter('all');
  };

  const loadAllAds = async () => {
    setIsLoading(true);
    try {
      const apiAds = await load_ads(); // Cargar todos los Ads desde la API

      // Filtrar anuncios según adsetId y adcreativeId
      const filteredAds = apiAds.filter(
        (ad: Ad2) => ad.adset_id === adsetId && ad.creative.id === adcreativeId
      );

      setAds(filteredAds); // Establecer los Ads filtrados en el estado
    } catch (error) {
      console.error('Error loading ads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasLoaded.current) {
      loadAllAds();
      hasLoaded.current = true;
    }
  }, [adsetId, adcreativeId]);

  const handleApplyFilter = async () => {
    setIsLoading(true);
    try {
      const apiAds = await load_ads();
      const filteredAds = apiAds.filter(
        (ad: Ad2) =>
          ad.adset_id === adsetId &&
          ad.creative.id === adcreativeId &&
          (statusFilter === 'all'
            ? true
            : statusFilter === 'activo'
            ? ad.status === 'ACTIVE'
            : ad.status !== 'ACTIVE')
      );
      setAds(filteredAds);
    } catch (error) {
      console.error('Error applying filter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Todos los anuncios</h1>
        <div className="flex items-center">
          <button
            onClick={toggleFilters}
            className={`flex items-center ml-5 rounded px-4 py-2 ${
              filtersVisible
                ? 'bg-black text-white'
                : 'border border-black bg-transparent text-black'
            }`}
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
            <div>Filtrar</div>
          </button>

          {adsetId && adcreativeId && (
            <Link
              href={`/pages/publicaciones/campanas/addsets/adcreative/ad/crear?adsetId=${adsetId}&adcreativeId=${adcreativeId}`}
              className="flex items-center ml-5 rounded px-4 py-2 bg-[#BD181E] text-white"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              <div>Nuevo</div>
            </Link>
          )}
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
              { value: 'activo', label: 'Activos' },
              { value: 'inactivo', label: 'Inactivos' },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
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
              onClick={handleApplyFilter}
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              <div>Aplicar filtro</div>
            </button>
          </div>
        </div>
      )}

      {/* Lista de Ads */}
      <ul className="mt-6 flex flex-col gap-2 list-none p-0 min-w-full">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </ul>
    </main>
  );
}

export default function AdListPage() {
  return (
    <Suspense fallback={<div>Cargando anuncios...</div>}>
      <AdListContent />
    </Suspense>
  );
}
