'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

import {
  AdjustmentsHorizontalIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

import { Campaign } from '@/app/lib/types';
import FilterSelect from '@/app/ui/interacciones/filter-select';
import CampanasCard from '@/app/ui/campanas/campanas-card';
import { load_all_campaigns, update_campaign_status } from '@/app/lib/data';

export default function Page() {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [estadoFilter, setEstadoFilter] = useState('all');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasLoaded = useRef(false);

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const resetFilters = () => {
    setEstadoFilter('all');
  };

  const loadMoreCampaigns = async () => {
    setIsLoading(true);
    try {
      const apiCampaigns = await load_all_campaigns();
      if (Array.isArray(apiCampaigns)) {
        setCampaigns(apiCampaigns);
      } else {
        console.error('Error: apiCampaigns is not an array', apiCampaigns);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasLoaded.current) {
      loadMoreCampaigns();
      hasLoaded.current = true;
    }
  }, []);

  const handleActivate = async (id: string) => {
    try {
      await update_campaign_status(id, 'ACTIVE');
      await loadMoreCampaigns(); // Recargar campañas después de activar
    } catch (error) {
      console.error('Error activating campaign:', error);
    }
  };

  const handlePause = async (id: string) => {
    try {
      await update_campaign_status(id, 'PAUSED');
      await loadMoreCampaigns(); // Recargar campañas después de pausar
    } catch (error) {
      console.error('Error pausing campaign:', error);
    }
  };

  const handleAplicarFiltro = async () => {
    setIsLoading(true);
    try {
        const apiCampaigns = await load_all_campaigns(); // Asegúrate que esta función cargue todas las campañas desde tu API
        const filteredCampaigns =
            estadoFilter === "all"
                ? apiCampaigns
                : apiCampaigns.filter((campaign: Campaign) =>
                      estadoFilter === "activo" ? campaign.status === "ACTIVE" : campaign.status !== "ACTIVE"
                  );
        setCampaigns(filteredCampaigns);
    } catch (error) {
        console.error("Error applying filter:", error);
    } finally {
        setIsLoading(false);
    }
};

  return (
    <main>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Todas las campañas</h1>
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

          <Link
            href="/pages/publicaciones/campanas/crear"
            className={`flex items-center ml-5 rounded px-4 py-2 ${
              filtersVisible
                ? 'bg-[#BD181E] text-white'
                : 'border border-black bg-transparent text-black'
            }`
          }
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
              { value: 'activo', label: 'Activas' },
              { value: 'desactivo', label: 'Inactivas' },
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

      {/* Lista de campañas */}
      <ul className="mt-6 flex flex-col gap-2 list-none p-0 min-w-full">
        {campaigns.map((campaign) => (
          <CampanasCard
            key={campaign.id}
            campaign={campaign}
            onActivate={() => handleActivate(campaign.id)}
            onPause={() => handlePause(campaign.id)}
          />
        ))}
      </ul>
    </main>
  );
}
