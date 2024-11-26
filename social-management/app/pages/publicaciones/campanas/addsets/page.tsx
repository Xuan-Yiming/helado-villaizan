'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlusCircleIcon, HandRaisedIcon, EyeIcon } from '@heroicons/react/24/solid';

import FilterSelect from '@/app/ui/interacciones/filter-select';
import { Adset } from '@/app/lib/types';
import { load_adsets, update_adset_status } from '@/app/lib/data';
import AdsetCard from '@/app/ui/campanas/adset-card';

export default function Page() {
  const [adsets, setAdsets] = useState<Adset[]>([]);
  const [estadoFilter, setEstadoFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('id');
  const hasLoaded = useRef(false);

  const loadMoreAdsets = async () => {
    if (!campaignId) return;
    setIsLoading(true);
    try {
      const apiAdsets = await load_adsets(campaignId);
      // Filtrar por estado si es necesario
      const filteredAdsets = apiAdsets.filter((adset) => {
        if (estadoFilter === 'all') return true;
        return estadoFilter === 'activo' ? adset.status === 'ACTIVE' : adset.status === 'PAUSED';
      });
      setAdsets(filteredAdsets);
    } catch (error) {
      console.error('Error loading adsets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilter = async () => {
    await loadMoreAdsets();
  };

  useEffect(() => {
    if (!hasLoaded.current) {
      loadMoreAdsets();
      hasLoaded.current = true;
    }
  }, [estadoFilter]);

  const handleActivate = async (adsetId: string) => {
    try {
      await update_adset_status(adsetId, 'ACTIVE');
      loadMoreAdsets();
    } catch (error) {
      console.error('Error activating adset:', error);
    }
  };

  const handlePause = async (adsetId: string) => {
    try {
      await update_adset_status(adsetId, 'PAUSED');
      loadMoreAdsets();
    } catch (error) {
      console.error('Error pausing adset:', error);
    }
  };

  return (
    <main>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">AdSets de la Campaña</h1>
      </div>

      {/* Filtros */}
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
        <button
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700"
          onClick={handleApplyFilter}
        >
          Aplicar filtro
        </button>
      </div>

      {/* Lista de Addsets */}
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