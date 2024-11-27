'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import {
  AdjustmentsHorizontalIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

import { Adset } from '@/app/lib/types';
import FilterSelect from '@/app/ui/interacciones/filter-select';
import AdsetCard from '@/app/ui/campanas/adset-card';
import { load_adsets, update_adset_status } from '@/app/lib/data';
import { useSearchParams } from 'next/navigation';

function AdsetPageContent() {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [estadoFilter, setEstadoFilter] = useState('all');
  const [adsets, setAdsets] = useState<Adset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('id');
  const hasLoaded = useRef(false);

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const resetFilters = () => {
    setEstadoFilter('all');
  };

  const loadMoreAdsets = async () => {
    if (!campaignId) return;
    setIsLoading(true);
    try {
      const apiAdsets = await load_adsets(campaignId);
      const filteredAdsets =
        estadoFilter === 'all'
          ? apiAdsets
          : apiAdsets.filter((adset: Adset) =>
              estadoFilter === 'activo'
                ? adset.status === 'ACTIVE'
                : adset.status === 'PAUSED'
            );
      setAdsets(filteredAdsets);
    } catch (error) {
      console.error('Error loading AdSets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasLoaded.current) {
      loadMoreAdsets();
      hasLoaded.current = true;
    }
  }, []);

  const handleActivate = async (id: string) => {
    try {
      await update_adset_status(id, 'ACTIVE');
      await loadMoreAdsets();
    } catch (error) {
      console.error('Error activating AdSet:', error);
    }
  };

  const handlePause = async (id: string) => {
    try {
      await update_adset_status(id, 'PAUSED');
      await loadMoreAdsets();
    } catch (error) {
      console.error('Error pausing AdSet:', error);
    }
  };

  const handleAplicarFiltro = async () => {
    setIsLoading(true);
    try {
      await loadMoreAdsets();
    } catch (error) {
      console.error('Error applying filter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!campaignId) {
    return (
      <main className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-700">
          ID de campaña no especificado. Por favor, selecciona una campaña válida.
        </p>
      </main>
    );
  }

  return (
    <main>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">AdSets de la Campaña</h1>
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

          {/* Botón Crear AdSet */}
          <Link
            href={`/pages/publicaciones/campanas/addsets/crear?id=${campaignId}`}
            className={`flex items-center ml-5 rounded px-4 py-2 ${
              filtersVisible
                ? 'bg-[#BD181E] text-white'
                : 'border border-black bg-transparent text-black'
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
              { value: 'pausado', label: 'Pausado' },
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

      {/* Lista de AdSets */}
      <ul className="mt-6 flex flex-col gap-2 list-none p-0 min-w-full">
        {adsets.map((adset) => (
          <AdsetCard
            key={adset.id}
            adset={adset}
            onActivate={() => handleActivate(adset.id)}
            onPause={() => handlePause(adset.id)}
          />
        ))}
      </ul>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando contenido...</div>}>
      <AdsetPageContent />
    </Suspense>
  );
}
